# Kotlin + Ktor 安全加固实施指南

## 已完成 ✅

- [x] .env.example 已创建（包含 CORS 和速率限制配置）

## 待实施

### 1. 添加依赖

**文件**: `build.gradle.kts`

```kotlin
dependencies {
    // Ktor server
    implementation("io.ktor:ktor-server-core:$ktor_version")
    implementation("io.ktor:ktor-server-netty:$ktor_version")
    implementation("io.ktor:ktor-server-content-negotiation:$ktor_version")
    implementation("io.ktor:ktor-serialization-kotlinx-json:$ktor_version")

    // CORS
    implementation("io.ktor:ktor-server-cors:$ktor_version")

    // Rate limiting
    implementation("io.ktor:ktor-server-rate-limit:$ktor_version")

    // Default headers
    implementation("io.ktor:ktor-server-default-headers:$ktor_version")

    // Environment variables
    implementation("io.github.cdimascio:dotenv-kotlin:6.4.1")

    // Logging
    implementation("ch.qos.logback:logback-classic:1.4.11")

    // Database
    implementation("org.jetbrains.exposed:exposed-core:$exposed_version")
    implementation("org.jetbrains.exposed:exposed-dao:$exposed_version")
    implementation("org.jetbrains.exposed:exposed-jdbc:$exposed_version")
    implementation("org.xerial:sqlite-jdbc:3.44.1.0")

    // HTML escaping
    implementation("org.apache.commons:commons-text:1.11.0")
}
```

### 2. CORS 配置

**文件**: `src/main/kotlin/com/example/Application.kt`

```kotlin
import io.ktor.server.application.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.http.*
import io.github.cdimascio.dotenv.dotenv

fun Application.configureCORS() {
    val dotenv = dotenv {
        ignoreIfMissing = true
    }

    val allowedOrigins = dotenv["ALLOWED_ORIGINS"]
        ?.split(",")
        ?.map { it.trim() }
        ?: listOf("http://localhost:3000")

    install(CORS) {
        allowedOrigins.forEach { origin ->
            allowHost(origin, schemes = listOf("http", "https"))
        }

        allowMethod(HttpMethod.Options)
        allowMethod(HttpMethod.Get)
        allowMethod(HttpMethod.Post)
        allowMethod(HttpMethod.Put)
        allowMethod(HttpMethod.Delete)

        allowHeader(HttpHeaders.Authorization)
        allowHeader(HttpHeaders.ContentType)
        allowHeader(HttpHeaders.Accept)

        allowCredentials = true
        maxAgeInSeconds = 3600
    }

    log.info("CORS configured with allowed origins: $allowedOrigins")
}
```

### 3. 安全响应头

**文件**: `src/main/kotlin/com/example/Application.kt`

```kotlin
import io.ktor.server.plugins.defaultheaders.*

fun Application.configureSecurityHeaders() {
    install(DefaultHeaders) {
        header("X-Content-Type-Options", "nosniff")
        header("X-Frame-Options", "DENY")
        header("X-XSS-Protection", "1; mode=block")
        header("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
    }
}
```

### 4. 速率限制

**文件**: `src/main/kotlin/com/example/Application.kt`

```kotlin
import io.ktor.server.plugins.ratelimit.*
import kotlin.time.Duration.Companion.minutes
import kotlin.time.Duration.Companion.seconds

fun Application.configureRateLimiting() {
    val dotenv = dotenv { ignoreIfMissing = true }

    val maxRequests = dotenv["RATE_LIMIT_MAX"]?.toIntOrNull() ?: 100
    val windowMinutes = dotenv["RATE_LIMIT_WINDOW_MINUTES"]?.toLongOrNull() ?: 1L

    install(RateLimit) {
        register(RateLimitName("api")) {
            rateLimiter(limit = maxRequests, refillPeriod = windowMinutes.minutes)
        }
    }

    log.info("Rate limiting configured: $maxRequests requests per $windowMinutes minute(s)")
}
```

### 5. 数据验证和 HTML 转义

