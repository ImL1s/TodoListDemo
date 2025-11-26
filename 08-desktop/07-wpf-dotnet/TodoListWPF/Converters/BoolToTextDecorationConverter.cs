using System;
using System.Globalization;
using System.Windows;
using System.Windows.Data;

namespace TodoListWPF.Converters;

/// <summary>
/// Converts boolean to TextDecoration for strikethrough effect on completed todos.
/// </summary>
public class BoolToTextDecorationConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
    {
        if (value is bool isCompleted && isCompleted)
        {
            return TextDecorations.Strikethrough;
        }
        return null!;
    }

    public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
    {
        throw new NotImplementedException();
    }
}
