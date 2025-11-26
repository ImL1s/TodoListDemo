using System;
using System.Globalization;
using System.Windows;
using System.Windows.Data;

namespace TodoListWPF.Converters;

/// <summary>
/// Converts boolean values to Visibility enumeration.
/// True = Visible, False = Collapsed (or Hidden based on parameter).
/// </summary>
public class BoolToVisibilityConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
    {
        if (value is not bool boolValue)
            return Visibility.Collapsed;

        // Check if parameter indicates to use Hidden instead of Collapsed
        var useHidden = parameter is string param && param.Equals("Hidden", StringComparison.OrdinalIgnoreCase);
        var invisibleState = useHidden ? Visibility.Hidden : Visibility.Collapsed;

        return boolValue ? Visibility.Visible : invisibleState;
    }

    public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
    {
        if (value is not Visibility visibility)
            return false;

        return visibility == Visibility.Visible;
    }
}
