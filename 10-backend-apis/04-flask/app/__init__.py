"""
Flask TodoList Application Factory.
"""
from flask import Flask
from flask_cors import CORS
from .database import db
from .routes import todos_bp


def create_app(config=None):
    """
    Application factory for creating Flask app instances.

    Args:
        config: Optional configuration dictionary

    Returns:
        Flask: Configured Flask application instance
    """
    app = Flask(__name__)

    # Default configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todos.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JSON_SORT_KEYS'] = False

    # Apply custom configuration if provided
    if config:
        app.config.update(config)

    # Initialize extensions
    db.init_app(app)
    CORS(app)  # Enable CORS for all routes

    # Register blueprints
    app.register_blueprint(todos_bp, url_prefix='/api')

    # Create database tables
    with app.app_context():
        db.create_all()

    # Root route
    @app.route('/')
    def index():
        """API root endpoint."""
        return {
            'message': 'TodoList API',
            'version': '1.0.0',
            'endpoints': {
                'todos': '/api/todos',
                'health': '/health'
            }
        }

    # Health check route
    @app.route('/health')
    def health():
        """Health check endpoint."""
        return {'status': 'healthy'}

    return app
