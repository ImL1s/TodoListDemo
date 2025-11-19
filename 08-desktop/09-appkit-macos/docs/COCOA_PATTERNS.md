# Cocoa Design Patterns Guide

A comprehensive guide to the design patterns used in Cocoa and AppKit development.

## Table of Contents

1. [MVC Pattern (Cocoa Style)](#mvc-pattern)
2. [Delegation](#delegation)
3. [Target-Action](#target-action)
4. [Responder Chain](#responder-chain)
5. [Key-Value Observing (KVO)](#key-value-observing)
6. [Notifications](#notifications)
7. [Additional Patterns](#additional-patterns)

## MVC Pattern

### Model-View-Controller (Cocoa Style)

The MVC pattern is fundamental to Cocoa development. Cocoa's MVC is slightly different from the traditional MVC pattern.

### Components

**Model**
- Represents data and business logic
- Independent of the user interface
- Notifies controllers of changes

**View**
- Displays data to the user
- Receives user input
- Knows nothing about the model

**Controller**
- Mediates between model and view
- Updates views when model changes
- Updates model based on user actions

### Implementation

**Model Layer**
```swift
// Model: Pure data and business logic
class TodoItem: NSObject, Codable {
    @objc dynamic var title: String
    @objc dynamic var isCompleted: Bool
    let id: UUID

    init(title: String, isCompleted: Bool = false) {
        self.id = UUID()
        self.title = title
        self.isCompleted = isCompleted
        super.init()
    }

    func toggleCompletion() {
        isCompleted.toggle()
    }
}

// Model Manager
@objc class TodoManager: NSObject {
    @objc dynamic var todos: [TodoItem] = []

    func addTodo(title: String) -> TodoItem {
        let todo = TodoItem(title: title)
        todos.append(todo)
        return todo
    }

    func removeTodo(_ todo: TodoItem) {
        todos.removeAll { $0.id == todo.id }
    }
}
```

**View Layer**
```swift
// View: No business logic
class TodoCellView: NSTableCellView {
    @IBOutlet weak var titleLabel: NSTextField!
    @IBOutlet weak var checkboxButton: NSButton!

    func configure(with todo: TodoItem) {
        titleLabel.stringValue = todo.title
        checkboxButton.state = todo.isCompleted ? .on : .off
    }
}
```

**Controller Layer**
```swift
// Controller: Coordinates model and view
class TodoViewController: NSViewController {

    // View references
    @IBOutlet weak var tableView: NSTableView!
    @IBOutlet weak var inputField: NSTextField!

    // Model reference
    private let todoManager = TodoManager()

    override func viewDidLoad() {
        super.viewDidLoad()

        // Setup view
        tableView.dataSource = self
        tableView.delegate = self

        // Observe model
        todoManager.addObserver(
            self,
            forKeyPath: "todos",
            options: [.new],
            context: nil
        )
    }

    // Handle user actions
    @IBAction func addButtonClicked(_ sender: NSButton) {
        let title = inputField.stringValue
        todoManager.addTodo(title: title)
        inputField.stringValue = ""
    }

    // Update view when model changes
    override func observeValue(
        forKeyPath keyPath: String?,
        of object: Any?,
        change: [NSKeyValueChangeKey : Any]?,
        context: UnsafeMutableRawPointer?
    ) {
        if keyPath == "todos" {
            tableView.reloadData()
        }
    }
}

// Connect to view
extension TodoViewController: NSTableViewDataSource {
    func numberOfRows(in tableView: NSTableView) -> Int {
        return todoManager.todos.count
    }
}

extension TodoViewController: NSTableViewDelegate {
    func tableView(_ tableView: NSTableView,
                   viewFor tableColumn: NSTableColumn?,
                   row: Int) -> NSView? {
        let cell = tableView.makeView(
            withIdentifier: NSUserInterfaceItemIdentifier("TodoCell"),
            owner: self
        ) as? TodoCellView

        let todo = todoManager.todos[row]
        cell?.configure(with: todo)

        return cell
    }
}
```

### Benefits of MVC

1. **Separation of Concerns**: Each component has a clear responsibility
2. **Reusability**: Models and views can be reused
3. **Testability**: Models can be tested independently
4. **Maintainability**: Changes to one layer don't affect others

## Delegation

### What is Delegation?

Delegation is a design pattern where one object acts on behalf of another. It's extensively used in Cocoa for callbacks and customization.

### Protocol-Based Delegation

```swift
// Define delegate protocol
protocol TodoManagerDelegate: AnyObject {
    func todoManager(_ manager: TodoManager, didAddTodo todo: TodoItem)
    func todoManager(_ manager: TodoManager, didRemoveTodo todo: TodoItem)
    func todoManager(_ manager: TodoManager, didUpdateTodo todo: TodoItem)
}

// Optional methods using @objc
@objc protocol OptionalDelegate: AnyObject {
    @objc optional func todoManagerWillUpdate(_ manager: TodoManager)
    @objc optional func todoManagerDidUpdate(_ manager: TodoManager)
}

// Delegating class
class TodoManager {
    weak var delegate: TodoManagerDelegate?

    private var todos: [TodoItem] = []

    func addTodo(title: String) {
        let todo = TodoItem(title: title)
        todos.append(todo)

        // Notify delegate
        delegate?.todoManager(self, didAddTodo: todo)
    }

    func removeTodo(_ todo: TodoItem) {
        todos.removeAll { $0.id == todo.id }
        delegate?.todoManager(self, didRemoveTodo: todo)
    }
}

// Delegate implementation
class TodoViewController: NSViewController {
    private let todoManager = TodoManager()

    override func viewDidLoad() {
        super.viewDidLoad()

        // Set self as delegate
        todoManager.delegate = self
    }
}

extension TodoViewController: TodoManagerDelegate {
    func todoManager(_ manager: TodoManager, didAddTodo todo: TodoItem) {
        print("Todo added: \(todo.title)")
        tableView.reloadData()
    }

    func todoManager(_ manager: TodoManager, didRemoveTodo todo: TodoItem) {
        print("Todo removed: \(todo.title)")
        tableView.reloadData()
    }

    func todoManager(_ manager: TodoManager, didUpdateTodo todo: TodoItem) {
        print("Todo updated: \(todo.title)")
        tableView.reloadData()
    }
}
```

### Built-in Delegates

Cocoa frameworks use delegation extensively:

```swift
// NSTableViewDelegate
extension MyViewController: NSTableViewDelegate {
    func tableView(_ tableView: NSTableView,
                   viewFor tableColumn: NSTableColumn?,
                   row: Int) -> NSView? {
        // Return view for row
    }

    func tableViewSelectionDidChange(_ notification: Notification) {
        // Handle selection change
    }
}

// NSTextFieldDelegate
extension MyViewController: NSTextFieldDelegate {
    func controlTextDidChange(_ obj: Notification) {
        // Handle text change
    }

    func control(_ control: NSControl,
                 textView: NSTextView,
                 doCommandBy commandSelector: Selector) -> Bool {
        if commandSelector == #selector(insertNewline(_:)) {
            // Handle Enter key
            return true
        }
        return false
    }
}

// NSWindowDelegate
extension MyWindowController: NSWindowDelegate {
    func windowWillClose(_ notification: Notification) {
        // Cleanup before window closes
    }

    func windowDidResize(_ notification: Notification) {
        // Handle window resize
    }
}
```

### Best Practices

1. **Use Weak References**: Always use `weak` for delegates to avoid retain cycles
2. **Protocol Conformance**: Use extensions for protocol conformance
3. **Optional Methods**: Use `@objc optional` for truly optional methods
4. **Naming Convention**: Use delegate/dataSource naming pattern

## Target-Action

### Overview

Target-Action is a design pattern for handling user interactions. When a control is activated, it sends an action message to a target object.

### Basic Usage

```swift
class MyViewController: NSViewController {

    private let button = NSButton()

    override func viewDidLoad() {
        super.viewDidLoad()

        // Set target and action
        button.target = self
        button.action = #selector(buttonClicked(_:))

        view.addSubview(button)
    }

    // Action method
    @objc func buttonClicked(_ sender: NSButton) {
        print("Button was clicked!")
    }
}
```

### Multiple Targets

```swift
class MultiTargetExample: NSViewController {

    let button = NSButton()

    override func viewDidLoad() {
        super.viewDidLoad()

        // Primary action
        button.target = self
        button.action = #selector(primaryAction(_:))

        // Additional targets can be added via NSControl's cell
        // But generally, one action per control is cleaner
    }

    @objc func primaryAction(_ sender: NSButton) {
        print("Primary action")

        // Can trigger additional actions programmatically
        secondaryAction()
    }

    func secondaryAction() {
        print("Secondary action")
    }
}
```

### Action with Tag

```swift
class TaggedActionsViewController: NSViewController {

    override func viewDidLoad() {
        super.viewDidLoad()

        // Create multiple buttons with same action
        for i in 0..<5 {
            let button = NSButton()
            button.title = "Button \(i)"
            button.tag = i
            button.target = self
            button.action = #selector(buttonClicked(_:))
            // Add to view...
        }
    }

    @objc func buttonClicked(_ sender: NSButton) {
        print("Button with tag \(sender.tag) clicked")

        switch sender.tag {
        case 0: handleFirstButton()
        case 1: handleSecondButton()
        default: handleOtherButton()
        }
    }

    func handleFirstButton() { }
    func handleSecondButton() { }
    func handleOtherButton() { }
}
```

### Menu Items

```swift
class MenuViewController: NSViewController {

    func createMenu() {
        let menu = NSMenu()

        let item1 = NSMenuItem(
            title: "New Todo",
            action: #selector(newTodo(_:)),
            keyEquivalent: "n"
        )
        item1.target = self
        menu.addItem(item1)

        let item2 = NSMenuItem(
            title: "Delete Todo",
            action: #selector(deleteTodo(_:)),
            keyEquivalent: "d"
        )
        item2.target = self
        menu.addItem(item2)

        return menu
    }

    @objc func newTodo(_ sender: NSMenuItem) {
        print("New todo")
    }

    @objc func deleteTodo(_ sender: NSMenuItem) {
        print("Delete todo")
    }

    // Validate menu items
    override func validateMenuItem(_ menuItem: NSMenuItem) -> Bool {
        if menuItem.action == #selector(deleteTodo(_:)) {
            // Enable only if there's a selection
            return tableView.selectedRow >= 0
        }
        return true
    }
}
```

## Responder Chain

### Understanding the Responder Chain

The responder chain is a series of linked responder objects that handle events in Cocoa applications.

### Responder Hierarchy

```
NSApplication
    └── NSWindow
        └── NSWindowController
            └── NSViewController
                └── NSView
                    └── NSControl (Button, TextField, etc.)
```

### Event Flow

```swift
class ResponderChainExample: NSView {

    // Handle mouse events
    override func mouseDown(with event: NSEvent) {
        print("View handling mouseDown")

        // Can pass to next responder
        super.mouseDown(with: event)
    }

    // Handle key events
    override func keyDown(with event: NSEvent) {
        if event.charactersIgnoringModifiers == " " {
            print("Space key handled by view")
        } else {
            // Pass to next responder
            super.keyDown(with: event)
        }
    }

    // Accept first responder status
    override var acceptsFirstResponder: Bool {
        return true
    }

    // Become first responder
    override func becomeFirstResponder() -> Bool {
        print("View became first responder")
        return super.becomeFirstResponder()
    }

    // Resign first responder
    override func resignFirstResponder() -> Bool {
        print("View resigned first responder")
        return super.resignFirstResponder()
    }
}
```

### Custom Actions in Responder Chain

```swift
class TodoViewController: NSViewController {

    // Define custom actions
    @IBAction func deleteSelectedTodos(_ sender: Any?) {
        let selectedRows = tableView.selectedRowIndexes
        // Delete logic...
    }

    @IBAction func selectAllTodos(_ sender: Any?) {
        tableView.selectRowIndexes(
            IndexSet(0..<tableView.numberOfRows),
            byExtendingSelection: false
        )
    }

    // Validate actions
    override func validateUserInterfaceItem(_ item: NSValidatedUserInterfaceItem) -> Bool {
        if item.action == #selector(deleteSelectedTodos(_:)) {
            return tableView.selectedRow >= 0
        }
        if item.action == #selector(selectAllTodos(_:)) {
            return tableView.numberOfRows > 0
        }
        return true
    }
}
```

### First Responder Management

```swift
class WindowManagementExample: NSViewController {

    @IBOutlet weak var textField: NSTextField!

    func focusTextField() {
        // Make text field first responder
        view.window?.makeFirstResponder(textField)
    }

    func clearFocus() {
        // Clear first responder
        view.window?.makeFirstResponder(nil)
    }

    // Intercept responder changes
    override func viewDidAppear() {
        super.viewDidAppear()
        // Automatically focus text field
        focusTextField()
    }
}
```

## Key-Value Observing

### KVO Basics

KVO allows objects to be notified of changes to specified properties of other objects.

### Traditional KVO (Objective-C Style)

```swift
class TodoManager: NSObject {
    @objc dynamic var todos: [TodoItem] = []
    @objc dynamic var totalCount: Int = 0
}

class ObserverViewController: NSViewController {

    private let todoManager = TodoManager()
    private var todosObservation: NSKeyValueObservation?

    override func viewDidLoad() {
        super.viewDidLoad()

        // Add observer (old API)
        todoManager.addObserver(
            self,
            forKeyPath: "todos",
            options: [.new, .old],
            context: nil
        )
    }

    override func observeValue(
        forKeyPath keyPath: String?,
        of object: Any?,
        change: [NSKeyValueChangeKey : Any]?,
        context: UnsafeMutableRawPointer?
    ) {
        if keyPath == "todos" {
            if let newValue = change?[.newKey] as? [TodoItem] {
                print("Todos changed: \(newValue.count) items")
                tableView.reloadData()
            }
        }
    }

    deinit {
        todoManager.removeObserver(self, forKeyPath: "todos")
    }
}
```

### Modern KVO (Swift API)

```swift
class ModernObserverViewController: NSViewController {

    private let todoManager = TodoManager()
    private var todosObservation: NSKeyValueObservation?

    override func viewDidLoad() {
        super.viewDidLoad()

        // Modern Swift KVO API
        todosObservation = todoManager.observe(
            \.todos,
            options: [.new, .old]
        ) { [weak self] manager, change in
            guard let self = self else { return }

            print("Todos changed")
            print("Old count: \(change.oldValue?.count ?? 0)")
            print("New count: \(change.newValue?.count ?? 0)")

            DispatchQueue.main.async {
                self.tableView.reloadData()
            }
        }
    }

    deinit {
        todosObservation?.invalidate()
    }
}
```

### KVO Compliance

```swift
// Manual KVO compliance
class ManualKVOCompliance: NSObject {

    private var _todos: [TodoItem] = []

    @objc dynamic var todos: [TodoItem] {
        get {
            return _todos
        }
        set {
            willChangeValue(forKey: "todos")
            _todos = newValue
            didChangeValue(forKey: "todos")
        }
    }

    // For collections, use more specific notifications
    @objc func addTodo(_ todo: TodoItem) {
        let index = _todos.count
        willChange(.insertion, valuesAt: IndexSet(integer: index), forKey: "todos")
        _todos.append(todo)
        didChange(.insertion, valuesAt: IndexSet(integer: index), forKey: "todos")
    }

    @objc func removeTodo(at index: Int) {
        willChange(.removal, valuesAt: IndexSet(integer: index), forKey: "todos")
        _todos.remove(at: index)
        didChange(.removal, valuesAt: IndexSet(integer: index), forKey: "todos")
    }
}
```

## Notifications

### NotificationCenter

NotificationCenter provides a broadcast mechanism for sending messages between objects.

### Basic Usage

```swift
// Define notification names
extension Notification.Name {
    static let todoAdded = Notification.Name("TodoAdded")
    static let todoRemoved = Notification.Name("TodoRemoved")
    static let todoUpdated = Notification.Name("TodoUpdated")
}

// Posting notifications
class TodoManager {
    func addTodo(_ todo: TodoItem) {
        todos.append(todo)

        // Post notification
        NotificationCenter.default.post(
            name: .todoAdded,
            object: self,
            userInfo: ["todo": todo]
        )
    }
}

// Observing notifications
class TodoViewController: NSViewController {

    override func viewDidLoad() {
        super.viewDidLoad()

        // Add observer
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(todoAdded(_:)),
            name: .todoAdded,
            object: nil
        )

        // Or use block-based API
        NotificationCenter.default.addObserver(
            forName: .todoAdded,
            object: nil,
            queue: .main
        ) { [weak self] notification in
            self?.handleTodoAdded(notification)
        }
    }

    @objc func todoAdded(_ notification: Notification) {
        if let todo = notification.userInfo?["todo"] as? TodoItem {
            print("Todo added: \(todo.title)")
            tableView.reloadData()
        }
    }

    func handleTodoAdded(_ notification: Notification) {
        // Handle notification
    }

    deinit {
        NotificationCenter.default.removeObserver(self)
    }
}
```

### Custom Notification Objects

```swift
// Type-safe notification
struct TodoNotification {
    static let didAdd = Notification.Name("TodoDidAdd")
    static let didRemove = Notification.Name("TodoDidRemove")

    let todo: TodoItem
    let source: TodoManager

    static func post(name: Notification.Name, todo: TodoItem, source: TodoManager) {
        let notification = TodoNotification(todo: todo, source: source)
        NotificationCenter.default.post(
            name: name,
            object: source,
            userInfo: ["notification": notification]
        )
    }

    static func from(_ notification: Notification) -> TodoNotification? {
        return notification.userInfo?["notification"] as? TodoNotification
    }
}

// Usage
class TypeSafeTodoManager {
    func addTodo(_ todo: TodoItem) {
        todos.append(todo)
        TodoNotification.post(name: .didAdd, todo: todo, source: self)
    }
}

class TypeSafeObserver: NSViewController {
    override func viewDidLoad() {
        super.viewDidLoad()

        NotificationCenter.default.addObserver(
            forName: TodoNotification.didAdd,
            object: nil,
            queue: .main
        ) { notification in
            if let todoNotification = TodoNotification.from(notification) {
                print("Todo added: \(todoNotification.todo.title)")
            }
        }
    }
}
```

## Additional Patterns

### Singleton

```swift
class TodoManager {
    static let shared = TodoManager()

    private init() {
        // Private initializer prevents external instantiation
    }

    private var todos: [TodoItem] = []

    func addTodo(_ todo: TodoItem) {
        todos.append(todo)
    }
}

// Usage
TodoManager.shared.addTodo(todo)
```

### Factory Pattern

```swift
protocol Todo {
    var title: String { get }
    var isCompleted: Bool { get }
}

class SimpleTodo: Todo {
    let title: String
    var isCompleted: Bool

    init(title: String) {
        self.title = title
        self.isCompleted = false
    }
}

class PriorityTodo: Todo {
    let title: String
    var isCompleted: Bool
    let priority: Int

    init(title: String, priority: Int) {
        self.title = title
        self.priority = priority
        self.isCompleted = false
    }
}

// Factory
class TodoFactory {
    enum TodoType {
        case simple
        case priority(Int)
    }

    static func createTodo(type: TodoType, title: String) -> Todo {
        switch type {
        case .simple:
            return SimpleTodo(title: title)
        case .priority(let level):
            return PriorityTodo(title: title, priority: level)
        }
    }
}

// Usage
let simpleTodo = TodoFactory.createTodo(type: .simple, title: "Buy milk")
let priorityTodo = TodoFactory.createTodo(type: .priority(3), title: "Urgent task")
```

### Observer Pattern

```swift
protocol TodoObserver: AnyObject {
    func todosDidChange(_ todos: [TodoItem])
}

class ObservableTodoManager {
    private var observers: [TodoObserver] = []
    private var todos: [TodoItem] = [] {
        didSet {
            notifyObservers()
        }
    }

    func addObserver(_ observer: TodoObserver) {
        observers.append(observer)
    }

    func removeObserver(_ observer: TodoObserver) {
        observers.removeAll { $0 === observer }
    }

    private func notifyObservers() {
        observers.forEach { $0.todosDidChange(todos) }
    }

    func addTodo(_ todo: TodoItem) {
        todos.append(todo)
    }
}

// Usage
class ObserverViewController: NSViewController, TodoObserver {
    let manager = ObservableTodoManager()

    override func viewDidLoad() {
        super.viewDidLoad()
        manager.addObserver(self)
    }

    func todosDidChange(_ todos: [TodoItem]) {
        tableView.reloadData()
    }

    deinit {
        manager.removeObserver(self)
    }
}
```

---

These design patterns form the foundation of Cocoa development. Mastering them will make you a more effective macOS developer and help you write cleaner, more maintainable code.
