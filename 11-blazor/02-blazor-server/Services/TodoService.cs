using Microsoft.EntityFrameworkCore;
using TodoBlazorServer.Data;
using TodoBlazorServer.Models;

namespace TodoBlazorServer.Services;

/// <summary>
/// Service for managing Todo items with EF Core persistence
/// </summary>
public class TodoService
{
    private readonly IDbContextFactory<TodoContext> _contextFactory;
    private readonly ILogger<TodoService> _logger;

    public TodoService(IDbContextFactory<TodoContext> contextFactory, ILogger<TodoService> logger)
    {
        _contextFactory = contextFactory;
        _logger = logger;
    }

    /// <summary>
    /// Event raised when todos are changed
    /// </summary>
    public event Action? OnChange;

    /// <summary>
    /// Get all todos
    /// </summary>
    public async Task<List<Todo>> GetTodosAsync()
    {
        using var context = await _contextFactory.CreateDbContextAsync();
        return await context.Todos
            .OrderBy(t => t.CreatedAt)
            .ToListAsync();
    }

    /// <summary>
    /// Get a single todo by ID
    /// </summary>
    public async Task<Todo?> GetTodoByIdAsync(int id)
    {
        using var context = await _contextFactory.CreateDbContextAsync();
        return await context.Todos.FindAsync(id);
    }

    /// <summary>
    /// Get active (not completed) todos count
    /// </summary>
    public async Task<int> GetActiveCountAsync()
    {
        using var context = await _contextFactory.CreateDbContextAsync();
        return await context.Todos.CountAsync(t => !t.IsCompleted);
    }

    /// <summary>
    /// Get completed todos count
    /// </summary>
    public async Task<int> GetCompletedCountAsync()
    {
        using var context = await _contextFactory.CreateDbContextAsync();
        return await context.Todos.CountAsync(t => t.IsCompleted);
    }

    /// <summary>
    /// Add a new todo
    /// </summary>
    public async Task<Todo> AddTodoAsync(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
            throw new ArgumentException("Todo text cannot be empty", nameof(text));

        using var context = await _contextFactory.CreateDbContextAsync();
        var todo = new Todo
        {
            Text = text.Trim(),
            IsCompleted = false,
            CreatedAt = DateTime.UtcNow
        };

        context.Todos.Add(todo);
        await context.SaveChangesAsync();

        _logger.LogInformation("Created todo with ID: {Id}", todo.Id);
        NotifyStateChanged();

        return todo;
    }

    /// <summary>
    /// Toggle todo completion status
    /// </summary>
    public async Task<bool> ToggleTodoAsync(int id)
    {
        using var context = await _contextFactory.CreateDbContextAsync();
        var todo = await context.Todos.FindAsync(id);

        if (todo == null)
        {
            _logger.LogWarning("Todo with ID {Id} not found", id);
            return false;
        }

        todo.IsCompleted = !todo.IsCompleted;
        await context.SaveChangesAsync();

        _logger.LogInformation("Toggled todo {Id} completion to: {IsCompleted}", id, todo.IsCompleted);
        NotifyStateChanged();

        return true;
    }

    /// <summary>
    /// Update todo text
    /// </summary>
    public async Task<bool> UpdateTodoAsync(int id, string text)
    {
        if (string.IsNullOrWhiteSpace(text))
            throw new ArgumentException("Todo text cannot be empty", nameof(text));

        using var context = await _contextFactory.CreateDbContextAsync();
        var todo = await context.Todos.FindAsync(id);

        if (todo == null)
        {
            _logger.LogWarning("Todo with ID {Id} not found", id);
            return false;
        }

        todo.Text = text.Trim();
        await context.SaveChangesAsync();

        _logger.LogInformation("Updated todo {Id}", id);
        NotifyStateChanged();

        return true;
    }

    /// <summary>
    /// Delete a todo
    /// </summary>
    public async Task<bool> DeleteTodoAsync(int id)
    {
        using var context = await _contextFactory.CreateDbContextAsync();
        var todo = await context.Todos.FindAsync(id);

        if (todo == null)
        {
            _logger.LogWarning("Todo with ID {Id} not found", id);
            return false;
        }

        context.Todos.Remove(todo);
        await context.SaveChangesAsync();

        _logger.LogInformation("Deleted todo {Id}", id);
        NotifyStateChanged();

        return true;
    }

    /// <summary>
    /// Clear all completed todos
    /// </summary>
    public async Task<int> ClearCompletedAsync()
    {
        using var context = await _contextFactory.CreateDbContextAsync();
        var completedTodos = await context.Todos
            .Where(t => t.IsCompleted)
            .ToListAsync();

        if (!completedTodos.Any())
            return 0;

        context.Todos.RemoveRange(completedTodos);
        await context.SaveChangesAsync();

        var count = completedTodos.Count;
        _logger.LogInformation("Cleared {Count} completed todos", count);
        NotifyStateChanged();

        return count;
    }

    /// <summary>
    /// Notify subscribers that todos have changed
    /// </summary>
    private void NotifyStateChanged() => OnChange?.Invoke();
}
