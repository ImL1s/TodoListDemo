using System.Collections.ObjectModel;
using System.Reactive;
using ReactiveUI;
using TodoAvalonia.Models;
using TodoAvalonia.Services;

namespace TodoAvalonia.ViewModels;

public class MainWindowViewModel : ViewModelBase
{
    private readonly TodoService _todoService;
    private string _newTodoText = string.Empty;

    public MainWindowViewModel(TodoService todoService)
    {
        _todoService = todoService;

        // Initialize commands
        AddTodoCommand = ReactiveCommand.CreateFromTask(AddTodoAsync);
        ToggleTodoCommand = ReactiveCommand.CreateFromTask<Todo>(ToggleTodoAsync);
        DeleteTodoCommand = ReactiveCommand.CreateFromTask<Todo>(DeleteTodoAsync);
        LoadTodosCommand = ReactiveCommand.CreateFromTask(LoadTodosAsync);

        // Load todos on initialization
        LoadTodosCommand.Execute().Subscribe();
    }

    public ObservableCollection<Todo> Todos { get; } = new();

    public string NewTodoText
    {
        get => _newTodoText;
        set => this.RaiseAndSetIfChanged(ref _newTodoText, value);
    }

    public ReactiveCommand<Unit, Unit> AddTodoCommand { get; }
    public ReactiveCommand<Todo, Unit> ToggleTodoCommand { get; }
    public ReactiveCommand<Todo, Unit> DeleteTodoCommand { get; }
    public ReactiveCommand<Unit, Unit> LoadTodosCommand { get; }

    private async Task LoadTodosAsync()
    {
        var todos = await _todoService.GetTodosAsync();
        Todos.Clear();
        foreach (var todo in todos)
        {
            Todos.Add(todo);
        }
    }

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

    private async Task ToggleTodoAsync(Todo todo)
    {
        todo.IsCompleted = !todo.IsCompleted;
        await _todoService.UpdateTodoAsync(todo);

        // Force UI update
        var index = Todos.IndexOf(todo);
        if (index >= 0)
        {
            Todos.RemoveAt(index);
            Todos.Insert(index, todo);
        }
    }

    private async Task DeleteTodoAsync(Todo todo)
    {
        await _todoService.DeleteTodoAsync(todo);
        Todos.Remove(todo);
    }
}
