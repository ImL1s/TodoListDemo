//
//  TouchBarSupport.swift
//  TodoListMac
//
//  Created on 2025-11-19
//  AppKit macOS Todo List Application
//

import Cocoa

@available(macOS 10.12.2, *)
extension NSTouchBarItem.Identifier {
    static let addTodo = NSTouchBarItem.Identifier("com.todolistmac.addTodo")
    static let toggleFilter = NSTouchBarItem.Identifier("com.todolistmac.toggleFilter")
    static let clearCompleted = NSTouchBarItem.Identifier("com.todolistmac.clearCompleted")
    static let statistics = NSTouchBarItem.Identifier("com.todolistmac.statistics")
    static let search = NSTouchBarItem.Identifier("com.todolistmac.search")
}

// MARK: - MainViewController Touch Bar Support

@available(macOS 10.12.2, *)
extension MainViewController: NSTouchBarDelegate {

    override func makeTouchBar() -> NSTouchBar? {
        let touchBar = NSTouchBar()
        touchBar.delegate = self
        touchBar.customizationIdentifier = .todoListTouchBar
        touchBar.defaultItemIdentifiers = [
            .addTodo,
            .flexibleSpace,
            .toggleFilter,
            .flexibleSpace,
            .clearCompleted,
            .otherItemsProxy
        ]
        touchBar.customizationAllowedItemIdentifiers = [
            .addTodo,
            .toggleFilter,
            .clearCompleted,
            .statistics,
            .search
        ]

        return touchBar
    }

    func touchBar(_ touchBar: NSTouchBar, makeItemForIdentifier identifier: NSTouchBarItem.Identifier) -> NSTouchBarItem? {

        switch identifier {
        case .addTodo:
            let item = NSCustomTouchBarItem(identifier: identifier)
            let button = NSButton(
                image: NSImage(systemSymbolName: "plus.circle.fill", accessibilityDescription: "Add Todo")!,
                target: self,
                action: #selector(addButtonClicked(_:))
            )
            button.bezelColor = .systemBlue
            item.view = button
            item.customizationLabel = "Add Todo"
            return item

        case .toggleFilter:
            let item = NSCustomTouchBarItem(identifier: identifier)
            let segmentedControl = NSSegmentedControl(
                labels: ["All", "Active", "Done"],
                trackingMode: .selectOne,
                target: self,
                action: #selector(filterChanged(_:))
            )
            segmentedControl.selectedSegment = 0
            item.view = segmentedControl
            item.customizationLabel = "Filter"
            return item

        case .clearCompleted:
            let item = NSCustomTouchBarItem(identifier: identifier)
            let button = NSButton(
                title: "Clear",
                target: self,
                action: #selector(clearCompletedClicked(_:))
            )
            button.bezelColor = .systemRed
            item.view = button
            item.customizationLabel = "Clear Completed"
            return item

        case .statistics:
            let item = NSCustomTouchBarItem(identifier: identifier)
            let button = NSButton(
                image: NSImage(systemSymbolName: "chart.bar.fill", accessibilityDescription: "Statistics")!,
                target: self,
                action: #selector(showStatistics(_:))
            )
            item.view = button
            item.customizationLabel = "Statistics"
            return item

        case .search:
            let item = NSCustomTouchBarItem(identifier: identifier)
            let button = NSButton(
                image: NSImage(systemSymbolName: "magnifyingglass", accessibilityDescription: "Search")!,
                target: self,
                action: #selector(focusSearch(_:))
            )
            item.view = button
            item.customizationLabel = "Search"
            return item

        default:
            return nil
        }
    }

    @objc private func showStatistics(_ sender: Any) {
        let stats = todoService.getProductivityStats()

        let alert = NSAlert()
        alert.messageText = "Todo Statistics"
        alert.informativeText = """
        Total: \(stats.totalTodos)
        Active: \(stats.activeTodos)
        Completed: \(stats.completedTodos)
        """
        alert.alertStyle = .informational
        alert.addButton(withTitle: "OK")
        alert.runModal()
    }

