"""
Database models for TodoList application.
"""
from datetime import datetime
from .database import db


class Todo(db.Model):
    """
    Todo model representing a todo item.

    Attributes:
        id (int): Primary key
        text (str): Todo item text content
        completed (bool): Whether the todo is completed
        created_at (datetime): Timestamp when the todo was created
    """
    __tablename__ = 'todos'

    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(500), nullable=False)
    completed = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        """String representation of the todo."""
        status = "✓" if self.completed else "○"
        return f"<Todo {self.id}: {status} {self.text[:30]}>"

    def to_dict(self):
        """
        Convert todo to dictionary for JSON serialization.

        Returns:
            dict: Todo data as dictionary
        """
        return {
            'id': self.id,
            'text': self.text,
            'completed': self.completed,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

    @staticmethod
    def from_dict(data):
        """
        Create a Todo instance from dictionary.

        Args:
            data (dict): Dictionary containing todo data

        Returns:
            Todo: New Todo instance
        """
        return Todo(
            text=data.get('text', '').strip(),
            completed=data.get('completed', False)
        )

    def update_from_dict(self, data):
        """
        Update todo attributes from dictionary.

        Args:
            data (dict): Dictionary containing update data
        """
        if 'text' in data:
            self.text = data['text'].strip()
        if 'completed' in data:
            self.completed = data['completed']
