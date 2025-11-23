# Rust + Actix-web 安全加固实施指南

## 已完成 ✅

- [x] .env.example 已更新（添加 CORS 和速率限制配置）

## 待实施

### 1. 添加依赖

**文件**: `Cargo.toml`

在 `[dependencies]` 部分添加：

```toml
[dependencies]
actix-web = "4"
actix-cors = "0.7"
actix-rt = "2"
serde = { version = "1", features = ["derive"] }
serde_json = "1"
sqlx = { version = "0.7", features = ["runtime-tokio-rustls", "sqlite"] }
tokio = { version = "1", features = ["full"] }
dotenv = "0.15"
env_logger = "0.11"
log = "0.4"
validator = { version = "0.16", features = ["derive"] }
html-escape = "0.2"
actix-limitation = "0.5"
```

### 2. CORS 配置

**文件**: `src/main.rs`

```rust
use actix_cors::Cors;
use std::env;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();
    env_logger::init();

    let host = env::var("HOST").unwrap_or_else(|_| "0.0.0.0".to_string());
    let port = env::var("PORT").unwrap_or_else(|_| "8080".to_string());

    // Parse allowed origins
    let allowed_origins: Vec<String> = env::var("ALLOWED_ORIGINS")
        .unwrap_or_else(|_| "http://localhost:3000".to_string())
        .split(',')
        .map(|s| s.trim().to_string())
        .collect();

    log::info!("Starting server at http://{}:{}", host, port);
    log::info!("Allowed origins: {:?}", allowed_origins);

    HttpServer::new(move || {
        let cors = Cors::default()
            .allowed_origin_fn(move |origin, _req_head| {
                allowed_origins.iter().any(|o| {
                    origin.to_str()
                        .map(|s| s == o)
                        .unwrap_or(false)
                })
            })
            .allowed_methods(vec!["GET", "POST", "PUT", "DELETE", "OPTIONS"])
            .allowed_headers(vec![
                actix_web::http::header::AUTHORIZATION,
                actix_web::http::header::ACCEPT,
                actix_web::http::header::CONTENT_TYPE,
            ])
            .supports_credentials()
            .max_age(3600);

        App::new()
            .wrap(cors)
            .wrap(middleware::Logger::default())
            // ... routes
    })
    .bind((host, port.parse::<u16>().unwrap()))?
    .run()
    .await
}
```

### 3. 安全响应头中间件

**创建文件**: `src/middleware/security_headers.rs`

```rust
use actix_web::{
    dev::{forward_ready, Service, ServiceRequest, ServiceResponse, Transform},
    Error,
};
use futures::future::LocalBoxFuture;
use std::future::{ready, Ready};

pub struct SecurityHeaders;

impl<S, B> Transform<S, ServiceRequest> for SecurityHeaders
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type InitError = ();
    type Transform = SecurityHeadersMiddleware<S>;
    type Future = Ready<Result<Self::Transform, Self::InitError>>;

    fn new_transform(&self, service: S) -> Self::Future {
        ready(Ok(SecurityHeadersMiddleware { service }))
    }
}

pub struct SecurityHeadersMiddleware<S> {
    service: S,
}

impl<S, B> Service<ServiceRequest> for SecurityHeadersMiddleware<S>
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type Future = LocalBoxFuture<'static, Result<Self::Response, Self::Error>>;

    forward_ready!(service);

    fn call(&self, req: ServiceRequest) -> Self::Future {
        let fut = self.service.call(req);

        Box::pin(async move {
            let mut res = fut.await?;
            let headers = res.headers_mut();

            headers.insert(
                actix_web::http::header::HeaderName::from_static("x-content-type-options"),
                actix_web::http::header::HeaderValue::from_static("nosniff"),
            );
            headers.insert(
                actix_web::http::header::HeaderName::from_static("x-frame-options"),
                actix_web::http::header::HeaderValue::from_static("DENY"),
            );
            headers.insert(
                actix_web::http::header::HeaderName::from_static("x-xss-protection"),
                actix_web::http::header::HeaderValue::from_static("1; mode=block"),
            );
            headers.insert(
                actix_web::http::header::HeaderName::from_static("strict-transport-security"),
                actix_web::http::header::HeaderValue::from_static("max-age=31536000; includeSubDomains"),
            );

            Ok(res)
        })
    }
}
```

在 `main.rs` 中使用：

```rust
mod middleware;
use middleware::security_headers::SecurityHeaders;

App::new()
    .wrap(SecurityHeaders)
    // ... other middleware
```

### 4. 输入验证和 HTML 转义

**文件**: `src/models.rs`