**创建文件**: `src/main/kotlin/com/example/models/TodoModels.kt`

```kotlin
package com.example.models

import kotlinx.serialization.Serializable
import org.apache.commons.text.StringEscapeUtils

@Serializable
data class CreateTodoRequest(
    val text: String,
    val completed: Boolean = false
) {
    init {
        require(text.isNotBlank()) { "Text cannot be blank" }
        require(text.length in 1..500) { "Text must be between 1 and 500 characters" }
    }

    fun sanitize(): CreateTodoRequest {
        return copy(text = StringEscapeUtils.escapeHtml4(text))
    }
}

@Serializable
data class UpdateTodoRequest(
    val text: String? = null,
    val completed: Boolean? = null
) {
    init {
        text?.let {
            require(it.isNotBlank()) { "Text cannot be blank" }
            require(it.length in 1..500) { "Text must be between 1 and 500 characters" }
        }
    }

    fun sanitize(): UpdateTodoRequest {
        return copy(text = text?.let { StringEscapeUtils.escapeHtml4(it) })
    }
}

@Serializable
data class TodoResponse(
    val id: Int,
    val text: String,
    val completed: Boolean,
    val createdAt: String,
    val updatedAt: String
)

@Serializable
data class ErrorResponse(
    val error: String
)
```

### 6. ID 验证和路由

**创建文件**: `src/main/kotlin/com/example/routes/TodoRoutes.kt`

```kotlin
package com.example.routes

import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.http.*
import com.example.models.*
import com.example.database.TodoDatabase
import org.slf4j.LoggerFactory

fun Route.todoRoutes(database: TodoDatabase) {
    val logger = LoggerFactory.getLogger("TodoRoutes")

    route("/api/todos") {
        get {
            try {
                val todos = database.getAllTodos()
                call.respond(HttpStatusCode.OK, todos)
            } catch (e: Exception) {
                logger.error("Error retrieving todos", e)
                call.respond(
                    HttpStatusCode.InternalServerError,
                    ErrorResponse("Failed to retrieve todos")
                )
            }
        }

        get("/{id}") {
            val idStr = call.parameters["id"]
            val id = idStr?.toIntOrNull()

            if (id == null || id <= 0) {
                call.respond(
                    HttpStatusCode.BadRequest,
                    ErrorResponse("Invalid ID format")
                )
                return@get
            }

            try {
                val todo = database.getTodoById(id)
                if (todo != null) {
                    call.respond(HttpStatusCode.OK, todo)
                } else {
                    call.respond(
                        HttpStatusCode.NotFound,
                        ErrorResponse("Todo not found")
                    )
                }
            } catch (e: Exception) {
                logger.error("Error retrieving todo $id", e)
                call.respond(
                    HttpStatusCode.InternalServerError,
                    ErrorResponse("Failed to retrieve todo")
                )
            }
        }

        post {
            try {
                val request = call.receive<CreateTodoRequest>()
                val sanitized = request.sanitize()
                val todo = database.createTodo(sanitized)
                call.respond(HttpStatusCode.Created, todo)
            } catch (e: IllegalArgumentException) {
                call.respond(
                    HttpStatusCode.BadRequest,
                    ErrorResponse("Invalid input: ${e.message}")
                )
            } catch (e: Exception) {
                logger.error("Error creating todo", e)
                call.respond(
                    HttpStatusCode.InternalServerError,
                    ErrorResponse("Failed to create todo")
                )
            }
        }

        put("/{id}") {
            val idStr = call.parameters["id"]
            val id = idStr?.toIntOrNull()

            if (id == null || id <= 0) {
                call.respond(
                    HttpStatusCode.BadRequest,
                    ErrorResponse("Invalid ID format")
                )
                return@put
            }

            try {
                val request = call.receive<UpdateTodoRequest>()
                val sanitized = request.sanitize()
                val todo = database.updateTodo(id, sanitized)

                if (todo != null) {
                    call.respond(HttpStatusCode.OK, todo)
                } else {
                    call.respond(
                        HttpStatusCode.NotFound,
                        ErrorResponse("Todo not found")
                    )
                }
            } catch (e: IllegalArgumentException) {
                call.respond(
                    HttpStatusCode.BadRequest,
                    ErrorResponse("Invalid input: ${e.message}")
                )
            } catch (e: Exception) {
                logger.error("Error updating todo $id", e)
                call.respond(
                    HttpStatusCode.InternalServerError,
                    ErrorResponse("Failed to update todo")
                )
            }
        }

        delete("/{id}") {
            val idStr = call.parameters["id"]
            val id = idStr?.toIntOrNull()

            if (id == null || id <= 0) {
                call.respond(
                    HttpStatusCode.BadRequest,
                    ErrorResponse("Invalid ID format")
                )
                return@delete
            }

            try {
                val deleted = database.deleteTodo(id)
                if (deleted) {
                    call.respond(
                        HttpStatusCode.OK,
                        mapOf("message" to "Todo deleted successfully")
                    )
                } else {
                    call.respond(
                        HttpStatusCode.NotFound,
                        ErrorResponse("Todo not found")
                    )
                }
            } catch (e: Exception) {
                logger.error("Error deleting todo $id", e)
                call.respond(
                    HttpStatusCode.InternalServerError,
                    ErrorResponse("Failed to delete todo")
                )
            }
        }
    }
}
```

