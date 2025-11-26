package com.example.models

import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.javatime.datetime
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

@Serializable
data class Todo(
    val id: Int,
    val text: String,
    val completed: Boolean,
    val createdAt: String
)

@Serializable
data class CreateTodoRequest(
    val text: String
)

@Serializable
data class UpdateTodoRequest(
    val text: String? = null,
    val completed: Boolean? = null
)

object Todos : Table("todos") {
    val id = integer("id").autoIncrement()
    val text = varchar("text", 500)
    val completed = bool("completed").default(false)
    val createdAt = datetime("created_at").clientDefault { LocalDateTime.now() }

    override val primaryKey = PrimaryKey(id)
}

fun ResultRow.toTodo() = Todo(
    id = this[Todos.id],
    text = this[Todos.text],
    completed = this[Todos.completed],
    createdAt = this[Todos.createdAt].format(DateTimeFormatter.ISO_DATE_TIME)
)
