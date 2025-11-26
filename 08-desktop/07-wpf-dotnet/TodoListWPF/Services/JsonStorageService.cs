using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using TodoListWPF.Models;

namespace TodoListWPF.Services;

/// <summary>
/// JSON-based implementation of IStorageService.
/// Stores todos and settings in JSON files in the user's AppData folder.
/// </summary>
public class JsonStorageService : IStorageService
{
    private readonly string _todosFilePath;
    private readonly string _settingsFilePath;
    private readonly JsonSerializerOptions _jsonOptions;

    public JsonStorageService()
    {
        var appDataPath = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
            "TodoListWPF"
        );

        Directory.CreateDirectory(appDataPath);

        _todosFilePath = Path.Combine(appDataPath, "todos.json");
        _settingsFilePath = Path.Combine(appDataPath, "settings.json");

        _jsonOptions = new JsonSerializerOptions
        {
            WriteIndented = true,
            PropertyNameCaseInsensitive = true
        };
    }

    public async Task SaveTodosAsync(IEnumerable<TodoItem> todos)
    {
        try
        {
            // Convert to DTOs to avoid serializing ObservableObject internals
            var dtos = todos.Select(t => new TodoItemDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                IsCompleted = t.IsCompleted,
                CreatedAt = t.CreatedAt,
                CompletedAt = t.CompletedAt,
                Priority = t.Priority,
                Category = t.Category
            }).ToList();

            var json = JsonSerializer.Serialize(dtos, _jsonOptions);
            await File.WriteAllTextAsync(_todosFilePath, json);
        }
        catch (Exception ex)
        {
            // Log error - in production, use proper logging
            System.Diagnostics.Debug.WriteLine($"Error saving todos: {ex.Message}");
            throw;
        }
    }

    public async Task<IEnumerable<TodoItem>> LoadTodosAsync()
    {
        try
        {
            if (!File.Exists(_todosFilePath))
            {
                return Enumerable.Empty<TodoItem>();
            }

            var json = await File.ReadAllTextAsync(_todosFilePath);
            var dtos = JsonSerializer.Deserialize<List<TodoItemDto>>(json, _jsonOptions);

            if (dtos == null)
            {
                return Enumerable.Empty<TodoItem>();
            }

            return dtos.Select(dto => new TodoItem
            {
                Id = dto.Id,
                Title = dto.Title,
                Description = dto.Description,
                IsCompleted = dto.IsCompleted,
                CreatedAt = dto.CreatedAt,
                CompletedAt = dto.CompletedAt,
                Priority = dto.Priority,
                Category = dto.Category
            }).ToList();
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Error loading todos: {ex.Message}");
            return Enumerable.Empty<TodoItem>();
        }
    }

    public async Task SaveSettingsAsync(AppSettings settings)
    {
        try
        {
            var dto = new AppSettingsDto
            {
                IsDarkTheme = settings.IsDarkTheme,
                WindowWidth = settings.WindowWidth,
                WindowHeight = settings.WindowHeight,
                WindowLeft = settings.WindowLeft,
                WindowTop = settings.WindowTop,
                IsMaximized = settings.IsMaximized,
                CurrentFilter = settings.CurrentFilter,
                CurrentSortOption = settings.CurrentSortOption,
                LastSaveLocation = settings.LastSaveLocation
            };

            var json = JsonSerializer.Serialize(dto, _jsonOptions);
            await File.WriteAllTextAsync(_settingsFilePath, json);
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Error saving settings: {ex.Message}");
        }
    }

    public async Task<AppSettings> LoadSettingsAsync()
    {
        try
        {
            if (!File.Exists(_settingsFilePath))
            {
                return new AppSettings();
            }

            var json = await File.ReadAllTextAsync(_settingsFilePath);
            var dto = JsonSerializer.Deserialize<AppSettingsDto>(json, _jsonOptions);

            if (dto == null)
            {
                return new AppSettings();
            }

            return new AppSettings
            {
                IsDarkTheme = dto.IsDarkTheme,
                WindowWidth = dto.WindowWidth,
                WindowHeight = dto.WindowHeight,
                WindowLeft = dto.WindowLeft,
                WindowTop = dto.WindowTop,
                IsMaximized = dto.IsMaximized,
                CurrentFilter = dto.CurrentFilter,
                CurrentSortOption = dto.CurrentSortOption,
                LastSaveLocation = dto.LastSaveLocation
            };
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Error loading settings: {ex.Message}");
            return new AppSettings();
        }
    }

    // DTOs for serialization
    private class TodoItemDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool IsCompleted { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public TodoPriority Priority { get; set; }
        public string Category { get; set; } = string.Empty;
    }

    private class AppSettingsDto
    {
        public bool IsDarkTheme { get; set; }
        public double WindowWidth { get; set; }
        public double WindowHeight { get; set; }
        public double WindowLeft { get; set; }
        public double WindowTop { get; set; }
        public bool IsMaximized { get; set; }
        public TodoFilter CurrentFilter { get; set; }
        public TodoSortOption CurrentSortOption { get; set; }
        public string LastSaveLocation { get; set; } = string.Empty;
    }
}
