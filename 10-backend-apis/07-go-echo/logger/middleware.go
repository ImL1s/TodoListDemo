package logger

import (
	"time"

	"github.com/labstack/echo/v4"
	"go.uber.org/zap"
)

// LoggingMiddleware logs all HTTP requests with structured logging
func LoggingMiddleware() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			// Start timer
			start := time.Now()
			req := c.Request()
			res := c.Response()
			path := req.URL.Path
			query := req.URL.RawQuery

			// Process request
			err := next(c)

			// Calculate request duration
			duration := time.Since(start)

			// Build log fields
			fields := []zap.Field{
				zap.String("method", req.Method),
				zap.String("path", path),
				zap.String("query", query),
				zap.Int("status", res.Status),
				zap.Duration("duration", duration),
				zap.String("ip", c.RealIP()),
				zap.String("user_agent", req.UserAgent()),
				zap.Int64("size", res.Size),
			}

			// Add error if any
			if err != nil {
				fields = append(fields, zap.Error(err))
			}

			// Log based on status code
			statusCode := res.Status
			if statusCode >= 500 {
				Error("Server error", fields...)
			} else if statusCode >= 400 {
				Warn("Client error", fields...)
			} else {
				Info("Request completed", fields...)
			}

			// Warn on slow requests (> 100ms)
			if duration > 100*time.Millisecond {
				Warn("Slow request detected",
					zap.String("path", path),
					zap.Duration("duration", duration),
				)
			}

			return err
		}
	}
}

// RecoveryMiddleware recovers from panics and logs them
func RecoveryMiddleware() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			defer func() {
				if r := recover(); r != nil {
					err, ok := r.(error)
					if !ok {
						Error("Panic recovered",
							zap.Any("panic", r),
							zap.String("path", c.Request().URL.Path),
							zap.String("method", c.Request().Method),
						)
					} else {
						Error("Panic recovered",
							zap.Error(err),
							zap.String("path", c.Request().URL.Path),
							zap.String("method", c.Request().Method),
						)
					}
					c.JSON(500, map[string]string{
						"error": "Internal server error",
					})
				}
			}()
			return next(c)
		}
	}
}
