# TodoList API - Kotlin + Ktor

A modern, asynchronous RESTful API for managing todos built with Kotlin and Ktor framework.

## Tech Stack

- **Language**: Kotlin 1.9+
- **Framework**: Ktor 2.3+
- **Database**: SQLite with Exposed ORM
- **Features**: Coroutines, Type Safety, Serialization, CORS

## Installation

### Prerequisites

- JDK 17 or higher
- Gradle (wrapper included)

### Setup

1. **Navigate to project directory**:
   ```bash
   cd 10-backend-apis/12-kotlin-ktor
   ```

2. **Build the project**:
   ```bash
   ./gradlew build
   ```

   On Windows:
   ```bash
   gradlew.bat build
   ```

3. **Run the server**:
   ```bash
   ./gradlew run
   ```

The API will be available at `http://localhost:8080`

## Development

### Auto-reload Development Mode
```bash
./gradlew run -Ddevelopment=true
```

### Run Tests
```bash
./gradlew test
```

### Create Distribution
```bash
./gradlew installDist
```

The executable will be in `build/install/todo-ktor/bin/`

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
    "text": "Learn Kotlin",
    "completed": false,
    "createdAt": "2024-01-01T12:00:00"
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
  "text": "Learn Kotlin",
  "completed": false,
  "createdAt": "2024-01-01T12:00:00"
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
  "createdAt": "2024-01-01T12:00:00"
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
  "createdAt": "2024-01-01T12:00:00"
}
```

#### Delete Todo
```http
DELETE /api/todos/{id}
```

**Response** (204 No Content)

## Project Structure

```
12-kotlin-ktor/
├── src/main/kotlin/com/example/
│   ├── Application.kt              # Main application setup
│   ├── models/
│   │   └── Todo.kt                 # Data models & table definition
│   ├── routes/
│   │   └── TodoRoutes.kt           # Route handlers
│   └── database/
│       └── DatabaseFactory.kt      # Database operations
├── build.gradle.kts                # Build configuration
├── gradle.properties               # Gradle properties
├── .gitignore
└── README.md
```

## Key Features

### Coroutines
Asynchronous programming with Kotlin coroutines:
```kotlin
suspend fun getAllTodos(): List<Todo> = dbQuery {
    Todos.selectAll()
        .orderBy(Todos.createdAt to SortOrder.DESC)
        .map { it.toTodo() }
}
```

### Type-Safe Database
Exposed ORM provides type-safe SQL:
```kotlin
object Todos : Table("todos") {
    val id = integer("id").autoIncrement()
    val text = varchar("text", 500)
    val completed = bool("completed").default(false)
    val createdAt = datetime("created_at").clientDefault { LocalDateTime.now() }

    override val primaryKey = PrimaryKey(id)
}
```

### Serialization
Kotlinx.serialization for JSON handling:
```kotlin
@Serializable
data class Todo(
    val id: Int,
    val text: String,
    val completed: Boolean,
    val createdAt: String
)
```

### Routing DSL
Clean and expressive routing:
```kotlin
routing {
    route("/api/todos") {
        get {
            val todos = DatabaseFactory.getAllTodos()
            call.respond(todos)
        }

        post {
            val request = call.receive<CreateTodoRequest>()
            val todo = DatabaseFactory.createTodo(request.text)
            call.respond(HttpStatusCode.Created, todo)
        }
    }
}
```

## Validation Rules

- **text**: Required, 1-500 characters
- **completed**: Optional, boolean

## Error Handling

The API returns appropriate HTTP status codes:

- `200 OK`: Successful GET/PUT request
- `201 Created`: Successful POST request
- `204 No Content`: Successful DELETE request
- `400 Bad Request`: Validation error or invalid request
- `404 Not Found`: Todo not found
- `500 Internal Server Error`: Server error

Error responses:
```json
{
  "error": "Todo not found"
}
```

## Plugins

The application uses several Ktor plugins:

- **ContentNegotiation**: JSON serialization/deserialization
- **CORS**: Cross-origin resource sharing
- **CallLogging**: Request/response logging
- **StatusPages**: Exception handling

## Configuration

### Application Configuration
Edit `src/main/kotlin/com/example/Application.kt`:
```kotlin
embeddedServer(Netty, port = 8080, host = "0.0.0.0") {
    module()
}.start(wait = true)
```

### Database Configuration
Database is configured in `DatabaseFactory.kt`:
```kotlin
val jdbcURL = "jdbc:sqlite:todos.db"
```

## Building for Production

### Create Fat JAR
Add to `build.gradle.kts`:
```kotlin
tasks.jar {
    manifest {
        attributes["Main-Class"] = "com.example.ApplicationKt"
    }
    from(configurations.runtimeClasspath.get().map { if (it.isDirectory) it else zipTree(it) })
    duplicatesStrategy = DuplicatesStrategy.EXCLUDE
}
```

Then build:
```bash
./gradlew jar
java -jar build/libs/todo-ktor-0.1.0.jar
```

## Testing

### Unit Tests
```kotlin
@Test
fun testGetAllTodos() = testApplication {
    application { module() }
    client.get("/api/todos").apply {
        assertEquals(HttpStatusCode.OK, status)
    }
}
```

Run tests:
```bash
./gradlew test
```

## Performance

Ktor features:
- **Non-blocking I/O**: Built on Kotlin coroutines
- **Lightweight**: Minimal overhead
- **Scalable**: Handles many concurrent connections
- **Fast startup**: Quick application initialization

## Development Tips

### Hot Reload
Use the development mode flag for auto-reload:
```bash
./gradlew run -Ddevelopment=true
```

### Logging
Adjust logging in `src/main/resources/logback.xml`:
```xml
<logger name="io.ktor" level="INFO"/>
```

## License

MIT
