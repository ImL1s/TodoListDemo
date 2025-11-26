package handlers

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
	"github.com/user/todolist-echo/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// CustomValidator is a custom validator for Echo
type CustomValidator struct {
	validator *validator.Validate
}

// Validate validates a struct
func (cv *CustomValidator) Validate(i interface{}) error {
	if err := cv.validator.Struct(i); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	return nil
}

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

// setupTestEcho creates a new Echo instance for testing
func setupTestEcho() *echo.Echo {
	e := echo.New()
	e.Validator = &CustomValidator{validator: validator.New()}
	return e
}

func TestGetTodos(t *testing.T) {
	setupTestDB()
	defer cleanupTestDB()

	e := setupTestEcho()

	// Create test todos
	todos := []models.Todo{
		{Text: "Test todo 1", Completed: false},
		{Text: "Test todo 2", Completed: true},
	}
	for _, todo := range todos {
		database.DB.Create(&todo)
	}

	// Create request
	req := httptest.NewRequest(http.MethodGet, "/api/todos", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	// Call handler
	err := GetTodos(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)

	var response []models.Todo
	json.Unmarshal(rec.Body.Bytes(), &response)
	assert.Len(t, response, 2)
}

func TestGetTodosEmpty(t *testing.T) {
	setupTestDB()
	defer cleanupTestDB()

	e := setupTestEcho()

	req := httptest.NewRequest(http.MethodGet, "/api/todos", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	err := GetTodos(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)

	var response []models.Todo
	json.Unmarshal(rec.Body.Bytes(), &response)
	assert.Len(t, response, 0)
}

func TestGetTodo(t *testing.T) {
	setupTestDB()
	defer cleanupTestDB()

	e := setupTestEcho()

	// Create test todo
	todo := models.Todo{Text: "Test todo", Completed: false}
	database.DB.Create(&todo)

	// Create request
	req := httptest.NewRequest(http.MethodGet, "/api/todos/1", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues("1")

	// Call handler
	err := GetTodo(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)

	var response models.Todo
	json.Unmarshal(rec.Body.Bytes(), &response)
	assert.Equal(t, "Test todo", response.Text)
	assert.False(t, response.Completed)
}

func TestGetTodoNotFound(t *testing.T) {
	setupTestDB()
	defer cleanupTestDB()

	e := setupTestEcho()

	req := httptest.NewRequest(http.MethodGet, "/api/todos/999", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues("999")

	err := GetTodo(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusNotFound, rec.Code)
}

func TestCreateTodo(t *testing.T) {
	setupTestDB()
	defer cleanupTestDB()

	e := setupTestEcho()

	jsonBody := `{"text":"New todo","completed":false}`
	req := httptest.NewRequest(http.MethodPost, "/api/todos", strings.NewReader(jsonBody))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	err := CreateTodo(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusCreated, rec.Code)

	var response models.Todo
	json.Unmarshal(rec.Body.Bytes(), &response)
	assert.Equal(t, "New todo", response.Text)
	assert.False(t, response.Completed)
	assert.NotZero(t, response.ID)
}

func TestCreateTodoValidationError(t *testing.T) {
	setupTestDB()
	defer cleanupTestDB()

	e := setupTestEcho()

	// Empty text should fail validation
	jsonBody := `{"text":"","completed":false}`
	req := httptest.NewRequest(http.MethodPost, "/api/todos", strings.NewReader(jsonBody))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	err := CreateTodo(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusBadRequest, rec.Code)
}

func TestCreateTodoInvalidJSON(t *testing.T) {
	setupTestDB()
	defer cleanupTestDB()

	e := setupTestEcho()

	req := httptest.NewRequest(http.MethodPost, "/api/todos", strings.NewReader("invalid json"))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	err := CreateTodo(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusBadRequest, rec.Code)
}

func TestUpdateTodo(t *testing.T) {
	setupTestDB()
	defer cleanupTestDB()

	e := setupTestEcho()

	// Create test todo
	todo := models.Todo{Text: "Original text", Completed: false}
	database.DB.Create(&todo)

	// Update todo
	jsonBody := `{"text":"Updated text","completed":true}`
	req := httptest.NewRequest(http.MethodPut, "/api/todos/1", strings.NewReader(jsonBody))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues("1")

	err := UpdateTodo(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)

	var response models.Todo
	json.Unmarshal(rec.Body.Bytes(), &response)
	assert.Equal(t, "Updated text", response.Text)
	assert.True(t, response.Completed)
}

func TestUpdateTodoPartial(t *testing.T) {
	setupTestDB()
	defer cleanupTestDB()

	e := setupTestEcho()

	// Create test todo
	todo := models.Todo{Text: "Original text", Completed: false}
	database.DB.Create(&todo)

	// Update only completed field
	jsonBody := `{"completed":true}`
	req := httptest.NewRequest(http.MethodPut, "/api/todos/1", strings.NewReader(jsonBody))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues("1")

	err := UpdateTodo(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)

	var response models.Todo
	json.Unmarshal(rec.Body.Bytes(), &response)
	assert.Equal(t, "Original text", response.Text) // Should remain unchanged
	assert.True(t, response.Completed)               // Should be updated
}

func TestUpdateTodoNotFound(t *testing.T) {
	setupTestDB()
	defer cleanupTestDB()

	e := setupTestEcho()

	jsonBody := `{"text":"Updated text"}`
	req := httptest.NewRequest(http.MethodPut, "/api/todos/999", strings.NewReader(jsonBody))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues("999")

	err := UpdateTodo(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusNotFound, rec.Code)
}

func TestDeleteTodo(t *testing.T) {
	setupTestDB()
	defer cleanupTestDB()

	e := setupTestEcho()

	// Create test todo
	todo := models.Todo{Text: "Test todo", Completed: false}
	database.DB.Create(&todo)

	req := httptest.NewRequest(http.MethodDelete, "/api/todos/1", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues("1")

	err := DeleteTodo(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)

	// Verify todo is deleted
	var count int64
	database.DB.Model(&models.Todo{}).Count(&count)
	assert.Equal(t, int64(0), count)
}

func TestDeleteTodoNotFound(t *testing.T) {
	setupTestDB()
	defer cleanupTestDB()

	e := setupTestEcho()

	req := httptest.NewRequest(http.MethodDelete, "/api/todos/999", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues("999")

	err := DeleteTodo(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusNotFound, rec.Code)
}

func TestDeleteTodoInvalidID(t *testing.T) {
	setupTestDB()
	defer cleanupTestDB()

	e := setupTestEcho()

	req := httptest.NewRequest(http.MethodDelete, "/api/todos/invalid", nil)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)
	c.SetParamNames("id")
	c.SetParamValues("invalid")

	err := DeleteTodo(c)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusBadRequest, rec.Code)
}
