package main

import (
	"html"
	"log"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	limiter "github.com/ulule/limiter/v3"
	mgin "github.com/ulule/limiter/v3/drivers/middleware/gin"
	"github.com/ulule/limiter/v3/drivers/store/memory"
	"github.com/user/todolist-gin/database"
	"github.com/user/todolist-gin/handlers"
	"github.com/user/todolist-gin/logger"
	"go.uber.org/zap"
)

// securityHeadersMiddleware adds security headers to all responses
func securityHeadersMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("X-Content-Type-Options", "nosniff")
		c.Header("X-Frame-Options", "DENY")
		c.Header("X-XSS-Protection", "1; mode=block")
		c.Header("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
		c.Next()
	}
}

// getEnv gets an environment variable with a fallback default value
func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}

func main() {
	// Load .env file if it exists (ignore error in production)
	_ = godotenv.Load()

	// Initialize logger
	if err := logger.InitLogger(); err != nil {
		log.Fatal("Failed to initialize logger:", err)
	}
	defer logger.Sync()

	logger.Info("Starting Todo List API",
		zap.String("version", "1.0.0"),
		zap.String("environment", getEnv("ENV", "development")),
	)

	// Set Gin mode based on environment
	if getEnv("ENV", "development") == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	// Initialize database
	database.InitDatabase()

	// Create Gin router (without default middleware)
	r := gin.New()

	// Add custom middleware in order
	r.Use(logger.RecoveryMiddleware())
	r.Use(logger.LoggingMiddleware())
	r.Use(securityHeadersMiddleware())

	// Configure CORS with environment-based allowed origins
	allowedOrigins := strings.Split(getEnv("ALLOWED_ORIGINS", "http://localhost:3000"), ",")
	// Trim spaces from each origin
	for i, origin := range allowedOrigins {
		allowedOrigins[i] = strings.TrimSpace(origin)
	}

	config := cors.Config{
		AllowOrigins:     allowedOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}
	r.Use(cors.New(config))

	// Rate limiting middleware
	rateLimitMax, _ := strconv.ParseInt(getEnv("RATE_LIMIT_MAX", "100"), 10, 64)
	rateLimitWindow, _ := strconv.ParseInt(getEnv("RATE_LIMIT_WINDOW_MINUTES", "1"), 10, 64)

	rate := limiter.Rate{
		Period: time.Duration(rateLimitWindow) * time.Minute,
		Limit:  rateLimitMax,
	}
	store := memory.NewStore()
	rateLimiter := mgin.NewMiddleware(limiter.New(store, rate))
	r.Use(rateLimiter)

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
		// Check database connection
		db := database.GetDB()
		sqlDB, err := db.DB()
		dbStatus := "ok"
		if err != nil || sqlDB.Ping() != nil {
			dbStatus = "unavailable"
		}

		statusCode := 200
		if dbStatus != "ok" {
			statusCode = 503
		}

		logger.Debug("Health check",
			zap.String("database", dbStatus),
			zap.String("version", "1.0.0"),
		)

		c.JSON(statusCode, gin.H{
			"status":   "ok",
			"database": dbStatus,
			"version":  "1.0.0",
			"time":     time.Now().UTC().Format(time.RFC3339),
		})
	})

	// Start server
	port := getEnv("PORT", "8080")
	host := getEnv("HOST", "0.0.0.0")
	serverAddr := host + ":" + port

	logger.Info("Server configuration",
		zap.String("address", serverAddr),
		zap.String("environment", getEnv("ENV", "development")),
		zap.Strings("cors_allowed_origins", allowedOrigins),
		zap.Int64("rate_limit_max", rateLimitMax),
		zap.Int64("rate_limit_window_minutes", rateLimitWindow),
	)

	logger.Info("Server starting", zap.String("address", serverAddr))

	if err := r.Run(serverAddr); err != nil {
		logger.Fatal("Failed to start server", zap.Error(err))
	}
}

// SanitizeHTML removes HTML tags and escapes special characters
func SanitizeHTML(input string) string {
	return html.EscapeString(input)
}
