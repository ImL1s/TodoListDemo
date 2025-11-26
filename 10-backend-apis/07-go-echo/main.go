package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"strings"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	limiter "github.com/ulule/limiter/v3"
	mecho "github.com/ulule/limiter/v3/drivers/middleware/echo"
	"github.com/ulule/limiter/v3/drivers/store/memory"
	"github.com/user/todolist-echo/database"
	"github.com/user/todolist-echo/handlers"
	"github.com/user/todolist-echo/logger"
	"go.uber.org/zap"
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

	// Initialize database
	database.InitDatabase()

	// Create Echo instance
	e := echo.New()
	e.HideBanner = true

	// Set custom validator
	e.Validator = &CustomValidator{validator: validator.New()}

	// Middleware - use custom logging and recovery
	e.Use(logger.RecoveryMiddleware())
	e.Use(logger.LoggingMiddleware())

	// Security headers middleware
	e.Use(func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			c.Response().Header().Set("X-Content-Type-Options", "nosniff")
			c.Response().Header().Set("X-Frame-Options", "DENY")
			c.Response().Header().Set("X-XSS-Protection", "1; mode=block")
			c.Response().Header().Set("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
			return next(c)
		}
	})

	// CORS configuration
	allowedOrigins := strings.Split(getEnv("ALLOWED_ORIGINS", "http://localhost:3000"), ",")
	// Trim spaces from each origin
	for i, origin := range allowedOrigins {
		allowedOrigins[i] = strings.TrimSpace(origin)
	}

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     allowedOrigins,
		AllowMethods:     []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete, http.MethodOptions},
		AllowHeaders:     []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
		AllowCredentials: true,
		MaxAge:           43200, // 12 hours
	}))

	// Rate limiting middleware
	rateLimitMax, _ := strconv.ParseInt(getEnv("RATE_LIMIT_MAX", "100"), 10, 64)
	rateLimitWindow, _ := strconv.ParseInt(getEnv("RATE_LIMIT_WINDOW_MINUTES", "1"), 10, 64)

	rate := limiter.Rate{
		Period: time.Duration(rateLimitWindow) * time.Minute,
		Limit:  rateLimitMax,
	}
	store := memory.NewStore()
	rateLimiter := mecho.NewMiddleware(limiter.New(store, rate))
	e.Use(rateLimiter)

	// Health check endpoint
	e.GET("/health", func(c echo.Context) error {
		// Check database connection
		db := database.GetDB()
		sqlDB, err := db.DB()
		dbStatus := "ok"
		if err != nil || sqlDB.Ping() != nil {
			dbStatus = "unavailable"
		}

		statusCode := http.StatusOK
		if dbStatus != "ok" {
			statusCode = http.StatusServiceUnavailable
		}

		logger.Debug("Health check",
			zap.String("database", dbStatus),
			zap.String("version", "1.0.0"),
		)

		return c.JSON(statusCode, map[string]interface{}{
			"status":   "ok",
			"database": dbStatus,
			"version":  "1.0.0",
			"time":     time.Now().UTC().Format(time.RFC3339),
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

	go func() {
		logger.Info("Server starting", zap.String("address", serverAddr))
		if err := e.Start(serverAddr); err != nil && err != http.ErrServerClosed {
			logger.Fatal("Failed to start server", zap.Error(err))
		}
	}()

	// Wait for interrupt signal to gracefully shutdown the server
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt)
	<-quit

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	logger.Info("Shutting down server...")
	if err := e.Shutdown(ctx); err != nil {
		logger.Fatal("Failed to shutdown server", zap.Error(err))
	}
}
