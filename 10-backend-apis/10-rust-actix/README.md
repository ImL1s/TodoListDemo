# TodoList API - Rust + Actix-web

A high-performance RESTful API for managing todos built with Rust and Actix-web framework.

## Tech Stack

- **Language**: Rust 1.75+
- **Framework**: Actix-web 4
- **Database**: SQLite with SQLx
- **Features**: Async/Await, Type-safe queries, CORS support

## Installation

### Prerequisites

- Rust 1.75 or higher (install via [rustup](https://rustup.rs/))
- Cargo (comes with Rust)

### Setup

1. **Clone and navigate to the project**:
   ```bash
   cd 10-backend-apis/10-rust-actix
   ```

2. **Setup environment**:
   ```bash
   cp .env.example .env
   ```

3. **Build the project**:
   ```bash
   cargo build --release
   ```

4. **Run the server**:
   ```bash
   cargo run --release
   ```

The API will be available at `http://localhost:8080`

## Development Mode

For development with auto-reload, install cargo-watch:
```bash
cargo install cargo-watch
cargo watch -x run
```

## API Endpoints

### Base URL
```
http://localhost:8080/api
```

### Endpoints

#### Get All Todos
```http
GET /api/todos
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "text": "Learn Rust",
    "completed": false,
    "created_at": "2024-01-01 12:00:00"
  }
]
```

#### Create Todo
```http
POST /api/todos
Content-Type: application/json

{
  "text": "New todo item"
}
```

**Response** (201 Created):
```json
{
  "id": 1,
  "text": "New todo item",
  "completed": false,
  "created_at": "2024-01-01 12:00:00"
}
```

#### Update Todo
```http
PUT /api/todos/{id}
Content-Type: application/json

{
  "text": "Updated text",
  "completed": true
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "text": "Updated text",
  "completed": true,
  "created_at": "2024-01-01 12:00:00"
}
```

#### Delete Todo
```http
DELETE /api/todos/{id}
```

**Response** (204 No Content)

## Project Structure

```
10-rust-actix/
├── src/
│   ├── main.rs           # Application entry point & server setup
│   ├── models.rs         # Data models and DTOs
│   ├── handlers.rs       # HTTP request handlers
│   └── db.rs            # Database operations
├── Cargo.toml           # Dependencies and metadata
├── .env.example         # Environment variables template
├── .gitignore
└── README.md
```

## Key Features

### Type Safety
Rust's type system ensures compile-time correctness:
```rust
#[derive(Serialize, Deserialize, FromRow)]
pub struct Todo {
    pub id: i64,
    pub text: String,
    pub completed: bool,
    pub created_at: String,
}
```

### Async Database Operations
Powered by SQLx for safe, async database queries:
```rust
pub async fn get_all_todos(pool: &SqlitePool) -> Result<Vec<Todo>, Error> {
    sqlx::query_as::<_, Todo>("SELECT * FROM todos ORDER BY created_at DESC")
        .fetch_all(pool)
        .await
}
```

### Validation
Built-in request validation:
- Text: 1-500 characters
- Proper error messages for invalid requests

## Error Handling

The API returns appropriate HTTP status codes:

- `200 OK`: Successful GET/PUT request
- `201 Created`: Successful POST request
- `204 No Content`: Successful DELETE request
- `400 Bad Request`: Validation error
- `404 Not Found`: Todo not found
- `500 Internal Server Error`: Server error

## Performance

Actix-web is one of the fastest web frameworks:
- Async I/O with Tokio runtime
- Zero-cost abstractions
- Efficient memory usage
- Connection pooling

## Testing

Run tests:
```bash
cargo test
```

Run with code coverage:
```bash
cargo tarpaulin --out Html
```

## Building for Production

```bash
# Build optimized binary
cargo build --release

# Binary will be at
./target/release/todo-actix
```

## Environment Variables

- `DATABASE_URL`: SQLite database path (default: `sqlite:todos.db`)
- `HOST`: Server host (default: `127.0.0.1`)
- `PORT`: Server port (default: `8080`)
- `RUST_LOG`: Log level (default: `info`)

## License

MIT
