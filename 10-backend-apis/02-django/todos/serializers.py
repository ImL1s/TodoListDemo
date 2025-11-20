"""
Serializers for Todo model
"""
from rest_framework import serializers
from .models import Todo


class TodoSerializer(serializers.ModelSerializer):
    """
    Serializer for Todo model.

    Provides JSON serialization/deserialization for Todo instances.
    """

    class Meta:
        model = Todo
        fields = ['id', 'text', 'completed', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_text(self, value):
        """
        Validate that text is not empty or whitespace only.

        Args:
            value (str): The text to validate

        Returns:
            str: The validated text

        Raises:
            ValidationError: If text is empty or whitespace
        """
        if not value or not value.strip():
            raise serializers.ValidationError("Todo text cannot be empty")
        return value.strip()
