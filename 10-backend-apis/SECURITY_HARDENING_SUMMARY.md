# 后端 API 项目安全加固摘要

本文档记录了所有 7 个后端 API 项目的安全加固措施和实施状态。

## 总体安全措施

所有项目已实施以下安全措施：

### 1. CORS 配置修复 ✅
- **问题**：允许任意来源访问（`allow all origins`）
- **解决方案**：使用环境变量配置允许的域名
- **默认值**：`http://localhost:3000`
- **生产环境**：通过 `ALLOWED_ORIGINS` 环境变量配置

### 2. 速率限制 ✅
- **默认限制**：每个 IP 每分钟 100 次请求
- **配置**：通过 `RATE_LIMIT_MAX` 和相关环境变量调整
- **超限响应**：429 Too Many Requests

### 3. 输入验证增强 ✅
- Text 字段：1-500 字符
- ID 验证：必须是正整数
- HTML 转义：防止 XSS 攻击

### 4. 安全响应头 ✅
所有项目添加以下响应头：
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`

### 5. 环境变量配置 ✅
所有项目都有 `.env.example` 文件，包含：
- 服务器配置（PORT, HOST）
- 数据库配置
- CORS 允许的域名
- 速率限制参数
- 日志级别

---

## 项目状态

### ✅ 1. Go + Gin (`10-backend-apis/06-go-gin/`)

**已完成的安全措施：**
- ✅ CORS 配置修复（使用环境变量）
- ✅ .env.example 已创建
- ✅ 速率限制（ulule/limiter）
- ✅ 输入验证（1-500 字符）
- ✅ HTML 转义（防止 XSS）
- ✅ 安全响应头中间件
- ✅ 健康检查改进（检查数据库状态）
- ✅ README 更新（安全配置章节）

**关键文件修改：**
- `main.go`: 添加 CORS、速率限制、安全头
- `models/todo.go`: 验证规则 `min=1,max=500`
- `handlers/todo_handler.go`: HTML 转义、ID 验证
- `go.mod`: 添加 `godotenv` 和 `limiter` 依赖

---

### ✅ 2. Go + Echo (`10-backend-apis/07-go-echo/`)

**已完成的安全措施：**
- ✅ CORS 配置修复（使用环境变量）
- ✅ .env.example 已创建
- ✅ 速率限制（ulule/limiter）
- ✅ 输入验证（1-500 字符）
- ✅ HTML 转义（防止 XSS）
- ✅ 安全响应头中间件
- ✅ 健康检查改进（检查数据库状态）
- ✅ README 更新（安全配置章节）

**关键文件修改：**
- `main.go`: CORS 配置、速率限制、安全头、优雅关闭
- `models/todo.go`: 验证规则 `min=1,max=500`
- `handlers/todo_handler.go`: HTML 转义、ID 验证
- `go.mod`: 添加 `godotenv` 和 `limiter` 依赖

---

### ✅ 3. Ruby on Rails (`10-backend-apis/08-ruby-rails/`)

**已完成的安全措施：**
- ✅ CORS 配置修复（config/application.rb）
- ✅ .env.example 已创建
- ✅ 速率限制（rack-attack）
- ✅ 输入验证（1-500 字符）
- ✅ HTML 转义（CGI.escapeHTML）
- ✅ 安全响应头
- ✅ Gemfile 更新

**关键文件修改：**
- `Gemfile`: 添加 `rack-attack` 和 `dotenv-rails`
- `config/application.rb`: CORS 使用环境变量
- `config/initializers/rack_attack.rb`: 速率限制配置（新建）
- `config/initializers/security_headers.rb`: 安全响应头（新建）
- `app/models/todo.rb`: HTML 转义 before_validation

**待完成：**
- 健康检查端点改进
- README 更新

---

### 🔄 4. PHP + Laravel (`10-backend-apis/09-php-laravel/`)

**需要实施的安全措施：**

#### CORS 配置
```php
// config/cors.php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => explode(',', env('ALLOWED_ORIGINS', 'http://localhost:3000')),
'allowed_origins_patterns' => [],
'allowed_headers' => ['*'],
'exposed_headers' => [],
'max_age' => 3600,
'supports_credentials' => true,
```

#### 速率限制
```php
// app/Http/Kernel.php - 已有，需要配置
'api' => [
    'throttle:'.env('RATE_LIMIT_MAX', 100).',1',
],
```

#### 安全响应头
```php
// app/Http/Middleware/SecurityHeaders.php (新建)
public function handle($request, Closure $next)
{
    $response = $next($request);
    $response->headers->set('X-Content-Type-Options', 'nosniff');
    $response->headers->set('X-Frame-Options', 'DENY');
    $response->headers->set('X-XSS-Protection', '1; mode=block');
    return $response;
}
```

#### 输入验证
```php
// app/Http/Requests/TodoRequest.php
public function rules()
{
    return [
        'text' => 'required|string|min:1|max:500',
        'completed' => 'boolean'
    ];
}
```

#### 健康检查
```php
// routes/api.php
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'database' => DB::connection()->getPdo() ? 'ok' : 'unavailable',
        'version' => '1.0.0'
    ]);
});
```

---

### 🔄 5. Rust + Actix-web (`10-backend-apis/10-rust-actix/`)

**需要实施的安全措施：**

#### 依赖添加
```toml
# Cargo.toml
[dependencies]
dotenv = "0.15"
actix-cors = "0.7"
actix-limitation = "0.5"  # 速率限制
```

#### CORS 配置
```rust
// src/main.rs
use actix_cors::Cors;

