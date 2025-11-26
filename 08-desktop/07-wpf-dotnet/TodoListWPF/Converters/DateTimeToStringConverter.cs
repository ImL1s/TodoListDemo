using System;
using System.Globalization;
using System.Windows.Data;

namespace TodoListWPF.Converters;

/// <summary>
/// Converts DateTime to a formatted string.
/// Supports custom format via converter parameter.
/// </summary>
public class DateTimeToStringConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
    {
        if (value is not DateTime dateTime)
            return string.Empty;

        var format = parameter as string ?? "g"; // Default to short date/time pattern
        return dateTime.ToString(format, culture);
    }

    public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
    {
        if (value is string dateString && DateTime.TryParse(dateString, culture, DateTimeStyles.None, out var result))
        {
            return result;
        }
        return DateTime.Now;
    }
}
