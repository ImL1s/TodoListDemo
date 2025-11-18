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

  const html = filteredTodos.map(todo => generateTodoHTML(todo)).join('');
  res.send(html);
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

  // Return the new todo item HTML + clear the input field
  res.send(`
    ${generateTodoHTML(newTodo)}
    <script>document.getElementById('todo-input').value = '';</script>
  `);
});

// Toggle todo completion
app.post('/todos/:id/toggle', (req, res) => {
  const todo = todos.find(t => t.id === req.params.id);

  if (!todo) {
    res.status(404).send('');
    return;
  }

  todo.completed = !todo.completed;
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

  // Return empty response - htmx will swap out the element
  res.send('');
});

// Clear completed todos
app.post('/todos/clear-completed', (req, res) => {
  todos = todos.filter(t => !t.completed);

  // Return all remaining todos
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
