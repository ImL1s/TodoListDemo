# Architecture Documentation

## Overview

This Flutter Desktop Todo application follows a clean architecture pattern with clear separation of concerns. The architecture is designed to be maintainable, testable, and scalable.

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                      │
│  (Screens, Widgets, Dialogs)                               │
│  - Displays UI                                              │
│  - Handles user input                                       │
│  - Observes state changes                                   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                     │
│  (Providers)                                                │
│  - Manages application state                                │
│  - Implements business rules                                │
│  - Coordinates between UI and data                          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                             │
│  (Services, Models)                                         │
│  - Database operations                                      │
│  - Data transformation                                      │
│  - Data validation                                          │
└─────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### 1. Presentation Layer

#### Screens (`lib/screens/`)
- **HomeScreen**: Main application screen
  - Manages layout based on screen size
  - Handles keyboard shortcuts
  - Coordinates between sidebar, list, and statistics panel

#### Widgets (`lib/widgets/`)

**Dialogs:**
- `AddTodoDialog`: Create new todo
- `EditTodoDialog`: Edit existing todo

**Panels:**
- `FilterSidebar`: Left sidebar with filters and categories
- `StatisticsPanel`: Right panel with stats and insights
- `SearchBar`: Search functionality

**List Components:**
- `TodoList`: Container for todo items, handles empty states
- `TodoItem`: Individual todo card with all interactions

### 2. Business Logic Layer

#### Providers (`lib/providers/`)

**TodoProvider** (`todo_provider.dart`):
```dart
class TodoProvider extends ChangeNotifier {
  // State
  - List<Todo> _todos
  - TodoFilter _currentFilter
  - TodoSort _currentSort
  - String? _selectedCategory
  - String _searchQuery

  // Getters (computed properties)
  - List<Todo> get todos
  - int get totalCount
  - int get activeCount
  - int get completedCount
  - List<String> get categories

  // Actions
  - loadTodos()
  - addTodo()
  - updateTodo()
  - deleteTodo()
  - toggleTodo()
  - setFilter()
  - setSort()
  - setCategory()
  - setSearchQuery()
  - clearCompleted()
}
```

**Responsibilities:**
- Maintains application state
- Coordinates with StorageService
- Implements filtering and sorting logic
- Notifies listeners of state changes
- Validates business rules

### 3. Data Layer

#### Models (`lib/models/`)

**Todo** (`todo.dart`):
```dart
class Todo {
  final String id;
  final String title;
  final String? description;
  final bool completed;
  final DateTime createdAt;
  final DateTime? completedAt;
  final String? category;
  final int priority;

  // Methods
  - toMap()          // Serialization
  - fromMap()        // Deserialization
  - copyWith()       // Immutable updates
}
```

**Enums:**
- `TodoFilter`: all, active, completed
- `TodoSort`: createdDate, priority, title

#### Services (`lib/services/`)

**StorageService** (`storage_service.dart`):
```dart
class StorageService {
  // Database operations
  - init()
  - insertTodo()
  - getAllTodos()
  - getTodoById()
  - updateTodo()
  - deleteTodo()
  - deleteAllCompleted()
  - getTodosByFilter()
  - getCategories()
  - getStatistics()
  - close()
}
```

**Responsibilities:**
- SQLite database management
- CRUD operations
- Query optimization
- Data persistence
- Migration handling

### 4. Utilities

#### Shortcuts (`lib/utils/`)

**AppShortcuts** (`app_shortcuts.dart`):
- Defines keyboard shortcuts
- Maps shortcuts to intents
- Provides actions for handling shortcuts
- Mixin for shortcut handling in screens

## Data Flow

### Reading Data

```
User Opens App
    ↓
main.dart initializes StorageService
    ↓
TodoProvider.loadTodos() called
    ↓
StorageService.getAllTodos()
    ↓
SQLite Query Executed
    ↓
Data converted to Todo objects
    ↓
Provider updates _todos list
    ↓
notifyListeners() called
    ↓
UI rebuilds via Consumer widgets
    ↓
User sees todos
```

### Creating Data

```
User clicks "New Todo"
    ↓
AddTodoDialog shown
    ↓
User fills form and submits
    ↓
Provider.addTodo() called
    ↓
Todo object created with UUID
    ↓
StorageService.insertTodo()
    ↓
SQLite INSERT executed
    ↓
Provider adds to _todos list
    ↓
notifyListeners() called
    ↓
UI rebuilds
    ↓
New todo appears in list
```

### Updating Data

```
User clicks on todo
    ↓
EditTodoDialog shown with current data
    ↓
User modifies and saves
    ↓
Provider.updateTodo() called
    ↓
StorageService.updateTodo()
    ↓
SQLite UPDATE executed
    ↓
Provider updates todo in _todos list
    ↓
notifyListeners() called
    ↓
UI rebuilds
    ↓
Changes reflected in UI
```

## State Management Pattern

### Provider Pattern

**Why Provider?**
- Simple and lightweight
- Built-in to Flutter ecosystem
- Good performance with selective rebuilding
- Easy to test
- Clear data flow

