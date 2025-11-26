use actix_web::{web, HttpResponse, Result};
use sqlx::SqlitePool;

use crate::db;
use crate::models::{CreateTodo, UpdateTodo};

pub async fn get_todos(pool: web::Data<SqlitePool>) -> Result<HttpResponse> {
    match db::get_all_todos(pool.get_ref()).await {
        Ok(todos) => Ok(HttpResponse::Ok().json(todos)),
        Err(e) => {
            log::error!("Failed to get todos: {}", e);
            Ok(HttpResponse::InternalServerError().json(serde_json::json!({
                "error": "Failed to get todos"
            })))
        }
    }
}

pub async fn create_todo(
    pool: web::Data<SqlitePool>,
    todo: web::Json<CreateTodo>,
) -> Result<HttpResponse> {
    if todo.text.is_empty() || todo.text.len() > 500 {
        return Ok(HttpResponse::BadRequest().json(serde_json::json!({
            "error": "Text must be between 1 and 500 characters"
        })));
    }

    match db::create_todo(pool.get_ref(), &todo.text).await {
        Ok(created_todo) => Ok(HttpResponse::Created().json(created_todo)),
        Err(e) => {
            log::error!("Failed to create todo: {}", e);
            Ok(HttpResponse::InternalServerError().json(serde_json::json!({
                "error": "Failed to create todo"
            })))
        }
    }
}

pub async fn update_todo(
    pool: web::Data<SqlitePool>,
    id: web::Path<i64>,
    todo: web::Json<UpdateTodo>,
) -> Result<HttpResponse> {
    if let Some(ref text) = todo.text {
        if text.is_empty() || text.len() > 500 {
            return Ok(HttpResponse::BadRequest().json(serde_json::json!({
                "error": "Text must be between 1 and 500 characters"
            })));
        }
    }

    match db::update_todo(
        pool.get_ref(),
        id.into_inner(),
        todo.text.clone(),
        todo.completed,
    )
    .await
    {
        Ok(updated_todo) => Ok(HttpResponse::Ok().json(updated_todo)),
        Err(sqlx::Error::RowNotFound) => {
            Ok(HttpResponse::NotFound().json(serde_json::json!({
                "error": "Todo not found"
            })))
        }
        Err(e) => {
            log::error!("Failed to update todo: {}", e);
            Ok(HttpResponse::InternalServerError().json(serde_json::json!({
                "error": "Failed to update todo"
            })))
        }
    }
}

pub async fn delete_todo(
    pool: web::Data<SqlitePool>,
    id: web::Path<i64>,
) -> Result<HttpResponse> {
    match db::delete_todo(pool.get_ref(), id.into_inner()).await {
        Ok(_) => Ok(HttpResponse::NoContent().finish()),
        Err(e) => {
            log::error!("Failed to delete todo: {}", e);
            Ok(HttpResponse::InternalServerError().json(serde_json::json!({
                "error": "Failed to delete todo"
            })))
        }
    }
}
