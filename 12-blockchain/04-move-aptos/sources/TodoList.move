module todo_list_addr::TodoList {
    use std::string::String;
    use std::vector;
    use aptos_framework::timestamp;
    use aptos_framework::account;
    use aptos_framework::event;

    /// Todo item structure
    struct Todo has store, drop, copy {
        id: u64,
        text: String,
        completed: bool,
        created_at: u64,
    }

    /// Main TodoList resource
    struct TodoList has key {
        todos: vector<Todo>,
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

    /// Initialize TodoList for an account
    public entry fun initialize(account: &signer) {
        let todo_list = TodoList {
            todos: vector::empty<Todo>(),
            todo_counter: 0,
            create_todo_events: account::new_event_handle<TodoCreatedEvent>(account),
            toggle_todo_events: account::new_event_handle<TodoToggledEvent>(account),
            delete_todo_events: account::new_event_handle<TodoDeletedEvent>(account),
        };
        move_to(account, todo_list);
    }

    /// Create a new todo
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

        vector::push_back(&mut todo_list.todos, todo);

        event::emit_event(
            &mut todo_list.create_todo_events,
            TodoCreatedEvent {
                id: todo.id,
                text: todo.text,
                created_at: todo.created_at,
            }
        );
    }

    /// Toggle todo completion status
    public entry fun toggle_todo(
        account: &signer,
        todo_id: u64,
    ) acquires TodoList {
        let account_addr = std::signer::address_of(account);
        assert!(exists<TodoList>(account_addr), ETODOLIST_NOT_INITIALIZED);

        let todo_list = borrow_global_mut<TodoList>(account_addr);

        let todos_ref = &mut todo_list.todos;
        let len = vector::length(todos_ref);
        let i = 0;
        let found = false;

        while (i < len) {
            let todo = vector::borrow_mut(todos_ref, i);
            if (todo.id == todo_id) {
                todo.completed = !todo.completed;

                event::emit_event(
                    &mut todo_list.toggle_todo_events,
                    TodoToggledEvent {
                        id: todo_id,
                        completed: todo.completed,
                    }
                );

                found = true;
                break
            };
            i = i + 1;
        };

        assert!(found, ETODO_NOT_FOUND);
    }

    /// Delete a todo
    public entry fun delete_todo(
        account: &signer,
        todo_id: u64,
    ) acquires TodoList {
        let account_addr = std::signer::address_of(account);
        assert!(exists<TodoList>(account_addr), ETODOLIST_NOT_INITIALIZED);

        let todo_list = borrow_global_mut<TodoList>(account_addr);

        let todos_ref = &mut todo_list.todos;
        let len = vector::length(todos_ref);
        let i = 0;
        let found = false;

        while (i < len) {
            let todo = vector::borrow(todos_ref, i);
            if (todo.id == todo_id) {
                vector::remove(todos_ref, i);

                event::emit_event(
                    &mut todo_list.delete_todo_events,
                    TodoDeletedEvent {
                        id: todo_id,
                    }
                );

                found = true;
                break
            };
            i = i + 1;
        };

        assert!(found, ETODO_NOT_FOUND);
    }

    /// Get all todos for an account
    #[view]
    public fun get_todos(account_addr: address): vector<Todo> acquires TodoList {
        assert!(exists<TodoList>(account_addr), ETODOLIST_NOT_INITIALIZED);
        *&borrow_global<TodoList>(account_addr).todos
    }

    /// Get a specific todo by ID
    #[view]
    public fun get_todo(account_addr: address, todo_id: u64): Todo acquires TodoList {
        assert!(exists<TodoList>(account_addr), ETODOLIST_NOT_INITIALIZED);

        let todos = &borrow_global<TodoList>(account_addr).todos;
        let len = vector::length(todos);
        let i = 0;

        while (i < len) {
            let todo = vector::borrow(todos, i);
            if (todo.id == todo_id) {
                return *todo
            };
            i = i + 1;
        };

        abort ETODO_NOT_FOUND
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