**Implementation:**

1. **Provider Setup** (main.dart):
```dart
MultiProvider(
  providers: [
    ChangeNotifierProvider(
      create: (_) => TodoProvider(storageService)..loadTodos(),
    ),
  ],
  child: MyApp(),
)
```

2. **Consuming State** (widgets):
```dart
// Rebuilds when any provider property changes
Consumer<TodoProvider>(
  builder: (context, provider, child) {
    return ListView(children: provider.todos);
  },
)

// More efficient: only rebuilds when specific property changes
Selector<TodoProvider, List<Todo>>(
  selector: (context, provider) => provider.todos,
  builder: (context, todos, child) {
    return ListView(children: todos);
  },
)
```

3. **Triggering Actions**:
```dart
// Inside widgets
context.read<TodoProvider>().addTodo(...);
Provider.of<TodoProvider>(context, listen: false).addTodo(...);
```

## Database Architecture

### Schema Design

**Tables:**
- `todos`: Main todo storage

**Indexes:**
- `idx_completed`: Optimize status filtering
- `idx_priority`: Optimize priority sorting
- `idx_category`: Optimize category filtering

### Query Optimization

1. **Use Indexes**: All common queries use indexed columns
2. **Limit Results**: Use LIMIT for pagination (future)
3. **Batch Operations**: Group multiple updates
4. **Connection Pooling**: Single database instance

### Migration Strategy

```dart
Future<void> _onUpgrade(Database db, int oldVersion, int newVersion) async {
  // Version 1 to 2: Add tags column
  if (oldVersion < 2) {
    await db.execute('ALTER TABLE todos ADD COLUMN tags TEXT');
  }
  // Version 2 to 3: Add due_date column
  if (oldVersion < 3) {
    await db.execute('ALTER TABLE todos ADD COLUMN due_date TEXT');
  }
}
```

## Responsive Layout Architecture

### Breakpoint System

```dart
// In HomeScreen
LayoutBuilder(
  builder: (context, constraints) {
    final isWideScreen = constraints.maxWidth > 1200;
    final isMediumScreen = constraints.maxWidth > 800;

    return Row(
      children: [
        if (isMediumScreen) FilterSidebar(...),
        Expanded(child: MainContent(...)),
        if (isWideScreen) StatisticsPanel(...),
      ],
    );
  },
)
```

### Adaptive Components

**Strategy:**
- Use LayoutBuilder for size-based decisions
- MediaQuery for device information
- Platform checks for OS-specific behavior

## Error Handling

### Layers

1. **UI Layer**:
   - Form validation
   - User feedback (SnackBars)
   - Error dialogs

2. **Provider Layer**:
   - Business logic validation
   - Try-catch blocks
   - Error state management

3. **Service Layer**:
   - Database error handling
   - Recovery strategies
   - Logging

### Example

```dart
// In Provider
Future<void> addTodo(...) async {
  try {
    final todo = Todo(...);
    await _storageService.insertTodo(todo);
    _todos.insert(0, todo);
    notifyListeners();
  } catch (e) {
    // Log error
    print('Error adding todo: $e');
    // Rethrow for UI to handle
    rethrow;
  }
}

// In Widget
try {
  await provider.addTodo(...);
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(content: Text('Todo added')),
  );
} catch (e) {
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(content: Text('Failed to add todo')),
  );
}
```

## Testing Strategy (Future Implementation)

### Unit Tests
- Test models (serialization, copyWith)
- Test providers (business logic)
- Test services (database operations)

### Widget Tests
- Test individual widgets
- Test user interactions
- Test widget states

### Integration Tests
- Test complete workflows
- Test navigation
- Test data persistence

## Performance Considerations

### Optimization Techniques

1. **Const Constructors**: Reduce rebuilds
2. **Key Usage**: Stable widget identity
3. **Selective Rebuilding**: Consumer/Selector
4. **Lazy Loading**: ListView.builder
5. **Compute Function**: Heavy computations in isolates

### Profiling

Use Flutter DevTools:
- Widget rebuild profiling
- Memory usage
- Database query timing
- Frame rendering performance

## Security Considerations

### Current Implementation
- Local storage only
- No authentication
- No encryption

### Future Enhancements
- Encrypt database (sqlcipher)
- Secure cloud sync
- User authentication
- Data backup encryption

## Extensibility

### Adding New Features

The architecture supports easy extension:

1. **New Todo Properties**:
   - Update Model
   - Update Database schema
   - Add migration
   - Update UI

2. **New Filters**:
   - Add to TodoFilter enum
   - Update Provider filtering logic
   - Add UI elements

3. **New Data Source**:
   - Create new service
   - Implement same interface
   - Inject in Provider
   - No UI changes needed

## Conclusion

This architecture provides:
- **Separation of Concerns**: Clear boundaries
- **Testability**: Each layer can be tested independently
- **Maintainability**: Easy to understand and modify
- **Scalability**: Can grow with new features
- **Performance**: Optimized for desktop use

The pattern is proven, widely used, and well-documented, making it accessible for developers of all levels.
