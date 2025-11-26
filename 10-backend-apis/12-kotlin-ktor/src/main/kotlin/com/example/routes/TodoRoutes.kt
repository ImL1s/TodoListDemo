package com.example.routes

import com.example.database.DatabaseFactory
import com.example.models.CreateTodoRequest
import com.example.models.UpdateTodoRequest
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Application.configureTodoRoutes() {
    routing {
        route("/api/todos") {
            // Get all todos
            get {
                val todos = DatabaseFactory.getAllTodos()
                call.respond(todos)
            }

            // Get single todo
            get("/{id}") {
                val id = call.parameters["id"]?.toIntOrNull()
                if (id == null) {
                    call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Invalid ID"))
                    return@get
                }

                val todo = DatabaseFactory.getTodoById(id)
                if (todo == null) {
                    call.respond(HttpStatusCode.NotFound, mapOf("error" to "Todo not found"))
                } else {
                    call.respond(todo)
                }
            }

            // Create todo
            post {
                val request = try {
                    call.receive<CreateTodoRequest>()
                } catch (e: Exception) {
                    call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Invalid request body"))
                    return@post
                }

                if (request.text.isBlank() || request.text.length > 500) {
                    call.respond(
                        HttpStatusCode.BadRequest,
                        mapOf("error" to "Text must be between 1 and 500 characters")
                    )
                    return@post
                }

                val todo = DatabaseFactory.createTodo(request.text)
                call.respond(HttpStatusCode.Created, todo)
            }

            // Update todo
            put("/{id}") {
                val id = call.parameters["id"]?.toIntOrNull()
                if (id == null) {
                    call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Invalid ID"))
                    return@put
                }

                val request = try {
                    call.receive<UpdateTodoRequest>()
                } catch (e: Exception) {
                    call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Invalid request body"))
                    return@put
                }

                if (request.text != null && (request.text.isBlank() || request.text.length > 500)) {
                    call.respond(
                        HttpStatusCode.BadRequest,
                        mapOf("error" to "Text must be between 1 and 500 characters")
                    )
                    return@put
                }

                val updatedTodo = DatabaseFactory.updateTodo(id, request.text, request.completed)
                if (updatedTodo == null) {
                    call.respond(HttpStatusCode.NotFound, mapOf("error" to "Todo not found"))
                } else {
                    call.respond(updatedTodo)
                }
            }

            // Delete todo
            delete("/{id}") {
                val id = call.parameters["id"]?.toIntOrNull()
                if (id == null) {
                    call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Invalid ID"))
                    return@delete
                }

                val deleted = DatabaseFactory.deleteTodo(id)
                if (deleted) {
                    call.respond(HttpStatusCode.NoContent)
                } else {
                    call.respond(HttpStatusCode.NotFound, mapOf("error" to "Todo not found"))
                }
            }
        }
    }
}