### 7. 健康检查端点

**文件**: `src/main/kotlin/com/example/routes/HealthRoutes.kt`

```kotlin
package com.example.routes

import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.http.*
import com.example.database.TodoDatabase
import kotlinx.serialization.Serializable
import java.time.Instant

@Serializable
data class HealthResponse(
    val status: String,
    val database: String,
    val version: String,
    val time: String
)

fun Route.healthRoutes(database: TodoDatabase) {
    get("/health") {
        val dbStatus = try {
            database.checkConnection()
            "ok"
        } catch (e: Exception) {
            "unavailable"
        }

        val statusCode = if (dbStatus == "ok") {
            HttpStatusCode.OK
        } else {
            HttpStatusCode.ServiceUnavailable
        }

        call.respond(
            statusCode,
            HealthResponse(
                status = "ok",
                database = dbStatus,
                version = "1.0.0",
                time = Instant.now().toString()
            )
        )
    }
}
```

### 8. 主应用配置

**文件**: `src/main/kotlin/com/example/Application.kt`

```kotlin
package com.example

import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.routing.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.plugins.contentnegotiation.*
import io.github.cdimascio.dotenv.dotenv
import com.example.routes.*
import com.example.database.TodoDatabase

fun main() {
    val dotenv = dotenv { ignoreIfMissing = true }

    val host = dotenv["HOST"] ?: "0.0.0.0"
    val port = dotenv["PORT"]?.toIntOrNull() ?: 8080

    embeddedServer(Netty, port = port, host = host, module = Application::module)
        .start(wait = true)
}

fun Application.module() {
    val database = TodoDatabase()

    // Configure plugins
    install(ContentNegotiation) {
        json()
    }

    configureCORS()
    configureSecurityHeaders()
    configureRateLimiting()

    // Configure routing
    routing {
        healthRoutes(database)
        todoRoutes(database)
    }

    log.info("Server started successfully")
}
```

## 测试

```bash
# 构建项目
./gradlew build

# 运行项目
./gradlew run

# 测试 CORS
curl -H "Origin: http://unauthorized.com" \
  -H "Access-Control-Request-Method: POST" \
  -X OPTIONS http://localhost:8080/api/todos

# 测试健康检查
curl http://localhost:8080/health

# 测试速率限制
for i in {1..110}; do curl http://localhost:8080/api/todos; done
```

## 生产环境部署

```bash
# 设置环境变量
export ENVIRONMENT=production
export ALLOWED_ORIGINS=https://yourdomain.com

# 构建 JAR
./gradlew shadowJar

# 运行
java -jar build/libs/todolist-ktor-all.jar
```
