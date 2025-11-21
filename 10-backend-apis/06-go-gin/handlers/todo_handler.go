package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/user/todolist-gin/database"
	"github.com/user/todolist-gin/models"
)

// GetTodos retrieves all todos
func GetTodos(c *gin.Context) {
	var todos []models.Todo
	result := database.GetDB().Order("created_at desc").Find(&todos)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to retrieve todos",
		})
		return
	}

	c.JSON(http.StatusOK, todos)
}

// GetTodo retrieves a single todo by ID
func GetTodo(c *gin.Context) {
	id := c.Param("id")
	var todo models.Todo

	result := database.GetDB().First(&todo, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Todo not found",
		})
		return
	}

	c.JSON(http.StatusOK, todo)
}

// CreateTodo creates a new todo
func CreateTodo(c *gin.Context) {
	var input models.CreateTodoInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	todo := models.Todo{
		Text:      input.Text,
		Completed: input.Completed,
	}

	result := database.GetDB().Create(&todo)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to create todo",
		})
		return
	}

	c.JSON(http.StatusCreated, todo)
}

// UpdateTodo updates an existing todo
func UpdateTodo(c *gin.Context) {
	id := c.Param("id")
	var todo models.Todo

	// Check if todo exists
	result := database.GetDB().First(&todo, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Todo not found",
		})
		return
	}

	var input models.UpdateTodoInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	// Update fields if provided
	updates := make(map[string]interface{})
	if input.Text != nil {
		updates["text"] = *input.Text
	}
	if input.Completed != nil {
		updates["completed"] = *input.Completed
	}

	result = database.GetDB().Model(&todo).Updates(updates)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to update todo",
		})
		return
	}

	// Reload todo to get updated values
	database.GetDB().First(&todo, id)
	c.JSON(http.StatusOK, todo)
}

// DeleteTodo deletes a todo
func DeleteTodo(c *gin.Context) {
	id := c.Param("id")
	idInt, err := strconv.Atoi(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid ID format",
		})
		return
	}

	result := database.GetDB().Delete(&models.Todo{}, idInt)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to delete todo",
		})
		return
	}

	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Todo not found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Todo deleted successfully",
	})
}
