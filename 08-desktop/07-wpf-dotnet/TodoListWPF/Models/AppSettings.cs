using CommunityToolkit.Mvvm.ComponentModel;

namespace TodoListWPF.Models;

/// <summary>
/// Application settings that persist between sessions.
/// </summary>
public partial class AppSettings : ObservableObject
{
    [ObservableProperty]
    private bool isDarkTheme;

    [ObservableProperty]
    private double windowWidth = 900;

    [ObservableProperty]
    private double windowHeight = 650;

    [ObservableProperty]
    private double windowLeft = 100;

    [ObservableProperty]
    private double windowTop = 100;

    [ObservableProperty]
    private bool isMaximized;

    [ObservableProperty]
    private TodoFilter currentFilter = TodoFilter.All;

    [ObservableProperty]
    private TodoSortOption currentSortOption = TodoSortOption.CreatedDateDesc;

    [ObservableProperty]
    private string lastSaveLocation = "todos.json";

    /// <summary>
    /// Creates default application settings.
    /// </summary>
    public AppSettings()
    {
        IsDarkTheme = false;
    }
}
