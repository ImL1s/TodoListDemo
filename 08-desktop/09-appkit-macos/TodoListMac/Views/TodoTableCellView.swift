//
//  TodoTableCellView.swift
//  TodoListMac
//
//  Created on 2025-11-19
//  AppKit macOS Todo List Application
//

import Cocoa

/// Custom table cell view for displaying todo items
/// Provides a checkbox, title label, and additional controls
class TodoTableCellView: NSTableCellView {

    // MARK: - IBOutlets

    @IBOutlet weak var checkboxButton: NSButton!
    @IBOutlet weak var titleTextField: NSTextField!
    @IBOutlet weak var priorityIndicator: NSView!
    @IBOutlet weak var dateLabel: NSTextField!
    @IBOutlet weak var deleteButton: NSButton!

    // MARK: - Properties

    /// The todo item this cell represents
    var todoItem: TodoItem? {
        didSet {
            updateUI()
        }
    }

    /// Callback when checkbox is toggled
    var onToggleCompletion: ((TodoItem) -> Void)?

    /// Callback when delete is clicked
    var onDelete: ((TodoItem) -> Void)?

    /// Callback when title is edited
    var onTitleEdit: ((TodoItem, String) -> Void)?

    // MARK: - Initialization

    override func awakeFromNib() {
        super.awakeFromNib()
        setupUI()
    }

    // MARK: - UI Setup

    private func setupUI() {
        // Configure checkbox
        checkboxButton?.target = self
        checkboxButton?.action = #selector(checkboxToggled(_:))

        // Configure title text field
        titleTextField?.delegate = self
        titleTextField?.isEditable = true
        titleTextField?.isBordered = false
        titleTextField?.drawsBackground = false
        titleTextField?.focusRingType = .none

        // Configure priority indicator
        priorityIndicator?.wantsLayer = true
        priorityIndicator?.layer?.cornerRadius = 3

        // Configure delete button
        deleteButton?.target = self
        deleteButton?.action = #selector(deleteButtonClicked(_:))
        deleteButton?.isHidden = true // Show on hover

        // Add tracking area for hover effects
        let trackingArea = NSTrackingArea(
            rect: bounds,
            options: [.mouseEnteredAndExited, .activeInKeyWindow, .inVisibleRect],
            owner: self,
            userInfo: nil
        )
        addTrackingArea(trackingArea)
    }

    // MARK: - Update UI

    private func updateUI() {
        guard let todo = todoItem else { return }

        // Update checkbox
        checkboxButton?.state = todo.isCompleted ? .on : .off

        // Update title
        titleTextField?.stringValue = todo.title

        // Apply strikethrough if completed
        if todo.isCompleted {
            let attributes: [NSAttributedString.Key: Any] = [
                .strikethroughStyle: NSUnderlineStyle.single.rawValue,
                .foregroundColor: NSColor.secondaryLabelColor
            ]
            titleTextField?.attributedStringValue = NSAttributedString(
                string: todo.title,
                attributes: attributes
            )
        } else {
            titleTextField?.textColor = .labelColor
        }

        // Update priority indicator
        updatePriorityIndicator(priority: todo.priority)

        // Update date label
        let formatter = RelativeDateTimeFormatter()
        formatter.unitsStyle = .abbreviated
        dateLabel?.stringValue = formatter.localizedString(for: todo.createdAt, relativeTo: Date())
    }

    private func updatePriorityIndicator(priority: Int) {
        guard let indicator = priorityIndicator else { return }

        indicator.isHidden = priority == 0

        switch priority {
        case 3: // High
            indicator.layer?.backgroundColor = NSColor.systemRed.cgColor
        case 2: // Medium
            indicator.layer?.backgroundColor = NSColor.systemOrange.cgColor
        case 1: // Low
            indicator.layer?.backgroundColor = NSColor.systemBlue.cgColor
        default:
            indicator.isHidden = true
        }
    }

    // MARK: - Actions

    @objc private func checkboxToggled(_ sender: NSButton) {
        guard let todo = todoItem else { return }
        onToggleCompletion?(todo)
    }

