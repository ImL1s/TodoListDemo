using SQLite;

namespace TodoAvalonia.Models;

[Table("todos")]
public class Todo
{
    [PrimaryKey, AutoIncrement]
    public int Id { get; set; }

    public string Text { get; set; } = string.Empty;

    public bool IsCompleted { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
