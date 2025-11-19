//
//  ContentView.swift
//  TodoList
//
//  Main view controller for the Todo List application
//  iOS 15.0+
//

import SwiftUI

/// Main content view that serves as the container for the entire Todo List app
///
/// This view implements a modern iOS design with:
/// - Beautiful gradient background
/// - Custom navigation bar with technology badge
/// - Todo input section
/// - Scrollable todo list
/// - Statistics footer
struct ContentView: View {
    // MARK: - Environment Objects

    /// Access the shared TodoViewModel from the environment
    /// This is injected by the App struct
    @EnvironmentObject var todoViewModel: TodoViewModel

    // MARK: - State Properties

    /// Controls the presentation of the settings sheet
    @State private var showingSettings = false

    /// Controls the visibility of completed todos
    @State private var showCompletedTodos = true

    /// Controls the delete all confirmation alert
    @State private var showDeleteAllConfirmation = false

    /// Current color scheme (light/dark mode)
    @Environment(\.colorScheme) var colorScheme

    // MARK: - Body

    var body: some View {
        NavigationView {
            ZStack {
                // MARK: - Background
                backgroundGradient
                    .ignoresSafeArea()

                // MARK: - Main Content
                VStack(spacing: 0) {
                    // Header with technology badge
                    headerView
                        .padding(.top, 8)
                        .padding(.horizontal)

                    // Todo Input Section
                    TodoInputView()
                        .environmentObject(todoViewModel)
                        .padding(.horizontal)
                        .padding(.vertical, 12)

                    // Divider
                    Divider()
                        .background(Color.white.opacity(0.3))
                        .padding(.horizontal)

                    // Todo List Section
                    TodoListView(showCompleted: $showCompletedTodos)
                        .environmentObject(todoViewModel)

                    // Statistics Footer
                    statisticsFooter
                        .padding()
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    toggleButton
                }

                ToolbarItem(placement: .navigationBarTrailing) {
                    HStack(spacing: 16) {
                        filterMenu
                        sortMenu
                        settingsButton
                    }
                }
            }
            .searchable(text: $todoViewModel.searchText,
                       prompt: "Search todos...")
            .sheet(isPresented: $showingSettings) {
                settingsView
            }
            .alert("Clear All Todos", isPresented: $showDeleteAllConfirmation) {
                Button("Cancel", role: .cancel) { }
                Button("Delete All", role: .destructive) {
                    withAnimation {
                        todoViewModel.clearAll()
                    }
                    showingSettings = false
                }
            } message: {
                Text("Are you sure you want to delete all todos? This action cannot be undone.")
            }
        }
        // Support for iPad split view
        .navigationViewStyle(.stack)
    }

    // MARK: - Subviews

    /// Beautiful gradient background
    private var backgroundGradient: some View {
        LinearGradient(
            gradient: Gradient(colors: gradientColors),
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
    }

    /// Gradient colors based on color scheme
    private var gradientColors: [Color] {
        if colorScheme == .dark {
            return [
                Color(red: 0.1, green: 0.2, blue: 0.45),
                Color(red: 0.2, green: 0.1, blue: 0.3),
                Color(red: 0.1, green: 0.1, blue: 0.2)
            ]
        } else {
            return [
                Color(red: 0.4, green: 0.6, blue: 1.0),
                Color(red: 0.6, green: 0.4, blue: 0.9),
                Color(red: 0.5, green: 0.7, blue: 1.0)
            ]
        }
    }

    /// Header with title and SwiftUI badge
    private var headerView: some View {
        VStack(spacing: 8) {
            HStack {
                // App icon
                Image(systemName: "checklist")
                    .font(.system(size: 32, weight: .bold))
                    .foregroundColor(.white)

                VStack(alignment: .leading, spacing: 2) {
                    Text("Todo List")
                        .font(.system(size: 28, weight: .bold))
                        .foregroundColor(.white)

                    // Technology badge
                    HStack(spacing: 4) {
                        Image(systemName: "swift")
                            .font(.system(size: 10, weight: .semibold))
                        Text("SwiftUI")
                            .font(.system(size: 10, weight: .semibold))
                    }
                    .foregroundColor(.white.opacity(0.9))
                    .padding(.horizontal, 8)
                    .padding(.vertical, 3)
                    .background(
                        Capsule()
                            .fill(Color.white.opacity(0.2))
                    )
                }

                Spacer()
            }
        }
    }

    /// Toggle button to show/hide completed todos
    private var toggleButton: some View {
        Button(action: {
            withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                showCompletedTodos.toggle()
            }
        }) {
            Image(systemName: showCompletedTodos ? "eye.fill" : "eye.slash.fill")
                .foregroundColor(.white)
                .font(.system(size: 16, weight: .semibold))
        }
        .accessibilityLabel(showCompletedTodos ? "Hide completed todos" : "Show completed todos")
        .accessibilityHint("Double tap to toggle completed todos visibility")
    }

