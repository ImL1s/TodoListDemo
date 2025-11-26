using CommunityToolkit.Mvvm.ComponentModel;
using System;

namespace TodoListWPF.Models;

/// <summary>
/// Represents a single todo item with observable properties.
/// Uses CommunityToolkit.Mvvm for automatic INotifyPropertyChanged implementation.
/// </summary>
public partial class TodoItem : ObservableObject
{
    private Guid _id;
    private string _title = string.Empty;
    private string _description = string.Empty;
    private bool _isCompleted;
    private DateTime _createdAt;
    private DateTime? _completedAt;
    private TodoPriority _priority;
    private string _category = string.Empty;

    /// <summary>
    /// Unique identifier for the todo item.
    /// </summary>
    public Guid Id
    {
        get => _id;
        set => SetProperty(ref _id, value);
    }

    /// <summary>
    /// Title of the todo item. Required field.
    /// </summary>
    [ObservableProperty]
    [NotifyPropertyChangedFor(nameof(DisplayTitle))]
    private string title = string.Empty;

    /// <summary>
    /// Optional description providing more details about the todo.
    /// </summary>
    [ObservableProperty]
    private string description = string.Empty;

    /// <summary>
    /// Indicates whether the todo has been completed.
    /// When set to true, automatically sets CompletedAt timestamp.
    /// </summary>
    [ObservableProperty]
    [NotifyPropertyChangedFor(nameof(DisplayTitle))]
    private bool isCompleted;

    /// <summary>
    /// Timestamp when the todo was created.
    /// </summary>
    [ObservableProperty]
    private DateTime createdAt;

    /// <summary>
    /// Timestamp when the todo was completed (null if not completed).
    /// </summary>
    [ObservableProperty]
    private DateTime? completedAt;

    /// <summary>
    /// Priority level of the todo item.
    /// </summary>
    [ObservableProperty]
    private TodoPriority priority;

    /// <summary>
    /// Category or tag for organizing todos.
    /// </summary>
    [ObservableProperty]
    private string category = string.Empty;

    /// <summary>
    /// Display title with strikethrough effect when completed (for UI).
    /// </summary>
    public string DisplayTitle => IsCompleted ? $"✓ {Title}" : Title;

    /// <summary>
    /// Creates a new TodoItem with a unique ID and current timestamp.
    /// </summary>
    public TodoItem()
    {
        Id = Guid.NewGuid();
        CreatedAt = DateTime.Now;
        Priority = TodoPriority.Normal;
    }

    /// <summary>
    /// Called when IsCompleted changes to update CompletedAt timestamp.
    /// </summary>
    partial void OnIsCompletedChanged(bool value)
    {
        CompletedAt = value ? DateTime.Now : null;
    }

    /// <summary>
    /// Creates a copy of this todo item.
    /// </summary>
    public TodoItem Clone()
    {
        return new TodoItem
        {
            Id = this.Id,
            Title = this.Title,
            Description = this.Description,
            IsCompleted = this.IsCompleted,
            CreatedAt = this.CreatedAt,
            CompletedAt = this.CompletedAt,
            Priority = this.Priority,
            Category = this.Category
        };
    }
}

/// <summary>
/// Priority levels for todo items.
/// </summary>
public enum TodoPriority
{
    Low = 0,
    Normal = 1,
    High = 2,
    Urgent = 3
}
