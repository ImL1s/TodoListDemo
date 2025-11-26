"""
API routes for TodoList operations.
"""
from flask import Blueprint, request, jsonify
from .database import db
from .models import Todo

# Create blueprint
todos_bp = Blueprint('todos', __name__)


def validate_todo_data(data, required=True):
    """
    Validate todo data.

    Args:
        data (dict): Todo data to validate
        required (bool): Whether text field is required

    Returns:
        tuple: (is_valid, error_message)
    """
    if required and 'text' not in data:
        return False, "Missing required field: text"

    if 'text' in data:
        text = data['text'].strip() if isinstance(data['text'], str) else ''
        if not text:
            return False, "Text cannot be empty"
        if len(text) > 500:
            return False, "Text cannot exceed 500 characters"

    if 'completed' in data and not isinstance(data['completed'], bool):
        return False, "Completed must be a boolean"

    return True, None


@todos_bp.route('/todos', methods=['GET'])
def get_todos():
    """
    Get all todos with optional filtering.

    Query Parameters:
        completed (bool): Filter by completion status
        skip (int): Number of records to skip
        limit (int): Maximum number of records to return

    Returns:
        JSON response with todos list and total count
    """
    # Get query parameters
    completed_param = request.args.get('completed')
    skip = request.args.get('skip', 0, type=int)
    limit = request.args.get('limit', 100, type=int)

    # Build query
    query = Todo.query

    # Filter by completion status if specified
    if completed_param is not None:
        completed = completed_param.lower() in ['true', '1', 'yes']
        query = query.filter_by(completed=completed)

    # Get total count
    total = query.count()

    # Apply pagination and ordering
    todos = query.order_by(Todo.created_at.desc()).offset(skip).limit(limit).all()

    return jsonify({
        'todos': [todo.to_dict() for todo in todos],
        'total': total
    }), 200


@todos_bp.route('/todos', methods=['POST'])
def create_todo():
    """
    Create a new todo.

    Request Body:
        text (str): Todo text (required)
        completed (bool): Completion status (optional, default: false)

    Returns:
        JSON response with created todo (201) or error (400)
    """
    data = request.get_json()

    if not data:
        return jsonify({'error': 'No data provided'}), 400

    # Validate data
    is_valid, error_msg = validate_todo_data(data, required=True)
    if not is_valid:
        return jsonify({'error': error_msg}), 400

    # Create todo
    try:
        todo = Todo.from_dict(data)
        db.session.add(todo)
        db.session.commit()
        return jsonify(todo.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to create todo: {str(e)}'}), 500


@todos_bp.route('/todos/<int:todo_id>', methods=['GET'])
def get_todo(todo_id):
    """
    Get a specific todo by ID.

    Args:
        todo_id (int): ID of the todo to retrieve

    Returns:
        JSON response with todo (200) or error (404)
    """
    todo = Todo.query.get(todo_id)

    if not todo:
        return jsonify({'error': f'Todo with id {todo_id} not found'}), 404

    return jsonify(todo.to_dict()), 200


@todos_bp.route('/todos/<int:todo_id>', methods=['PUT'])
def update_todo(todo_id):
    """
    Update an existing todo.

    Args:
        todo_id (int): ID of the todo to update

    Request Body:
        text (str): Updated text (optional)
        completed (bool): Updated completion status (optional)

    Returns:
        JSON response with updated todo (200) or error (400/404)
    """
    todo = Todo.query.get(todo_id)

    if not todo:
        return jsonify({'error': f'Todo with id {todo_id} not found'}), 404

    data = request.get_json()

    if not data:
        return jsonify({'error': 'No data provided'}), 400

    # Validate data
    is_valid, error_msg = validate_todo_data(data, required=False)
    if not is_valid:
        return jsonify({'error': error_msg}), 400

    # Update todo
    try:
        todo.update_from_dict(data)
        db.session.commit()
        return jsonify(todo.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update todo: {str(e)}'}), 500


@todos_bp.route('/todos/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    """
    Delete a todo.

    Args:
        todo_id (int): ID of the todo to delete

    Returns:
        Empty response (204) or error (404)
    """
    todo = Todo.query.get(todo_id)

    if not todo:
        return jsonify({'error': f'Todo with id {todo_id} not found'}), 404

    try:
        db.session.delete(todo)
        db.session.commit()
        return '', 204
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to delete todo: {str(e)}'}), 500


@todos_bp.route('/todos/<int:todo_id>/toggle', methods=['POST'])
def toggle_todo(todo_id):
    """
    Toggle the completion status of a todo.

    Args:
        todo_id (int): ID of the todo to toggle

    Returns:
        JSON response with updated todo (200) or error (404)
    """
    todo = Todo.query.get(todo_id)

    if not todo:
        return jsonify({'error': f'Todo with id {todo_id} not found'}), 404

    try:
        todo.completed = not todo.completed
        db.session.commit()
        return jsonify(todo.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to toggle todo: {str(e)}'}), 500


@todos_bp.route('/todos/completed', methods=['DELETE'])
def clear_completed():
    """
    Delete all completed todos.

    Returns:
        JSON response with deletion count (200)
    """
    try:
        deleted_count = Todo.query.filter_by(completed=True).delete()
        db.session.commit()
        return jsonify({
            'message': f'Deleted {deleted_count} completed todo(s)',
            'count': deleted_count
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to clear completed todos: {str(e)}'}), 500
