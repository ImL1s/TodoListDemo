//
//  TodoItemRow.swift
//  TodoList
//
//  Individual todo item row component
//  iOS 15.0+
//

import SwiftUI

/// Individual todo item row
///
/// Features:
/// - Checkbox for completion toggle
/// - Todo title with strike-through when completed
/// - Priority indicator
/// - Swipe-to-delete gesture
/// - Edit mode (optional)
/// - Due date indicator
/// - Tags display
/// - Smooth animations
struct TodoItemRow: View {
    // MARK: - Properties

    /// The todo item to display
    let todo: Todo

    /// Whether this item is being edited
    let isEditing: Bool

    /// Callback when toggle button is tapped
    let onToggle: () -> Void

    /// Callback when delete is requested
    let onDelete: () -> Void

    /// Callback when edit is requested
    let onEdit: () -> Void

    /// Callback when editing ends
    let onEndEdit: () -> Void

    // MARK: - State Properties

    /// Swipe offset for delete gesture
    @State private var swipeOffset: CGFloat = 0

    /// Whether to show delete button
    @State private var showDeleteButton = false

    /// Color scheme
    @Environment(\.colorScheme) var colorScheme

    // MARK: - Constants

    private let deleteThreshold: CGFloat = -80
    private let maxSwipe: CGFloat = -120

    // MARK: - Body

    var body: some View {
        ZStack(alignment: .trailing) {
            // Background delete button
            deleteButton
                .opacity(showDeleteButton ? 1 : 0)

            // Main content
            mainContent
                .offset(x: swipeOffset)
                .gesture(swipeGesture)
        }
        .frame(height: 70)
        .animation(.spring(response: 0.3, dampingFraction: 0.7), value: swipeOffset)
        .animation(.spring(response: 0.3, dampingFraction: 0.7), value: showDeleteButton)
        .accessibilityElement(children: .combine)
        .accessibilityLabel(accessibilityLabel)
        .accessibilityHint(accessibilityHint)
        .accessibilityAddTraits(todo.isCompleted ? [.isButton, .isSelected] : [.isButton])
        .accessibilityAction(named: "Toggle Completion") {
            onToggle()
        }
        .accessibilityAction(named: "Delete") {
            onDelete()
        }
    }

    // MARK: - Accessibility

    /// Accessibility label for the todo item
    private var accessibilityLabel: String {
        var components: [String] = []

        // Title
        components.append(todo.title)

        // Priority
        components.append("\(todo.priority.rawValue) priority")

        // Completion status
        components.append(todo.isCompleted ? "Completed" : "Not completed")

        // Due date
        if let dueDate = todo.formattedDueDate {
            if todo.isOverdue {
                components.append("Overdue: \(dueDate)")
            } else {
                components.append("Due: \(dueDate)")
            }
        }

        // Tags
        if !todo.tags.isEmpty {
            components.append("Tags: \(todo.tags.joined(separator: ", "))")
        }

        return components.joined(separator: ". ")
    }

    /// Accessibility hint for the todo item
    private var accessibilityHint: String {
        if todo.isCompleted {
            return "Double tap to mark as not completed. Swipe left to delete."
        } else {
            return "Double tap to mark as completed. Swipe left to delete."
        }
    }

    // MARK: - Subviews

    /// Main content of the row
    private var mainContent: some View {
        HStack(spacing: 12) {
            // Completion toggle button
            toggleButton

            // Todo content
            VStack(alignment: .leading, spacing: 4) {
                // Title
                titleText

                // Metadata row (priority, due date, tags)
                metadataRow
            }

            Spacer()

            // Chevron or edit indicator
            if !todo.isCompleted {
                Image(systemName: "chevron.right")
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundColor(.white.opacity(0.3))
            }
        }
        .padding(12)
        .background(rowBackground)
        .cornerRadius(12)
    }

    /// Toggle completion button
    private var toggleButton: some View {
        Button(action: {
            onToggle()
            generateHapticFeedback()
        }) {
            ZStack {
                Circle()
                    .stroke(priorityColor, lineWidth: 2)
                    .frame(width: 28, height: 28)

                if todo.isCompleted {
                    Circle()
                        .fill(priorityColor)
                        .frame(width: 28, height: 28)

                    Image(systemName: "checkmark")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(.white)
                }
            }
        }
        .buttonStyle(PlainButtonStyle())
        .accessibilityLabel(todo.isCompleted ? "Completed" : "Not completed")
        .accessibilityHint("Double tap to toggle")
    }

