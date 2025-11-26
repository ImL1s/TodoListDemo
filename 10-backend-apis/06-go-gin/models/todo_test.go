package models

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestTodoStructCreation(t *testing.T) {
	todo := Todo{
		Text:      "Test todo",
		Completed: false,
	}

	assert.Equal(t, "Test todo", todo.Text)
	assert.False(t, todo.Completed)
}

func TestCreateTodoInput(t *testing.T) {
	input := CreateTodoInput{
		Text:      "New todo",
		Completed: false,
	}

	assert.Equal(t, "New todo", input.Text)
	assert.False(t, input.Completed)
}

func TestUpdateTodoInput(t *testing.T) {
	text := "Updated text"
	completed := true

	input := UpdateTodoInput{
		Text:      &text,
		Completed: &completed,
	}

	assert.Equal(t, "Updated text", *input.Text)
	assert.True(t, *input.Completed)
}

func TestUpdateTodoInputNilFields(t *testing.T) {
	input := UpdateTodoInput{}

	assert.Nil(t, input.Text)
	assert.Nil(t, input.Completed)
}
