package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
	"github.com/user/todolist-echo/database"
	"github.com/user/todolist-echo/handlers"
	"github.com/user/todolist-echo/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupTestApp() *echo.Echo {
	// Initialize test database
	var err error
	database.DB, err = gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to test database")
	}
	database.DB.AutoMigrate(&models.Todo{})

	// Create Echo instance
	e := echo.New()
	e.Validator = &CustomValidator{validator: validator.New()}

	// API routes
	api := e.Group("/api")
	api.GET("/todos", handlers.GetTodos)
	api.GET("/todos/:id", handlers.GetTodo)
	api.POST("/todos", handlers.CreateTodo)
	api.PUT("/todos/:id", handlers.UpdateTodo)
	api.DELETE("/todos/:id", handlers.DeleteTodo)

	return e
}

func cleanupTestData() {
	database.DB.Exec("DELETE FROM todos")
}

// Integration tests
func TestIntegrationCreateAndGetTodo(t *testing.T) {
	e := setupTestApp()
	defer cleanupTestData()

	// Create a new todo
	jsonBody := `{"text":"Integration test todo","completed":false}`
	req := httptest.NewRequest(http.MethodPost, "/api/todos", strings.NewReader(jsonBody))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	e.ServeHTTP(rec, req)

	assert.Equal(t, http.StatusCreated, rec.Code)

	var createdTodo models.Todo
	json.Unmarshal(rec.Body.Bytes(), &createdTodo)
	assert.Equal(t, "Integration test todo", createdTodo.Text)
	assert.False(t, createdTodo.Completed)

	// Get the created todo
	req = httptest.NewRequest(http.MethodGet, "/api/todos/1", nil)
	rec = httptest.NewRecorder()
	e.ServeHTTP(rec, req)

	assert.Equal(t, http.StatusOK, rec.Code)

	var fetchedTodo models.Todo
	json.Unmarshal(rec.Body.Bytes(), &fetchedTodo)
	assert.Equal(t, createdTodo.ID, fetchedTodo.ID)
	assert.Equal(t, "Integration test todo", fetchedTodo.Text)
}

func TestIntegrationCreateUpdateAndGetTodo(t *testing.T) {
	e := setupTestApp()
	defer cleanupTestData()

	// Create a new todo
	jsonBody := `{"text":"Original text","completed":false}`
	req := httptest.NewRequest(http.MethodPost, "/api/todos", strings.NewReader(jsonBody))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	e.ServeHTTP(rec, req)

	assert.Equal(t, http.StatusCreated, rec.Code)

	// Update the todo
	updateBody := `{"text":"Updated text","completed":true}`
	req = httptest.NewRequest(http.MethodPut, "/api/todos/1", strings.NewReader(updateBody))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec = httptest.NewRecorder()
	e.ServeHTTP(rec, req)

	assert.Equal(t, http.StatusOK, rec.Code)

	// Get the updated todo
	req = httptest.NewRequest(http.MethodGet, "/api/todos/1", nil)
	rec = httptest.NewRecorder()
	e.ServeHTTP(rec, req)

	assert.Equal(t, http.StatusOK, rec.Code)

	var fetchedTodo models.Todo
	json.Unmarshal(rec.Body.Bytes(), &fetchedTodo)
	assert.Equal(t, "Updated text", fetchedTodo.Text)
	assert.True(t, fetchedTodo.Completed)
}

func TestIntegrationCreateAndDeleteTodo(t *testing.T) {
	e := setupTestApp()
	defer cleanupTestData()

	// Create a new todo
	jsonBody := `{"text":"Todo to be deleted","completed":false}`
	req := httptest.NewRequest(http.MethodPost, "/api/todos", strings.NewReader(jsonBody))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	e.ServeHTTP(rec, req)

	assert.Equal(t, http.StatusCreated, rec.Code)

	// Delete the todo
	req = httptest.NewRequest(http.MethodDelete, "/api/todos/1", nil)
	rec = httptest.NewRecorder()
	e.ServeHTTP(rec, req)

	assert.Equal(t, http.StatusOK, rec.Code)

	// Try to get the deleted todo
	req = httptest.NewRequest(http.MethodGet, "/api/todos/1", nil)
	rec = httptest.NewRecorder()
	e.ServeHTTP(rec, req)

	assert.Equal(t, http.StatusNotFound, rec.Code)
}

