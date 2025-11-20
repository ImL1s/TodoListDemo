"""
FastAPI TodoList Application - Main entry point.
"""
from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Optional

from . import crud, models, schemas
from .database import engine, get_db

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="TodoList API",
    description="RESTful API for TodoList application built with FastAPI",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint - API information.
    """
    return {
        "message": "TodoList API",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc"
    }


@app.get(
    "/todos",
    response_model=schemas.TodosResponse,
    status_code=status.HTTP_200_OK,
    tags=["Todos"],
    summary="Get all todos",
    description="Retrieve a list of all todos with optional filtering by completion status"
)
async def get_todos(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of records to return"),
    completed: Optional[bool] = Query(None, description="Filter by completion status"),
    db: Session = Depends(get_db)
):
    """
    Get all todos with pagination and optional filtering.

    Args:
        skip: Number of records to skip (default: 0)
        limit: Maximum number of records to return (default: 100)
        completed: Filter by completion status (None = all)
        db: Database session

    Returns:
        TodosResponse with list of todos and total count
    """
    todos = crud.get_todos(db, skip=skip, limit=limit, completed=completed)
    total = crud.get_todos_count(db, completed=completed)
    return schemas.TodosResponse(todos=todos, total=total)


@app.post(
    "/todos",
    response_model=schemas.TodoResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Todos"],
    summary="Create a new todo",
    description="Create a new todo item"
)
async def create_todo(
    todo: schemas.TodoCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new todo.

    Args:
        todo: TodoCreate schema with todo data
        db: Database session

    Returns:
        Created todo
    """
    return crud.create_todo(db=db, todo=todo)


@app.get(
    "/todos/{todo_id}",
    response_model=schemas.TodoResponse,
    status_code=status.HTTP_200_OK,
    tags=["Todos"],
    summary="Get a specific todo",
    description="Retrieve a single todo by its ID"
)
async def get_todo(
    todo_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a specific todo by ID.

    Args:
        todo_id: ID of the todo to retrieve
        db: Database session

    Returns:
        Todo if found

    Raises:
        HTTPException: 404 if todo not found
    """
    db_todo = crud.get_todo(db, todo_id=todo_id)
    if db_todo is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo with id {todo_id} not found"
        )
    return db_todo


@app.put(
    "/todos/{todo_id}",
    response_model=schemas.TodoResponse,
    status_code=status.HTTP_200_OK,
    tags=["Todos"],
    summary="Update a todo",
    description="Update an existing todo item"
)
async def update_todo(
    todo_id: int,
    todo_update: schemas.TodoUpdate,
    db: Session = Depends(get_db)
):
    """
    Update an existing todo.

    Args:
        todo_id: ID of the todo to update
        todo_update: TodoUpdate schema with update data
        db: Database session

    Returns:
        Updated todo

    Raises:
        HTTPException: 404 if todo not found
    """
    db_todo = crud.update_todo(db, todo_id=todo_id, todo_update=todo_update)
    if db_todo is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo with id {todo_id} not found"
        )
    return db_todo


@app.delete(
    "/todos/{todo_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["Todos"],
    summary="Delete a todo",
    description="Delete a todo by its ID"
)
async def delete_todo(
    todo_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a todo.

    Args:
        todo_id: ID of the todo to delete
        db: Database session

    Raises:
        HTTPException: 404 if todo not found
    """
    success = crud.delete_todo(db, todo_id=todo_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo with id {todo_id} not found"
        )
    return None


@app.post(
    "/todos/{todo_id}/toggle",
    response_model=schemas.TodoResponse,
    status_code=status.HTTP_200_OK,
    tags=["Todos"],
    summary="Toggle todo completion",
    description="Toggle the completion status of a todo"
)
async def toggle_todo(
    todo_id: int,
    db: Session = Depends(get_db)
):
    """
    Toggle the completion status of a todo.

    Args:
        todo_id: ID of the todo to toggle
        db: Database session

    Returns:
        Updated todo

    Raises:
        HTTPException: 404 if todo not found
    """
    db_todo = crud.toggle_todo(db, todo_id=todo_id)
    if db_todo is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Todo with id {todo_id} not found"
        )
    return db_todo


@app.delete(
    "/todos/completed/clear",
    response_model=schemas.MessageResponse,
    status_code=status.HTTP_200_OK,
    tags=["Todos"],
    summary="Clear completed todos",
    description="Delete all completed todos"
)
async def clear_completed_todos(
    db: Session = Depends(get_db)
):
    """
    Delete all completed todos.

    Args:
        db: Database session

    Returns:
        Message with count of deleted todos
    """
    deleted_count = crud.delete_completed_todos(db)
    return schemas.MessageResponse(
        message=f"Deleted {deleted_count} completed todo(s)"
    )


@app.get("/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint.
    """
    return {"status": "healthy"}
