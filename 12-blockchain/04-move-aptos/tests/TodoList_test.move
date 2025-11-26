#[test_only]
module todo_list_addr::TodoList_test {
    use std::string;
    use std::signer;
    use aptos_framework::timestamp;
    use todo_list_addr::TodoList;

    #[test(account = @todo_list_addr)]
    public fun test_initialize(account: &signer) {
        // Setup timestamp for testing
        timestamp::set_time_has_started_for_testing(account);

        // Initialize TodoList
        TodoList::initialize(account);

        // Verify initialization
        let addr = signer::address_of(account);
        assert!(TodoList::is_initialized(addr), 0);
        assert!(TodoList::get_todo_count(addr) == 0, 1);
    }

    #[test(account = @todo_list_addr)]
    public fun test_create_todo(account: &signer) {
        timestamp::set_time_has_started_for_testing(account);

        TodoList::initialize(account);
        TodoList::create_todo(account, string::utf8(b"Test todo"));

        let addr = signer::address_of(account);
        let todos = TodoList::get_todos(addr);
        assert!(std::vector::length(&todos) == 1, 0);

        let todo = TodoList::get_todo(addr, 1);
        assert!(todo.id == 1, 1);
        assert!(todo.text == string::utf8(b"Test todo"), 2);
        assert!(todo.completed == false, 3);
        assert!(todo.created_at > 0, 4);
    }

    #[test(account = @todo_list_addr)]
    public fun test_create_multiple_todos(account: &signer) {
        timestamp::set_time_has_started_for_testing(account);

        TodoList::initialize(account);
        TodoList::create_todo(account, string::utf8(b"First todo"));
        TodoList::create_todo(account, string::utf8(b"Second todo"));
        TodoList::create_todo(account, string::utf8(b"Third todo"));

        let addr = signer::address_of(account);
        let todos = TodoList::get_todos(addr);
        assert!(std::vector::length(&todos) == 3, 0);
        assert!(TodoList::get_todo_count(addr) == 3, 1);

        let todo1 = TodoList::get_todo(addr, 1);
        assert!(todo1.text == string::utf8(b"First todo"), 2);

        let todo2 = TodoList::get_todo(addr, 2);
        assert!(todo2.text == string::utf8(b"Second todo"), 3);

        let todo3 = TodoList::get_todo(addr, 3);
        assert!(todo3.text == string::utf8(b"Third todo"), 4);
    }

    #[test(account = @todo_list_addr)]
    public fun test_toggle_todo(account: &signer) {
        timestamp::set_time_has_started_for_testing(account);

        TodoList::initialize(account);
        TodoList::create_todo(account, string::utf8(b"Test todo"));

        let addr = signer::address_of(account);

        // Check initial state
        let todo = TodoList::get_todo(addr, 1);
        assert!(todo.completed == false, 0);

        // Toggle to completed
        TodoList::toggle_todo(account, 1);
        let todo = TodoList::get_todo(addr, 1);
        assert!(todo.completed == true, 1);

        // Toggle back to incomplete
        TodoList::toggle_todo(account, 1);
        let todo = TodoList::get_todo(addr, 1);
        assert!(todo.completed == false, 2);
    }

    #[test(account = @todo_list_addr)]
    public fun test_delete_todo(account: &signer) {
        timestamp::set_time_has_started_for_testing(account);

        TodoList::initialize(account);
        TodoList::create_todo(account, string::utf8(b"Test todo"));

        let addr = signer::address_of(account);
        assert!(std::vector::length(&TodoList::get_todos(addr)) == 1, 0);

        TodoList::delete_todo(account, 1);

        let todos = TodoList::get_todos(addr);
        assert!(std::vector::length(&todos) == 0, 1);
    }

    #[test(account = @todo_list_addr)]
    public fun test_delete_middle_todo(account: &signer) {
        timestamp::set_time_has_started_for_testing(account);

        TodoList::initialize(account);
        TodoList::create_todo(account, string::utf8(b"First todo"));
        TodoList::create_todo(account, string::utf8(b"Second todo"));
        TodoList::create_todo(account, string::utf8(b"Third todo"));

        let addr = signer::address_of(account);

        // Delete middle todo
        TodoList::delete_todo(account, 2);

        let todos = TodoList::get_todos(addr);
        assert!(std::vector::length(&todos) == 2, 0);

        // Verify remaining todos
        let todo1 = std::vector::borrow(&todos, 0);
        assert!(todo1.id == 1, 1);

        let todo3 = std::vector::borrow(&todos, 1);
        assert!(todo3.id == 3, 2);
    }