func TestIntegrationGetAllTodos(t *testing.T) {
	e := setupTestApp()
	defer cleanupTestData()

	// Create multiple todos
	todoTexts := []string{"First todo", "Second todo", "Third todo"}
	for i, text := range todoTexts {
		completed := i%2 == 1
		jsonBody := `{"text":"` + text + `","completed":` + (map[bool]string{true: "true", false: "false"}[completed]) + `}`
		req := httptest.NewRequest(http.MethodPost, "/api/todos", strings.NewReader(jsonBody))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e.ServeHTTP(rec, req)
		assert.Equal(t, http.StatusCreated, rec.Code)
	}

	// Get all todos
	req := httptest.NewRequest(http.MethodGet, "/api/todos", nil)
	rec := httptest.NewRecorder()
	e.ServeHTTP(rec, req)

	assert.Equal(t, http.StatusOK, rec.Code)

	var allTodos []models.Todo
	json.Unmarshal(rec.Body.Bytes(), &allTodos)
	assert.Len(t, allTodos, 3)
}

func TestIntegrationErrorHandling404(t *testing.T) {
	e := setupTestApp()
	defer cleanupTestData()

	// Try to get non-existent todo
	req := httptest.NewRequest(http.MethodGet, "/api/todos/999", nil)
	rec := httptest.NewRecorder()
	e.ServeHTTP(rec, req)

	assert.Equal(t, http.StatusNotFound, rec.Code)
}

func TestIntegrationErrorHandling400(t *testing.T) {
	e := setupTestApp()
	defer cleanupTestData()

	// Try to create todo with invalid JSON
	req := httptest.NewRequest(http.MethodPost, "/api/todos", strings.NewReader("invalid json"))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	e.ServeHTTP(rec, req)

	assert.Equal(t, http.StatusBadRequest, rec.Code)
}

func TestIntegrationErrorHandlingEmptyText(t *testing.T) {
	e := setupTestApp()
	defer cleanupTestData()

	// Try to create todo with empty text
	jsonBody := `{"text":"","completed":false}`
	req := httptest.NewRequest(http.MethodPost, "/api/todos", strings.NewReader(jsonBody))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	e.ServeHTTP(rec, req)

	assert.Equal(t, http.StatusBadRequest, rec.Code)
}

func TestIntegrationLongText(t *testing.T) {
	e := setupTestApp()
	defer cleanupTestData()

	// Create todo with long text (>500 characters)
	longText := strings.Repeat("a", 600)
	jsonBody := `{"text":"` + longText + `","completed":false}`
	req := httptest.NewRequest(http.MethodPost, "/api/todos", strings.NewReader(jsonBody))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	e.ServeHTTP(rec, req)

	// Should succeed (we don't have length validation in the model)
	assert.Equal(t, http.StatusCreated, rec.Code)

	var createdTodo models.Todo
	json.Unmarshal(rec.Body.Bytes(), &createdTodo)
	assert.Equal(t, len(longText), len(createdTodo.Text))
}

func TestIntegrationMultipleOperations(t *testing.T) {
	e := setupTestApp()
	defer cleanupTestData()

	// Create multiple todos
	for i := 1; i <= 5; i++ {
		completed := i%2 == 0
		jsonBody := `{"text":"Todo ` + string(rune('0'+i)) + `","completed":` + (map[bool]string{true: "true", false: "false"}[completed]) + `}`
		req := httptest.NewRequest(http.MethodPost, "/api/todos", strings.NewReader(jsonBody))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		e.ServeHTTP(rec, req)
		assert.Equal(t, http.StatusCreated, rec.Code)
	}

	// Get all todos
	req := httptest.NewRequest(http.MethodGet, "/api/todos", nil)
	rec := httptest.NewRecorder()
	e.ServeHTTP(rec, req)
	assert.Equal(t, http.StatusOK, rec.Code)

	var allTodos []models.Todo
	json.Unmarshal(rec.Body.Bytes(), &allTodos)
	assert.Len(t, allTodos, 5)

	// Update first todo
	updateBody := `{"text":"Updated first todo"}`
	req = httptest.NewRequest(http.MethodPut, "/api/todos/1", strings.NewReader(updateBody))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec = httptest.NewRecorder()
	e.ServeHTTP(rec, req)
	assert.Equal(t, http.StatusOK, rec.Code)

	// Delete second todo
	req = httptest.NewRequest(http.MethodDelete, "/api/todos/2", nil)
	rec = httptest.NewRecorder()
	e.ServeHTTP(rec, req)
	assert.Equal(t, http.StatusOK, rec.Code)

	// Get all todos again
	req = httptest.NewRequest(http.MethodGet, "/api/todos", nil)
	rec = httptest.NewRecorder()
	e.ServeHTTP(rec, req)
	assert.Equal(t, http.StatusOK, rec.Code)

	json.Unmarshal(rec.Body.Bytes(), &allTodos)
	assert.Len(t, allTodos, 4)
}
