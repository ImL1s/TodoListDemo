using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TodoListWPF.Models;

namespace TodoListWPF.Services;

/// <summary>
/// In-memory implementation of ITodoService with JSON persistence.
/// </summary>
public class TodoService : ITodoService
{
    private readonly List<TodoItem> _todos = new();
    private readonly IStorageService _storageService;

    public TodoService(IStorageService storageService)
    {
        _storageService = storageService;
    }

    public async Task<IEnumerable<TodoItem>> GetAllAsync()
    {
        await Task.CompletedTask;
        return _todos.ToList();
    }

    public async Task<TodoItem?> GetByIdAsync(Guid id)
    {
        await Task.CompletedTask;
        return _todos.FirstOrDefault(t => t.Id == id);
    }

    public async Task AddAsync(TodoItem item)
    {
        await Task.CompletedTask;
        if (item.Id == Guid.Empty)
        {
            item.Id = Guid.NewGuid();
        }
        _todos.Add(item);
        await SaveAsync();
    }

    public async Task UpdateAsync(TodoItem item)
    {
        await Task.CompletedTask;
        var existing = _todos.FirstOrDefault(t => t.Id == item.Id);
        if (existing != null)
        {
            var index = _todos.IndexOf(existing);
            _todos[index] = item;
            await SaveAsync();
        }
    }

    public async Task DeleteAsync(Guid id)
    {
        await Task.CompletedTask;
        var item = _todos.FirstOrDefault(t => t.Id == id);
        if (item != null)
        {
            _todos.Remove(item);
            await SaveAsync();
        }
    }

    public async Task DeleteCompletedAsync()
    {
        await Task.CompletedTask;
        _todos.RemoveAll(t => t.IsCompleted);
        await SaveAsync();
    }

    public async Task SaveAsync()
    {
        await _storageService.SaveTodosAsync(_todos);
    }

    public async Task LoadAsync()
    {
        var todos = await _storageService.LoadTodosAsync();
        _todos.Clear();
        _todos.AddRange(todos);
    }
}
