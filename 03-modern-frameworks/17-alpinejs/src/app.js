/**
 * Alpine.js Todo List - Modular Version
 *
 * This file demonstrates how to organize Alpine.js code
 * in a more modular way for larger applications.
 *
 * Usage with npm/bundler:
 * import Alpine from 'alpinejs'
 * import './app.js'
 * Alpine.start()
 */

// ============================================================================
// STORE: Global State Management
// ============================================================================

/**
 * Todo Store - Centralized state management
 *
 * Alpine.store provides a global reactive state that can be accessed
 * from any component using $store.todos
 */
export const todoStore = {
    items: [],
    filter: 'all',

    /**
     * Initialize store from localStorage
     */
    init() {
        const saved = localStorage.getItem('alpine-todos');
        if (saved) {
            try {
                this.items = JSON.parse(saved);
            } catch (e) {
                console.error('Failed to parse saved todos:', e);
                this.items = [];
            }
        }
    },

    /**
     * Add a new todo
     * @param {string} text - The todo text
     */
    add(text) {
        if (!text.trim()) return;

        this.items.push({
            id: Date.now(),
            text: text.trim(),
            completed: false,
            createdAt: new Date().toISOString()
        });

        this.save();
    },

    /**
     * Remove a todo by ID
     * @param {number} id - The todo ID
     */
    remove(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.save();
    },

    /**
     * Toggle todo completion status
     * @param {number} id - The todo ID
     */
    toggle(id) {
        const todo = this.items.find(item => item.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.save();
        }
    },

    /**
     * Update todo text
     * @param {number} id - The todo ID
     * @param {string} text - The new text
     */
    update(id, text) {
        const todo = this.items.find(item => item.id === id);
        if (todo && text.trim()) {
            todo.text = text.trim();
            this.save();
        }
    },

    /**
     * Clear all completed todos
     */
    clearCompleted() {
        this.items = this.items.filter(item => !item.completed);
        this.save();
    },

    /**
     * Toggle all todos to completed/uncompleted
     * @param {boolean} completed - Target completion state
     */
    toggleAll(completed) {
        this.items.forEach(item => {
            item.completed = completed;
        });
        this.save();
    },

    /**
     * Set the current filter
     * @param {string} filter - 'all', 'active', or 'completed'
     */
    setFilter(filter) {
        this.filter = filter;
    },

    /**
     * Get filtered todos based on current filter
     * @returns {Array} Filtered todo items
     */
    get filteredItems() {
        switch (this.filter) {
            case 'active':
                return this.items.filter(item => !item.completed);
            case 'completed':
                return this.items.filter(item => item.completed);
            default:
                return this.items;
        }
    },

    /**
     * Get count of active (uncompleted) todos
     * @returns {number}
     */
    get activeCount() {
        return this.items.filter(item => !item.completed).length;
    },

    /**
     * Get count of completed todos
     * @returns {number}
     */
    get completedCount() {
        return this.items.filter(item => item.completed).length;
    },

    /**
     * Get total count of todos
     * @returns {number}
     */
    get totalCount() {
        return this.items.length;
    },

    /**
     * Check if all todos are completed
     * @returns {boolean}
     */
    get allCompleted() {
        return this.items.length > 0 && this.items.every(item => item.completed);
    },

    /**
     * Save to localStorage
     */
    save() {
        localStorage.setItem('alpine-todos', JSON.stringify(this.items));
    }
};

// ============================================================================
// COMPONENT: Todo App
// ============================================================================

/**
 * Main Todo App Component
 *
 * This component handles the UI logic for the todo list.
 * It uses Alpine.data() to define reusable component logic.
 */
export const todoAppComponent = () => ({
    // Local state
    newTodo: '',
    editingId: null,
    editingText: '',

    /**
     * Component initialization
     * Called when the component is mounted
     */
    init() {
        // Example: Watch for changes in the store
        this.$watch('$store.todos.items', (value) => {
            console.log('Todos changed:', value.length);
        });

        // Focus input on mount
        this.$nextTick(() => {
            if (this.$refs.input) {
                this.$refs.input.focus();
            }
        });
    },

    /**
     * Add a new todo
     */
    addTodo() {
        if (this.newTodo.trim()) {
            this.$store.todos.add(this.newTodo);
            this.newTodo = '';
            this.$refs.input.focus();
        }
    },

    /**
     * Delete a todo
     * @param {number} id - The todo ID
     */
    deleteTodo(id) {
        if (confirm('Are you sure you want to delete this todo?')) {
            this.$store.todos.remove(id);
        }
    },

    /**
     * Start editing a todo
     * @param {number} id - The todo ID
     * @param {string} text - The current todo text
     */
    startEdit(id, text) {
        this.editingId = id;
        this.editingText = text;

        // Focus the edit input on next tick
        this.$nextTick(() => {
            const editInput = this.$refs['edit-' + id];
            if (editInput) {
                editInput.value = text;
                editInput.focus();
                editInput.select();
            }
        });
    },

    /**
     * Save the edited todo
     * @param {number} id - The todo ID
     */
    saveEdit(id) {
        if (this.editingId === id) {
            const editInput = this.$refs['edit-' + id];
            if (editInput && editInput.value.trim()) {
                this.$store.todos.update(id, editInput.value);
                this.cancelEdit();
            } else if (editInput && !editInput.value.trim()) {
                // Delete if empty
                this.$store.todos.remove(id);
                this.cancelEdit();
            }
        }
    },

    /**
     * Cancel editing
     */
    cancelEdit() {
        this.editingId = null;
        this.editingText = '';
    },

    /**
     * Toggle all todos
     */
    toggleAll() {
        this.$store.todos.toggleAll(!this.$store.todos.allCompleted);
    },

    /**
     * Computed property: completion percentage
     * @returns {string} Percentage string (e.g., "75%")
     */
    get completionPercentage() {
        if (this.$store.todos.totalCount === 0) return '0%';
        const percentage = Math.round(
            (this.$store.todos.completedCount / this.$store.todos.totalCount) * 100
        );
        return percentage + '%';
    },

    /**
     * Computed property: has any todos
     * @returns {boolean}
     */
    get hasTodos() {
        return this.$store.todos.totalCount > 0;
    },

    /**
     * Computed property: has completed todos
     * @returns {boolean}
     */
    get hasCompletedTodos() {
        return this.$store.todos.completedCount > 0;
    }
});

// ============================================================================
// INITIALIZATION (for module usage)
// ============================================================================

/**
 * Initialize Alpine.js stores and components
 * Call this function before Alpine.start()
 */
export function initializeApp() {
    // Register the todo store
    Alpine.store('todos', todoStore);

    // Register the todo app component
    Alpine.data('todoApp', todoAppComponent);

    // Initialize the store
    Alpine.store('todos').init();
}

// ============================================================================
// AUTO-INITIALIZATION (for CDN usage)
// ============================================================================

// If Alpine is available globally (CDN), auto-initialize
if (typeof Alpine !== 'undefined') {
    document.addEventListener('alpine:init', () => {
        initializeApp();
    });
}
