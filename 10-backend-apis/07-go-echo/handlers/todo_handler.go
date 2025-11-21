package handlers

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"github.com/user/todolist-echo/database"
	"github.com/user/todolist-echo/models"
)

// GetTodos retrieves all todos
func GetTodos(c echo.Context) error {
	var todos []models.Todo
	result := database.GetDB().Order("created_at desc").Find(&todos)

	if result.Error != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to retrieve todos",
		})
	}

	return c.JSON(http.StatusOK, todos)
}

// GetTodo retrieves a single todo by ID
func GetTodo(c echo.Context) error {
	id := c.Param("id")
	var todo models.Todo

	result := database.GetDB().First(&todo, id)
	if result.Error != nil {
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "Todo not found",
		})
	}

	return c.JSON(http.StatusOK, todo)
}

// CreateTodo creates a new todo
func CreateTodo(c echo.Context) error {
	input := new(models.CreateTodoInput)

	if err := c.Bind(input); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Invalid request body",
		})
	}

	if err := c.Validate(input); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": err.Error(),
		})
	}

	todo := models.Todo{
		Text:      input.Text,
		Completed: input.Completed,
	}

	result := database.GetDB().Create(&todo)
	if result.Error != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to create todo",
		})
	}

	return c.JSON(http.StatusCreated, todo)
}

// UpdateTodo updates an existing todo
func UpdateTodo(c echo.Context) error {
	id := c.Param("id")
	var todo models.Todo

	// Check if todo exists
	result := database.GetDB().First(&todo, id)
	if result.Error != nil {
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "Todo not found",
		})
	}

	input := new(models.UpdateTodoInput)
	if err := c.Bind(input); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Invalid request body",
		})
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
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to update todo",
		})
	}

	// Reload todo to get updated values
	database.GetDB().First(&todo, id)
	return c.JSON(http.StatusOK, todo)
}

// DeleteTodo deletes a todo
func DeleteTodo(c echo.Context) error {
	id := c.Param("id")
	idInt, err := strconv.Atoi(id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Invalid ID format",
		})
	}

	result := database.GetDB().Delete(&models.Todo{}, idInt)
	if result.Error != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Failed to delete todo",
		})
	}

	if result.RowsAffected == 0 {
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "Todo not found",
		})
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Todo deleted successfully",
	})
}
