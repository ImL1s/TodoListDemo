# Architecture Documentation

## SwiftUI Todo List - MVVM Architecture

This document provides an in-depth explanation of the application architecture, design patterns, and implementation decisions.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [MVVM Pattern](#mvvm-pattern)
3. [Data Flow](#data-flow)
4. [Component Interaction](#component-interaction)
5. [State Management](#state-management)
6. [Persistence Layer](#persistence-layer)
7. [Design Decisions](#design-decisions)
8. [Scalability](#scalability)

---

## Architecture Overview

### High-Level Structure

```
┌─────────────────────────────────────────────────────────┐
│                      SwiftUI App                        │
│                   (TodoListApp)                         │
└──────────────────────┬──────────────────────────────────┘
                       │
                       │ Creates & Injects
                       ▼
┌─────────────────────────────────────────────────────────┐
│                   ViewModel Layer                       │
│                  (TodoViewModel)                        │
│                                                         │
│  - ObservableObject                                     │
│  - @Published properties                                │
│  - Business logic                                       │
│  - Coordinates persistence                              │
└──────────────────────┬──────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
┌──────────────┐ ┌──────────┐ ┌─────────────────┐
│  Model Layer │ │   View   │ │ Persistence     │
│              │ │  Layer   │ │                 │
│  Todo struct │ │          │ │ UserDefaults    │
│  Priority    │ │ SwiftUI  │ │ Manager         │
│  Extensions  │ │ Views    │ │                 │
└──────────────┘ └──────────┘ └─────────────────┘
```

### Layers Responsibility

| Layer | Responsibility | Technologies |
|-------|---------------|--------------|
| **View** | UI Presentation, User Interaction | SwiftUI |
| **ViewModel** | Business Logic, State Management | Combine, Swift |
| **Model** | Data Structures, Business Entities | Swift, Codable |
| **Persistence** | Data Storage, Retrieval | UserDefaults, JSONEncoder |

---

## MVVM Pattern

### Why MVVM for SwiftUI?

1. **Natural Fit**: SwiftUI is designed for MVVM
2. **Reactive**: Built-in support for ObservableObject
3. **Testable**: ViewModels are pure Swift, easy to test
4. **Scalable**: Clear separation makes growth easier
5. **Maintainable**: Changes isolated to appropriate layers

### Model Layer

**File**: `Models/Todo.swift`

**Purpose**: Define data structures and business entities

**Characteristics**:
- Value types (struct)
- Immutable where possible
- Codable for persistence
- Identifiable for SwiftUI
- Pure data, no dependencies

**Example**:
```swift
struct Todo: Identifiable, Codable, Equatable {
    let id: UUID
    var title: String
    var isCompleted: Bool
    let createdAt: Date

    // Computed properties (derived state)
    var isOverdue: Bool {
        // Pure function, no side effects
    }
}
```

**Best Practices**:
- ✅ Keep it simple (data only)
- ✅ Use immutable properties when possible
- ✅ Computed properties for derived state
- ❌ No business logic
- ❌ No persistence code
- ❌ No view references

### ViewModel Layer

**File**: `ViewModels/TodoViewModel.swift`

**Purpose**: Manage app state and business logic

**Characteristics**:
- Reference type (class)
- Conforms to ObservableObject
- @Published properties for reactive updates
- Contains all business logic
- Coordinates with persistence layer
- No UIKit/SwiftUI dependencies

**Example**:
```swift
class TodoViewModel: ObservableObject {
    // Published state (observed by views)
    @Published var todos: [Todo] = []

    // Computed properties (for views)
    var activeTodosCount: Int {
        todos.filter { !$0.isCompleted }.count
    }

    // Commands (user actions)
    func addTodo(title: String) {
        let todo = Todo(title: title)
        todos.append(todo)
        saveTodos()  // Coordinate persistence
    }

    // Private helpers
    private func saveTodos() {
        UserDefaultsManager.shared.saveTodos(todos)
    }
}
```

**Best Practices**:
- ✅ Single responsibility
- ✅ Publish only what views need
- ✅ Use computed properties for derived data
- ✅ Coordinate with services (persistence, network)
- ❌ No UI code
- ❌ No direct UserDefaults access (use manager)
- ❌ No view references

### View Layer

**Files**: `ContentView.swift`, `Views/*.swift`

**Purpose**: Display UI and capture user input

**Characteristics**:
- Value types (struct)
- Conform to View protocol
- Declarative syntax
- Observe ViewModel changes
- No business logic
- Purely presentational

**Example**:
```swift
struct ContentView: View {
    // Observe ViewModel
    @EnvironmentObject var viewModel: TodoViewModel

    // Local UI state only
    @State private var showSettings = false

    var body: some View {
        VStack {
            // Display data from ViewModel
            Text("Total: \(viewModel.todos.count)")

            // Send commands to ViewModel
            Button("Add") {
                viewModel.addTodo(title: "New")
            }
        }
    }
}
```

**Best Practices**:
- ✅ Small, focused views
- ✅ Extract complex views into subviews
- ✅ Use @State for local UI state only
- ✅ Use @EnvironmentObject for shared state
- ❌ No business logic
- ❌ No direct model manipulation
- ❌ No persistence code

---

## Data Flow

### Unidirectional Flow

```
User Action → View → ViewModel → Model → Persistence
                ↑                   ↓
                └───────────────────┘
                   @Published update
```

### Step-by-Step Example: Adding a Todo

1. **User Input**
   ```swift
   // User types "Buy groceries" and taps Add
   Button("Add") {
       viewModel.addTodo(title: inputText)
   }
   ```

2. **View → ViewModel**
   ```swift
   // View calls ViewModel method
   func addTodo(title: String) {
       // Validation
       guard !title.isEmpty else { return }

       // Create model
       let todo = Todo(title: title)

       // Update state
       todos.append(todo)  // Triggers @Published
   }
   ```

3. **ViewModel → Persistence**
   ```swift
   // didSet observer triggers save
   @Published var todos: [Todo] = [] {
       didSet {
           saveTodos()
       }
   }

   private func saveTodos() {
       UserDefaultsManager.shared.saveTodos(todos)
   }
   ```

4. **Persistence → Storage**
   ```swift
   // Manager encodes and saves
   func saveTodos(_ todos: [Todo]) {
       let data = try? encoder.encode(todos)
       defaults.set(data, forKey: "todos")
   }
   ```

5. **ViewModel → View Update**
   ```swift
   // SwiftUI automatically re-renders
   // because todos is @Published
   ForEach(viewModel.todos) { todo in
       TodoRow(todo: todo)
   }
   ```

### State Update Flow

```
@Published Property Changed
         ↓
ObservableObject sends objectWillChange
         ↓
All observing Views notified
         ↓
SwiftUI compares old/new View values
         ↓
Only changed Views re-render
         ↓
UI updates on screen
```

---

## Component Interaction

### Dependency Injection

**App Level**:
```swift
@main
struct TodoListApp: App {
    // Create ViewModel once
    @StateObject private var viewModel = TodoViewModel()

    var body: some Scene {
        WindowGroup {
            ContentView()
                // Inject into environment
                .environmentObject(viewModel)
        }
    }
}
```

**View Level**:
```swift
struct ContentView: View {
    // Access from environment
    @EnvironmentObject var viewModel: TodoViewModel

    var body: some View {
        TodoListView()
            // Already has access via environment
    }
}

struct TodoListView: View {
    @EnvironmentObject var viewModel: TodoViewModel
    // Can use viewModel
}
```

### Property Wrapper Hierarchy

```
@StateObject (Owns the object)
    ├── App creates and owns ViewModel
    │
    └─→ .environmentObject(viewModel)
            │
            ├─→ View A (@EnvironmentObject)
            ├─→ View B (@EnvironmentObject)
            └─→ View C (@EnvironmentObject)
```

**When to use each**:
- `@StateObject`: When view **creates** the object
- `@ObservedObject`: When view **receives** the object
- `@EnvironmentObject`: When object is **shared** across many views
- `@State`: For simple value types (Int, String, Bool)
- `@Binding`: For two-way connection to parent's state

### Communication Patterns

**View → ViewModel** (Commands)
```swift
struct AddButton: View {
    @EnvironmentObject var viewModel: TodoViewModel

    var body: some View {
        Button("Add") {
            viewModel.addTodo(title: "New")  // Command
        }
    }
}
```

**ViewModel → View** (State)
```swift
class TodoViewModel: ObservableObject {
    @Published var todos: [Todo] = []  // State
}

struct TodoList: View {
    @EnvironmentObject var viewModel: TodoViewModel

    var body: some View {
        ForEach(viewModel.todos) { todo in  // Read state
            TodoRow(todo: todo)
        }
    }
}
```

**View → View** (Props & Bindings)
```swift
struct ParentView: View {
    @State private var count = 0

    var body: some View {
        ChildView(count: $count)  // Binding
    }
}

struct ChildView: View {
    @Binding var count: Int

    var body: some View {
        Button("Increment") {
            count += 1  // Updates parent
        }
    }
}
```

---

## State Management

### Types of State

1. **App State** (Global)
   - TodoViewModel
   - User preferences
   - Authentication state

2. **View State** (Local)
   - Text field content
   - Sheet presentation
   - Animation triggers

3. **Derived State** (Computed)
   - Filtered todos
   - Completion percentage
   - Statistics

### State Location Decision Tree

```
Is state needed by multiple views?
├─ Yes → Use ViewModel (@Published)
└─ No
   ├─ Is it persistent?
   │  ├─ Yes → Use ViewModel + Persistence
   │  └─ No → Use @State in View
   │
   └─ Does parent need to access it?
      ├─ Yes → Use @Binding
      └─ No → Use @State
```

### Example: Input Field State

```swift
struct TodoInputView: View {
    @EnvironmentObject var viewModel: TodoViewModel

    // Local UI state (not shared, not persistent)
    @State private var inputText = ""
    @State private var showPicker = false

    var body: some View {
        TextField("New todo", text: $inputText)

        Button("Add") {
            // Send to ViewModel
            viewModel.addTodo(title: inputText)
            // Reset local state
            inputText = ""
        }
    }
}
```

### Reactive Updates

**Combine Framework Integration**:
```swift
class TodoViewModel: ObservableObject {
    @Published var todos: [Todo] = []
    @Published var searchText = ""

    var filteredTodos: [Todo] {
        if searchText.isEmpty {
            return todos
        } else {
            return todos.filter {
                $0.title.contains(searchText)
            }
        }
    }

    private var cancellables = Set<AnyCancellable>()

    init() {
        // React to search changes
        $searchText
            .debounce(for: .milliseconds(300), scheduler: RunLoop.main)
            .sink { [weak self] _ in
                self?.objectWillChange.send()
            }
            .store(in: &cancellables)
    }
}
```

---

## Persistence Layer

### UserDefaultsManager

**Purpose**: Centralize all persistence logic

**Benefits**:
- Single source of truth for persistence
- Easy to swap implementations (e.g., CoreData)
- Testable (can inject mock)
- Consistent error handling

**Architecture**:
```
TodoViewModel
      ↓
UserDefaultsManager (Singleton)
      ↓
UserDefaults (iOS System)
      ↓
Disk Storage
```

**Implementation**:
```swift
class UserDefaultsManager {
    static let shared = UserDefaultsManager()
    private let defaults = UserDefaults.standard
    private let key = "todos_key"

    func saveTodos(_ todos: [Todo]) {
        let data = try? JSONEncoder().encode(todos)
        defaults.set(data, forKey: key)
    }

    func loadTodos() -> [Todo] {
        guard let data = defaults.data(forKey: key),
              let todos = try? JSONDecoder().decode([Todo].self, from: data)
        else { return [] }
        return todos
    }
}
```

### Alternative Persistence Options

**1. CoreData** (for complex data)
```swift
class CoreDataManager {
    let container: NSPersistentContainer

    func saveTodo(_ todo: Todo) {
        let entity = TodoEntity(context: container.viewContext)
        entity.id = todo.id
        entity.title = todo.title
        try? container.viewContext.save()
    }
}
```

**2. SwiftData** (iOS 17+)
```swift
@Model
class Todo {
    var id: UUID
    var title: String
    var isCompleted: Bool
}

@Query var todos: [Todo]
```

**3. File System**
```swift
func saveTodos(_ todos: [Todo]) throws {
    let url = FileManager.default
        .urls(for: .documentDirectory, in: .userDomainMask)[0]
        .appendingPathComponent("todos.json")

    let data = try JSONEncoder().encode(todos)
    try data.write(to: url)
}
```

---

## Design Decisions

### Why SwiftUI Over UIKit?

**Chosen**: SwiftUI
**Rationale**:
- Modern, declarative syntax
- Less boilerplate code
- Built-in reactive updates
- Better performance for simple UIs
- Future-proof

**Trade-offs**:
- Limited to iOS 13+
- Some advanced features need newer iOS
- Smaller community compared to UIKit

### Why MVVM Over Other Patterns?

**Alternatives Considered**:

1. **MVC** (Model-View-Controller)
   - ❌ Massive View Controllers
   - ❌ Hard to test
   - ❌ Tight coupling

2. **VIPER** (View-Interactor-Presenter-Entity-Router)
   - ❌ Too complex for simple app
   - ❌ Lots of boilerplate
   - ✅ Great for large teams/apps

3. **Redux/TCA** (The Composable Architecture)
   - ❌ Steep learning curve
   - ❌ Lots of boilerplate
   - ✅ Excellent for complex state

**MVVM Chosen Because**:
- ✅ Perfect fit for SwiftUI
- ✅ Right balance of structure/simplicity
- ✅ Easy to understand
- ✅ Testable
- ✅ Scalable for medium apps

### Why UserDefaults Over CoreData?

**Chosen**: UserDefaults
**Rationale**:
- Simple data structure
- Small dataset expected
- No relationships between entities
- Easier to implement and maintain

**When to Use CoreData**:
- Large datasets (1000+ items)
- Complex relationships
- Advanced querying needed
- Offline-first apps

---

## Scalability

### Current Architecture Scales Well For:

- ✅ Adding new todo properties
- ✅ Adding more views
- ✅ Implementing search/filter
- ✅ Adding categories
- ✅ Unit testing
- ✅ Small to medium apps (< 20 screens)

### Scaling Strategies

#### 1. Multiple ViewModels

```swift
// Separate concerns
class TodoListViewModel: ObservableObject { }
class TodoDetailViewModel: ObservableObject { }
class SettingsViewModel: ObservableObject { }
```

#### 2. Service Layer

```swift
// Extract business logic
protocol TodoService {
    func fetchTodos() async throws -> [Todo]
    func saveTodo(_ todo: Todo) async throws
}

class TodoViewModel: ObservableObject {
    private let service: TodoService

    init(service: TodoService = DefaultTodoService()) {
        self.service = service
    }
}
```

#### 3. Repository Pattern

```swift
protocol TodoRepository {
    func getAll() -> [Todo]
    func save(_ todo: Todo)
    func delete(_ id: UUID)
}

class UserDefaultsTodoRepository: TodoRepository {
    // Implementation
}

class CoreDataTodoRepository: TodoRepository {
    // Alternative implementation
}
```

#### 4. Coordinator Pattern (for navigation)

```swift
class AppCoordinator {
    enum Route {
        case todoList
        case todoDetail(Todo)
        case settings
    }

    @Published var currentRoute: Route = .todoList
}
```

### When to Refactor

**Signs you need more structure**:
- ViewModels > 500 lines
- Multiple responsibilities in one ViewModel
- Difficulty writing tests
- Complex navigation logic
- Team size growing

**Refactoring Approach**:
1. Extract services
2. Split ViewModels by feature
3. Introduce coordinator for navigation
4. Add repository layer
5. Consider state management library (TCA, Redux)

---

## Testing Strategy

### Unit Tests (ViewModels)

```swift
class TodoViewModelTests: XCTestCase {
    var sut: TodoViewModel!
    var mockStorage: MockUserDefaultsManager!

    override func setUp() {
        mockStorage = MockUserDefaultsManager()
        sut = TodoViewModel(storage: mockStorage)
    }

    func testAddTodo() {
        sut.addTodo(title: "Test")
        XCTAssertEqual(sut.todos.count, 1)
        XCTAssertTrue(mockStorage.saveCalled)
    }
}
```

### UI Tests (Views)

```swift
class TodoListUITests: XCTestCase {
    func testAddTodo() {
        let app = XCUIApplication()
        app.launch()

        app.textFields["New todo"].tap()
        app.textFields["New todo"].typeText("Test")
        app.buttons["Add"].tap()

        XCTAssertTrue(app.staticTexts["Test"].exists)
    }
}
```

### Snapshot Tests

```swift
func testContentView() {
    let view = ContentView()
        .environmentObject(TodoViewModel.sample)

    assertSnapshot(matching: view, as: .image)
}
```

---

## Conclusion

This architecture provides:
- ✅ **Separation of Concerns**: Each layer has clear responsibility
- ✅ **Testability**: ViewModels easily tested
- ✅ **Maintainability**: Changes isolated to appropriate layers
- ✅ **Scalability**: Can grow with app complexity
- ✅ **SwiftUI Best Practices**: Leverages framework strengths
- ✅ **Clean Code**: Readable and understandable

For questions or improvements, please contribute to the project!

---

**Last Updated**: November 17, 2025
