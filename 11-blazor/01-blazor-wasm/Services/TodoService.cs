using Blazored.LocalStorage;
using TodoBlazorWasm.Models;

namespace TodoBlazorWasm.Services;

/// <summary>
/// Service for managing Todo items with LocalStorage persistence
/// </summary>
public class TodoService
{
    private readonly ILocalStorageService _localStorage;
    private const string StorageKey = "todos";
    private List<Todo> _todos = new();
    private int _nextId = 1;

    public TodoService(ILocalStorageService localStorage)
    {
        _localStorage = localStorage;
    }

    /// <summary>
    /// Event raised when todos are changed
    /// </summary>
    public event Action? OnChange;

    /// <summary>
    /// Initialize the service and load todos from localStorage
    /// </summary>
    public async Task InitializeAsync()
    {
        var stored = await _localStorage.GetItemAsync<List<Todo>>(StorageKey);
        if (stored != null && stored.Any())
        {
            _todos = stored;
            _nextId = _todos.Max(t => t.Id) + 1;
        }
        else
        {
            // Add sample data
            _todos = new List<Todo>
            {
                new Todo { Id = 1, Text = "Welcome to Blazor WebAssembly!", IsCompleted = false, CreatedAt = DateTime.Now },
                new Todo { Id = 2, Text = "Try adding a new todo", IsCompleted = false, CreatedAt = DateTime.Now },
                new Todo { Id = 3, Text = "Click the checkbox to complete a todo", IsCompleted = true, CreatedAt = DateTime.Now }
            };
            _nextId = 4;
            await SaveAsync();
        }
    }

    /// <summary>
    /// Get all todos
    /// </summary>
    public List<Todo> GetTodos() => _todos.OrderBy(t => t.CreatedAt).ToList();

    /// <summary>
    /// Get active (not completed) todos count
    /// </summary>
    public int GetActiveCount() => _todos.Count(t => !t.IsCompleted);

    /// <summary>
    /// Get completed todos count
    /// </summary>
    public int GetCompletedCount() => _todos.Count(t => t.IsCompleted);

    /// <summary>
    /// Add a new todo
    /// </summary>
    public async Task AddTodoAsync(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
            return;

        var todo = new Todo
        {
            Id = _nextId++,
            Text = text.Trim(),
            IsCompleted = false,
            CreatedAt = DateTime.Now
        };

        _todos.Add(todo);
        await SaveAsync();
        NotifyStateChanged();
    }

    /// <summary>
    /// Toggle todo completion status
    /// </summary>
    public async Task ToggleTodoAsync(int id)
    {
        var todo = _todos.FirstOrDefault(t => t.Id == id);
        if (todo != null)
        {
            todo.IsCompleted = !todo.IsCompleted;
            await SaveAsync();
            NotifyStateChanged();
        }
    }

    /// <summary>
    /// Update todo text
    /// </summary>
    public async Task UpdateTodoAsync(int id, string text)
    {
        var todo = _todos.FirstOrDefault(t => t.Id == id);
        if (todo != null && !string.IsNullOrWhiteSpace(text))
        {
            todo.Text = text.Trim();
            await SaveAsync();
            NotifyStateChanged();
        }
    }

    /// <summary>
    /// Delete a todo
    /// </summary>
    public async Task DeleteTodoAsync(int id)
    {
        var todo = _todos.FirstOrDefault(t => t.Id == id);
        if (todo != null)
        {
            _todos.Remove(todo);
            await SaveAsync();
            NotifyStateChanged();
        }
    }

    /// <summary>
    /// Clear all completed todos
    /// </summary>
    public async Task ClearCompletedAsync()
    {
        _todos.RemoveAll(t => t.IsCompleted);
        await SaveAsync();
        NotifyStateChanged();
    }

    /// <summary>
    /// Save todos to localStorage
    /// </summary>
    private async Task SaveAsync()
    {
        await _localStorage.SetItemAsync(StorageKey, _todos);
    }

    /// <summary>
    /// Notify subscribers that todos have changed
    /// </summary>
    private void NotifyStateChanged() => OnChange?.Invoke();
}
