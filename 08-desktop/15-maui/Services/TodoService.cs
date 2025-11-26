using SQLite;
using TodoMaui.Models;

namespace TodoMaui.Services;

public class TodoService
{
    private readonly SQLiteAsyncConnection _database;

    public TodoService(string dbPath)
    {
        _database = new SQLiteAsyncConnection(dbPath);
        _database.CreateTableAsync<Todo>().Wait();
    }

    public async Task<List<Todo>> GetTodosAsync()
    {
        return await _database.Table<Todo>()
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();
    }

    public async Task<int> AddTodoAsync(Todo todo)
    {
        return await _database.InsertAsync(todo);
    }

    public async Task<int> UpdateTodoAsync(Todo todo)
    {
        return await _database.UpdateAsync(todo);
    }

    public async Task<int> DeleteTodoAsync(Todo todo)
    {
        return await _database.DeleteAsync(todo);
    }
}
