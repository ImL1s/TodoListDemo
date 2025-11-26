const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// In-memory todo storage
let todos = [
  { id: uuidv4(), text: 'Learn htmx basics', completed: false, createdAt: new Date() },
  { id: uuidv4(), text: 'Build a hypermedia-driven app', completed: false, createdAt: new Date() },
  { id: uuidv4(), text: 'Embrace HATEOAS', completed: true, createdAt: new Date() }
];

// Helper function to generate todo item HTML
function generateTodoHTML(todo) {
  return `
    <li class="todo-item ${todo.completed ? 'completed' : ''}" id="todo-${todo.id}">
      <div class="todo-content">
        <input
          type="checkbox"
          ${todo.completed ? 'checked' : ''}
          hx-post="/todos/${todo.id}/toggle"
          hx-target="#todo-${todo.id}"
          hx-swap="outerHTML"
          class="todo-checkbox"
        >
        <span class="todo-text">${escapeHtml(todo.text)}</span>
        <button
          class="delete-btn"
          hx-delete="/todos/${todo.id}"
          hx-target="#todo-${todo.id}"
          hx-swap="outerHTML swap:1s"
          hx-confirm="Are you sure you want to delete this todo?"
        >
          Delete
        </button>
      </div>
    </li>
  `;
}

// Helper function to escape HTML
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Helper function to generate filter tabs HTML with active state
function generateFilterTabsHTML(activeFilter) {
  return `
    <div id="filter-tabs" class="filter-tabs" hx-swap-oob="true">
      <button
        class="filter-tab ${activeFilter === 'all' ? 'active' : ''}"
        hx-get="/todos?filter=all"
        hx-target="#todo-list"
        hx-swap="innerHTML"
        hx-trigger="click"
      >
        All
      </button>
      <button
        class="filter-tab ${activeFilter === 'active' ? 'active' : ''}"
        hx-get="/todos?filter=active"
        hx-target="#todo-list"
        hx-swap="innerHTML"
        hx-trigger="click"
      >
        Active
      </button>
      <button
        class="filter-tab ${activeFilter === 'completed' ? 'active' : ''}"
        hx-get="/todos?filter=completed"
        hx-target="#todo-list"
        hx-swap="innerHTML"
        hx-trigger="click"
      >
        Completed
      </button>
    </div>
  `;
}

// Routes

// Get all todos (returns HTML list items)
app.get('/todos', (req, res) => {
  const filter = req.query.filter || 'all';
  let filteredTodos = todos;

  if (filter === 'active') {
    filteredTodos = todos.filter(t => !t.completed);
  } else if (filter === 'completed') {
    filteredTodos = todos.filter(t => t.completed);
  }

  const todosHtml = filteredTodos.map(todo => generateTodoHTML(todo)).join('');

  // Include filter tabs with out-of-band swap to update active state
  // This demonstrates server-driven UI state management
  const filterTabsHtml = generateFilterTabsHTML(filter);

  res.send(todosHtml + filterTabsHtml);
});

// Create a new todo
app.post('/todos', (req, res) => {
  const text = req.body.text?.trim();

  if (!text) {
    res.status(400).send('<div class="error">Todo text cannot be empty</div>');
    return;
  }

  const newTodo = {
    id: uuidv4(),
    text: text,
    completed: false,
    createdAt: new Date()
  };

  todos.unshift(newTodo);

  // Return the new todo item HTML
  // Note: Form reset is handled by hx-on::after-request in the HTML
  res.setHeader('HX-Trigger', 'todoUpdate');
  res.send(generateTodoHTML(newTodo));
});

// Toggle todo completion
app.post('/todos/:id/toggle', (req, res) => {
  const todo = todos.find(t => t.id === req.params.id);

  if (!todo) {
    res.status(404).send('');
    return;
  }

  todo.completed = !todo.completed;

  // Trigger stats update via HX-Trigger header
  res.setHeader('HX-Trigger', 'todoUpdate');
  res.send(generateTodoHTML(todo));
});

// Delete a todo
app.delete('/todos/:id', (req, res) => {
  const index = todos.findIndex(t => t.id === req.params.id);

  if (index === -1) {
    res.status(404).send('');
    return;
  }

  todos.splice(index, 1);

  // Trigger stats update via HX-Trigger header
  // Return empty response - htmx will swap out the element
  res.setHeader('HX-Trigger', 'todoUpdate');
  res.send('');
});

// Clear completed todos
app.post('/todos/clear-completed', (req, res) => {
  todos = todos.filter(t => !t.completed);

  // Trigger stats update via HX-Trigger header
  // Return all remaining todos
  res.setHeader('HX-Trigger', 'todoUpdate');
  const html = todos.map(todo => generateTodoHTML(todo)).join('');
  res.send(html);
});

// Get stats (returns HTML fragment)
app.get('/todos/stats', (req, res) => {
  const total = todos.length;
  const active = todos.filter(t => !t.completed).length;
  const completed = todos.filter(t => t.completed).length;

  const html = `
    <div class="stats">
      <span class="stat-item">Total: <strong>${total}</strong></span>
      <span class="stat-item">Active: <strong>${active}</strong></span>
      <span class="stat-item">Completed: <strong>${completed}</strong></span>
    </div>
  `;

  res.send(html);
});

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 htmx Todo List server is running!`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`\n✨ Features:`);
  console.log(`   - Hypermedia-driven architecture`);
  console.log(`   - Zero frontend JavaScript`);
  console.log(`   - HATEOAS principles`);
  console.log(`   - Progressive enhancement\n`);
});
