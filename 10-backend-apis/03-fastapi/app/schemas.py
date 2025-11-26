"""
Pydantic schemas for request/response validation.
"""
from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import Optional


class TodoBase(BaseModel):
    """Base schema with common todo attributes."""
    text: str = Field(..., min_length=1, max_length=500, description="Todo item text")
    completed: bool = Field(default=False, description="Completion status")

    @field_validator('text')
    @classmethod
    def validate_text(cls, v: str) -> str:
        """
        Validate that text is not empty or whitespace only.

        Args:
            v: The text to validate

        Returns:
            str: The validated and stripped text

        Raises:
            ValueError: If text is empty or whitespace
        """
        if not v or not v.strip():
            raise ValueError('Text cannot be empty or whitespace')
        return v.strip()


class TodoCreate(TodoBase):
    """Schema for creating a new todo."""
    pass


class TodoUpdate(BaseModel):
    """Schema for updating a todo (all fields optional)."""
    text: Optional[str] = Field(None, min_length=1, max_length=500)
    completed: Optional[bool] = None

    @field_validator('text')
    @classmethod
    def validate_text(cls, v: Optional[str]) -> Optional[str]:
        """Validate text if provided."""
        if v is not None and (not v or not v.strip()):
            raise ValueError('Text cannot be empty or whitespace')
        return v.strip() if v else None


class TodoResponse(TodoBase):
    """Schema for todo response."""
    id: int = Field(..., description="Todo ID")
    created_at: datetime = Field(..., description="Creation timestamp")

    class Config:
        from_attributes = True  # Pydantic v2 (was orm_mode in v1)


class TodosResponse(BaseModel):
    """Schema for list of todos response."""
    todos: list[TodoResponse]
    total: int


class MessageResponse(BaseModel):
    """Generic message response."""
    message: str
