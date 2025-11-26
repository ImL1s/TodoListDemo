package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/user/todolist-gin/database"
	"github.com/user/todolist-gin/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// setupTestDB initializes a test database
func setupTestDB() {
	var err error
	database.DB, err = gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to test database")
	}
	database.DB.AutoMigrate(&models.Todo{})
}

// cleanupTestDB clears all data from the test database
func cleanupTestDB() {
	database.DB.Exec("DELETE FROM todos")
}

func TestGetTodos(t *testing.T) {
	gin.SetMode(gin.TestMode)
	setupTestDB()
	defer cleanupTestDB()

	// Create test todos
	todos := []models.Todo{
		{Text: "Test todo 1", Completed: false},
		{Text: "Test todo 2", Completed: true},
	}
	for _, todo := range todos {
		database.DB.Create(&todo)
	}

	// Create request
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = httptest.NewRequest("GET", "/api/todos", nil)

	// Call handler
	GetTodos(c)

	// Assert response
	assert.Equal(t, http.StatusOK, w.Code)

	var response []models.Todo
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Len(t, response, 2)
}

func TestGetTodosEmpty(t *testing.T) {
	gin.SetMode(gin.TestMode)
	setupTestDB()
	defer cleanupTestDB()

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = httptest.NewRequest("GET", "/api/todos", nil)

	GetTodos(c)

	assert.Equal(t, http.StatusOK, w.Code)

	var response []models.Todo
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Len(t, response, 0)
}

func TestGetTodo(t *testing.T) {
	gin.SetMode(gin.TestMode)
	setupTestDB()
	defer cleanupTestDB()

	// Create test todo
	todo := models.Todo{Text: "Test todo", Completed: false}
	database.DB.Create(&todo)

	// Create request
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Params = gin.Params{{Key: "id", Value: "1"}}
	c.Request = httptest.NewRequest("GET", "/api/todos/1", nil)

	// Call handler
	GetTodo(c)

	// Assert response
	assert.Equal(t, http.StatusOK, w.Code)

	var response models.Todo
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, "Test todo", response.Text)
	assert.False(t, response.Completed)
}

func TestGetTodoNotFound(t *testing.T) {
	gin.SetMode(gin.TestMode)
	setupTestDB()
	defer cleanupTestDB()

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Params = gin.Params{{Key: "id", Value: "999"}}
	c.Request = httptest.NewRequest("GET", "/api/todos/999", nil)

	GetTodo(c)

	assert.Equal(t, http.StatusNotFound, w.Code)
}

func TestCreateTodo(t *testing.T) {
	gin.SetMode(gin.TestMode)
	setupTestDB()
	defer cleanupTestDB()

	input := models.CreateTodoInput{
		Text:      "New todo",
		Completed: false,
	}
	body, _ := json.Marshal(input)

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = httptest.NewRequest("POST", "/api/todos", bytes.NewBuffer(body))
	c.Request.Header.Set("Content-Type", "application/json")

	CreateTodo(c)

	assert.Equal(t, http.StatusCreated, w.Code)

	var response models.Todo
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, "New todo", response.Text)
	assert.False(t, response.Completed)
	assert.NotZero(t, response.ID)
}

