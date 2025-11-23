package com.example

import com.example.database.DatabaseFactory
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.jsonArray
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import kotlin.test.*

class ApplicationTest {

    @BeforeTest
    fun setup() {
        // Initialize test database
        DatabaseFactory.init()
    }

    @AfterTest
    fun tearDown() {
        // Clean up database after each test
        DatabaseFactory.clearAll()
    }

    @Test
    fun testGetTodosEmpty() = testApplication {
        application {
            module()
        }

        val response = client.get("/api/todos")
        assertEquals(HttpStatusCode.OK, response.status)
        assertEquals("[]", response.bodyAsText())
    }

    @Test
    fun testCreateTodo() = testApplication {
        application {
            module()
        }

        val response = client.post("/api/todos") {
            contentType(ContentType.Application.Json)
            setBody("""{"text": "Test todo"}""")
        }

        assertEquals(HttpStatusCode.Created, response.status)
        val body = Json.parseToJsonElement(response.bodyAsText()).jsonObject
        assertTrue(body.containsKey("id"))
        assertEquals("Test todo", body["text"]?.jsonPrimitive?.content)
        assertEquals(false, body["completed"]?.jsonPrimitive?.content?.toBoolean())
    }

    @Test
    fun testCreateTodoEmptyText() = testApplication {
        application {
            module()
        }

        val response = client.post("/api/todos") {
            contentType(ContentType.Application.Json)
            setBody("""{"text": ""}""")
        }

        assertEquals(HttpStatusCode.BadRequest, response.status)
    }

    @Test
    fun testCreateTodoLongText() = testApplication {
        application {
            module()
        }

        val longText = "a".repeat(501)
        val response = client.post("/api/todos") {
            contentType(ContentType.Application.Json)
            setBody("""{"text": "$longText"}""")
        }

        assertEquals(HttpStatusCode.BadRequest, response.status)
    }

    @Test
    fun testGetTodoById() = testApplication {
        application {
            module()
        }

        // Create a todo first
        val createResponse = client.post("/api/todos") {
            contentType(ContentType.Application.Json)
            setBody("""{"text": "Test todo"}""")
        }
        val createBody = Json.parseToJsonElement(createResponse.bodyAsText()).jsonObject
        val todoId = createBody["id"]?.jsonPrimitive?.content

        // Get the todo
        val response = client.get("/api/todos/$todoId")
        assertEquals(HttpStatusCode.OK, response.status)

        val body = Json.parseToJsonElement(response.bodyAsText()).jsonObject
        assertEquals(todoId, body["id"]?.jsonPrimitive?.content)
        assertEquals("Test todo", body["text"]?.jsonPrimitive?.content)
    }

    @Test
    fun testGetTodoByIdNotFound() = testApplication {
        application {
            module()
        }

        val response = client.get("/api/todos/999")
        assertEquals(HttpStatusCode.NotFound, response.status)
    }

    @Test
    fun testUpdateTodo() = testApplication {
        application {
            module()
        }

        // Create a todo first
        val createResponse = client.post("/api/todos") {
            contentType(ContentType.Application.Json)
            setBody("""{"text": "Original"}""")
        }
        val createBody = Json.parseToJsonElement(createResponse.bodyAsText()).jsonObject
        val todoId = createBody["id"]?.jsonPrimitive?.content

        // Update the todo
        val updateResponse = client.put("/api/todos/$todoId") {
            contentType(ContentType.Application.Json)
            setBody("""{"text": "Updated", "completed": true}""")
        }

        assertEquals(HttpStatusCode.OK, updateResponse.status)
        val updateBody = Json.parseToJsonElement(updateResponse.bodyAsText()).jsonObject
        assertEquals("Updated", updateBody["text"]?.jsonPrimitive?.content)
        assertEquals(true, updateBody["completed"]?.jsonPrimitive?.content?.toBoolean())
    }

