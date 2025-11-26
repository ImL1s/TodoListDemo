"""
Django admin configuration for Todo model
"""
from django.contrib import admin
from .models import Todo


@admin.register(Todo)
class TodoAdmin(admin.ModelAdmin):
    """
    Admin interface for Todo model.

    Provides a rich interface for managing todos in Django admin.
    """

    list_display = ['id', 'text_preview', 'completed', 'created_at']
    list_filter = ['completed', 'created_at']
    search_fields = ['text']
    readonly_fields = ['created_at']
    list_per_page = 25

    fieldsets = (
        ('Todo Information', {
            'fields': ('text', 'completed')
        }),
        ('Metadata', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )

    def text_preview(self, obj):
        """Display truncated text in list view."""
        return obj.text[:50] + '...' if len(obj.text) > 50 else obj.text

    text_preview.short_description = 'Text'

    actions = ['mark_completed', 'mark_incomplete']

    @admin.action(description='Mark selected todos as completed')
    def mark_completed(self, request, queryset):
        """Mark selected todos as completed."""
        updated = queryset.update(completed=True)
        self.message_user(request, f'{updated} todo(s) marked as completed.')

    @admin.action(description='Mark selected todos as incomplete')
    def mark_incomplete(self, request, queryset):
        """Mark selected todos as incomplete."""
        updated = queryset.update(completed=False)
        self.message_user(request, f'{updated} todo(s) marked as incomplete.')
