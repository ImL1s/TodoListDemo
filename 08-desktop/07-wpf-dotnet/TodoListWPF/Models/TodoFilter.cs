namespace TodoListWPF.Models;

/// <summary>
/// Enumeration representing different filter options for displaying todos.
/// </summary>
public enum TodoFilter
{
    /// <summary>
    /// Show all todos regardless of completion status.
    /// </summary>
    All,

    /// <summary>
    /// Show only active (not completed) todos.
    /// </summary>
    Active,

    /// <summary>
    /// Show only completed todos.
    /// </summary>
    Completed
}

/// <summary>
/// Sort options for todo items.
/// </summary>
public enum TodoSortOption
{
    /// <summary>
    /// Sort by creation date (newest first).
    /// </summary>
    CreatedDateDesc,

    /// <summary>
    /// Sort by creation date (oldest first).
    /// </summary>
    CreatedDateAsc,

    /// <summary>
    /// Sort by title alphabetically.
    /// </summary>
    TitleAsc,

    /// <summary>
    /// Sort by priority (highest first).
    /// </summary>
    PriorityDesc,

    /// <summary>
    /// Sort by completion status (active first).
    /// </summary>
    CompletionStatus
}