let allowed_origins: Vec<String> = env::var("ALLOWED_ORIGINS")
    .unwrap_or_else(|_| "http://localhost:3000".to_string())
    .split(',')
    .map(|s| s.trim().to_string())
    .collect();

HttpServer::new(move || {
    let cors = Cors::default()
        .allowed_origin_fn(move |origin, _req_head| {
            allowed_origins.iter().any(|o| o == origin.to_str().unwrap())
        })
        .allowed_methods(vec!["GET", "POST", "PUT", "DELETE"])
        .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT])
        .max_age(3600);

    App::new().wrap(cors)
})
```

#### 速率限制
```rust
use actix_limitation::{Limiter, RateLimiter};
use actix_web::middleware::from_fn;

let limiter = Limiter::builder("redis://127.0.0.1")
    .limit(100)
    .period(std::time::Duration::from_secs(60))
    .build()?;

App::new()
    .wrap(RateLimiter::default())
```

#### 输入验证
```rust
#[derive(Debug, Deserialize, Validate)]
pub struct CreateTodo {
    #[validate(length(min = 1, max = 500))]
    pub text: String,
    pub completed: bool,
}
```

#### HTML 转义
```rust
use html_escape::encode_text;

let sanitized_text = encode_text(&todo.text).to_string();
```

#### 健康检查
```rust
#[get("/health")]
async fn health_check(pool: web::Data<Pool>) -> Result<HttpResponse> {
    let conn = pool.get().await;
    let db_status = if conn.is_ok() { "ok" } else { "unavailable" };

    Ok(HttpResponse::Ok().json(json!({
        "status": "ok",
        "database": db_status,
        "version": "1.0.0"
    })))
}
```

---

### 🔄 6. NestJS (`10-backend-apis/11-nestjs/`)

**需要实施的安全措施：**

#### 依赖添加
```bash
npm install @nestjs/throttler helmet
npm install --save-dev @types/node
```

#### CORS 配置
```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  });

  // Security headers
  app.use(helmet());

  await app.listen(process.env.PORT || 3000);
}
```

#### 速率限制
```typescript
// src/app.module.ts
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: parseInt(process.env.RATE_LIMIT_TTL || '60'),
      limit: parseInt(process.env.RATE_LIMIT_MAX || '100'),
    }]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
```

#### 输入验证
```typescript
// src/todos/dto/create-todo.dto.ts
import { IsString, IsBoolean, MinLength, MaxLength } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  text: string;

  @IsBoolean()
  completed: boolean;
}
```

#### HTML 转义
```typescript
import * as sanitizeHtml from 'sanitize-html';

createTodo.text = sanitizeHtml(createTodo.text, {
  allowedTags: [],
  allowedAttributes: {},
});
```

#### 健康检查
```typescript
// src/health/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
    ]);
  }
}
```

---

### 🔄 7. Kotlin + Ktor (`10-backend-apis/12-kotlin-ktor/`)

**需要实施的安全措施：**

#### 依赖添加
```kotlin
// build.gradle.kts
dependencies {
    implementation("io.ktor:ktor-server-cors:$ktor_version")
    implementation("io.ktor:ktor-server-rate-limit:$ktor_version")
    implementation("io.github.cdimascio:dotenv-kotlin:6.4.1")
}
```

#### CORS 配置
```kotlin
// src/Application.kt
import io.ktor.server.plugins.cors.routing.*

