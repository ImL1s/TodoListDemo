using Microsoft.Extensions.Logging;
using TodoMaui.Services;
using TodoMaui.ViewModels;
using TodoMaui.Views;

namespace TodoMaui;

public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
        builder
            .UseMauiApp<App>()
            .ConfigureFonts(fonts =>
            {
                fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
            });

#if DEBUG
        builder.Logging.AddDebug();
#endif

        // Register Services
        string dbPath = Path.Combine(FileSystem.AppDataDirectory, "todos.db");
        builder.Services.AddSingleton(new TodoService(dbPath));

        // Register ViewModels
        builder.Services.AddTransient<TodoListViewModel>();

        // Register Views
        builder.Services.AddTransient<TodoListPage>();

        return builder.Build();
    }
}
