package main

import (
	"context"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/user/todolist-echo/database"
	"github.com/user/todolist-echo/handlers"
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

func main() {
	// Initialize database
	database.InitDatabase()

	// Create Echo instance
	e := echo.New()

	// Set custom validator
	e.Validator = &CustomValidator{validator: validator.New()}

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	// Health check endpoint
	e.GET("/health", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{
			"status": "ok",
		})
	})

	// API routes
	api := e.Group("/api")
	api.GET("/todos", handlers.GetTodos)
	api.GET("/todos/:id", handlers.GetTodo)
	api.POST("/todos", handlers.CreateTodo)
	api.PUT("/todos/:id", handlers.UpdateTodo)
	api.DELETE("/todos/:id", handlers.DeleteTodo)

	// Start server with graceful shutdown
	go func() {
		e.Logger.Info("Server starting on http://localhost:8080")
		if err := e.Start(":8080"); err != nil && err != http.ErrServerClosed {
			e.Logger.Fatal("Failed to start server:", err)
		}
	}()

	// Wait for interrupt signal to gracefully shutdown the server
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt)
	<-quit

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	e.Logger.Info("Shutting down server...")
	if err := e.Shutdown(ctx); err != nil {
		e.Logger.Fatal(err)
	}
}