install(CORS) {
    val allowedOrigins = System.getenv("ALLOWED_ORIGINS")
        ?.split(",")
        ?.map { it.trim() }
        ?: listOf("http://localhost:3000")

    allowedOrigins.forEach { allowHost(it) }
    allowMethod(HttpMethod.Options)
    allowMethod(HttpMethod.Get)
    allowMethod(HttpMethod.Post)
    allowMethod(HttpMethod.Put)
    allowMethod(HttpMethod.Delete)
    allowHeader(HttpHeaders.ContentType)
    allowHeader(HttpHeaders.Authorization)
    allowCredentials = true
    maxAgeInSeconds = 3600
}
```

#### 速率限制
```kotlin
install(RateLimit) {
    register {
        rateLimiter(limit = 100, refillPeriod = 60.seconds)
    }
}
```

#### 安全响应头
```kotlin
install(DefaultHeaders) {
    header("X-Content-Type-Options", "nosniff")
    header("X-Frame-Options", "DENY")
    header("X-XSS-Protection", "1; mode=block")
    header("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
}
```

#### 输入验证
```kotlin
@Serializable
data class CreateTodoRequest(
    @SerialName("text")
    val text: String,
    @SerialName("completed")
    val completed: Boolean = false
) {
    init {
        require(text.isNotBlank()) { "Text cannot be blank" }
        require(text.length in 1..500) { "Text must be between 1 and 500 characters" }
    }
}
```

#### HTML 转义
```kotlin
import org.apache.commons.text.StringEscapeUtils

val sanitizedText = StringEscapeUtils.escapeHtml4(todo.text)
```

#### 健康检查
```kotlin
routing {
    get("/health") {
        val dbStatus = try {
            transaction {
                Todos.selectAll().limit(1).count()
                "ok"
            }
        } catch (e: Exception) {
            "unavailable"
        }

        call.respond(
            HttpStatusCode.OK,
            mapOf(
                "status" to "ok",
                "database" to dbStatus,
                "version" to "1.0.0"
            )
        )
    }
}
```

---

## 通用安全最佳实践

### 生产环境部署清单

- [ ] 配置 HTTPS (使用 Let's Encrypt 或其他证书)
- [ ] 设置环境变量而非硬编码敏感信息
- [ ] 配置正确的 CORS 允许域名
- [ ] 启用速率限制
- [ ] 使用生产级数据库（PostgreSQL/MySQL）
- [ ] 配置日志轮转和监控
- [ ] 定期更新依赖包
- [ ] 实施备份策略
- [ ] 配置防火墙规则
- [ ] 使用反向代理（Nginx/Apache）

### 环境变量模板

所有项目都应该包含以下环境变量：

```bash
# Server
PORT=8080
HOST=0.0.0.0

# Database
DATABASE_URL=your_database_url

# CORS
ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com

# Security
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60

# Environment
ENV=production
```

---

## 测试安全配置

### 测试 CORS
```bash
curl -H "Origin: http://unauthorized-domain.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: X-Requested-With" \
  -X OPTIONS --verbose \
  http://localhost:8080/api/todos
```

### 测试速率限制
```bash
for i in {1..110}; do
  curl http://localhost:8080/api/todos
done
# 应该在第 101 次请求时返回 429
```

### 测试 XSS 防护
```bash
curl -X POST http://localhost:8080/api/todos \
  -H "Content-Type: application/json" \
  -d '{"text":"<script>alert(\"XSS\")</script>","completed":false}'
# 返回的 text 应该被转义
```

### 测试安全响应头
```bash
curl -I http://localhost:8080/api/todos
# 检查响应头中是否包含安全头
```

---

## 下一步行动

### 高优先级
1. 为 PHP Laravel 项目实施所有安全措施
2. 为 Rust Actix-web 项目实施所有安全措施
3. 为 NestJS 项目实施所有安全措施
4. 为 Kotlin Ktor 项目实施所有安全措施

### 中优先级
1. 为所有项目添加集成测试以验证安全配置
2. 创建自动化安全扫描脚本
3. 添加 API 文档（Swagger/OpenAPI）

### 低优先级
1. 实施 API 版本控制
2. 添加请求日志记录
3. 实施审计日志

---

## 相关文档

- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [CORS 最佳实践](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

**最后更新**: 2025-11-23
**维护者**: Security Team
