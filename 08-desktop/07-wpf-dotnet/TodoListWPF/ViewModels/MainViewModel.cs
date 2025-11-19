using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Data;
using TodoListWPF.Models;
using TodoListWPF.Services;

namespace TodoListWPF.ViewModels;

/// <summary>
/// Main ViewModel for the Todo List application.
/// Demonstrates MVVM pattern with CommunityToolkit.Mvvm.
/// </summary>
public partial class MainViewModel : ObservableObject
{
    private readonly ITodoService _todoService;
    private readonly IStorageService _storageService;

    #region Observable Properties

    /// <summary>
    /// Collection of all todo items (source collection).
    /// </summary>
    [ObservableProperty]
    private ObservableCollection<TodoItem> _allTodos = new();

    /// <summary>
    /// Filtered view of todos based on current filter.
    /// </summary>
    public ICollectionView FilteredTodos { get; }

    /// <summary>
    /// Title for new todo being created.
    /// </summary>
    [ObservableProperty]
    [NotifyCanExecuteChangedFor(nameof(AddTodoCommand))]
    private string _newTodoTitle = string.Empty;

    /// <summary>
    /// Description for new todo being created.
    /// </summary>
    [ObservableProperty]
    private string _newTodoDescription = string.Empty;

    /// <summary>
    /// Priority for new todo being created.
    /// </summary>
    [ObservableProperty]
    private TodoPriority _newTodoPriority = TodoPriority.Normal;

    /// <summary>
    /// Current filter selection (All/Active/Completed).
    /// </summary>
    [ObservableProperty]
    private TodoFilter _currentFilter = TodoFilter.All;

    /// <summary>
    /// Current sort option.
    /// </summary>
    [ObservableProperty]
    private TodoSortOption _currentSortOption = TodoSortOption.CreatedDateDesc;

    /// <summary>
    /// Whether dark theme is enabled.
    /// </summary>
    [ObservableProperty]
    private bool _isDarkTheme;

    /// <summary>
    /// Search/filter text.
    /// </summary>
    [ObservableProperty]
    private string _searchText = string.Empty;

    /// <summary>
    /// Application settings.
    /// </summary>
    [ObservableProperty]
    private AppSettings _settings = new();

    /// <summary>
    /// Loading state indicator.
    /// </summary>
    [ObservableProperty]
    private bool _isLoading;

    #endregion

    #region Computed Properties

    /// <summary>
    /// Total number of todos.
    /// </summary>
    public int TotalCount => AllTodos.Count;

    /// <summary>
    /// Number of active (incomplete) todos.
    /// </summary>
    public int ActiveCount => AllTodos.Count(t => !t.IsCompleted);

    /// <summary>
    /// Number of completed todos.
    /// </summary>
    public int CompletedCount => AllTodos.Count(t => t.IsCompleted);

    /// <summary>
    /// Whether there are any completed todos (for "Clear Completed" button).
    /// </summary>
    public bool HasCompletedTodos => CompletedCount > 0;

    #endregion

    public MainViewModel(ITodoService todoService, IStorageService storageService)
    {
        _todoService = todoService;
        _storageService = storageService;

        // Setup filtered collection view
        FilteredTodos = CollectionViewSource.GetDefaultView(AllTodos);
        FilteredTodos.Filter = FilterTodos;
        FilteredTodos.SortDescriptions.Add(new SortDescription(nameof(TodoItem.CreatedAt), ListSortDirection.Descending));

        // Subscribe to collection changes to update counts
        AllTodos.CollectionChanged += (s, e) => UpdateCounts();
    }

    #region Initialization

    /// <summary>
    /// Initializes the ViewModel by loading data and settings.
    /// </summary>
    public async Task InitializeAsync()
    {
        IsLoading = true;
        try
        {
            // Load settings
            Settings = await _storageService.LoadSettingsAsync();
            IsDarkTheme = Settings.IsDarkTheme;
            CurrentFilter = Settings.CurrentFilter;
            CurrentSortOption = Settings.CurrentSortOption;

            // Load todos
            await _todoService.LoadAsync();
            var todos = await _todoService.GetAllAsync();

            AllTodos.Clear();
            foreach (var todo in todos)
            {
                AllTodos.Add(todo);
            }

            UpdateCounts();
        }
        finally
        {
            IsLoading = false;
        }
    }

    #endregion

    #region Commands

    /// <summary>
    /// Command to add a new todo.
    /// </summary>
    [RelayCommand(CanExecute = nameof(CanAddTodo))]
    private async Task AddTodoAsync()
    {
        var newTodo = new TodoItem
        {
            Title = NewTodoTitle.Trim(),
            Description = NewTodoDescription.Trim(),
            Priority = NewTodoPriority,
            CreatedAt = DateTime.Now
        };

        await _todoService.AddAsync(newTodo);
        AllTodos.Add(newTodo);

        // Clear input fields
        NewTodoTitle = string.Empty;
        NewTodoDescription = string.Empty;
        NewTodoPriority = TodoPriority.Normal;

        UpdateCounts();
    }

    private bool CanAddTodo() => !string.IsNullOrWhiteSpace(NewTodoTitle);

    /// <summary>
    /// Command to delete a specific todo.
    /// </summary>
    [RelayCommand]
    private async Task DeleteTodoAsync(TodoItem? item)
    {
        if (item == null) return;

        await _todoService.DeleteAsync(item.Id);
        AllTodos.Remove(item);
        UpdateCounts();
    }

    /// <summary>
    /// Command to toggle todo completion status.
    /// </summary>
    [RelayCommand]
    private async Task ToggleTodoAsync(TodoItem? item)
    {
        if (item == null) return;

        item.IsCompleted = !item.IsCompleted;
        await _todoService.UpdateAsync(item);
        UpdateCounts();
        FilteredTodos.Refresh();
    }

    /// <summary>
    /// Command to delete all completed todos.
    /// </summary>
    [RelayCommand]
    private async Task ClearCompletedAsync()
    {
        await _todoService.DeleteCompletedAsync();

        var completedItems = AllTodos.Where(t => t.IsCompleted).ToList();
        foreach (var item in completedItems)
        {
            AllTodos.Remove(item);
        }

        UpdateCounts();
    }

    /// <summary>
    /// Command to toggle between light and dark themes.
    /// </summary>
    [RelayCommand]
    private async Task ToggleThemeAsync()
    {
        IsDarkTheme = !IsDarkTheme;
        Settings.IsDarkTheme = IsDarkTheme;
        await _storageService.SaveSettingsAsync(Settings);
    }

    /// <summary>
    /// Command to edit a todo (opens edit dialog or inline editing).
    /// </summary>
    [RelayCommand]
    private void EditTodo(TodoItem? item)
    {
        if (item == null) return;
        // Implementation would open an edit dialog or enable inline editing
        // For simplicity, this is left as a placeholder
    }

    #endregion

    #region Filter and Search

    /// <summary>
    /// Called when CurrentFilter changes to refresh the filtered view.
    /// </summary>
    partial void OnCurrentFilterChanged(TodoFilter value)
    {
        FilteredTodos.Refresh();
        Settings.CurrentFilter = value;
        _ = _storageService.SaveSettingsAsync(Settings);
    }

    /// <summary>
    /// Called when CurrentSortOption changes to update sorting.
    /// </summary>
    partial void OnCurrentSortOptionChanged(TodoSortOption value)
    {
        UpdateSorting();
        Settings.CurrentSortOption = value;
        _ = _storageService.SaveSettingsAsync(Settings);
    }

    /// <summary>
    /// Called when SearchText changes to refresh filter.
    /// </summary>
    partial void OnSearchTextChanged(string value)
    {
        FilteredTodos.Refresh();
    }

    /// <summary>
    /// Filter predicate for the collection view.
    /// </summary>
    private bool FilterTodos(object obj)
    {
        if (obj is not TodoItem todo) return false;

        // Apply completion status filter
        var matchesFilter = CurrentFilter switch
        {
            TodoFilter.Active => !todo.IsCompleted,
            TodoFilter.Completed => todo.IsCompleted,
            _ => true
        };

        if (!matchesFilter) return false;

        // Apply search text filter
        if (!string.IsNullOrWhiteSpace(SearchText))
        {
            var searchLower = SearchText.ToLower();
            return todo.Title.ToLower().Contains(searchLower) ||
                   todo.Description.ToLower().Contains(searchLower) ||
                   todo.Category.ToLower().Contains(searchLower);
        }

        return true;
    }

    /// <summary>
    /// Updates the sorting of the filtered view.
    /// </summary>
    private void UpdateSorting()
    {
        FilteredTodos.SortDescriptions.Clear();

        switch (CurrentSortOption)
        {
            case TodoSortOption.CreatedDateDesc:
                FilteredTodos.SortDescriptions.Add(new SortDescription(nameof(TodoItem.CreatedAt), ListSortDirection.Descending));
                break;
            case TodoSortOption.CreatedDateAsc:
                FilteredTodos.SortDescriptions.Add(new SortDescription(nameof(TodoItem.CreatedAt), ListSortDirection.Ascending));
                break;
            case TodoSortOption.TitleAsc:
                FilteredTodos.SortDescriptions.Add(new SortDescription(nameof(TodoItem.Title), ListSortDirection.Ascending));
                break;
            case TodoSortOption.PriorityDesc:
                FilteredTodos.SortDescriptions.Add(new SortDescription(nameof(TodoItem.Priority), ListSortDirection.Descending));
                break;
            case TodoSortOption.CompletionStatus:
                FilteredTodos.SortDescriptions.Add(new SortDescription(nameof(TodoItem.IsCompleted), ListSortDirection.Ascending));
                break;
        }
    }

    #endregion

    #region Helper Methods

    /// <summary>
    /// Updates all computed count properties.
    /// </summary>
    private void UpdateCounts()
    {
        OnPropertyChanged(nameof(TotalCount));
        OnPropertyChanged(nameof(ActiveCount));
        OnPropertyChanged(nameof(CompletedCount));
        OnPropertyChanged(nameof(HasCompletedTodos));
    }

    /// <summary>
    /// Saves current application state before closing.
    /// </summary>
    public async Task SaveStateAsync()
    {
        await _storageService.SaveSettingsAsync(Settings);
        await _todoService.SaveAsync();
    }

    #endregion
}
