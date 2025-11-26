# Ember.js Key Highlights - Code Examples

## 🎯 Convention over Configuration in Action

### 1. Automatic Template Pairing
No need to manually import or register templates!

```
app/
├── components/
│   └── todo-item.js          ← JavaScript
└── templates/
    └── components/
        └── todo-item.hbs      ← Automatically paired!
```

**Ember automatically finds and links the template. Zero configuration!**

### 2. Dependency Injection
Services are automatically available everywhere:

```javascript
// Define once in app/services/todo-storage.js
export default class TodoStorageService extends Service {
  @tracked todos = [];
}

// Use anywhere with @service decorator
export default class MyComponent extends Component {
  @service todoStorage;  // ← Automatically injected!
  
  get todos() {
    return this.todoStorage.todos;  // Works immediately!
  }
}
```

**No manual imports, no context providers, no prop drilling!**

### 3. Tracked Properties - Auto Reactivity
Ember tracks dependencies automatically:

```javascript
export default class TodoController extends Controller {
  @service todoStorage;  // Service with @tracked todos
  @tracked filter = 'all';
  
  // This getter automatically re-computes when:
  // - todoStorage.todos changes
  // - filter changes
  get filteredTodos() {
    const todos = this.todoStorage.todos;
    
    switch (this.filter) {
      case 'active': return todos.filter(t => !t.completed);
      case 'completed': return todos.filter(t => t.completed);
      default: return todos;
    }
  }
  
  get activeTodosCount() {
    // Also auto-updates when todos changes
    return this.todoStorage.todos.filter(t => !t.completed).length;
  }
}
```

**No useMemo, useCallback, or manual dependency arrays!**

### 4. Route-Driven Architecture
URLs drive your application state:

```javascript
// app/router.js
Router.map(function() {
  this.route('todos', function() {
    this.route('todo', { path: '/:todo_id' });
  });
});

// app/routes/todos/todo.js
export default class TodoRoute extends Route {
  @service todoStorage;
  
  // Ember calls this when URL changes
  model(params) {
    // params.todo_id comes from URL
    return this.todoStorage.findById(params.todo_id);
  }
}
```

**URL → Data → UI, automatically!**

### 5. Glimmer Components - Modern & Clean

```javascript
// app/components/todo-item.js
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class TodoItemComponent extends Component {
  @tracked isEditing = false;
  
  @action
  startEditing() {
    this.isEditing = true;
  }
  
  @action
  save() {
    this.args.onUpdate(this.args.todo, this.editText);
    this.isEditing = false;
  }
}
```

```handlebars
{{! app/templates/components/todo-item.hbs }}
<li class={{if @todo.completed "completed"}}>
  {{#if this.isEditing}}
    <input 
      value={{this.editText}} 
      {{on "blur" this.save}}
    />
  {{else}}
    <label {{on "dblclick" this.startEditing}}>
      {{@todo.text}}
    </label>
  {{/if}}
</li>
```

**Clean separation of logic and presentation!**

## 📊 Framework Comparison - Real Code

### Adding a Todo

#### React
```jsx
import { useState } from 'react';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  
  const addTodo = (text) => {
    setTodos([...todos, { id: Date.now(), text, completed: false }]);
    setNewTodo('');
    localStorage.setItem('todos', JSON.stringify([...todos, newTodo]));
  };
  
  return (
    <input 
      value={newTodo}
      onChange={e => setNewTodo(e.target.value)}
      onKeyDown={e => e.key === 'Enter' && addTodo(newTodo)}
    />
  );
}
```

#### Vue 3
```vue
<script setup>
import { ref } from 'vue';

const todos = ref([]);
const newTodo = ref('');

const addTodo = (text) => {
  todos.value.push({ id: Date.now(), text, completed: false });
  localStorage.setItem('todos', JSON.stringify(todos.value));
  newTodo.value = '';
};
</script>

<template>
  <input 
    v-model="newTodo"
    @keydown.enter="addTodo(newTodo)"
  />
</template>
```

#### Ember.js
```javascript
// app/services/todo-storage.js
export default class TodoStorageService extends Service {
  @tracked todos = new TrackedArray([]);
  
  addTodo(text) {
    this.todos.push({ id: Date.now(), text, completed: false });
    this.save();
  }
  
  save() {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }
}

// app/components/todo-input.js
export default class TodoInputComponent extends Component {
  @tracked newTodoText = '';
  @service todoStorage;
  
  @action
  handleSubmit(event) {
    event.preventDefault();
    this.todoStorage.addTodo(this.newTodoText);
    this.newTodoText = '';
  }
}
```

