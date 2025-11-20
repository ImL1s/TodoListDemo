"""
SQLAlchemy database models.
"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from .database import Base


class Todo(Base):
    """
    Todo database model.

    Attributes:
        id (int): Primary key
        text (str): Todo item text content
        completed (bool): Whether the todo is completed
        created_at (datetime): Timestamp when the todo was created
    """
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String(500), nullable=False, index=True)
    completed = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    def __repr__(self) -> str:
        """String representation of the todo."""
        status = "✓" if self.completed else "○"
        return f"<Todo {self.id}: {status} {self.text[:30]}>"
