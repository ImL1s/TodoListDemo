"""
Database configuration and session management.
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from typing import Generator

# SQLite database URL
SQLALCHEMY_DATABASE_URL = "sqlite:///./todos.db"

# Create engine
# connect_args needed only for SQLite
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()


def get_db() -> Generator:
    """
    Dependency function that yields a database session.

    Yields:
        Session: SQLAlchemy database session

    Usage:
        Use as a FastAPI dependency to inject database session into route handlers.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