    #[test(account = @todo_list_addr)]
    public fun test_todo_counter_increments(account: &signer) {
        timestamp::set_time_has_started_for_testing(account);

        TodoList::initialize(account);

        let addr = signer::address_of(account);

        TodoList::create_todo(account, string::utf8(b"Todo 1"));
        assert!(TodoList::get_todo_count(addr) == 1, 0);

        TodoList::create_todo(account, string::utf8(b"Todo 2"));
        assert!(TodoList::get_todo_count(addr) == 2, 1);

        // Delete a todo - counter should not decrease
        TodoList::delete_todo(account, 1);
        assert!(TodoList::get_todo_count(addr) == 2, 2);

        // Create another - counter continues
        TodoList::create_todo(account, string::utf8(b"Todo 3"));
        assert!(TodoList::get_todo_count(addr) == 3, 3);
    }

    #[test(account = @todo_list_addr)]
    #[expected_failure(abort_code = 1)]
    public fun test_create_without_initialize(account: &signer) {
        timestamp::set_time_has_started_for_testing(account);
        // Should fail because not initialized
        TodoList::create_todo(account, string::utf8(b"Test todo"));
    }

    #[test(account = @todo_list_addr)]
    #[expected_failure(abort_code = 2)]
    public fun test_toggle_nonexistent_todo(account: &signer) {
        timestamp::set_time_has_started_for_testing(account);

        TodoList::initialize(account);
        // Should fail because todo doesn't exist
        TodoList::toggle_todo(account, 999);
    }

    #[test(account = @todo_list_addr)]
    #[expected_failure(abort_code = 2)]
    public fun test_delete_nonexistent_todo(account: &signer) {
        timestamp::set_time_has_started_for_testing(account);

        TodoList::initialize(account);
        // Should fail because todo doesn't exist
        TodoList::delete_todo(account, 999);
    }

    #[test(account = @todo_list_addr)]
    #[expected_failure(abort_code = 3)]
    public fun test_create_empty_text(account: &signer) {
        timestamp::set_time_has_started_for_testing(account);

        TodoList::initialize(account);
        // Should fail because text is empty
        TodoList::create_todo(account, string::utf8(b""));
    }

    #[test(account = @todo_list_addr)]
    #[expected_failure(abort_code = 1)]
    public fun test_get_todos_without_initialize(account: &signer) {
        let addr = signer::address_of(account);
        // Should fail because not initialized
        TodoList::get_todos(addr);
    }

    #[test(account = @todo_list_addr)]
    public fun test_timestamp_recorded(account: &signer) {
        timestamp::set_time_has_started_for_testing(account);

        // Set a specific timestamp
        timestamp::update_global_time_for_test(1000000);

        TodoList::initialize(account);
        TodoList::create_todo(account, string::utf8(b"Test todo"));

        let addr = signer::address_of(account);
        let todo = TodoList::get_todo(addr, 1);
        assert!(todo.created_at == 1, 0); // timestamp::now_seconds() returns seconds
    }

    #[test(account = @todo_list_addr)]
    public fun test_complete_workflow(account: &signer) {
        timestamp::set_time_has_started_for_testing(account);

        let addr = signer::address_of(account);

        // Initialize
        TodoList::initialize(account);
        assert!(TodoList::is_initialized(addr), 0);

        // Create todos
        TodoList::create_todo(account, string::utf8(b"Buy groceries"));
        TodoList::create_todo(account, string::utf8(b"Write code"));
        TodoList::create_todo(account, string::utf8(b"Exercise"));

        // Toggle some
        TodoList::toggle_todo(account, 1);
        TodoList::toggle_todo(account, 3);

        // Verify states
        let todo1 = TodoList::get_todo(addr, 1);
        assert!(todo1.completed == true, 1);

        let todo2 = TodoList::get_todo(addr, 2);
        assert!(todo2.completed == false, 2);

        let todo3 = TodoList::get_todo(addr, 3);
        assert!(todo3.completed == true, 3);

        // Delete completed one
        TodoList::delete_todo(account, 1);

        // Verify remaining
        let todos = TodoList::get_todos(addr);
        assert!(std::vector::length(&todos) == 2, 4);
    }
}
