package handlers

import (
	"html"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/user/todolist-gin/database"
	"github.com/user/todolist-gin/logger"
	"github.com/user/todolist-gin/models"
	"go.uber.org/zap"
)

// GetTodos retrieves all todos
func GetTodos(c *gin.Context) {
	start := time.Now()
	var todos []models.Todo
	result := database.GetDB().Order("created_at desc").Find(&todos)

	if result.Error != nil {
		logger.Error("Failed to retrieve todos",
			zap.Error(result.Error),
			zap.String("path", c.Request.URL.Path),
		)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to retrieve todos",
		})
		return
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

	c.JSON(http.StatusOK, todos)
}

// GetTodo retrieves a single todo by ID
func GetTodo(c *gin.Context) {
	start := time.Now()
	id := c.Param("id")

	// Validate ID format
	idInt, err := strconv.Atoi(id)
	if err != nil || idInt <= 0 {
		logger.Warn("Invalid todo ID format",
			zap.String("id", id),
			zap.Error(err),
		)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid ID format",
		})
		return
	}

	var todo models.Todo
	result := database.GetDB().First(&todo, idInt)
	if result.Error != nil {
		logger.Warn("Todo not found",
			zap.Int("id", idInt),
		)
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Todo not found",
		})
		return
	}

	duration := time.Since(start)
	logger.Info("Todo retrieved",
		zap.Int("id", idInt),
		zap.Duration("duration", duration),
	)

	c.JSON(http.StatusOK, todo)
}

// CreateTodo creates a new todo
func CreateTodo(c *gin.Context) {
	start := time.Now()
	var input models.CreateTodoInput

	if err := c.ShouldBindJSON(&input); err != nil {
		logger.Warn("Invalid input for create todo",
			zap.Error(err),
		)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid input: text must be 1-500 characters",
		})
		return
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
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to create todo",
		})
		return
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

	c.JSON(http.StatusCreated, todo)
}

// UpdateTodo updates an existing todo
func UpdateTodo(c *gin.Context) {
	start := time.Now()
	id := c.Param("id")

	// Validate ID format
	idInt, err := strconv.Atoi(id)
	if err != nil || idInt <= 0 {
		logger.Warn("Invalid todo ID format for update",
			zap.String("id", id),
			zap.Error(err),
		)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid ID format",
		})
		return
	}

	var todo models.Todo

	// Check if todo exists
	result := database.GetDB().First(&todo, idInt)
	if result.Error != nil {
		logger.Warn("Todo not found for update",
			zap.Int("id", idInt),
		)
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Todo not found",
		})
		return
	}

	var input models.UpdateTodoInput
	if err := c.ShouldBindJSON(&input); err != nil {
		logger.Warn("Invalid input for update todo",
			zap.Int("id", idInt),
			zap.Error(err),
		)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid input: text must be 1-500 characters",
		})
		return
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
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to update todo",
		})
		return
	}

	// Reload todo to get updated values
	database.GetDB().First(&todo, idInt)

	duration := time.Since(start)
	logger.Info("Todo updated",
		zap.Int("id", idInt),
		zap.Any("updates", updates),
		zap.Duration("duration", duration),
	)

	c.JSON(http.StatusOK, todo)
}

// DeleteTodo deletes a todo
func DeleteTodo(c *gin.Context) {
	start := time.Now()
	id := c.Param("id")

	// Validate ID format
	idInt, err := strconv.Atoi(id)
	if err != nil || idInt <= 0 {
		logger.Warn("Invalid todo ID format for delete",
			zap.String("id", id),
			zap.Error(err),
		)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid ID format",
		})
		return
	}

	result := database.GetDB().Delete(&models.Todo{}, idInt)
	if result.Error != nil {
		logger.Error("Failed to delete todo",
			zap.Int("id", idInt),
			zap.Error(result.Error),
		)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to delete todo",
		})
		return
	}

	if result.RowsAffected == 0 {
		logger.Warn("Todo not found for delete",
			zap.Int("id", idInt),
		)
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Todo not found",
		})
		return
	}

	duration := time.Since(start)
	logger.Info("Todo deleted",
		zap.Int("id", idInt),
		zap.Duration("duration", duration),
	)

	c.JSON(http.StatusOK, gin.H{
		"message": "Todo deleted successfully",
	})
}