    @Test
    fun testUpdateTodoPartial() = testApplication {
        application {
            module()
        }

        // Create a todo first
        val createResponse = client.post("/api/todos") {
            contentType(ContentType.Application.Json)
            setBody("""{"text": "Original"}""")
        }
        val createBody = Json.parseToJsonElement(createResponse.bodyAsText()).jsonObject
        val todoId = createBody["id"]?.jsonPrimitive?.content

        // Update only completed status
        val updateResponse = client.put("/api/todos/$todoId") {
            contentType(ContentType.Application.Json)
            setBody("""{"completed": true}""")
        }

        assertEquals(HttpStatusCode.OK, updateResponse.status)
        val updateBody = Json.parseToJsonElement(updateResponse.bodyAsText()).jsonObject
        assertEquals("Original", updateBody["text"]?.jsonPrimitive?.content)
        assertEquals(true, updateBody["completed"]?.jsonPrimitive?.content?.toBoolean())
    }

    @Test
    fun testUpdateTodoNotFound() = testApplication {
        application {
            module()
        }

        val response = client.put("/api/todos/999") {
            contentType(ContentType.Application.Json)
            setBody("""{"text": "Updated"}""")
        }

        assertEquals(HttpStatusCode.NotFound, response.status)
    }

    @Test
    fun testDeleteTodo() = testApplication {
        application {
            module()
        }

        // Create a todo first
        val createResponse = client.post("/api/todos") {
            contentType(ContentType.Application.Json)
            setBody("""{"text": "To delete"}""")
        }
        val createBody = Json.parseToJsonElement(createResponse.bodyAsText()).jsonObject
        val todoId = createBody["id"]?.jsonPrimitive?.content

        // Delete the todo
        val deleteResponse = client.delete("/api/todos/$todoId")
        assertEquals(HttpStatusCode.NoContent, deleteResponse.status)

        // Verify it's deleted
        val getResponse = client.get("/api/todos/$todoId")
        assertEquals(HttpStatusCode.NotFound, getResponse.status)
    }

    @Test
    fun testDeleteTodoNotFound() = testApplication {
        application {
            module()
        }

        val response = client.delete("/api/todos/999")
        assertEquals(HttpStatusCode.NotFound, response.status)
    }

    @Test
    fun testCompleteCrudWorkflow() = testApplication {
        application {
            module()
        }

        // Create
        val createResponse = client.post("/api/todos") {
            contentType(ContentType.Application.Json)
            setBody("""{"text": "Workflow test"}""")
        }
        assertEquals(HttpStatusCode.Created, createResponse.status)
        val todoId = Json.parseToJsonElement(createResponse.bodyAsText())
            .jsonObject["id"]?.jsonPrimitive?.content

        // Read all
        val getAllResponse = client.get("/api/todos")
        assertEquals(HttpStatusCode.OK, getAllResponse.status)
        val todos = Json.parseToJsonElement(getAllResponse.bodyAsText()).jsonArray
        assertEquals(1, todos.size)

        // Update
        val updateResponse = client.put("/api/todos/$todoId") {
            contentType(ContentType.Application.Json)
            setBody("""{"completed": true}""")
        }
        assertEquals(HttpStatusCode.OK, updateResponse.status)

        // Delete
        val deleteResponse = client.delete("/api/todos/$todoId")
        assertEquals(HttpStatusCode.NoContent, deleteResponse.status)

        // Verify empty list
        val finalGetResponse = client.get("/api/todos")
        assertEquals("[]", finalGetResponse.bodyAsText())
    }

    @Test
    fun testMultipleTodos() = testApplication {
        application {
            module()
        }

        // Create multiple todos
        repeat(5) { i ->
            client.post("/api/todos") {
                contentType(ContentType.Application.Json)
                setBody("""{"text": "Todo $i"}""")
            }
        }

        // Get all todos
        val response = client.get("/api/todos")
        val todos = Json.parseToJsonElement(response.bodyAsText()).jsonArray
        assertEquals(5, todos.size)
    }

    @Test
    fun testInvalidIdFormat() = testApplication {
        application {
            module()
        }

        val response = client.get("/api/todos/invalid")
        assertEquals(HttpStatusCode.BadRequest, response.status)
    }

    @Test
    fun testMaxLengthText() = testApplication {
        application {
            module()
        }

        val maxText = "a".repeat(500)
        val response = client.post("/api/todos") {
            contentType(ContentType.Application.Json)
            setBody("""{"text": "$maxText"}""")
        }

        assertEquals(HttpStatusCode.Created, response.status)
    }
}
