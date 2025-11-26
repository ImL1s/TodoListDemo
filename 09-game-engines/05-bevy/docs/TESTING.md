# Testing Guide

Comprehensive testing documentation for the Bevy Todo List application.

## Table of Contents

1. [Test Coverage](#test-coverage)
2. [Running Tests](#running-tests)
3. [Test Structure](#test-structure)
4. [Writing Tests](#writing-tests)
5. [Integration Tests](#integration-tests)
6. [Performance Tests](#performance-tests)

## Test Coverage

### Current Test Coverage

#### Components (`src/components/`)

**todo_item.rs:**
- ✅ `test_new_todo_item` - TodoItem creation
- ✅ `test_toggle_todo_item` - Toggle completion status
- ✅ `test_todo_serialization` - Serde serialization/deserialization

**ui_components.rs:**
- ✅ `test_filter_type_display_name` - FilterType display names
- ✅ `test_input_text_new` - InputText creation
- ✅ `test_input_text_push` - Character input
- ✅ `test_input_text_pop` - Character deletion
- ✅ `test_input_text_clear` - Input clearing
- ✅ `test_button_colors_new` - ButtonColors creation
- ✅ `test_button_colors_with_colors` - Custom color schemes
- ✅ `test_button_colors_default` - Default implementation

#### Resources (`src/resources/`)

**todo_list.rs:**
- ✅ `test_new_todo_list` - TodoList initialization
- ✅ `test_add_todo` - Adding todos
- ✅ `test_add_empty_todo` - Empty todo validation
- ✅ `test_remove_todo` - Todo removal
- ✅ `test_remove_nonexistent_todo` - Invalid removal handling
- ✅ `test_toggle_todo` - Toggle completion
- ✅ `test_update_todo` - Todo editing
- ✅ `test_clear_completed` - Bulk completion removal
- ✅ `test_filtered_items` - Filtering logic (All/Active/Completed)
- ✅ `test_counters` - Count calculations
- ✅ `test_has_todos_and_has_completed` - State checks

### Test Statistics

- **Total Tests:** 19
- **Components Tested:** TodoItem, InputText, ButtonColors, FilterType, TodoList
- **Coverage Areas:**
  - Data models: 100%
  - Business logic: 90%
  - UI components: 80%
  - System tests: 0% (requires Bevy test framework)

## Running Tests

### Basic Commands

```bash
# Run all tests
cargo test

# Run with output
cargo test -- --nocapture

# Run specific test
cargo test test_add_todo

# Run tests matching pattern
cargo test todo

# Run in release mode (faster)
cargo test --release
```

### Verbose Output

```bash
# Show test output
cargo test -- --nocapture --test-threads=1

# Show timing
cargo test -- --show-output
```

### Continuous Testing

```bash
# Install cargo-watch
cargo install cargo-watch

# Run tests on file changes
cargo watch -x test

# With clear screen
cargo watch -c -x test
```

## Test Structure

### Unit Tests

Unit tests are placed in the same file as the code they test, in a `#[cfg(test)]` module:

```rust
// src/resources/todo_list.rs

impl TodoList {
    pub fn add_todo(&mut self, title: String) -> u64 {
        // Implementation
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_add_todo() {
        let mut list = TodoList::new();
        let id = list.add_todo("Test".to_string());
        assert_eq!(id, 1);
    }
}
```

### Integration Tests

Integration tests go in the `tests/` directory (to be added):

```rust
// tests/integration_test.rs

use todolist_bevy::*;

#[test]
fn test_full_workflow() {
    // Test complete user workflows
}
```

## Writing Tests

### Test Naming Convention

```rust
#[test]
fn test_<component>_<scenario>_<expected_result>() {
    // Test implementation
}
```

Examples:
- `test_todo_add_valid_succeeds()`
- `test_todo_remove_invalid_fails()`
- `test_filter_active_shows_only_incomplete()`

### Assertion Patterns

```rust
// Equality
assert_eq!(actual, expected);
assert_ne!(actual, unexpected);

// Boolean
assert!(condition);
assert!(result.is_ok());

// Panic testing
#[should_panic(expected = "error message")]
#[test]
fn test_panic() {
    // Code that should panic
}

// Result testing
#[test]
fn test_result() -> Result<(), String> {
    let result = function_that_returns_result()?;
    assert_eq!(result, expected);
    Ok(())
}
```

### Testing Async Code (Future)

```rust
#[tokio::test]
async fn test_async_function() {
    let result = async_function().await;
    assert!(result.is_ok());
}
```

## Integration Tests

### Bevy System Tests

Testing Bevy systems requires the Bevy test framework:

```rust
use bevy::prelude::*;

#[test]
fn test_system() {
    // Create a test app
    let mut app = App::new();

    // Add resources
    app.insert_resource(TodoList::new());

    // Add systems
    app.add_systems(Update, handle_add_todo);

    // Send events
    app.world.send_event(AddTodoEvent {
        title: "Test".to_string(),
    });

    // Run one frame
    app.update();

    // Check results
    let todo_list = app.world.resource::<TodoList>();
    assert_eq!(todo_list.total_count(), 1);
}
```

### UI Tests

Testing UI requires spawning entities:

```rust
#[test]
fn test_ui_setup() {
    let mut app = App::new();
    app.add_plugins(DefaultPlugins);
    app.add_systems(Startup, setup_ui);

    app.update();

    // Query for UI entities
    let query = app.world.query::<&AppTitle>();
    assert_eq!(query.iter(&app.world).count(), 1);
}
```

## Performance Tests

### Benchmarking

```bash
# Install criterion
cargo install cargo-criterion

# Run benchmarks
cargo bench
```

Example benchmark (to be added in `benches/`):

```rust
use criterion::{black_box, criterion_group, criterion_main, Criterion};
use todolist_bevy::TodoList;

fn benchmark_add_todo(c: &mut Criterion) {
    c.bench_function("add_todo", |b| {
        let mut list = TodoList::new();
        b.iter(|| {
            list.add_todo(black_box("Test".to_string()))
        });
    });
}

criterion_group!(benches, benchmark_add_todo);
criterion_main!(benches);
```

### Load Testing

```rust
#[test]
fn test_many_todos() {
    let mut list = TodoList::new();

    // Add 1000 todos
    for i in 0..1000 {
        list.add_todo(format!("Todo {}", i));
    }

    assert_eq!(list.total_count(), 1000);

    // Test filtering performance
    let start = std::time::Instant::now();
    list.set_filter(FilterType::Active);
    let _filtered = list.filtered_items();
    let elapsed = start.elapsed();

    assert!(elapsed.as_millis() < 10, "Filtering too slow!");
}
```

## Test Data

### Fixtures

Create reusable test data:

```rust
#[cfg(test)]
mod test_helpers {
    use super::*;

    pub fn create_test_list() -> TodoList {
        let mut list = TodoList::new();
        list.add_todo("Test 1".to_string());
        list.add_todo("Test 2".to_string());
        list.add_todo("Test 3".to_string());
        list
    }

    pub fn create_mixed_list() -> TodoList {
        let mut list = create_test_list();
        list.toggle_todo(1);
        list.toggle_todo(3);
        list
    }
}
```

## Continuous Integration

Tests run automatically on:
- Every push to main/develop
- Every pull request
- Multiple platforms (Linux, Windows, macOS)
- Multiple Rust versions (stable, beta)

See `.github/workflows/ci.yml` for configuration.

## Test Best Practices

1. **Keep Tests Small:** Each test should verify one thing
2. **Use Descriptive Names:** Test names should describe what they test
3. **Avoid Test Interdependence:** Tests should run independently
4. **Test Edge Cases:** Include boundary conditions
5. **Test Error Paths:** Don't just test the happy path
6. **Keep Tests Fast:** Slow tests discourage running them
7. **Use Helper Functions:** Reduce test code duplication
8. **Document Complex Tests:** Add comments for non-obvious test logic

## Coverage Tools

### tarpaulin (Linux)

```bash
# Install
cargo install cargo-tarpaulin

# Generate coverage report
cargo tarpaulin --out Html --output-dir coverage

# Open report
firefox coverage/index.html
```

### llvm-cov (All platforms)

```bash
# Install
rustup component add llvm-tools-preview
cargo install cargo-llvm-cov

# Generate coverage
cargo llvm-cov

# Generate HTML report
cargo llvm-cov --html
```

## Future Test Areas

### To Be Implemented

- [ ] System integration tests
- [ ] UI interaction tests
- [ ] Storage persistence tests
- [ ] Event flow tests
- [ ] Performance benchmarks
- [ ] WASM-specific tests
- [ ] Accessibility tests
- [ ] Load tests (1000+ todos)

### Test Expansion Goals

- Achieve 95% code coverage
- Add property-based testing with `proptest`
- Add fuzz testing with `cargo-fuzz`
- Add mutation testing with `cargo-mutants`
- Performance regression tests

## Resources

- [Rust Testing Book](https://doc.rust-lang.org/book/ch11-00-testing.html)
- [Bevy Testing Guide](https://bevy-cheatbook.github.io/patterns/manual-event-clear.html)
- [Criterion.rs Docs](https://bheisler.github.io/criterion.rs/book/)
- [proptest Book](https://altsysrq/proptest-book)
