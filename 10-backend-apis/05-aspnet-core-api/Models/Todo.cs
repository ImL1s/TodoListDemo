using System.ComponentModel.DataAnnotations;

namespace TodoApi.Models;

/// <summary>
/// Represents a Todo item entity
/// </summary>
public class Todo
{
    /// <summary>
    /// Unique identifier for the todo item
    /// </summary>
    [Key]
    public int Id { get; set; }

    /// <summary>
    /// The todo item text content
    /// </summary>
    [Required]
    [MaxLength(500)]
    public string Text { get; set; } = string.Empty;

    /// <summary>
    /// Indicates whether the todo item is completed
    /// </summary>
    public bool IsCompleted { get; set; }

    /// <summary>
    /// The date and time when the todo item was created
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
