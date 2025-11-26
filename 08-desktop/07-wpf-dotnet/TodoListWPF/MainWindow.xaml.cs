using System.Windows;
using TodoListWPF.ViewModels;

namespace TodoListWPF;

/// <summary>
/// Interaction logic for MainWindow.xaml
/// </summary>
public partial class MainWindow : Window
{
    public MainWindow()
    {
        InitializeComponent();
    }

    protected override async void OnClosing(System.ComponentModel.CancelEventArgs e)
    {
        // Save window state
        if (DataContext is MainViewModel viewModel)
        {
            viewModel.Settings.WindowWidth = Width;
            viewModel.Settings.WindowHeight = Height;
            viewModel.Settings.WindowLeft = Left;
            viewModel.Settings.WindowTop = Top;
            viewModel.Settings.IsMaximized = WindowState == WindowState.Maximized;

            await viewModel.SaveStateAsync();
        }

        base.OnClosing(e);
    }

    protected override void OnSourceInitialized(System.EventArgs e)
    {
        base.OnSourceInitialized(e);

        // Restore window state
        if (DataContext is MainViewModel viewModel)
        {
            Width = viewModel.Settings.WindowWidth;
            Height = viewModel.Settings.WindowHeight;
            Left = viewModel.Settings.WindowLeft;
            Top = viewModel.Settings.WindowTop;

            if (viewModel.Settings.IsMaximized)
            {
                WindowState = WindowState.Maximized;
            }
        }
    }
}
