"""
URL routing for todos API
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TodoViewSet

# Create router and register viewsets
router = DefaultRouter()
router.register(r'todos', TodoViewSet, basename='todo')

urlpatterns = [
    path('', include(router.urls)),
]