```handlebars
{{! app/templates/components/todo-input.hbs }}
<form {{on "submit" this.handleSubmit}}>
  <input 
    value={{this.newTodoText}}
    {{on "input" (fn (mut this.newTodoText) event.target.value)}}
  />
</form>
```

**Ember: Logic in Service (reusable), Component (focused), Template (clean)**

## 🌟 Why Convention over Configuration Wins

### Example: File Structure

#### React Project (Manual Setup)
```
src/
├── components/
│   ├── TodoItem.jsx
│   ├── TodoItem.css
│   └── TodoItem.test.jsx
├── hooks/
│   └── useTodos.js
├── contexts/
│   └── TodoContext.jsx
├── utils/
│   └── localStorage.js
└── App.jsx

// Need to manually:
- Import components
- Set up context providers
- Configure routing (if needed)
- Wire up state management
```

#### Ember Project (Convention-Based)
```
app/
├── components/
│   └── todo-item.js
├── templates/
│   └── components/
│       └── todo-item.hbs
├── services/
│   └── todo-storage.js
└── routes/
    └── application.js

// Ember automatically:
✓ Pairs templates with components
✓ Injects services where needed
✓ Sets up routing
✓ Configures build pipeline
```

**Result: Less boilerplate, more productivity!**

## 🚀 Advanced Patterns Made Easy

### 1. Loading States
```javascript
// app/routes/todos.js
export default class TodosRoute extends Route {
  model() {
    return fetch('/api/todos').then(r => r.json());
  }
}

// Ember automatically shows:
// - todos-loading.hbs while loading
// - todos-error.hbs on error
// - todos.hbs when loaded
```

### 2. Computed Properties
```javascript
export default class TodoController extends Controller {
  @service todoStorage;
  
  // Auto-updates when todos change
  get activeTodos() {
    return this.todoStorage.todos.filter(t => !t.completed);
  }
  
  // Chains automatically
  get hasActiveTodos() {
    return this.activeTodos.length > 0;
  }
}
```

### 3. Actions Bubbling
```handlebars
{{! Child component }}
<button {{on "click" (fn @onDelete @todo)}}>Delete</button>

{{! Parent template }}
<TodoItem @todo={{todo}} @onDelete={{this.deleteTodo}} />

{{! Grandparent template }}
<TodoList @todos={{this.todos}} @onDelete={{this.handleDelete}} />
```

**Actions flow up the component tree naturally!**

## 💡 Developer Experience Wins

### 1. Ember CLI Generators
```bash
ember generate component todo-item
# Creates:
# - app/components/todo-item.js
# - app/templates/components/todo-item.hbs
# - tests/integration/components/todo-item-test.js

ember generate service todo-storage
# Creates:
# - app/services/todo-storage.js
# - tests/unit/services/todo-storage-test.js
```

### 2. Live Reload
- Change any file
- Browser updates instantly
- No manual refresh needed

### 3. Ember Inspector
- View component tree
- Inspect routes
- Debug services
- Monitor performance

### 4. Strong Conventions
- New team members productive immediately
- Code reviews easier
- Refactoring safer
- Upgrades smoother

## 🏢 Enterprise Benefits

### 1. Stability
```
Ember 3.x → 4.x → 5.x
- Minimal breaking changes
- Clear upgrade paths
- Deprecation warnings
- LTS releases
```

### 2. Scalability
```
Small App:    3 components, 1 route
Medium App:   50 components, 10 routes
Large App:    500 components, 100 routes

Same patterns work at every scale!
```

### 3. Team Onboarding
```
Week 1: Learn Ember conventions
Week 2: Productive on real features
Week 3: Contributing independently

vs.

React/Vue:
Week 1-4: Learn library + ecosystem choices
Week 5-8: Learn team's specific patterns
Week 9+: Productive
```

## 🎯 Bottom Line

### Choose Ember When You Want:
✅ Convention over Configuration
✅ Stability and long-term support
✅ Batteries-included framework
✅ Strong team patterns
✅ Enterprise-grade architecture
✅ Less decision fatigue
✅ Faster onboarding

### Consider Alternatives When You Need:
❌ Maximum flexibility
❌ Smallest possible bundle
❌ Latest/experimental features
❌ Microservices architecture
❌ Gradual adoption in existing app

---

**Ember.js: Productive. Battle-tested. Ambitious.**

Built for developers who want to build applications, not configure tooling.
