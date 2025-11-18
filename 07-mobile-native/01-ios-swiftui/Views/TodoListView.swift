//
//  TodoListView.swift
//  TodoList
//
//  List view displaying all todo items
//  iOS 15.0+
//

import SwiftUI

/// View displaying the list of todos
///
/// Features:
/// - Scrollable list of todos
/// - Swipe-to-delete gestures
/// - Empty state view
/// - Pull-to-refresh (optional)
/// - Section headers for completed/active
/// - Smooth animations
struct TodoListView: View {
    // MARK: - Environment Objects

    @EnvironmentObject var todoViewModel: TodoViewModel

    // MARK: - Bindings

    /// Control visibility of completed todos
    @Binding var showCompleted: Bool

    // MARK: - State Properties

    /// Currently editing todo ID
    @State private var editingTodoId: UUID?

    /// Color scheme
    @Environment(\.colorScheme) var colorScheme

    // MARK: - Body

    var body: some View {
        ScrollView {
            LazyVStack(spacing: 12) {
                if filteredTodos.isEmpty {
                    emptyStateView
                } else {
                    todosList
                }
            }
            .padding(.horizontal)
            .padding(.vertical, 12)
        }
    }

    // MARK: - Computed Properties

    /// Filtered todos based on showCompleted binding
    private var filteredTodos: [Todo] {
        if showCompleted {
            return todoViewModel.todos
        } else {
            return todoViewModel.todos.filter { !$0.isCompleted }
        }
    }

    /// Active todos
    private var activeTodos: [Todo] {
        filteredTodos.filter { !$0.isCompleted }
    }

    /// Completed todos
    private var completedTodos: [Todo] {
        filteredTodos.filter { $0.isCompleted }
    }

    // MARK: - Subviews

    /// Empty state view when no todos
    private var emptyStateView: some View {
        VStack(spacing: 16) {
            Spacer()
                .frame(height: 60)

            Image(systemName: showCompleted ? "checkmark.circle" : "tray")
                .font(.system(size: 60, weight: .thin))
                .foregroundColor(.white.opacity(0.4))

            Text(emptyStateText)
                .font(.system(size: 18, weight: .medium))
                .foregroundColor(.white.opacity(0.7))
                .multilineTextAlignment(.center)

            Text(emptyStateSubtext)
                .font(.system(size: 14, weight: .regular))
                .foregroundColor(.white.opacity(0.5))
                .multilineTextAlignment(.center)
                .padding(.horizontal, 40)

            Spacer()
        }
        .frame(maxWidth: .infinity)
        .padding()
    }

    /// Empty state text based on filter
    private var emptyStateText: String {
        if !showCompleted && todoViewModel.todos.contains(where: { $0.isCompleted }) {
            return "All Done!"
        } else if todoViewModel.todos.isEmpty {
            return "No Todos Yet"
        } else {
            return "No Active Todos"
        }
    }

    /// Empty state subtext
    private var emptyStateSubtext: String {
        if !showCompleted && todoViewModel.todos.contains(where: { $0.isCompleted }) {
            return "You've completed all your tasks. Great job!"
        } else if todoViewModel.todos.isEmpty {
            return "Add a todo to get started"
        } else {
            return "Toggle the eye icon to see completed todos"
        }
    }

    /// List of todos with sections
    private var todosList: some View {
        VStack(spacing: 20) {
            // Active todos section
            if !activeTodos.isEmpty {
                todoSection(
                    title: "Active",
                    todos: activeTodos,
                    icon: "circle"
                )
            }

            // Completed todos section
            if !completedTodos.isEmpty && showCompleted {
                todoSection(
                    title: "Completed",
                    todos: completedTodos,
                    icon: "checkmark.circle.fill"
                )
            }
        }
    }

    /// Todo section with header
    private func todoSection(title: String, todos: [Todo], icon: String) -> some View {
        VStack(spacing: 8) {
            // Section header
            HStack {
                Image(systemName: icon)
                    .font(.system(size: 14, weight: .semibold))
                Text(title)
                    .font(.system(size: 14, weight: .semibold))
                Spacer()
                Text("\(todos.count)")
                    .font(.system(size: 12, weight: .medium))
                    .padding(.horizontal, 8)
                    .padding(.vertical, 2)
                    .background(
                        Capsule()
                            .fill(Color.white.opacity(0.2))
                    )
            }
            .foregroundColor(.white.opacity(0.8))
            .padding(.horizontal, 8)

            // Todo items
            ForEach(todos) { todo in
                TodoItemRow(
                    todo: todo,
                    isEditing: editingTodoId == todo.id,
                    onToggle: {
                        todoViewModel.toggleTodo(id: todo.id)
                    },
                    onDelete: {
                        todoViewModel.deleteTodo(id: todo.id)
                    },
                    onEdit: {
                        withAnimation {
                            editingTodoId = todo.id
                        }
                    },
                    onEndEdit: {
                        withAnimation {
                            editingTodoId = nil
                        }
                    }
                )
                .transition(.asymmetric(
                    insertion: .scale.combined(with: .opacity),
                    removal: .scale.combined(with: .opacity)
                ))
            }
        }
    }
}

// MARK: - Preview Provider

#Preview("With Todos") {
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

        TodoListView(showCompleted: .constant(true))
            .environmentObject(TodoViewModel.sample)
    }
}

#Preview("Empty State") {
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

        TodoListView(showCompleted: .constant(true))
            .environmentObject(TodoViewModel.empty)
    }
}

#Preview("Active Only") {
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

        TodoListView(showCompleted: .constant(false))
            .environmentObject(TodoViewModel.sample)
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

        TodoListView(showCompleted: .constant(true))
            .environmentObject(TodoViewModel.sample)
    }
    .preferredColorScheme(.dark)
}