    /// Title text with strike-through if completed
    private var titleText: some View {
        Text(todo.title)
            .font(.body)  // Dynamic Type support
            .foregroundColor(
                todo.isCompleted ?
                .white.opacity(0.5) :
                .white
            )
            .strikethrough(todo.isCompleted, color: .white.opacity(0.5))
            .lineLimit(2)
    }

    /// Metadata row with priority, due date, and tags
    private var metadataRow: some View {
        HStack(spacing: 8) {
            // Priority indicator
            priorityIndicator

            // Due date (if exists)
            if let dueDate = todo.formattedDueDate {
                dueDateIndicator(dueDate)
            }

            // Tags (show first tag if exists)
            if let firstTag = todo.tags.first {
                tagIndicator(firstTag)
            }

            Spacer()
        }
    }

    /// Priority indicator
    private var priorityIndicator: some View {
        HStack(spacing: 3) {
            Image(systemName: todo.priority.icon)
                .font(.system(size: 9, weight: .semibold))
            Text(todo.priority.rawValue)
                .font(.system(size: 10, weight: .semibold))
        }
        .foregroundColor(priorityColor)
        .padding(.horizontal, 6)
        .padding(.vertical, 2)
        .background(
            Capsule()
                .fill(priorityColor.opacity(0.2))
        )
    }

    /// Due date indicator
    private func dueDateIndicator(_ dateString: String) -> some View {
        HStack(spacing: 3) {
            Image(systemName: todo.isOverdue ? "exclamationmark.triangle.fill" : "calendar")
                .font(.system(size: 9, weight: .semibold))
            Text(dateString)
                .font(.system(size: 10, weight: .medium))
        }
        .foregroundColor(todo.isOverdue ? .red : .white.opacity(0.7))
        .padding(.horizontal, 6)
        .padding(.vertical, 2)
        .background(
            Capsule()
                .fill(
                    todo.isOverdue ?
                    Color.red.opacity(0.2) :
                    Color.white.opacity(0.15)
                )
        )
    }

    /// Tag indicator
    private func tagIndicator(_ tag: String) -> some View {
        HStack(spacing: 3) {
            Image(systemName: "tag.fill")
                .font(.system(size: 8, weight: .semibold))
            Text(tag)
                .font(.system(size: 10, weight: .medium))
        }
        .foregroundColor(.white.opacity(0.7))
        .padding(.horizontal, 6)
        .padding(.vertical, 2)
        .background(
            Capsule()
                .fill(Color.white.opacity(0.15))
        )
    }

    /// Row background
    private var rowBackground: some View {
        RoundedRectangle(cornerRadius: 12)
            .fill(
                todo.isCompleted ?
                Color.white.opacity(0.1) :
                Color.white.opacity(colorScheme == .dark ? 0.15 : 0.25)
            )
            .shadow(
                color: Color.black.opacity(0.1),
                radius: todo.isCompleted ? 2 : 5,
                x: 0,
                y: 2
            )
    }

    /// Delete button revealed on swipe
    private var deleteButton: some View {
        Button(action: {
            onDelete()
            generateHapticFeedback(.success)
        }) {
            VStack(spacing: 4) {
                Image(systemName: "trash.fill")
                    .font(.system(size: 20, weight: .semibold))
                Text("Delete")
                    .font(.system(size: 11, weight: .medium))
            }
            .foregroundColor(.white)
            .frame(width: 80)
            .frame(maxHeight: .infinity)
            .background(Color.red)
            .cornerRadius(12)
        }
    }

    /// Priority color based on todo priority
    private var priorityColor: Color {
        switch todo.priority {
        case .low:
            return .blue
        case .medium:
            return .green
        case .high:
            return .orange
        case .urgent:
            return .red
        }
    }

    // MARK: - Gestures