    /// Filter menu for todos
    private var filterMenu: some View {
        Menu {
            Picker("Filter", selection: $todoViewModel.currentFilter) {
                ForEach(TodoViewModel.FilterOption.allCases) { option in
                    Label(option.rawValue, systemImage: option.icon)
                        .tag(option)
                }
            }
        } label: {
            Image(systemName: "line.3.horizontal.decrease.circle")
                .foregroundColor(.white)
                .font(.system(size: 16, weight: .semibold))
        }
        .accessibilityLabel("Filter todos")
    }

    /// Sort menu for todos
    private var sortMenu: some View {
        Menu {
            Picker("Sort", selection: $todoViewModel.sortOrder) {
                ForEach(TodoViewModel.SortOrder.allCases) { order in
                    Label(order.rawValue, systemImage: order.icon)
                        .tag(order)
                }
            }
        } label: {
            Image(systemName: "arrow.up.arrow.down.circle")
                .foregroundColor(.white)
                .font(.system(size: 16, weight: .semibold))
        }
        .accessibilityLabel("Sort todos")
    }

    /// Settings button
    private var settingsButton: some View {
        Button(action: {
            showingSettings = true
        }) {
            Image(systemName: "gearshape.fill")
                .foregroundColor(.white)
                .font(.system(size: 16, weight: .semibold))
        }
        .accessibilityLabel("Settings")
    }

    /// Statistics footer showing todo counts
    private var statisticsFooter: some View {
        VStack(spacing: 8) {
            Divider()
                .background(Color.white.opacity(0.3))

            HStack(spacing: 20) {
                statisticItem(
                    title: "Total",
                    value: "\(todoViewModel.todos.count)",
                    icon: "list.bullet"
                )

                statisticItem(
                    title: "Active",
                    value: "\(todoViewModel.activeTodosCount)",
                    icon: "circle"
                )

                statisticItem(
                    title: "Completed",
                    value: "\(todoViewModel.completedTodosCount)",
                    icon: "checkmark.circle.fill"
                )
            }
            .padding(.vertical, 8)
        }
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(Color.white.opacity(0.1))
                .shadow(color: Color.black.opacity(0.1), radius: 5, x: 0, y: 2)
        )
    }

    /// Individual statistic item
    private func statisticItem(title: String, value: String, icon: String) -> some View {
        VStack(spacing: 4) {
            HStack(spacing: 4) {
                Image(systemName: icon)
                    .font(.system(size: 12, weight: .semibold))
                Text(value)
                    .font(.system(size: 18, weight: .bold))
            }
            .foregroundColor(.white)

            Text(title)
                .font(.system(size: 11, weight: .medium))
                .foregroundColor(.white.opacity(0.7))
        }
        .frame(maxWidth: .infinity)
    }

    /// Settings view
    private var settingsView: some View {
        NavigationView {
            List {
                Section(header: Text("Display")) {
                    Toggle("Show Completed Todos", isOn: $showCompletedTodos)
                }

                Section(header: Text("Data")) {
                    Button(action: {
                        showDeleteAllConfirmation = true
                    }) {
                        HStack {
                            Image(systemName: "trash")
                                .foregroundColor(.red)
                            Text("Clear All Todos")
                                .foregroundColor(.red)
                        }
                    }

                    Button(action: {
                        todoViewModel.clearCompleted()
                        showingSettings = false
                    }) {
                        HStack {
                            Image(systemName: "checkmark.circle.badge.xmark")
                                .foregroundColor(.orange)
                            Text("Clear Completed Todos")
                                .foregroundColor(.orange)
                        }
                    }
                }

                Section(header: Text("About")) {
                    HStack {
                        Text("Version")
                        Spacer()
                        Text("1.0.0")
                            .foregroundColor(.secondary)
                    }

                    HStack {
                        Text("Framework")
                        Spacer()
                        Text("SwiftUI")
                            .foregroundColor(.secondary)
                    }

                    HStack {
                        Text("iOS Version")
                        Spacer()
                        Text("15.0+")
                            .foregroundColor(.secondary)
                    }
                }
            }
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        showingSettings = false
                    }
                }
            }
        }
    }

}

// MARK: - Preview Provider

#Preview("Light Mode") {
    ContentView()
        .environmentObject(TodoViewModel())
        .preferredColorScheme(.light)
}

#Preview("Dark Mode") {
    ContentView()
        .environmentObject(TodoViewModel())
        .preferredColorScheme(.dark)
}

#Preview("With Todos") {
    let viewModel = TodoViewModel()
    viewModel.addTodo(title: "Learn SwiftUI")
    viewModel.addTodo(title: "Build iOS App")
    viewModel.addTodo(title: "Master MVVM Pattern")

    return ContentView()
        .environmentObject(viewModel)
}
