using Moq;
using TodoListWPF.Models;
using TodoListWPF.Services;
using TodoListWPF.ViewModels;
using Xunit;

namespace TodoListWPF.Tests;

public class MainViewModelTests
{
    private readonly Mock<ITodoService> _mockTodoService;
    private readonly Mock<IStorageService> _mockStorageService;
    private readonly MainViewModel _viewModel;

    public MainViewModelTests()
    {
        _mockTodoService = new Mock<ITodoService>();
        _mockStorageService = new Mock<IStorageService>();
        _viewModel = new MainViewModel(_mockTodoService.Object, _mockStorageService.Object);
    }

    [Fact]
    public async Task AddTodoAsync_WithValidTitle_AddsTodoToCollection()
    {
        // Arrange
        _viewModel.NewTodoTitle = "Test Todo";

        // Act
        await _viewModel.AddTodoCommand.ExecuteAsync(null);

        // Assert
        Assert.Single(_viewModel.AllTodos);
        Assert.Equal("Test Todo", _viewModel.AllTodos[0].Title);
        _mockTodoService.Verify(s => s.AddAsync(It.IsAny<TodoItem>()), Times.Once);
    }

    [Fact]
    public async Task AddTodoAsync_WithEmptyTitle_DoesNotAddTodo()
    {
        // Arrange
        _viewModel.NewTodoTitle = "";

        // Act
        var canExecute = _viewModel.AddTodoCommand.CanExecute(null);

        // Assert
        Assert.False(canExecute);
        Assert.Empty(_viewModel.AllTodos);
    }

    [Fact]
    public async Task DeleteTodoAsync_RemovesTodo()
    {
        // Arrange
        var todo = new TodoItem { Title = "Test Todo" };
        _viewModel.AllTodos.Add(todo);

        // Act
        await _viewModel.DeleteTodoCommand.ExecuteAsync(todo);

        // Assert
        Assert.Empty(_viewModel.AllTodos);
        _mockTodoService.Verify(s => s.DeleteAsync(todo.Id), Times.Once);
    }

    [Fact]
    public async Task ToggleTodoAsync_TogglesCompletionStatus()
    {
        // Arrange
        var todo = new TodoItem { Title = "Test Todo", IsCompleted = false };
        _viewModel.AllTodos.Add(todo);

        // Act
        await _viewModel.ToggleTodoCommand.ExecuteAsync(todo);

        // Assert
        Assert.True(todo.IsCompleted);
        _mockTodoService.Verify(s => s.UpdateAsync(todo), Times.Once);
    }

    [Fact]
    public void CurrentFilter_Changed_RefreshesFilteredView()
    {
        // Arrange
        _viewModel.AllTodos.Add(new TodoItem { Title = "Active", IsCompleted = false });
        _viewModel.AllTodos.Add(new TodoItem { Title = "Completed", IsCompleted = true });

        // Act
        _viewModel.CurrentFilter = TodoFilter.Active;

        // Assert
        var filteredCount = 0;
        foreach (var item in _viewModel.FilteredTodos)
        {
            filteredCount++;
        }
        Assert.Equal(1, filteredCount);
    }

    [Fact]
    public void TotalCount_ReturnsCorrectCount()
    {
        // Arrange
        _viewModel.AllTodos.Add(new TodoItem { Title = "Todo 1" });
        _viewModel.AllTodos.Add(new TodoItem { Title = "Todo 2" });

        // Assert
        Assert.Equal(2, _viewModel.TotalCount);
    }

    [Fact]
    public void ActiveCount_ReturnsCorrectCount()
    {
        // Arrange
        _viewModel.AllTodos.Add(new TodoItem { Title = "Active 1", IsCompleted = false });
        _viewModel.AllTodos.Add(new TodoItem { Title = "Active 2", IsCompleted = false });
        _viewModel.AllTodos.Add(new TodoItem { Title = "Completed", IsCompleted = true });

        // Assert
        Assert.Equal(2, _viewModel.ActiveCount);
    }

    [Fact]
    public void CompletedCount_ReturnsCorrectCount()
    {
        // Arrange
        _viewModel.AllTodos.Add(new TodoItem { Title = "Active", IsCompleted = false });
        _viewModel.AllTodos.Add(new TodoItem { Title = "Completed 1", IsCompleted = true });
        _viewModel.AllTodos.Add(new TodoItem { Title = "Completed 2", IsCompleted = true });

        // Assert
        Assert.Equal(2, _viewModel.CompletedCount);
    }
}

public class TodoItemTests
{
    [Fact]
    public void IsCompleted_WhenSetToTrue_SetsCompletedAt()
    {
        // Arrange
        var todo = new TodoItem { Title = "Test" };

        // Act
        todo.IsCompleted = true;

        // Assert
        Assert.NotNull(todo.CompletedAt);
    }

    [Fact]
    public void IsCompleted_WhenSetToFalse_ClearsCompletedAt()
    {
        // Arrange
        var todo = new TodoItem { Title = "Test", IsCompleted = true };

        // Act
        todo.IsCompleted = false;

        // Assert
        Assert.Null(todo.CompletedAt);
    }

    [Fact]
    public void Clone_CreatesExactCopy()
    {
        // Arrange
        var original = new TodoItem
        {
            Title = "Test",
            Description = "Description",
            Priority = TodoPriority.High,
            IsCompleted = true
        };

        // Act
        var clone = original.Clone();

        // Assert
        Assert.Equal(original.Id, clone.Id);
        Assert.Equal(original.Title, clone.Title);
        Assert.Equal(original.Description, clone.Description);
        Assert.Equal(original.Priority, clone.Priority);
        Assert.Equal(original.IsCompleted, clone.IsCompleted);
    }
}