func TestCreateTodoValidationError(t *testing.T) {
	gin.SetMode(gin.TestMode)
	setupTestDB()
	defer cleanupTestDB()

	// Empty text should fail validation
	input := models.CreateTodoInput{
		Text:      "",
		Completed: false,
	}
	body, _ := json.Marshal(input)

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = httptest.NewRequest("POST", "/api/todos", bytes.NewBuffer(body))
	c.Request.Header.Set("Content-Type", "application/json")

	CreateTodo(c)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestCreateTodoInvalidJSON(t *testing.T) {
	gin.SetMode(gin.TestMode)
	setupTestDB()
	defer cleanupTestDB()

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = httptest.NewRequest("POST", "/api/todos", bytes.NewBufferString("invalid json"))
	c.Request.Header.Set("Content-Type", "application/json")

	CreateTodo(c)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestUpdateTodo(t *testing.T) {
	gin.SetMode(gin.TestMode)
	setupTestDB()
	defer cleanupTestDB()

	// Create test todo
	todo := models.Todo{Text: "Original text", Completed: false}
	database.DB.Create(&todo)

	// Update todo
	newText := "Updated text"
	completed := true
	input := models.UpdateTodoInput{
		Text:      &newText,
		Completed: &completed,
	}
	body, _ := json.Marshal(input)

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Params = gin.Params{{Key: "id", Value: "1"}}
	c.Request = httptest.NewRequest("PUT", "/api/todos/1", bytes.NewBuffer(body))
	c.Request.Header.Set("Content-Type", "application/json")

	UpdateTodo(c)

	assert.Equal(t, http.StatusOK, w.Code)

	var response models.Todo
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, "Updated text", response.Text)
	assert.True(t, response.Completed)
}

func TestUpdateTodoPartial(t *testing.T) {
	gin.SetMode(gin.TestMode)
	setupTestDB()
	defer cleanupTestDB()

	// Create test todo
	todo := models.Todo{Text: "Original text", Completed: false}
	database.DB.Create(&todo)

	// Update only completed field
	completed := true
	input := models.UpdateTodoInput{
		Completed: &completed,
	}
	body, _ := json.Marshal(input)

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Params = gin.Params{{Key: "id", Value: "1"}}
	c.Request = httptest.NewRequest("PUT", "/api/todos/1", bytes.NewBuffer(body))
	c.Request.Header.Set("Content-Type", "application/json")

	UpdateTodo(c)

	assert.Equal(t, http.StatusOK, w.Code)

	var response models.Todo
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, "Original text", response.Text) // Should remain unchanged
	assert.True(t, response.Completed)               // Should be updated
}

func TestUpdateTodoNotFound(t *testing.T) {
	gin.SetMode(gin.TestMode)
	setupTestDB()
	defer cleanupTestDB()

	newText := "Updated text"
	input := models.UpdateTodoInput{
		Text: &newText,
	}
	body, _ := json.Marshal(input)

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Params = gin.Params{{Key: "id", Value: "999"}}
	c.Request = httptest.NewRequest("PUT", "/api/todos/999", bytes.NewBuffer(body))
	c.Request.Header.Set("Content-Type", "application/json")

	UpdateTodo(c)

	assert.Equal(t, http.StatusNotFound, w.Code)
}

func TestDeleteTodo(t *testing.T) {
	gin.SetMode(gin.TestMode)
	setupTestDB()
	defer cleanupTestDB()

	// Create test todo
	todo := models.Todo{Text: "Test todo", Completed: false}
	database.DB.Create(&todo)

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Params = gin.Params{{Key: "id", Value: "1"}}
	c.Request = httptest.NewRequest("DELETE", "/api/todos/1", nil)

	DeleteTodo(c)

	assert.Equal(t, http.StatusOK, w.Code)

	// Verify todo is deleted
	var count int64
	database.DB.Model(&models.Todo{}).Count(&count)
	assert.Equal(t, int64(0), count)
}

func TestDeleteTodoNotFound(t *testing.T) {
	gin.SetMode(gin.TestMode)
	setupTestDB()
	defer cleanupTestDB()

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Params = gin.Params{{Key: "id", Value: "999"}}
	c.Request = httptest.NewRequest("DELETE", "/api/todos/999", nil)

	DeleteTodo(c)

	assert.Equal(t, http.StatusNotFound, w.Code)
}

func TestDeleteTodoInvalidID(t *testing.T) {
	gin.SetMode(gin.TestMode)
	setupTestDB()
	defer cleanupTestDB()

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Params = gin.Params{{Key: "id", Value: "invalid"}}
	c.Request = httptest.NewRequest("DELETE", "/api/todos/invalid", nil)

	DeleteTodo(c)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}
