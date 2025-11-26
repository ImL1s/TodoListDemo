using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

namespace TodoApi.Data;

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
            new Todo { Id = 1, Text = "Learn ASP.NET Core", IsCompleted = true, CreatedAt = DateTime.UtcNow },
            new Todo { Id = 2, Text = "Build a Web API", IsCompleted = false, CreatedAt = DateTime.UtcNow },
            new Todo { Id = 3, Text = "Deploy to production", IsCompleted = false, CreatedAt = DateTime.UtcNow }
        );
    }
}
