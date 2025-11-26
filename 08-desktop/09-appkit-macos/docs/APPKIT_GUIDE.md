# AppKit Framework Guide

A comprehensive guide to understanding and using AppKit for macOS application development.

## Table of Contents

1. [Introduction to AppKit](#introduction-to-appkit)
2. [AppKit vs SwiftUI](#appkit-vs-swiftui)
3. [NSView Hierarchy](#nsview-hierarchy)
4. [NSViewController Lifecycle](#nsviewcontroller-lifecycle)
5. [NSTableView Usage](#nstableview-usage)
6. [Interface Builder (XIB/Storyboard)](#interface-builder)
7. [Programmatic UI](#programmatic-ui)
8. [Best Practices](#best-practices)

## Introduction to AppKit

AppKit is Apple's original object-oriented framework for building user interfaces on macOS. It has been the foundation of Mac applications since the early days of Mac OS X and continues to be relevant for many types of applications.

### What is AppKit?

AppKit provides:
- A complete UI toolkit (windows, views, controls)
- Event handling system
- Drawing and graphics support
- Document management
- Printing support
- Accessibility features

### When to Use AppKit

Choose AppKit when you need:
- **Mature APIs**: Decades of refinement and stability
- **Fine-grained Control**: Precise control over UI behavior
- **Legacy Support**: Support for older macOS versions
- **Complex UIs**: Custom drawing and advanced layouts
- **Existing Codebase**: Integration with Objective-C code

### Core Components

```swift
import Cocoa  // Imports AppKit and Foundation

// Main components
NSApplication     // The application object
NSWindow          // Window management
NSView            // Base class for all views
NSViewController  // View controller base class
NSControl         // Base for interactive controls
```

## AppKit vs SwiftUI

### Feature Comparison

| Feature | AppKit | SwiftUI |
|---------|--------|---------|
| First Released | 1994 | 2019 |
| Language | Objective-C/Swift | Swift only |
| Paradigm | Imperative | Declarative |
| UI Definition | XIB/Storyboard or Code | Code only |
| Minimum macOS | 10.0+ | 10.15+ |
| Learning Curve | Steeper | Gentler |
| Flexibility | Very High | Growing |
| Maturity | Very Mature | Still Evolving |
| Documentation | Extensive | Growing |
| Third-party Support | Excellent | Good |

### Code Comparison

**AppKit (Programmatic)**
```swift
class MyViewController: NSViewController {
    private let button = NSButton()

    override func viewDidLoad() {
        super.viewDidLoad()

        button.title = "Click Me"
        button.target = self
        button.action = #selector(buttonClicked)
        button.frame = NSRect(x: 100, y: 100, width: 120, height: 40)

        view.addSubview(button)
    }

    @objc func buttonClicked() {
        print("Button clicked!")
    }
}
```

**SwiftUI**
```swift
struct MyView: View {
    var body: some View {
        Button("Click Me") {
            print("Button clicked!")
        }
        .frame(width: 120, height: 40)
    }
}
```

### When to Choose AppKit

1. **Targeting Older macOS Versions**
   - Need to support macOS < 10.15
   - Maximum compatibility

2. **Complex Custom Views**
   - Custom drawing with Core Graphics
   - Advanced animation control
   - Precise layout requirements

3. **Existing Codebase**
   - Large AppKit codebase to maintain
   - Integration with Objective-C

4. **Specific Features**
   - Some features only available in AppKit
   - NSTableView with advanced features
   - Complex responder chain usage

### When to Choose SwiftUI

1. **New Projects**
   - Starting from scratch
   - Modern macOS only (10.15+)

2. **Rapid Development**
   - Quick prototyping
   - Simple to moderate complexity

3. **Cross-Platform**
   - Sharing code with iOS/iPadOS
   - Unified codebase

## NSView Hierarchy

### Understanding the View Tree

Every AppKit window contains a hierarchy of views:

```
NSWindow
└── contentView (NSView)
    ├── NSTableView
    │   └── NSTableCellView (many)
    ├── NSTextField
    └── NSButton
```

### NSView Basics

```swift
class NSView: NSResponder {
    // Frame and bounds
    var frame: NSRect           // Position in superview
    var bounds: NSRect          // Local coordinate system

    // View hierarchy
    var superview: NSView?
    var subviews: [NSView]
    func addSubview(_ view: NSView)
    func removeFromSuperview()

    // Drawing
    var needsDisplay: Bool
    func draw(_ dirtyRect: NSRect)

    // Layer backing
    var wantsLayer: Bool
    var layer: CALayer?

    // Appearance
    var appearance: NSAppearance?
    var effectiveAppearance: NSAppearance { get }
}
```

### Custom Views

Creating a custom view:

```swift
class CustomView: NSView {

    // MARK: - Initialization

    override init(frame frameRect: NSRect) {
        super.init(frame: frameRect)
        commonInit()
    }

    required init?(coder: NSCoder) {
        super.init(coder: coder)
        commonInit()
    }

    private func commonInit() {
        // Setup code here
        wantsLayer = true
        layer?.backgroundColor = NSColor.white.cgColor
    }

    // MARK: - Drawing

    override func draw(_ dirtyRect: NSRect) {
        super.draw(dirtyRect)

        // Custom drawing
        NSColor.blue.setFill()
        let rect = NSRect(x: 10, y: 10, width: 100, height: 100)
        rect.fill()
    }

    // MARK: - Layout

    override func layout() {
        super.layout()
        // Custom layout logic
    }

    // MARK: - Appearance

    override func updateLayer() {
        super.updateLayer()
        // Update layer properties
        layer?.backgroundColor = NSColor.controlBackgroundColor.cgColor
    }
}
```

### Layer-Backed Views

AppKit supports layer-backed views for better performance:

```swift
class ModernView: NSView {
    override init(frame frameRect: NSRect) {
        super.init(frame: frameRect)

        // Enable layer backing
        wantsLayer = true

        // Configure layer
        layer?.cornerRadius = 8
        layer?.borderWidth = 1
        layer?.borderColor = NSColor.gray.cgColor

        // Shadow
        shadow = NSShadow()
        layer?.shadowOpacity = 0.3
        layer?.shadowRadius = 5
        layer?.shadowOffset = NSSize(width: 0, height: -2)
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) not implemented")
    }
}
```

## NSViewController Lifecycle

### Lifecycle Methods

```swift
class MyViewController: NSViewController {

    // MARK: - Lifecycle

    // 1. Initialization
    override init(nibName: NSNib.Name?, bundle: Bundle?) {
        super.init(nibName: nibName, bundle: bundle)
        print("init(nibName:bundle:)")
    }

    required init?(coder: NSCoder) {
        super.init(coder: coder)
        print("init(coder:)")
    }

    // 2. View loading
    override func loadView() {
        super.loadView()
        print("loadView()")
        // Create view hierarchy if not using XIB/Storyboard
    }

    // 3. View loaded
    override func viewDidLoad() {
        super.viewDidLoad()
        print("viewDidLoad()")
        // View is loaded, setup UI here
    }

    // 4. View will appear
    override func viewWillAppear() {
        super.viewWillAppear()
        print("viewWillAppear()")
        // View is about to be shown
    }

    // 5. View appeared
    override func viewDidAppear() {
        super.viewDidAppear()
        print("viewDidAppear()")
        // View is now visible
    }

    // 6. View will disappear
    override func viewWillDisappear() {
        super.viewWillDisappear()
        print("viewWillDisappear()")
        // View is about to be hidden
    }

    // 7. View disappeared
    override func viewDidDisappear() {
        super.viewDidDisappear()
        print("viewDidDisappear()")
        // View is now hidden
    }

    // Layout
    override func viewWillLayout() {
        super.viewWillLayout()
        print("viewWillLayout()")
    }

    override func viewDidLayout() {
        super.viewDidLayout()
        print("viewDidLayout()")
    }
}
```

### Typical Setup Pattern

```swift
class TodoViewController: NSViewController {

    // MARK: - IBOutlets

    @IBOutlet weak var tableView: NSTableView!
    @IBOutlet weak var inputField: NSTextField!

    // MARK: - Properties

    private var todos: [TodoItem] = []

    // MARK: - Lifecycle

    override func viewDidLoad() {
        super.viewDidLoad()

        setupUI()
        setupObservers()
        loadData()
    }

    // MARK: - Setup

    private func setupUI() {
        tableView.delegate = self
        tableView.dataSource = self
        inputField.delegate = self
    }

    private func setupObservers() {
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(dataDidChange),
            name: .dataChanged,
            object: nil
        )
    }

    private func loadData() {
        // Load data from storage
    }

    // MARK: - Cleanup

    deinit {
        NotificationCenter.default.removeObserver(self)
    }
}
```

## NSTableView Usage

### NSTableView Overview

NSTableView is the primary view for displaying lists and tables in macOS:

```swift
class TableViewController: NSViewController {

    @IBOutlet weak var tableView: NSTableView!

    private var data: [Item] = []

    override func viewDidLoad() {
        super.viewDidLoad()

        // Configure table view
        tableView.delegate = self
        tableView.dataSource = self

        // Register cell XIB
        let nib = NSNib(nibNamed: "CustomCellView", bundle: nil)
        tableView.register(nib, forIdentifier: NSUserInterfaceItemIdentifier("CustomCell"))

        // Configure appearance
        tableView.rowHeight = 44
        tableView.usesAutomaticRowHeights = false
        tableView.selectionHighlightStyle = .regular
        tableView.allowsEmptySelection = true
    }
}
```

### NSTableViewDataSource

```swift
extension TableViewController: NSTableViewDataSource {

    // Required: Number of rows
    func numberOfRows(in tableView: NSTableView) -> Int {
        return data.count
    }

    // Optional: Object value for row
    func tableView(_ tableView: NSTableView,
                   objectValueFor tableColumn: NSTableColumn?,
                   row: Int) -> Any? {
        return data[row]
    }
}
```

### NSTableViewDelegate

```swift
extension TableViewController: NSTableViewDelegate {

    // View-based table view
    func tableView(_ tableView: NSTableView,
                   viewFor tableColumn: NSTableColumn?,
                   row: Int) -> NSView? {

        let identifier = NSUserInterfaceItemIdentifier("CustomCell")

        guard let cellView = tableView.makeView(
            withIdentifier: identifier,
            owner: self
        ) as? CustomCellView else {
            return nil
        }

        // Configure cell
        let item = data[row]
        cellView.configure(with: item)

        return cellView
    }

    // Row selection
    func tableViewSelectionDidChange(_ notification: Notification) {
        let selectedRow = tableView.selectedRow
        if selectedRow >= 0 {
            let item = data[selectedRow]
            print("Selected: \(item)")
        }
    }

    // Row height (if using variable heights)
    func tableView(_ tableView: NSTableView,
                   heightOfRow row: Int) -> CGFloat {
        return 44
    }

    // Should select row
    func tableView(_ tableView: NSTableView,
                   shouldSelectRow row: Int) -> Bool {
        return true
    }
}
```

### Custom Table Cell View

```swift
class CustomCellView: NSTableCellView {

    @IBOutlet weak var titleLabel: NSTextField!
    @IBOutlet weak var subtitleLabel: NSTextField!
    @IBOutlet weak var iconImageView: NSImageView!

    func configure(with item: Item) {
        titleLabel.stringValue = item.title
        subtitleLabel.stringValue = item.subtitle
        iconImageView.image = item.icon
    }

    override func prepareForReuse() {
        super.prepareForReuse()
        // Reset cell state
        titleLabel.stringValue = ""
        subtitleLabel.stringValue = ""
        iconImageView.image = nil
    }
}
```

### Advanced Features

**Drag and Drop**
```swift
extension TableViewController {

    func tableView(_ tableView: NSTableView,
                   pasteboardWriterForRow row: Int) -> NSPasteboardWriting? {
        let item = NSPasteboardItem()
        item.setString(String(row), forType: .string)
        return item
    }

    func tableView(_ tableView: NSTableView,
                   validateDrop info: NSDraggingInfo,
                   proposedRow row: Int,
                   proposedDropOperation dropOperation: NSTableView.DropOperation) -> NSDragOperation {
        return .move
    }

    func tableView(_ tableView: NSTableView,
                   acceptDrop info: NSDraggingInfo,
                   row: Int,
                   dropOperation: NSTableView.DropOperation) -> Bool {
        // Handle drop
        return true
    }
}
```

## Interface Builder

### XIB Files

XIB (XML Interface Builder) files define user interfaces visually:

**Advantages:**
- Visual interface design
- Quick prototyping
- No code for basic layouts
- Preview in Interface Builder

**Disadvantages:**
- Merge conflicts in version control
- Less type-safe
- Harder to review in pull requests

### Creating a XIB

1. **File → New → File → View**
2. **Name it (e.g., CustomView.xib)**
3. **Design your interface**
4. **Connect outlets and actions**

### Loading a XIB

```swift
// Load XIB
let nib = NSNib(nibNamed: "CustomView", bundle: nil)

// Instantiate from NIB
var topLevelObjects: NSArray?
nib?.instantiate(withOwner: self, topLevelObjects: &topLevelObjects)

if let view = topLevelObjects?.first(where: { $0 is NSView }) as? NSView {
    // Use the view
}
```

### Storyboards

Storyboards contain multiple scenes (view controllers) and their relationships:

**Advantages:**
- See full app flow
- Define segues visually
- Manage multiple scenes in one file

**Usage:**
```swift
// Get main storyboard
let storyboard = NSStoryboard(name: "Main", bundle: nil)

// Instantiate view controller
let identifier = NSStoryboard.SceneIdentifier("MyViewController")
guard let viewController = storyboard.instantiateController(
    withIdentifier: identifier
) as? MyViewController else {
    return
}

// Present or use view controller
```

## Programmatic UI

### Creating UI in Code

Many developers prefer creating UI programmatically for better control and version control:

```swift
class ProgrammaticViewController: NSViewController {

    // MARK: - Properties

    private let stackView = NSStackView()
    private let titleLabel = NSTextField(labelWithString: "")
    private let button = NSButton()

    // MARK: - Lifecycle

    override func loadView() {
        view = NSView()
        view.wantsLayer = true
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        setupViews()
        setupConstraints()
    }

    // MARK: - Setup

    private func setupViews() {
        // Configure stack view
        stackView.orientation = .vertical
        stackView.spacing = 16
        stackView.alignment = .centerX
        stackView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(stackView)

        // Configure label
        titleLabel.font = .systemFont(ofSize: 24, weight: .bold)
        titleLabel.alignment = .center
        titleLabel.stringValue = "Hello, AppKit!"

        // Configure button
        button.title = "Click Me"
        button.bezelStyle = .rounded
        button.target = self
        button.action = #selector(buttonClicked)

        // Add to stack
        stackView.addArrangedSubview(titleLabel)
        stackView.addArrangedSubview(button)
    }

    private func setupConstraints() {
        NSLayoutConstraint.activate([
            // Stack view constraints
            stackView.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            stackView.centerYAnchor.constraint(equalTo: view.centerYAnchor),
            stackView.leadingAnchor.constraint(greaterThanOrEqualTo: view.leadingAnchor, constant: 20),
            stackView.trailingAnchor.constraint(lessThanOrEqualTo: view.trailingAnchor, constant: -20),

            // Button constraints
            button.widthAnchor.constraint(greaterThanOrEqualToConstant: 120)
        ])
    }

    // MARK: - Actions

    @objc private func buttonClicked() {
        print("Button clicked!")
    }
}
```

### Auto Layout

```swift
// Disable autoresizing mask
view.translatesAutoresizingMaskIntoConstraints = false

// Create constraints
NSLayoutConstraint.activate([
    view.leadingAnchor.constraint(equalTo: superview.leadingAnchor, constant: 20),
    view.trailingAnchor.constraint(equalTo: superview.trailingAnchor, constant: -20),
    view.topAnchor.constraint(equalTo: superview.topAnchor, constant: 20),
    view.heightAnchor.constraint(equalToConstant: 100)
])

// Or use Visual Format Language
let views = ["button": button]
let constraints = NSLayoutConstraint.constraints(
    withVisualFormat: "H:|-20-[button]-20-|",
    options: [],
    metrics: nil,
    views: views
)
NSLayoutConstraint.activate(constraints)
```

## Best Practices

### 1. Memory Management

```swift
// Use weak references for delegates
weak var delegate: MyDelegate?

// Clean up observers
deinit {
    NotificationCenter.default.removeObserver(self)
}

// Use [weak self] in closures
button.onClick = { [weak self] in
    self?.handleClick()
}
```

### 2. Thread Safety

```swift
// Always update UI on main thread
DispatchQueue.main.async {
    self.tableView.reloadData()
}

// Use @MainActor for view controllers (Swift 5.5+)
@MainActor
class MyViewController: NSViewController {
    // All methods run on main thread
}
```

### 3. View Reuse

```swift
// Reuse table view cells
let identifier = NSUserInterfaceItemIdentifier("CellID")
guard let cell = tableView.makeView(
    withIdentifier: identifier,
    owner: self
) as? MyCellView else {
    // Create new cell if needed
    return MyCellView()
}
```

### 4. Appearance Support

```swift
// Support dark mode
override func viewDidAppear() {
    super.viewDidAppear()
    updateColors()
}

private func updateColors() {
    view.layer?.backgroundColor = NSColor.controlBackgroundColor.cgColor
}

// Observe appearance changes
override func viewDidChangeEffectiveAppearance() {
    super.viewDidChangeEffectiveAppearance()
    updateColors()
}
```

### 5. Accessibility

```swift
// Set accessibility properties
button.setAccessibilityLabel("Add Todo")
button.setAccessibilityHint("Adds a new todo item to the list")
button.setAccessibilityRole(.button)
```

### 6. Organization

```swift
class WellOrganizedViewController: NSViewController {

    // MARK: - IBOutlets

    @IBOutlet weak var tableView: NSTableView!

    // MARK: - Properties

    private var data: [Item] = []

    // MARK: - Lifecycle

    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
    }

    // MARK: - Setup

    private func setupUI() {
        // Setup code
    }

    // MARK: - Actions

    @IBAction func buttonClicked(_ sender: NSButton) {
        // Action code
    }

    // MARK: - Private Methods

    private func updateData() {
        // Update logic
    }
}

// MARK: - NSTableViewDataSource

extension WellOrganizedViewController: NSTableViewDataSource {
    // Protocol implementation
}

// MARK: - NSTableViewDelegate

extension WellOrganizedViewController: NSTableViewDelegate {
    // Protocol implementation
}
```

---

This guide covers the essentials of AppKit development. For more detailed information, consult Apple's official AppKit documentation and the macOS Human Interface Guidelines.
