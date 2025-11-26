"""
API views for Todo operations
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, extend_schema_view
from .models import Todo
from .serializers import TodoSerializer


@extend_schema_view(
    list=extend_schema(description="Retrieve all todos"),
    create=extend_schema(description="Create a new todo"),
    retrieve=extend_schema(description="Retrieve a specific todo"),
    update=extend_schema(description="Update a todo"),
    partial_update=extend_schema(description="Partially update a todo"),
    destroy=extend_schema(description="Delete a todo"),
)
class TodoViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Todo CRUD operations.

    Provides standard REST API endpoints:
    - GET /api/todos/ - List all todos
    - POST /api/todos/ - Create a new todo
    - GET /api/todos/{id}/ - Retrieve a specific todo
    - PUT /api/todos/{id}/ - Update a todo
    - PATCH /api/todos/{id}/ - Partially update a todo
    - DELETE /api/todos/{id}/ - Delete a todo

    Additional actions:
    - POST /api/todos/clear_completed/ - Delete all completed todos
    - POST /api/todos/{id}/toggle/ - Toggle todo completion status
    """

    queryset = Todo.objects.all()
    serializer_class = TodoSerializer

    @extend_schema(
        description="Delete all completed todos",
        request=None,
        responses={204: None}
    )
    @action(detail=False, methods=['post'])
    def clear_completed(self, request):
        """
        Delete all completed todos.

        Returns:
            Response: 204 No Content with count of deleted todos
        """
        deleted_count, _ = Todo.objects.filter(completed=True).delete()
        return Response(
            {'message': f'Deleted {deleted_count} completed todos'},
            status=status.HTTP_204_NO_CONTENT
        )

    @extend_schema(
        description="Toggle todo completion status",
        request=None,
        responses={200: TodoSerializer}
    )
    @action(detail=True, methods=['post'])
    def toggle(self, request, pk=None):
        """
        Toggle the completion status of a todo.

        Args:
            pk: Primary key of the todo

        Returns:
            Response: Updated todo data
        """
        todo = self.get_object()
        todo.completed = not todo.completed
        todo.save()
        serializer = self.get_serializer(todo)
        return Response(serializer.data)
