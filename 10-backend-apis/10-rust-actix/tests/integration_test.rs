use actix_web::{test, web, App};
use serde_json::json;

// Note: You'll need to make the following modules public in main.rs:
// pub mod db;
// pub mod handlers;
// pub mod models;

#[cfg(test)]
mod tests {
    use super::*;

    async fn setup_test_pool() -> sqlx::SqlitePool {
        let pool = sqlx::SqlitePool::connect(":memory:")
            .await
            .expect("Failed to create test pool");

        // Run migrations
        sqlx::query(
            r#"
            CREATE TABLE IF NOT EXISTS todos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                text TEXT NOT NULL,
                completed BOOLEAN NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
            "#,
        )
        .execute(&pool)
        .await
        .expect("Failed to create test table");

        pool
    }

    #[actix_web::test]
    async fn test_get_todos_empty() {
        let pool = setup_test_pool().await;
        let app = test::init_service(
            App::new()
                .app_data(web::Data::new(pool.clone()))
                .route("/api/todos", web::get().to(todo_actix::handlers::get_todos)),
        )
        .await;

        let req = test::TestRequest::get().uri("/api/todos").to_request();
        let resp = test::call_service(&app, req).await;

        assert!(resp.status().is_success());
        let body: Vec<serde_json::Value> = test::read_body_json(resp).await;
        assert_eq!(body.len(), 0);
    }

    #[actix_web::test]
    async fn test_create_todo() {
        let pool = setup_test_pool().await;
        let app = test::init_service(
            App::new()
                .app_data(web::Data::new(pool.clone()))
                .route("/api/todos", web::post().to(todo_actix::handlers::create_todo)),
        )
        .await;

        let req = test::TestRequest::post()
            .uri("/api/todos")
            .set_json(&json!({"text": "Test todo"}))
            .to_request();

        let resp = test::call_service(&app, req).await;
        assert_eq!(resp.status(), 201);

        let body: serde_json::Value = test::read_body_json(resp).await;
        assert_eq!(body["text"], "Test todo");
        assert_eq!(body["completed"], false);
    }

    #[actix_web::test]
    async fn test_create_todo_empty_text() {
        let pool = setup_test_pool().await;
        let app = test::init_service(
            App::new()
                .app_data(web::Data::new(pool.clone()))
                .route("/api/todos", web::post().to(todo_actix::handlers::create_todo)),
        )
        .await;

        let req = test::TestRequest::post()
            .uri("/api/todos")
            .set_json(&json!({"text": ""}))
            .to_request();

        let resp = test::call_service(&app, req).await;
        assert_eq!(resp.status(), 400);
    }

    #[actix_web::test]
    async fn test_create_todo_long_text() {
        let pool = setup_test_pool().await;
        let app = test::init_service(
            App::new()
                .app_data(web::Data::new(pool.clone()))
                .route("/api/todos", web::post().to(todo_actix::handlers::create_todo)),
        )
        .await;

        let long_text = "a".repeat(501);
        let req = test::TestRequest::post()
            .uri("/api/todos")
            .set_json(&json!({"text": long_text}))
            .to_request();

        let resp = test::call_service(&app, req).await;
        assert_eq!(resp.status(), 400);
    }

    #[actix_web::test]
    async fn test_update_todo() {
        let pool = setup_test_pool().await;

        // Create a todo first
        sqlx::query("INSERT INTO todos (text, completed) VALUES (?, ?)")
            .bind("Original text")
            .bind(false)
            .execute(&pool)
            .await
            .expect("Failed to create test todo");

        let app = test::init_service(
            App::new()
                .app_data(web::Data::new(pool.clone()))
                .route("/api/todos/{id}", web::put().to(todo_actix::handlers::update_todo)),
        )
        .await;

        let req = test::TestRequest::put()
            .uri("/api/todos/1")
            .set_json(&json!({"text": "Updated text", "completed": true}))
            .to_request();

        let resp = test::call_service(&app, req).await;
        assert!(resp.status().is_success());

        let body: serde_json::Value = test::read_body_json(resp).await;
        assert_eq!(body["text"], "Updated text");
        assert_eq!(body["completed"], true);
    }

    #[actix_web::test]
    async fn test_update_nonexistent_todo() {
        let pool = setup_test_pool().await;
        let app = test::init_service(
            App::new()
                .app_data(web::Data::new(pool.clone()))
                .route("/api/todos/{id}", web::put().to(todo_actix::handlers::update_todo)),
        )
        .await;

        let req = test::TestRequest::put()
            .uri("/api/todos/999")
            .set_json(&json!({"text": "Updated"}))
            .to_request();

        let resp = test::call_service(&app, req).await;
        assert_eq!(resp.status(), 404);
    }

    #[actix_web::test]
    async fn test_delete_todo() {
        let pool = setup_test_pool().await;

        // Create a todo first
        sqlx::query("INSERT INTO todos (text, completed) VALUES (?, ?)")
            .bind("To be deleted")
            .bind(false)
            .execute(&pool)
            .await
            .expect("Failed to create test todo");

        let app = test::init_service(
            App::new()
                .app_data(web::Data::new(pool.clone()))
                .route("/api/todos/{id}", web::delete().to(todo_actix::handlers::delete_todo)),
        )
        .await;

        let req = test::TestRequest::delete().uri("/api/todos/1").to_request();

        let resp = test::call_service(&app, req).await;
        assert_eq!(resp.status(), 204);
    }

    #[actix_web::test]
    async fn test_complete_crud_workflow() {
        let pool = setup_test_pool().await;
        let app = test::init_service(
            App::new()
                .app_data(web::Data::new(pool.clone()))
                .service(
                    web::scope("/api/todos")
                        .route("", web::get().to(todo_actix::handlers::get_todos))
                        .route("", web::post().to(todo_actix::handlers::create_todo))
                        .route("/{id}", web::put().to(todo_actix::handlers::update_todo))
                        .route("/{id}", web::delete().to(todo_actix::handlers::delete_todo)),
                ),
        )
        .await;

        // Create
        let req = test::TestRequest::post()
            .uri("/api/todos")
            .set_json(&json!({"text": "Workflow test"}))
            .to_request();
        let resp = test::call_service(&app, req).await;
        assert_eq!(resp.status(), 201);

        // Get all
        let req = test::TestRequest::get().uri("/api/todos").to_request();
        let resp = test::call_service(&app, req).await;
        assert!(resp.status().is_success());
        let body: Vec<serde_json::Value> = test::read_body_json(resp).await;
        assert_eq!(body.len(), 1);

        // Update
        let req = test::TestRequest::put()
            .uri("/api/todos/1")
            .set_json(&json!({"completed": true}))
            .to_request();
        let resp = test::call_service(&app, req).await;
        assert!(resp.status().is_success());

        // Delete
        let req = test::TestRequest::delete().uri("/api/todos/1").to_request();
        let resp = test::call_service(&app, req).await;
        assert_eq!(resp.status(), 204);
    }
}