```rust
use validator::Validate;
use html_escape::encode_text;
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Validate)]
pub struct CreateTodo {
    #[validate(length(min = 1, max = 500, message = "Text must be between 1 and 500 characters"))]
    pub text: String,
    pub completed: Option<bool>,
}

impl CreateTodo {
    pub fn sanitize(mut self) -> Self {
        self.text = encode_text(&self.text).to_string();
        self
    }
}

#[derive(Debug, Deserialize, Validate)]
pub struct UpdateTodo {
    #[validate(length(min = 1, max = 500, message = "Text must be between 1 and 500 characters"))]
    pub text: Option<String>,
    pub completed: Option<bool>,
}

impl UpdateTodo {
    pub fn sanitize(mut self) -> Self {
        if let Some(text) = self.text {
            self.text = Some(encode_text(&text).to_string());
        }
        self
    }
}
```

**文件**: `src/handlers.rs`

```rust
use actix_web::{web, HttpResponse, Result};
use validator::Validate;

pub async fn create_todo(
    pool: web::Data<SqlitePool>,
    todo: web::Json<CreateTodo>,
) -> Result<HttpResponse> {
    // Validate input
    todo.validate()
        .map_err(|e| actix_web::error::ErrorBadRequest(format!("Validation error: {}", e)))?;

    // Sanitize input
    let todo = todo.into_inner().sanitize();

    // Create todo
    let result = sqlx::query!(
        "INSERT INTO todos (text, completed) VALUES (?, ?)",
        todo.text,
        todo.completed.unwrap_or(false)
    )
    .execute(pool.get_ref())
    .await
    .map_err(|e| {
        log::error!("Database error: {}", e);
        actix_web::error::ErrorInternalServerError("Failed to create todo")
    })?;

    let id = result.last_insert_rowid();

    Ok(HttpResponse::Created().json(json!({
        "id": id,
        "text": todo.text,
        "completed": todo.completed.unwrap_or(false)
    })))
}
```

### 5. ID 验证

**文件**: `src/handlers.rs`

```rust
pub async fn get_todo(
    pool: web::Data<SqlitePool>,
    id: web::Path<i64>,
) -> Result<HttpResponse> {
    let id = id.into_inner();

    if id <= 0 {
        return Ok(HttpResponse::BadRequest().json(json!({
            "error": "Invalid ID format"
        })));
    }

    let todo = sqlx::query_as!(
        Todo,
        "SELECT * FROM todos WHERE id = ?",
        id
    )
    .fetch_optional(pool.get_ref())
    .await
    .map_err(|e| {
        log::error!("Database error: {}", e);
        actix_web::error::ErrorInternalServerError("Database error")
    })?;

    match todo {
        Some(todo) => Ok(HttpResponse::Ok().json(todo)),
        None => Ok(HttpResponse::NotFound().json(json!({
            "error": "Todo not found"
        }))),
    }
}
```

### 6. 健康检查端点

**文件**: `src/handlers.rs`

```rust
pub async fn health_check(pool: web::Data<SqlitePool>) -> Result<HttpResponse> {
    let db_status = match sqlx::query("SELECT 1").fetch_one(pool.get_ref()).await {
        Ok(_) => "ok",
        Err(_) => "unavailable",
    };

    let status_code = if db_status == "ok" {
        actix_web::http::StatusCode::OK
    } else {
        actix_web::http::StatusCode::SERVICE_UNAVAILABLE
    };

    Ok(HttpResponse::build(status_code).json(json!({
        "status": "ok",
        "database": db_status,
        "version": "1.0.0",
        "time": chrono::Utc::now().to_rfc3339()
    })))
}
```

在 `main.rs` 中注册路由：

```rust
App::new()
    // ... middleware
    .route("/health", web::get().to(health_check))
    // ... other routes
```

### 7. 速率限制

**文件**: `src/main.rs`

```rust
use actix_limitation::{Limiter, RateLimiter};
use std::time::Duration;

let limiter = web::Data::new(
    Limiter::builder("memory://")
        .cookie_name("rate-limit")
        .session_key("rate-limit-session")
        .limit(
            env::var("RATE_LIMIT_MAX")
                .unwrap_or_else(|_| "100".to_string())
                .parse()
                .unwrap_or(100)
        )
        .period(Duration::from_secs(
            env::var("RATE_LIMIT_WINDOW_SECS")
                .unwrap_or_else(|_| "60".to_string())
                .parse()
                .unwrap_or(60)
        ))
        .build()
        .unwrap(),
);

App::new()
    .app_data(limiter.clone())
    .wrap(RateLimiter::default())
    // ... other configuration
```

## 测试

```bash
# 编译项目
cargo build --release

# 运行测试
cargo test

# 运行项目
cargo run

# 测试 CORS
curl -H "Origin: http://unauthorized.com" \
  -H "Access-Control-Request-Method: POST" \
  -X OPTIONS http://localhost:8080/api/todos

# 测试健康检查
curl http://localhost:8080/health
```

## 生产环境部署

```bash
# 设置环境变量
export ENVIRONMENT=production
export ALLOWED_ORIGINS=https://yourdomain.com
export RUST_LOG=info

# 构建优化版本
cargo build --release

# 运行
./target/release/todolist-actix
```
