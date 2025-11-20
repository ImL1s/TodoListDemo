using Microsoft.EntityFrameworkCore;
using TodoBlazorServer.Models;

namespace TodoBlazorServer.Data;

/// <summary>
/// Database context for Todo items
/// </summary>
public class TodoContext : DbContext
{
    public TodoContext(DbContextOptions<TodoContext> options) : base(options)
    {
    }

    /// <summary>
    /// Todo items collection
    /// </summary>
    public DbSet<Todo> Todos { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Todo>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Text)
                .IsRequired()
                .HasMaxLength(500);
            entity.Property(e => e.IsCompleted)
                .HasDefaultValue(false);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("datetime('now')");
        });

        // Seed data
        modelBuilder.Entity<Todo>().HasData(
            new Todo { Id = 1, Text = "Welcome to Blazor Server!", IsCompleted = false, CreatedAt = DateTime.UtcNow },
            new Todo { Id = 2, Text = "Experience real-time updates with SignalR", IsCompleted = false, CreatedAt = DateTime.UtcNow },
            new Todo { Id = 3, Text = "Data persists in SQLite database", IsCompleted = true, CreatedAt = DateTime.UtcNow }
        );
    }
}
