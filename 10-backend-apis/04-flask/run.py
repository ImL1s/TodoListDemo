#!/usr/bin/env python
"""
Flask application entry point.

Run this script to start the development server.
"""
from app import create_app

# Create Flask app instance
app = create_app()

if __name__ == '__main__':
    # Run development server
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )
