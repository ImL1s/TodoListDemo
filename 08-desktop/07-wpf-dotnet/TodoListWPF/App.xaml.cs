using System;
using System.Windows;
using TodoListWPF.Services;
using TodoListWPF.ViewModels;

namespace TodoListWPF;

/// <summary>
/// Interaction logic for App.xaml
/// </summary>
public partial class App : Application
{
    private IStorageService? _storageService;
    private ITodoService? _todoService;
    private MainViewModel? _mainViewModel;

    protected override async void OnStartup(StartupEventArgs e)
    {
        base.OnStartup(e);

        // Initialize services
        _storageService = new JsonStorageService();
        _todoService = new TodoService(_storageService);

        // Initialize ViewModel
        _mainViewModel = new MainViewModel(_todoService, _storageService);
        await _mainViewModel.InitializeAsync();

        // Create and show main window
        var mainWindow = new MainWindow
        {
            DataContext = _mainViewModel
        };

        // Apply theme based on settings
        ApplyTheme(_mainViewModel.IsDarkTheme);

        // Subscribe to theme changes
        _mainViewModel.PropertyChanged += (s, e) =>
        {
            if (e.PropertyName == nameof(MainViewModel.IsDarkTheme))
            {
                ApplyTheme(_mainViewModel.IsDarkTheme);
            }
        };

        mainWindow.Show();
    }

    protected override async void OnExit(ExitEventArgs e)
    {
        // Save state before exiting
        if (_mainViewModel != null)
        {
            await _mainViewModel.SaveStateAsync();
        }

        base.OnExit(e);
    }

    /// <summary>
    /// Applies the specified theme to the application.
    /// </summary>
    private void ApplyTheme(bool isDarkTheme)
    {
        var themeDictionary = Resources.MergedDictionaries[0];
        themeDictionary.Source = new Uri(
            isDarkTheme ? "Styles/DarkTheme.xaml" : "Styles/LightTheme.xaml",
            UriKind.Relative
        );
    }
}
