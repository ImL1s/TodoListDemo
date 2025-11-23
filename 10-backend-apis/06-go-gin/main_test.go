package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/user/todolist-gin/database"
	"github.com/user/todolist-gin/handlers"
	"github.com/user/todolist-gin/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupTestRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)

	// Initialize test database
	var err error
	database.DB, err = gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to test database")
	}
	database.DB.AutoMigrate(&models.Todo{})

	// Create router
	r := gin.New()

	// API routes
	api := r.Group("/api")
	{
		api.GET("/todos", handlers.GetTodos)
		api.GET("/todos/:id", handlers.GetTodo)
		api.POST("/todos", handlers.CreateTodo)
		api.PUT("/todos/:id", handlers.UpdateTodo)
		api.DELETE("/todos/:id", handlers.DeleteTodo)
	}

	return r
}

func cleanupTestData() {
	database.DB.Exec("DELETE FROM todos")
}

// Integration tests
func TestIntegrationCreateAndGetTodo(t *testing.T) {
	router := setupTestRouter()
	defer cleanupTestData()

	// Create a new todo
	input := models.CreateTodoInput{
		Text:      "Integration test todo",
		Completed: false,
	}
	body, _ := json.Marshal(input)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/api/todos", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)

	var createdTodo models.Todo
	json.Unmarshal(w.Body.Bytes(), &createdTodo)
	assert.Equal(t, "Integration test todo", createdTodo.Text)
	assert.False(t, createdTodo.Completed)

	// Get the created todo
	w = httptest.NewRecorder()
	req, _ = http.NewRequest("GET", "/api/todos/1", nil)
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var fetchedTodo models.Todo
	json.Unmarshal(w.Body.Bytes(), &fetchedTodo)
	assert.Equal(t, createdTodo.ID, fetchedTodo.ID)
	assert.Equal(t, "Integration test todo", fetchedTodo.Text)
}

func TestIntegrationCreateUpdateAndGetTodo(t *testing.T) {
	router := setupTestRouter()
	defer cleanupTestData()

	// Create a new todo
	input := models.CreateTodoInput{
		Text:      "Original text",
		Completed: false,
	}
	body, _ := json.Marshal(input)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/api/todos", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)

	// Update the todo
	newText := "Updated text"
	completed := true
	updateInput := models.UpdateTodoInput{
		Text:      &newText,
		Completed: &completed,
	}
	updateBody, _ := json.Marshal(updateInput)

	w = httptest.NewRecorder()
	req, _ = http.NewRequest("PUT", "/api/todos/1", bytes.NewBuffer(updateBody))
	req.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	// Get the updated todo
	w = httptest.NewRecorder()
	req, _ = http.NewRequest("GET", "/api/todos/1", nil)
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var fetchedTodo models.Todo
	json.Unmarshal(w.Body.Bytes(), &fetchedTodo)
	assert.Equal(t, "Updated text", fetchedTodo.Text)
	assert.True(t, fetchedTodo.Completed)
}

func TestIntegrationCreateAndDeleteTodo(t *testing.T) {
	router := setupTestRouter()
	defer cleanupTestData()

	// Create a new todo
	input := models.CreateTodoInput{
		Text:      "Todo to be deleted",
		Completed: false,
	}
	body, _ := json.Marshal(input)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/api/todos", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)

	// Delete the todo
	w = httptest.NewRecorder()
	req, _ = http.NewRequest("DELETE", "/api/todos/1", nil)
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	// Try to get the deleted todo
	w = httptest.NewRecorder()
	req, _ = http.NewRequest("GET", "/api/todos/1", nil)
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
}

func TestIntegrationGetAllTodos(t *testing.T) {
	router := setupTestRouter()
	defer cleanupTestData()

	// Create multiple todos
	todos := []models.CreateTodoInput{
		{Text: "First todo", Completed: false},
		{Text: "Second todo", Completed: true},
		{Text: "Third todo", Completed: false},
	}

	for _, todo := range todos {
		body, _ := json.Marshal(todo)
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("POST", "/api/todos", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(w, req)
		assert.Equal(t, http.StatusCreated, w.Code)
	}

	// Get all todos
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/todos", nil)
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var allTodos []models.Todo
	json.Unmarshal(w.Body.Bytes(), &allTodos)
	assert.Len(t, allTodos, 3)
}

func TestIntegrationErrorHandling404(t *testing.T) {
	router := setupTestRouter()
	defer cleanupTestData()

	// Try to get non-existent todo
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/todos/999", nil)
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
}

func TestIntegrationErrorHandling400(t *testing.T) {
	router := setupTestRouter()
	defer cleanupTestData()

	// Try to create todo with invalid JSON
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/api/todos", bytes.NewBufferString("invalid json"))
	req.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestIntegrationErrorHandlingEmptyText(t *testing.T) {
	router := setupTestRouter()
	defer cleanupTestData()

	// Try to create todo with empty text
	input := models.CreateTodoInput{
		Text:      "",
		Completed: false,
	}
	body, _ := json.Marshal(input)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/api/todos", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestIntegrationLongText(t *testing.T) {
	router := setupTestRouter()
	defer cleanupTestData()

	// Create todo with long text (>500 characters)
	longText := make([]byte, 600)
	for i := range longText {
		longText[i] = 'a'
	}

	input := models.CreateTodoInput{
		Text:      string(longText),
		Completed: false,
	}
	body, _ := json.Marshal(input)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/api/todos", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w, req)

	// Should succeed (we don't have length validation in the model)
	// But we can verify it was stored correctly
	assert.Equal(t, http.StatusCreated, w.Code)

	var createdTodo models.Todo
	json.Unmarshal(w.Body.Bytes(), &createdTodo)
	assert.Equal(t, len(longText), len(createdTodo.Text))
}

func TestIntegrationMultipleOperations(t *testing.T) {
	router := setupTestRouter()
	defer cleanupTestData()

	// Create multiple todos
	for i := 1; i <= 5; i++ {
		input := models.CreateTodoInput{
			Text:      "Todo " + string(rune('0'+i)),
			Completed: i%2 == 0,
		}
		body, _ := json.Marshal(input)

		w := httptest.NewRecorder()
		req, _ := http.NewRequest("POST", "/api/todos", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(w, req)
		assert.Equal(t, http.StatusCreated, w.Code)
	}

	// Get all todos
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/todos", nil)
	router.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)

	var allTodos []models.Todo
	json.Unmarshal(w.Body.Bytes(), &allTodos)
	assert.Len(t, allTodos, 5)

	// Update first todo
	newText := "Updated first todo"
	updateInput := models.UpdateTodoInput{
		Text: &newText,
	}
	updateBody, _ := json.Marshal(updateInput)

	w = httptest.NewRecorder()
	req, _ = http.NewRequest("PUT", "/api/todos/1", bytes.NewBuffer(updateBody))
	req.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)

	// Delete second todo
	w = httptest.NewRecorder()
	req, _ = http.NewRequest("DELETE", "/api/todos/2", nil)
	router.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)

	// Get all todos again
	w = httptest.NewRecorder()
	req, _ = http.NewRequest("GET", "/api/todos", nil)
	router.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)

	json.Unmarshal(w.Body.Bytes(), &allTodos)
	assert.Len(t, allTodos, 4)
}
