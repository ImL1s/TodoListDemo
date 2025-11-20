"""
Todo model definition
"""
from django.db import models


class Todo(models.Model):
    """
    Todo item model.

    Attributes:
        text (str): The todo item text content
        completed (bool): Whether the todo is completed
        created_at (datetime): Timestamp when the todo was created
    """
    text = models.CharField(
        max_length=500,
        help_text="Todo item text"
    )
    completed = models.BooleanField(
        default=False,
        help_text="Completion status"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Creation timestamp"
    )

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Todo'
        verbose_name_plural = 'Todos'

    def __str__(self):
        """String representation of the todo."""
        status = "✓" if self.completed else "○"
        return f"{status} {self.text[:50]}"
