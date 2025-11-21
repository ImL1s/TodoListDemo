use sqlx::sqlite::{SqlitePool, SqlitePoolOptions};
use sqlx::Error;

pub async fn create_pool() -> SqlitePool {
    let database_url = std::env::var("DATABASE_URL")
        .unwrap_or_else(|_| "sqlite:todos.db".to_string());

    let pool = SqlitePoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("Failed to create database pool");

    // Run migrations
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            completed BOOLEAN NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL DEFAULT (datetime('now'))
        )
        "#,
    )
    .execute(&pool)
    .await
    .expect("Failed to create todos table");

    pool
}

pub async fn get_all_todos(pool: &SqlitePool) -> Result<Vec<crate::models::Todo>, Error> {
    sqlx::query_as::<_, crate::models::Todo>(
        "SELECT id, text, completed, created_at FROM todos ORDER BY created_at DESC"
    )
    .fetch_all(pool)
    .await
}

pub async fn create_todo(
    pool: &SqlitePool,
    text: &str,
) -> Result<crate::models::Todo, Error> {
    let result = sqlx::query(
        "INSERT INTO todos (text, completed) VALUES (?, ?)"
    )
    .bind(text)
    .bind(false)
    .execute(pool)
    .await?;

    let id = result.last_insert_rowid();

    sqlx::query_as::<_, crate::models::Todo>(
        "SELECT id, text, completed, created_at FROM todos WHERE id = ?"
    )
    .bind(id)
    .fetch_one(pool)
    .await
}

pub async fn update_todo(
    pool: &SqlitePool,
    id: i64,
    text: Option<String>,
    completed: Option<bool>,
) -> Result<crate::models::Todo, Error> {
    // Get current todo
    let current = sqlx::query_as::<_, crate::models::Todo>(
        "SELECT id, text, completed, created_at FROM todos WHERE id = ?"
    )
    .bind(id)
    .fetch_one(pool)
    .await?;

    let new_text = text.unwrap_or(current.text);
    let new_completed = completed.unwrap_or(current.completed);

    sqlx::query(
        "UPDATE todos SET text = ?, completed = ? WHERE id = ?"
    )
    .bind(&new_text)
    .bind(new_completed)
    .bind(id)
    .execute(pool)
    .await?;

    sqlx::query_as::<_, crate::models::Todo>(
        "SELECT id, text, completed, created_at FROM todos WHERE id = ?"
    )
    .bind(id)
    .fetch_one(pool)
    .await
}

pub async fn delete_todo(pool: &SqlitePool, id: i64) -> Result<(), Error> {
    sqlx::query("DELETE FROM todos WHERE id = ?")
        .bind(id)
        .execute(pool)
        .await?;

    Ok(())
}