    @objc private func deleteButtonClicked(_ sender: NSButton) {
        guard let todo = todoItem else { return }
        onDelete?(todo)
    }

    // MARK: - Mouse Tracking

    override func mouseEntered(with event: NSEvent) {
        deleteButton?.isHidden = false
        deleteButton?.alphaValue = 0
        NSAnimationContext.runAnimationGroup { context in
            context.duration = 0.2
            deleteButton?.animator().alphaValue = 1.0
        }
    }

    override func mouseExited(with event: NSEvent) {
        NSAnimationContext.runAnimationGroup({ context in
            context.duration = 0.2
            deleteButton?.animator().alphaValue = 0
        }, completionHandler: {
            self.deleteButton?.isHidden = true
        })
    }

    // MARK: - Appearance

    override func updateLayer() {
        super.updateLayer()

        // Support dark mode
        if let effectiveAppearance = effectiveAppearance.bestMatch(from: [.darkAqua, .aqua]) {
            if effectiveAppearance == .darkAqua {
                // Dark mode adjustments
                titleTextField?.textColor = todoItem?.isCompleted ?? false ? .secondaryLabelColor : .labelColor
            } else {
                // Light mode adjustments
                titleTextField?.textColor = todoItem?.isCompleted ?? false ? .secondaryLabelColor : .labelColor
            }
        }
    }
}

// MARK: - NSTextFieldDelegate

extension TodoTableCellView: NSTextFieldDelegate {
    func controlTextDidEndEditing(_ obj: Notification) {
        guard let textField = obj.object as? NSTextField,
              textField == titleTextField,
              let todo = todoItem else { return }

        let newTitle = textField.stringValue.trimmingCharacters(in: .whitespacesAndNewlines)

        if !newTitle.isEmpty && newTitle != todo.title {
            onTitleEdit?(todo, newTitle)
        } else {
            // Revert to original title if empty or unchanged
            textField.stringValue = todo.title
        }
    }

    func control(_ control: NSControl, textView: NSTextView, doCommandBy commandSelector: Selector) -> Bool {
        if commandSelector == #selector(NSResponder.insertNewline(_:)) {
            // End editing on Enter key
            window?.makeFirstResponder(nil)
            return true
        }
        return false
    }
}

// MARK: - Custom Priority Badge View

/// A custom view for displaying priority badges
class PriorityBadgeView: NSView {

    var priority: Int = 0 {
        didSet {
            needsDisplay = true
        }
    }

    override var wantsUpdateLayer: Bool {
        return true
    }

    override func updateLayer() {
        super.updateLayer()

        layer?.backgroundColor = NSColor.clear.cgColor

        switch priority {
        case 3:
            layer?.backgroundColor = NSColor.systemRed.withAlphaComponent(0.2).cgColor
        case 2:
            layer?.backgroundColor = NSColor.systemOrange.withAlphaComponent(0.2).cgColor
        case 1:
            layer?.backgroundColor = NSColor.systemBlue.withAlphaComponent(0.2).cgColor
        default:
            layer?.backgroundColor = NSColor.clear.cgColor
        }

        layer?.cornerRadius = 4
    }

    override func draw(_ dirtyRect: NSRect) {
        super.draw(dirtyRect)

        guard priority > 0 else { return }

        let color: NSColor
        let text: String

        switch priority {
        case 3:
            color = .systemRed
            text = "HIGH"
        case 2:
            color = .systemOrange
            text = "MED"
        case 1:
            color = .systemBlue
            text = "LOW"
        default:
            return
        }

        let attributes: [NSAttributedString.Key: Any] = [
            .font: NSFont.systemFont(ofSize: 9, weight: .semibold),
            .foregroundColor: color
        ]

        let textSize = text.size(withAttributes: attributes)
        let textRect = NSRect(
            x: (bounds.width - textSize.width) / 2,
            y: (bounds.height - textSize.height) / 2,
            width: textSize.width,
            height: textSize.height
        )

        text.draw(in: textRect, withAttributes: attributes)
    }
}