    /// Swipe gesture for delete action
    private var swipeGesture: some Gesture {
        DragGesture()
            .onChanged { value in
                // Only allow left swipe
                if value.translation.width < 0 {
                    let newOffset = max(value.translation.width, maxSwipe)
                    swipeOffset = newOffset
                    showDeleteButton = newOffset < deleteThreshold
                }
            }
            .onEnded { value in
                if value.translation.width < deleteThreshold * 1.5 {
                    // Delete if swiped far enough
                    onDelete()
                    generateHapticFeedback(.success)
                } else if value.translation.width < deleteThreshold {
                    // Show delete button
                    swipeOffset = maxSwipe
                    showDeleteButton = true
                } else {
                    // Reset
                    resetSwipe()
                }
            }
    }

    // MARK: - Private Methods

    /// Reset swipe position
    private func resetSwipe() {
        withAnimation {
            swipeOffset = 0
            showDeleteButton = false
        }
    }

    /// Generate haptic feedback
    private func generateHapticFeedback(_ type: UINotificationFeedbackGenerator.FeedbackType = .success) {
        let generator = UINotificationFeedbackGenerator()
        generator.notificationOccurred(type)
    }

    /// Generate impact haptic
    private func generateHapticFeedback() {
        let generator = UIImpactFeedbackGenerator(style: .medium)
        generator.impactOccurred()
    }
}

// MARK: - Preview Provider

#Preview("Active Todo") {
    ZStack {
        LinearGradient(
            gradient: Gradient(colors: [
                Color(red: 0.4, green: 0.6, blue: 1.0),
                Color(red: 0.6, green: 0.4, blue: 0.9)
            ]),
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
        .ignoresSafeArea()

        TodoItemRow(
            todo: Todo(
                title: "Learn SwiftUI",
                priority: .high,
                dueDate: Calendar.current.date(byAdding: .day, value: 2, to: Date()),
                tags: ["Learning"]
            ),
            isEditing: false,
            onToggle: {},
            onDelete: {},
            onEdit: {},
            onEndEdit: {}
        )
        .padding()
    }
}

#Preview("Completed Todo") {
    ZStack {
        LinearGradient(
            gradient: Gradient(colors: [
                Color(red: 0.4, green: 0.6, blue: 1.0),
                Color(red: 0.6, green: 0.4, blue: 0.9)
            ]),
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
        .ignoresSafeArea()

        TodoItemRow(
            todo: Todo(
                title: "Build Todo App",
                isCompleted: true,
                priority: .medium,
                tags: ["Project"]
            ),
            isEditing: false,
            onToggle: {},
            onDelete: {},
            onEdit: {},
            onEndEdit: {}
        )
        .padding()
    }
}

#Preview("Overdue Todo") {
    ZStack {
        LinearGradient(
            gradient: Gradient(colors: [
                Color(red: 0.4, green: 0.6, blue: 1.0),
                Color(red: 0.6, green: 0.4, blue: 0.9)
            ]),
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
        .ignoresSafeArea()

        TodoItemRow(
            todo: Todo(
                title: "Urgent Task - Already Overdue",
                priority: .urgent,
                dueDate: Calendar.current.date(byAdding: .day, value: -2, to: Date()),
                tags: ["Urgent"]
            ),
            isEditing: false,
            onToggle: {},
            onDelete: {},
            onEdit: {},
            onEndEdit: {}
        )
        .padding()
    }
}

#Preview("Dark Mode") {
    ZStack {
        LinearGradient(
            gradient: Gradient(colors: [
                Color(red: 0.1, green: 0.2, blue: 0.45),
                Color(red: 0.2, green: 0.1, blue: 0.3)
            ]),
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
        .ignoresSafeArea()

        VStack(spacing: 12) {
            TodoItemRow(
                todo: Todo(title: "Low Priority", priority: .low),
                isEditing: false,
                onToggle: {},
                onDelete: {},
                onEdit: {},
                onEndEdit: {}
            )

            TodoItemRow(
                todo: Todo(title: "Medium Priority", priority: .medium),
                isEditing: false,
                onToggle: {},
                onDelete: {},
                onEdit: {},
                onEndEdit: {}
            )

            TodoItemRow(
                todo: Todo(title: "High Priority", priority: .high),
                isEditing: false,
                onToggle: {},
                onDelete: {},
                onEdit: {},
                onEndEdit: {}
            )

            TodoItemRow(
                todo: Todo(title: "Urgent Priority", priority: .urgent),
                isEditing: false,
                onToggle: {},
                onDelete: {},
                onEdit: {},
                onEndEdit: {}
            )
        }
        .padding()
    }
    .preferredColorScheme(.dark)
}
