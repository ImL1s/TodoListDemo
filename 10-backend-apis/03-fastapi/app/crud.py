"""
CRUD (Create, Read, Update, Delete) operations for Todo.
"""
from sqlalchemy.orm import Session
from typing import Optional
from . import models, schemas


def get_todo(db: Session, todo_id: int) -> Optional[models.Todo]:
    """
    Retrieve a single todo by ID.

    Args:
        db: Database session
        todo_id: ID of the todo to retrieve

    Returns:
        Todo object if found, None otherwise
    """
    return db.query(models.Todo).filter(models.Todo.id == todo_id).first()


def get_todos(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    completed: Optional[bool] = None
) -> list[models.Todo]:
    """
    Retrieve a list of todos.

    Args:
        db: Database session
        skip: Number of records to skip (for pagination)
        limit: Maximum number of records to return
        completed: Filter by completion status (None = all)

    Returns:
        List of Todo objects
    """
    query = db.query(models.Todo)

    if completed is not None:
        query = query.filter(models.Todo.completed == completed)

    return query.order_by(models.Todo.created_at.desc()).offset(skip).limit(limit).all()


def get_todos_count(db: Session, completed: Optional[bool] = None) -> int:
    """
    Get total count of todos.

    Args:
        db: Database session
        completed: Filter by completion status (None = all)

    Returns:
        Total count of todos
    """
    query = db.query(models.Todo)

    if completed is not None:
        query = query.filter(models.Todo.completed == completed)

    return query.count()


def create_todo(db: Session, todo: schemas.TodoCreate) -> models.Todo:
    """
    Create a new todo.

    Args:
        db: Database session
        todo: TodoCreate schema with todo data

    Returns:
        Created Todo object
    """
    db_todo = models.Todo(**todo.model_dump())
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo


def update_todo(
    db: Session,
    todo_id: int,
    todo_update: schemas.TodoUpdate
) -> Optional[models.Todo]:
    """
    Update an existing todo.

    Args:
        db: Database session
        todo_id: ID of the todo to update
        todo_update: TodoUpdate schema with update data

    Returns:
        Updated Todo object if found, None otherwise
    """
    db_todo = get_todo(db, todo_id)

    if db_todo is None:
        return None

    # Update only provided fields
    update_data = todo_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_todo, field, value)

    db.commit()
    db.refresh(db_todo)
    return db_todo


def delete_todo(db: Session, todo_id: int) -> bool:
    """
    Delete a todo.

    Args:
        db: Database session
        todo_id: ID of the todo to delete

    Returns:
        True if deleted, False if not found
    """
    db_todo = get_todo(db, todo_id)

    if db_todo is None:
        return False

    db.delete(db_todo)
    db.commit()
    return True


def delete_completed_todos(db: Session) -> int:
    """
    Delete all completed todos.

    Args:
        db: Database session

    Returns:
        Number of deleted todos
    """
    deleted_count = db.query(models.Todo).filter(
        models.Todo.completed == True
    ).delete()
    db.commit()
    return deleted_count


def toggle_todo(db: Session, todo_id: int) -> Optional[models.Todo]:
    """
    Toggle the completion status of a todo.

    Args:
        db: Database session
        todo_id: ID of the todo to toggle

    Returns:
        Updated Todo object if found, None otherwise
    """
    db_todo = get_todo(db, todo_id)

    if db_todo is None:
        return None

    db_todo.completed = not db_todo.completed
    db.commit()
    db.refresh(db_todo)
    return db_todo
