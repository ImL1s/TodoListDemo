package database

import (
	"log"

	"github.com/user/todolist-echo/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

// InitDatabase initializes the database connection and runs migrations
func InitDatabase() {
	var err error
	DB, err = gorm.Open(sqlite.Open("todos.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Auto migrate the schema
	err = DB.AutoMigrate(&models.Todo{})
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	log.Println("Database initialized successfully")
}

// GetDB returns the database instance
func GetDB() *gorm.DB {
	return DB
}
