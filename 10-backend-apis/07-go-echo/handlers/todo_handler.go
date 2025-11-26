package handlers

import (
	"html"
	"net/http"
	"strconv"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/user/todolist-echo/database"
	"github.com/user/todolist-echo/logger"
	"github.com/user/todolist-echo/models"
	"go.uber.org/zap"
)

// GetTodos retrieves all todos
func GetTodos(c echo.Context) error {
	start := time.Now()
	var todos []models.Todo
	result := database.GetDB().Order("created_at desc").Find(&todos)

	if result.Error != nil {
		logger.Error("Failed to retrieve todos",
			zap.Error(result.Error),
			zap.String("path", c.Request().URL.Path),
		)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to retrieve todos",
		})
	}

	duration := time.Since(start)
	logger.Info("Todos retrieved",
		zap.Int("count", len(todos)),
		zap.Duration("duration", duration),
	)

	if duration > 100*time.Millisecond {
		logger.Warn("Slow operation detected",
			zap.String("operation", "get_todos"),
			zap.Duration("duration", duration),
		)
	}

	return c.JSON(http.StatusOK, todos)
}

// GetTodo retrieves a single todo by ID
func GetTodo(c echo.Context) error {
	start := time.Now()
	id := c.Param("id")

	// Validate ID format
	idInt, err := strconv.Atoi(id)
	if err != nil || idInt <= 0 {
		logger.Warn("Invalid todo ID format",
			zap.String("id", id),
			zap.Error(err),
		)
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Invalid ID format",
		})
	}

	var todo models.Todo
	result := database.GetDB().First(&todo, idInt)
	if result.Error != nil {
		logger.Warn("Todo not found",
			zap.Int("id", idInt),
		)
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "Todo not found",
		})
	}

	duration := time.Since(start)
	logger.Info("Todo retrieved",
		zap.Int("id", idInt),
		zap.Duration("duration", duration),
	)

	return c.JSON(http.StatusOK, todo)
}

// CreateTodo creates a new todo
func CreateTodo(c echo.Context) error {
	start := time.Now()
	input := new(models.CreateTodoInput)

	if err := c.Bind(input); err != nil {
		logger.Warn("Invalid request body for create todo",
			zap.Error(err),
		)
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Invalid request body",
		})
	}

	if err := c.Validate(input); err != nil {
		logger.Warn("Invalid input for create todo",
			zap.Error(err),
		)
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Invalid input: text must be 1-500 characters",
		})
	}

	// Sanitize input to prevent XSS
	sanitizedText := html.EscapeString(input.Text)

	todo := models.Todo{
		Text:      sanitizedText,
		Completed: input.Completed,
	}

	result := database.GetDB().Create(&todo)
	if result.Error != nil {
		logger.Error("Failed to create todo",
			zap.Error(result.Error),
			zap.String("text", sanitizedText),
		)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to create todo",
		})
	}

	duration := time.Since(start)
	logger.Info("Todo created",
		zap.Uint("id", todo.ID),
		zap.String("text", todo.Text),
		zap.Duration("duration", duration),
	)

	if duration > 100*time.Millisecond {
		logger.Warn("Slow operation detected",
			zap.String("operation", "create_todo"),
			zap.Duration("duration", duration),
		)
	}

	return c.JSON(http.StatusCreated, todo)
}

// UpdateTodo updates an existing todo
func UpdateTodo(c echo.Context) error {
	start := time.Now()
	id := c.Param("id")

	// Validate ID format
	idInt, err := strconv.Atoi(id)
	if err != nil || idInt <= 0 {
		logger.Warn("Invalid todo ID format for update",
			zap.String("id", id),
			zap.Error(err),
		)
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Invalid ID format",
		})
	}

	var todo models.Todo

	// Check if todo exists
	result := database.GetDB().First(&todo, idInt)
	if result.Error != nil {
		logger.Warn("Todo not found for update",
			zap.Int("id", idInt),
		)
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "Todo not found",
		})
	}

	input := new(models.UpdateTodoInput)
	if err := c.Bind(input); err != nil {
		logger.Warn("Invalid request body for update todo",
			zap.Int("id", idInt),
			zap.Error(err),
		)
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Invalid request body",
		})
	}

	if err := c.Validate(input); err != nil {
		logger.Warn("Invalid input for update todo",
			zap.Int("id", idInt),
			zap.Error(err),
		)
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Invalid input: text must be 1-500 characters",
		})
	}

	// Update fields if provided
	updates := make(map[string]interface{})
	if input.Text != nil {
		// Sanitize input to prevent XSS
		sanitizedText := html.EscapeString(*input.Text)
		updates["text"] = sanitizedText
	}
	if input.Completed != nil {
		updates["completed"] = *input.Completed
	}

	result = database.GetDB().Model(&todo).Updates(updates)
	if result.Error != nil {
		logger.Error("Failed to update todo",
			zap.Int("id", idInt),
			zap.Error(result.Error),
		)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to update todo",
		})
	}

	// Reload todo to get updated values
	database.GetDB().First(&todo, idInt)

	duration := time.Since(start)
	logger.Info("Todo updated",
		zap.Int("id", idInt),
		zap.Any("updates", updates),
		zap.Duration("duration", duration),
	)

	return c.JSON(http.StatusOK, todo)
}

// DeleteTodo deletes a todo
func DeleteTodo(c echo.Context) error {
	start := time.Now()
	id := c.Param("id")

	// Validate ID format
	idInt, err := strconv.Atoi(id)
	if err != nil || idInt <= 0 {
		logger.Warn("Invalid todo ID format for delete",
			zap.String("id", id),
			zap.Error(err),
		)
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Invalid ID format",
		})
	}

	result := database.GetDB().Delete(&models.Todo{}, idInt)
	if result.Error != nil {
		logger.Error("Failed to delete todo",
			zap.Int("id", idInt),
			zap.Error(result.Error),
		)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to delete todo",
		})
	}

	if result.RowsAffected == 0 {
		logger.Warn("Todo not found for delete",
			zap.Int("id", idInt),
		)
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "Todo not found",
		})
	}

	duration := time.Since(start)
	logger.Info("Todo deleted",
		zap.Int("id", idInt),
		zap.Duration("duration", duration),
	)

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Todo deleted successfully",
	})
}
