mod db;
mod handlers;
mod models;

use actix_cors::Cors;
use actix_web::{middleware, web, App, HttpServer};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Initialize logger
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    // Load .env file if it exists
    dotenv::dotenv().ok();

    // Create database pool
    log::info!("Initializing database...");
    let pool = db::create_pool().await;
    log::info!("Database initialized successfully");

    let host = std::env::var("HOST").unwrap_or_else(|_| "127.0.0.1".to_string());
    let port = std::env::var("PORT")
        .unwrap_or_else(|_| "8080".to_string())
        .parse::<u16>()
        .expect("PORT must be a valid number");

    log::info!("Starting server at http://{}:{}", host, port);

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .wrap(middleware::Logger::default())
            .wrap(
                Cors::default()
                    .allow_any_origin()
                    .allow_any_method()
                    .allow_any_header()
                    .max_age(3600),
            )
            .service(
                web::scope("/api/todos")
                    .route("", web::get().to(handlers::get_todos))
                    .route("", web::post().to(handlers::create_todo))
                    .route("/{id}", web::put().to(handlers::update_todo))
                    .route("/{id}", web::delete().to(handlers::delete_todo)),
            )
    })
    .bind((host.as_str(), port))?
    .run()
    .await
}
