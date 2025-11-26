using System;
using System.Globalization;
using System.Windows.Data;
using System.Windows.Media;
using TodoListWPF.Models;

namespace TodoListWPF.Converters;

/// <summary>
/// Converts TodoPriority enum to a corresponding color brush.
/// </summary>
public class PriorityToColorConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
    {
        if (value is not TodoPriority priority)
            return new SolidColorBrush(Colors.Gray);

        return priority switch
        {
            TodoPriority.Urgent => new SolidColorBrush(Color.FromRgb(220, 38, 38)),   // Red-600
            TodoPriority.High => new SolidColorBrush(Color.FromRgb(234, 88, 12)),     // Orange-600
            TodoPriority.Normal => new SolidColorBrush(Color.FromRgb(37, 99, 235)),   // Blue-600
            TodoPriority.Low => new SolidColorBrush(Color.FromRgb(107, 114, 128)),    // Gray-500
            _ => new SolidColorBrush(Colors.Gray)
        };
    }

    public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
    {
        throw new NotImplementedException();
    }
}
