using System.Collections.Generic;
using System.Threading.Tasks;
using TodoListWPF.Models;

namespace TodoListWPF.Services;

/// <summary>
/// Interface for managing todo items with CRUD operations.
/// </summary>
public interface ITodoService
{
    /// <summary>
    /// Gets all todo items.
    /// </summary>
    Task<IEnumerable<TodoItem>> GetAllAsync();

    /// <summary>
    /// Gets a specific todo item by ID.
    /// </summary>
    Task<TodoItem?> GetByIdAsync(Guid id);

    /// <summary>
    /// Adds a new todo item.
    /// </summary>
    Task AddAsync(TodoItem item);

    /// <summary>
    /// Updates an existing todo item.
    /// </summary>
    Task UpdateAsync(TodoItem item);

    /// <summary>
    /// Deletes a todo item.
    /// </summary>
    Task DeleteAsync(Guid id);

    /// <summary>
    /// Deletes all completed todos.
    /// </summary>
    Task DeleteCompletedAsync();

    /// <summary>
    /// Saves all changes to persistent storage.
    /// </summary>
    Task SaveAsync();

    /// <summary>
    /// Loads all todos from persistent storage.
    /// </summary>
    Task LoadAsync();
}