    @objc private func focusSearch(_ sender: Any) {
        view.window?.makeFirstResponder(searchField)
    }
}

@available(macOS 10.12.2, *)
extension NSTouchBar.CustomizationIdentifier {
    static let todoListTouchBar = NSTouchBar.CustomizationIdentifier("com.todolistmac.touchBar")
}

// MARK: - Touch Bar Scrubber Support

@available(macOS 10.12.2, *)
class TodoScrubberItemView: NSScrubberItemView {

    private let checkboxImageView = NSImageView()
    private let titleLabel = NSTextField(labelWithString: "")

    override init(frame frameRect: NSRect) {
        super.init(frame: frameRect)
        setupViews()
    }

    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupViews()
    }

    private func setupViews() {
        // Checkbox
        checkboxImageView.translatesAutoresizingMaskIntoConstraints = false
        addSubview(checkboxImageView)

        // Title
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        titleLabel.font = .systemFont(ofSize: 13)
        titleLabel.lineBreakMode = .byTruncatingTail
        addSubview(titleLabel)

        // Constraints
        NSLayoutConstraint.activate([
            checkboxImageView.leadingAnchor.constraint(equalTo: leadingAnchor, constant: 4),
            checkboxImageView.centerYAnchor.constraint(equalTo: centerYAnchor),
            checkboxImageView.widthAnchor.constraint(equalToConstant: 16),
            checkboxImageView.heightAnchor.constraint(equalToConstant: 16),

            titleLabel.leadingAnchor.constraint(equalTo: checkboxImageView.trailingAnchor, constant: 8),
            titleLabel.trailingAnchor.constraint(equalTo: trailingAnchor, constant: -4),
            titleLabel.centerYAnchor.constraint(equalTo: centerYAnchor)
        ])
    }

    func configure(with todo: TodoItem) {
        let checkImage = todo.isCompleted ?
            NSImage(systemSymbolName: "checkmark.circle.fill", accessibilityDescription: "Completed") :
            NSImage(systemSymbolName: "circle", accessibilityDescription: "Not Completed")

        checkboxImageView.image = checkImage
        checkboxImageView.contentTintColor = todo.isCompleted ? .systemGreen : .secondaryLabelColor

        titleLabel.stringValue = todo.title
        titleLabel.textColor = todo.isCompleted ? .secondaryLabelColor : .labelColor

        if todo.isCompleted {
            titleLabel.attributedStringValue = NSAttributedString(
                string: todo.title,
                attributes: [
                    .strikethroughStyle: NSUnderlineStyle.single.rawValue,
                    .foregroundColor: NSColor.secondaryLabelColor
                ]
            )
        }
    }
}

// MARK: - Haptic Feedback Support

@available(macOS 10.12.2, *)
extension NSHapticFeedbackManager {

    static func performFeedback(_ pattern: NSHapticFeedbackManager.FeedbackPattern, performanceTime: NSHapticFeedbackManager.PerformanceTime = .default) {
        NSHapticFeedbackManager.defaultPerformer.perform(pattern, performanceTime: performanceTime)
    }

    static func todoCompleted() {
        performFeedback(.levelChange)
    }

    static func todoAdded() {
        performFeedback(.generic)
    }

    static func todoDeleted() {
        performFeedback(.alignment)
    }
}

// MARK: - Touch Bar Animation Support

@available(macOS 10.12.2, *)
extension NSView {

    func animateTouchBarSuccess() {
        NSAnimationContext.runAnimationGroup { context in
            context.duration = 0.2
            context.timingFunction = CAMediaTimingFunction(name: .easeInEaseOut)

            animator().alphaValue = 0.5
        } completionHandler: {
            NSAnimationContext.runAnimationGroup { context in
                context.duration = 0.2
                self.animator().alphaValue = 1.0
            }
        }
    }

    func animateTouchBarError() {
        let animation = CAKeyframeAnimation(keyPath: "transform.translation.x")
        animation.values = [0, -5, 5, -5, 5, 0]
        animation.duration = 0.4

        wantsLayer = true
        layer?.add(animation, forKey: "shake")
    }
}
