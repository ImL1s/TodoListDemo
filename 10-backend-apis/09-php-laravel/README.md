# TodoList API - Laravel

A RESTful API for managing todos built with PHP and Laravel framework.

## Tech Stack

- **PHP**: 8.2+
- **Framework**: Laravel 10+
- **Database**: SQLite
- **Features**: RESTful API, Model Validation, CORS Support

## Installation

### Prerequisites

- PHP 8.2 or higher
- Composer
- SQLite extension for PHP

### Setup

1. **Install dependencies**:
   ```bash
   composer install
   ```

2. **Setup environment**:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. **Create database**:
   ```bash
   touch database/database.sqlite
   ```

4. **Run migrations**:
   ```bash
   php artisan migrate
   ```

5. **Start development server**:
   ```bash
   php artisan serve
   ```

The API will be available at `http://localhost:8000`

## API Endpoints

### Base URL
```
http://localhost:8000/api
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
    "text": "Learn Laravel",
    "completed": false,
    "created_at": "2024-01-01T12:00:00.000000Z",
    "updated_at": "2024-01-01T12:00:00.000000Z"
  }
]
```

#### Get Single Todo
```http
GET /api/todos/{id}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "text": "Learn Laravel",
  "completed": false,
  "created_at": "2024-01-01T12:00:00.000000Z",
  "updated_at": "2024-01-01T12:00:00.000000Z"
}
```

**Response** (404 Not Found):
```json
{
  "message": "No query results for model [App\\Models\\Todo] {id}"
}
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
  "created_at": "2024-01-01T12:00:00.000000Z",
  "updated_at": "2024-01-01T12:00:00.000000Z"
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
  "created_at": "2024-01-01T12:00:00.000000Z",
  "updated_at": "2024-01-01T12:30:00.000000Z"
}
```

#### Delete Todo
```http
DELETE /api/todos/{id}
```

**Response** (204 No Content)

## Project Structure

```
09-php-laravel/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       └── TodoController.php    # CRUD operations
│   └── Models/
│       └── Todo.php                  # Todo model
├── routes/
│   └── api.php                       # API routes
├── database/
│   └── migrations/
│       └── 2024_01_01_000000_create_todos_table.php
├── config/
│   ├── app.php                       # App configuration
│   ├── database.php                  # Database configuration
│   └── cors.php                      # CORS configuration
├── composer.json                     # Dependencies
├── artisan                           # Laravel CLI
├── .env.example                      # Environment template
└── README.md
```

## Validation Rules

- **text**: Required, string, max 500 characters
- **completed**: Optional, boolean

## Error Handling

The API returns appropriate HTTP status codes:

- `200 OK`: Successful GET/PUT request
- `201 Created`: Successful POST request
- `204 No Content`: Successful DELETE request
- `404 Not Found`: Todo not found
- `422 Unprocessable Entity`: Validation error

## Testing

Run PHPUnit tests:
```bash
php artisan test
```

## Development

### Code Style
```bash
./vendor/bin/pint
```

### Database Reset
```bash
php artisan migrate:fresh
```

## License

MIT
