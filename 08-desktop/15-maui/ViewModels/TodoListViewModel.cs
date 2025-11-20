using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System.Collections.ObjectModel;
using TodoMaui.Models;
using TodoMaui.Services;

namespace TodoMaui.ViewModels;

public partial class TodoListViewModel : ObservableObject
{
    private readonly TodoService _todoService;

    [ObservableProperty]
    private string _newTodoText = string.Empty;

    public ObservableCollection<Todo> Todos { get; } = new();

    public TodoListViewModel(TodoService todoService)
    {
        _todoService = todoService;
    }

    public async Task InitializeAsync()
    {
        await LoadTodosAsync();
    }

    [RelayCommand]
    private async Task LoadTodosAsync()
    {
        var todos = await _todoService.GetTodosAsync();
        Todos.Clear();
        foreach (var todo in todos)
        {
            Todos.Add(todo);
        }
    }

    [RelayCommand]
    private async Task AddTodoAsync()
    {
        if (string.IsNullOrWhiteSpace(NewTodoText))
            return;

        var todo = new Todo
        {
            Text = NewTodoText,
            IsCompleted = false,
            CreatedAt = DateTime.UtcNow
        };

        await _todoService.AddTodoAsync(todo);
        Todos.Insert(0, todo);
        NewTodoText = string.Empty;
    }

    [RelayCommand]
    private async Task ToggleTodoAsync(Todo todo)
    {
        todo.IsCompleted = !todo.IsCompleted;
        await _todoService.UpdateTodoAsync(todo);
    }

    [RelayCommand]
    private async Task DeleteTodoAsync(Todo todo)
    {
        await _todoService.DeleteTodoAsync(todo);
        Todos.Remove(todo);
    }
}
