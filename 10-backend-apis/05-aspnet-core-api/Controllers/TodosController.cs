using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Data;
using TodoApi.Models;

namespace TodoApi.Controllers;

/// <summary>
/// REST API Controller for managing Todo items
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class TodosController : ControllerBase
{
    private readonly TodoContext _context;
    private readonly ILogger<TodosController> _logger;

    public TodosController(TodoContext context, ILogger<TodosController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get all todo items
    /// </summary>
    /// <returns>List of all todo items</returns>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<Todo>>> GetTodos()
    {
        _logger.LogInformation("Getting all todos");
        return await _context.Todos
            .OrderBy(t => t.CreatedAt)
            .ToListAsync();
    }

    /// <summary>
    /// Get a specific todo item by ID
    /// </summary>
    /// <param name="id">Todo item ID</param>
    /// <returns>The requested todo item</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Todo>> GetTodo(int id)
    {
        _logger.LogInformation("Getting todo with ID: {Id}", id);
        var todo = await _context.Todos.FindAsync(id);

        if (todo == null)
        {
            _logger.LogWarning("Todo with ID {Id} not found", id);
            return NotFound();
        }

        return todo;
    }

    /// <summary>
    /// Create a new todo item
    /// </summary>
    /// <param name="todo">Todo item to create</param>
    /// <returns>The created todo item</returns>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<Todo>> CreateTodo(Todo todo)
    {
        if (string.IsNullOrWhiteSpace(todo.Text))
        {
            return BadRequest("Todo text cannot be empty");
        }

        todo.CreatedAt = DateTime.UtcNow;
        _context.Todos.Add(todo);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Created todo with ID: {Id}", todo.Id);
        return CreatedAtAction(nameof(GetTodo), new { id = todo.Id }, todo);
    }

    /// <summary>
    /// Update an existing todo item
    /// </summary>
    /// <param name="id">Todo item ID</param>
    /// <param name="todo">Updated todo data</param>
    /// <returns>No content on success</returns>
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateTodo(int id, Todo todo)
    {
        if (id != todo.Id)
        {
            return BadRequest("ID mismatch");
        }

        if (string.IsNullOrWhiteSpace(todo.Text))
        {
            return BadRequest("Todo text cannot be empty");
        }

        var existingTodo = await _context.Todos.FindAsync(id);
        if (existingTodo == null)
        {
            _logger.LogWarning("Todo with ID {Id} not found", id);
            return NotFound();
        }

        existingTodo.Text = todo.Text;
        existingTodo.IsCompleted = todo.IsCompleted;

        try
        {
            await _context.SaveChangesAsync();
            _logger.LogInformation("Updated todo with ID: {Id}", id);
        }
        catch (DbUpdateConcurrencyException)
        {
            _logger.LogError("Concurrency error updating todo with ID: {Id}", id);
            throw;
        }

        return NoContent();
    }

    /// <summary>
    /// Delete a todo item
    /// </summary>
    /// <param name="id">Todo item ID</param>
    /// <returns>No content on success</returns>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteTodo(int id)
    {
        var todo = await _context.Todos.FindAsync(id);
        if (todo == null)
        {
            _logger.LogWarning("Todo with ID {Id} not found", id);
            return NotFound();
        }

        _context.Todos.Remove(todo);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Deleted todo with ID: {Id}", id);
        return NoContent();
    }
}
