package com.example.database

import com.example.models.*
import kotlinx.coroutines.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.*
import org.jetbrains.exposed.sql.transactions.experimental.*
import java.time.LocalDateTime

object DatabaseFactory {
    fun init() {
        val driverClassName = "org.sqlite.JDBC"
        val jdbcURL = "jdbc:sqlite:todos.db"
        val database = Database.connect(jdbcURL, driverClassName)

        transaction(database) {
            SchemaUtils.create(Todos)
        }
    }

    suspend fun <T> dbQuery(block: suspend () -> T): T =
        newSuspendedTransaction(Dispatchers.IO) { block() }

    suspend fun getAllTodos(): List<Todo> = dbQuery {
        Todos.selectAll()
            .orderBy(Todos.createdAt to SortOrder.DESC)
            .map { it.toTodo() }
    }

    suspend fun getTodoById(id: Int): Todo? = dbQuery {
        Todos.select { Todos.id eq id }
            .map { it.toTodo() }
            .singleOrNull()
    }

    suspend fun createTodo(text: String): Todo = dbQuery {
        val insertStatement = Todos.insert {
            it[Todos.text] = text
            it[completed] = false
            it[createdAt] = LocalDateTime.now()
        }

        insertStatement.resultedValues?.singleOrNull()?.toTodo()
            ?: throw Exception("Failed to create todo")
    }

    suspend fun updateTodo(
        id: Int,
        text: String?,
        completed: Boolean?
    ): Todo? = dbQuery {
        val current = getTodoById(id) ?: return@dbQuery null

        Todos.update({ Todos.id eq id }) {
            if (text != null) it[Todos.text] = text
            if (completed != null) it[Todos.completed] = completed
        }

        getTodoById(id)
    }

    suspend fun deleteTodo(id: Int): Boolean = dbQuery {
        Todos.deleteWhere { Todos.id eq id } > 0
    }

    suspend fun clearAll() = dbQuery {
        Todos.deleteAll()
    }
}
