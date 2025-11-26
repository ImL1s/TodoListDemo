module todo_list_addr::TodoList {
    use std::string::String;
    use std::vector;
    use aptos_framework::timestamp;
    use aptos_framework::account;
    use aptos_framework::event;
    use aptos_std::table::{Self, Table};

    /// Todo item structure
    struct Todo has store, drop, copy {
        id: u64,
        text: String,
        completed: bool,
        created_at: u64,
    }

    /// Main TodoList resource with O(1) lookup using Table
    struct TodoList has key {
        todos: Table<u64, Todo>,  // Changed from vector to Table for O(1) performance
        todo_counter: u64,
        create_todo_events: event::EventHandle<TodoCreatedEvent>,
        toggle_todo_events: event::EventHandle<TodoToggledEvent>,
        delete_todo_events: event::EventHandle<TodoDeletedEvent>,
    }

    /// Event emitted when a todo is created
    struct TodoCreatedEvent has drop, store {
        id: u64,
        text: String,
        created_at: u64,
    }

    /// Event emitted when a todo is toggled
    struct TodoToggledEvent has drop, store {
        id: u64,
        completed: bool,
    }

    /// Event emitted when a todo is deleted
    struct TodoDeletedEvent has drop, store {
        id: u64,
    }

    /// Error codes
    const ETODOLIST_NOT_INITIALIZED: u64 = 1;
    const ETODO_NOT_FOUND: u64 = 2;
    const EINVALID_TEXT_LENGTH: u64 = 3;
    const ETODOLIST_ALREADY_EXISTS: u64 = 4;

    /// Initialize TodoList for an account
    public entry fun initialize(account: &signer) {
        let account_addr = std::signer::address_of(account);
        assert!(!exists<TodoList>(account_addr), ETODOLIST_ALREADY_EXISTS);

        let todo_list = TodoList {
            todos: table::new(),  // Create empty Table
            todo_counter: 0,
            create_todo_events: account::new_event_handle<TodoCreatedEvent>(account),
            toggle_todo_events: account::new_event_handle<TodoToggledEvent>(account),
            delete_todo_events: account::new_event_handle<TodoDeletedEvent>(account),
        };
        move_to(account, todo_list);
    }

    /// Create a new todo with O(1) insertion
    public entry fun create_todo(
        account: &signer,
        text: String,
    ) acquires TodoList {
        let account_addr = std::signer::address_of(account);
        assert!(exists<TodoList>(account_addr), ETODOLIST_NOT_INITIALIZED);

        // Validate text length (1-500 characters)
        let text_length = std::string::length(&text);
        assert!(text_length > 0 && text_length <= 500, EINVALID_TEXT_LENGTH);

        let todo_list = borrow_global_mut<TodoList>(account_addr);
        todo_list.todo_counter = todo_list.todo_counter + 1;

        let todo = Todo {
            id: todo_list.todo_counter,
            text,
            completed: false,
            created_at: timestamp::now_seconds(),
        };

        // O(1) insertion into Table
        table::add(&mut todo_list.todos, todo_list.todo_counter, todo);

        event::emit_event(
            &mut todo_list.create_todo_events,
            TodoCreatedEvent {
                id: todo.id,
                text: todo.text,
                created_at: todo.created_at,
            }
        );
    }

    /// Toggle todo completion status with O(1) lookup
    public entry fun toggle_todo(
        account: &signer,
        todo_id: u64,
    ) acquires TodoList {
        let account_addr = std::signer::address_of(account);
        assert!(exists<TodoList>(account_addr), ETODOLIST_NOT_INITIALIZED);

        let todo_list = borrow_global_mut<TodoList>(account_addr);

        // O(1) lookup and validation
        assert!(table::contains(&todo_list.todos, todo_id), ETODO_NOT_FOUND);

        // O(1) access and update
        let todo = table::borrow_mut(&mut todo_list.todos, todo_id);
        todo.completed = !todo.completed;

        event::emit_event(
            &mut todo_list.toggle_todo_events,
            TodoToggledEvent {
                id: todo_id,
                completed: todo.completed,
            }
        );
    }

    /// Delete a todo with O(1) removal
    public entry fun delete_todo(
        account: &signer,
        todo_id: u64,
    ) acquires TodoList {
        let account_addr = std::signer::address_of(account);
        assert!(exists<TodoList>(account_addr), ETODOLIST_NOT_INITIALIZED);

        let todo_list = borrow_global_mut<TodoList>(account_addr);

        // O(1) validation and removal
        assert!(table::contains(&todo_list.todos, todo_id), ETODO_NOT_FOUND);
        table::remove(&mut todo_list.todos, todo_id);

        event::emit_event(
            &mut todo_list.delete_todo_events,
            TodoDeletedEvent {
                id: todo_id,
            }
        );
    }

    /// Get all todos for an account (Note: Returns vector for compatibility)
    /// This function reconstructs a vector from the Table by iterating through IDs 1..todo_counter
    #[view]
    public fun get_todos(account_addr: address): vector<Todo> acquires TodoList {
        assert!(exists<TodoList>(account_addr), ETODOLIST_NOT_INITIALIZED);

        let todo_list = borrow_global<TodoList>(account_addr);
        let result = vector::empty<Todo>();
        let i = 1;

        // Iterate through all possible IDs from 1 to todo_counter
        while (i <= todo_list.todo_counter) {
            if (table::contains(&todo_list.todos, i)) {
                let todo = *table::borrow(&todo_list.todos, i);
                vector::push_back(&mut result, todo);
            };
            i = i + 1;
        };

        result
    }

    /// Get a specific todo by ID with O(1) lookup
    #[view]
    public fun get_todo(account_addr: address, todo_id: u64): Todo acquires TodoList {
        assert!(exists<TodoList>(account_addr), ETODOLIST_NOT_INITIALIZED);

        let todo_list = borrow_global<TodoList>(account_addr);
        assert!(table::contains(&todo_list.todos, todo_id), ETODO_NOT_FOUND);

        // O(1) lookup
        *table::borrow(&todo_list.todos, todo_id)
    }

    /// Check if a todo exists with O(1) lookup
    #[view]
    public fun todo_exists(account_addr: address, todo_id: u64): bool acquires TodoList {
        if (!exists<TodoList>(account_addr)) {
            return false
        };

        let todo_list = borrow_global<TodoList>(account_addr);
        table::contains(&todo_list.todos, todo_id)
    }

    /// Get todo count for an account
    #[view]
    public fun get_todo_count(account_addr: address): u64 acquires TodoList {
        assert!(exists<TodoList>(account_addr), ETODOLIST_NOT_INITIALIZED);
        borrow_global<TodoList>(account_addr).todo_counter
    }

    /// Check if TodoList is initialized for an account
    #[view]
    public fun is_initialized(account_addr: address): bool {
        exists<TodoList>(account_addr)
    }
}
