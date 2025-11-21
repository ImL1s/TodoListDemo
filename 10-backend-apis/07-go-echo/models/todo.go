package models

import (
	"time"
)

// Todo represents a todo item in the database
type Todo struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Text      string    `gorm:"not null" json:"text"`
	Completed bool      `json:"completed"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// CreateTodoInput defines the input structure for creating a todo
type CreateTodoInput struct {
	Text      string `json:"text" validate:"required"`
	Completed bool   `json:"completed"`
}

// UpdateTodoInput defines the input structure for updating a todo
type UpdateTodoInput struct {
	Text      *string `json:"text"`
	Completed *bool   `json:"completed"`
}
