package main

import (
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/user/todolist-gin/database"
	"github.com/user/todolist-gin/handlers"
)

func main() {
	// Initialize database
	database.InitDatabase()

	// Create Gin router
	r := gin.Default()

	// Configure CORS
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept"}
	r.Use(cors.New(config))

	// API routes
	api := r.Group("/api")
	{
		api.GET("/todos", handlers.GetTodos)
		api.GET("/todos/:id", handlers.GetTodo)
		api.POST("/todos", handlers.CreateTodo)
		api.PUT("/todos/:id", handlers.UpdateTodo)
		api.DELETE("/todos/:id", handlers.DeleteTodo)
	}

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "ok",
		})
	})

	// Start server
	log.Println("Server starting on http://localhost:8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
