namespace TodoBlazorWasm.Models;

/// <summary>
/// Represents a Todo item
/// </summary>
public class Todo
{
    /// <summary>
    /// Unique identifier for the todo item
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// The todo item text content
    /// </summary>
    public string Text { get; set; } = string.Empty;

    /// <summary>
    /// Indicates whether the todo item is completed
    /// </summary>
    public bool IsCompleted { get; set; }

    /// <summary>
    /// The date and time when the todo item was created
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.Now;
}
