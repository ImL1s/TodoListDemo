using System.Collections.Generic;
using System.Threading.Tasks;
using TodoListWPF.Models;

namespace TodoListWPF.Services;

/// <summary>
/// Interface for persistent storage operations.
/// </summary>
public interface IStorageService
{
    /// <summary>
    /// Saves todos to persistent storage.
    /// </summary>
    Task SaveTodosAsync(IEnumerable<TodoItem> todos);

    /// <summary>
    /// Loads todos from persistent storage.
    /// </summary>
    Task<IEnumerable<TodoItem>> LoadTodosAsync();

    /// <summary>
    /// Saves application settings.
    /// </summary>
    Task SaveSettingsAsync(AppSettings settings);

    /// <summary>
    /// Loads application settings.
    /// </summary>
    Task<AppSettings> LoadSettingsAsync();
}
