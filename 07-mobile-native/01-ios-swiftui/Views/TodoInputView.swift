//
//  TodoInputView.swift
//  TodoList
//
//  Input view for creating new todos
//  iOS 15.0+
//

import SwiftUI

/// View for inputting new todo items
///
/// This view provides:
/// - Text field for todo title
/// - Submit button with icon
/// - Priority selector (optional)
/// - Keyboard handling
/// - Input validation
/// - Smooth animations
struct TodoInputView: View {
    // MARK: - Environment Objects

    @EnvironmentObject var todoViewModel: TodoViewModel

    // MARK: - State Properties

    /// Text being typed by the user
    @State private var inputText: String = ""

    /// Whether the text field is focused
    @FocusState private var isInputFocused: Bool

    /// Selected priority for new todos
    @State private var selectedPriority: Todo.Priority = .medium

    /// Show priority picker
    @State private var showPriorityPicker = false

    /// Current color scheme
    @Environment(\.colorScheme) var colorScheme

    // MARK: - Constants

    private let maxCharacters = 200

    // MARK: - Body

    var body: some View {
        VStack(spacing: 12) {
            // Main input row
            HStack(spacing: 12) {
                // Priority indicator button
                priorityButton

                // Text input field
                textField

                // Submit button
                submitButton
            }
            .padding(12)
            .background(inputBackground)
            .cornerRadius(16)
            .shadow(color: Color.black.opacity(0.1), radius: 8, x: 0, y: 4)

            // Character counter and priority picker (if shown)
            if isInputFocused {
                HStack {
                    // Character counter
                    characterCounter

                    Spacer()

                    // Priority picker toggle
                    priorityPickerToggle
                }
                .padding(.horizontal, 4)
                .transition(.opacity.combined(with: .move(edge: .top)))
            }

            // Priority picker
            if showPriorityPicker {
                priorityPicker
                    .transition(.opacity.combined(with: .scale))
            }
        }
        .animation(.spring(response: 0.3, dampingFraction: 0.7), value: isInputFocused)
        .animation(.spring(response: 0.3, dampingFraction: 0.7), value: showPriorityPicker)
    }

    // MARK: - Subviews

    /// Background for the input area
    private var inputBackground: some View {
        RoundedRectangle(cornerRadius: 16)
            .fill(Color.white.opacity(colorScheme == .dark ? 0.15 : 0.95))
            .overlay(
                RoundedRectangle(cornerRadius: 16)
                    .stroke(
                        isInputFocused ?
                        Color.blue.opacity(0.5) :
                        Color.clear,
                        lineWidth: 2
                    )
            )
    }

    /// Priority indicator button
    private var priorityButton: some View {
        Button(action: {
            withAnimation {
                showPriorityPicker.toggle()
            }
            generateHapticFeedback()
        }) {
            Image(systemName: selectedPriority.icon)
                .font(.system(size: 20, weight: .semibold))
                .foregroundColor(priorityColor)
                .frame(width: 36, height: 36)
                .background(
                    Circle()
                        .fill(priorityColor.opacity(0.2))
                )
        }
    }

    /// Priority color based on selection
    private var priorityColor: Color {
        switch selectedPriority {
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

    /// Text input field
    private var textField: some View {
        TextField("Add a new todo...", text: $inputText)
            .focused($isInputFocused)
            .font(.system(size: 16, weight: .medium))
            .foregroundColor(colorScheme == .dark ? .white : .primary)
            .submitLabel(.done)
            .onChange(of: inputText) { oldValue, newValue in
                // Limit character count
                if newValue.count > maxCharacters {
                    inputText = String(newValue.prefix(maxCharacters))
                }
            }
            .onSubmit {
                addTodo()
            }
    }

    /// Submit button
    private var submitButton: some View {
        Button(action: addTodo) {
            Image(systemName: "plus.circle.fill")
                .font(.system(size: 28, weight: .semibold))
                .foregroundColor(canSubmit ? .blue : .gray.opacity(0.5))
        }
        .disabled(!canSubmit)
        .scaleEffect(canSubmit ? 1.0 : 0.9)
        .animation(.spring(response: 0.3, dampingFraction: 0.6), value: canSubmit)
    }

    /// Whether the input can be submitted
    private var canSubmit: Bool {
        !inputText.trimmingCharacters(in: .whitespaces).isEmpty
    }

    /// Character counter
    private var characterCounter: some View {
        Text("\(inputText.count)/\(maxCharacters)")
            .font(.system(size: 11, weight: .medium))
            .foregroundColor(
                inputText.count > maxCharacters * 9 / 10 ?
                .red.opacity(0.8) :
                .white.opacity(0.6)
            )
    }

    /// Priority picker toggle button
    private var priorityPickerToggle: some View {
        Button(action: {
            withAnimation {
                showPriorityPicker.toggle()
            }
            generateHapticFeedback()
        }) {
            HStack(spacing: 4) {
                Image(systemName: "flag.fill")
                    .font(.system(size: 10))
                Text("Priority")
                    .font(.system(size: 11, weight: .medium))
            }
            .foregroundColor(.white.opacity(0.8))
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(
                Capsule()
                    .fill(Color.white.opacity(0.2))
            )
        }
    }

    /// Priority picker
    private var priorityPicker: some View {
        VStack(spacing: 8) {
            Text("Select Priority")
                .font(.system(size: 12, weight: .semibold))
                .foregroundColor(.white.opacity(0.8))

            HStack(spacing: 12) {
                ForEach(Todo.Priority.allCases, id: \.self) { priority in
                    priorityOption(priority)
                }
            }
        }
        .padding(12)
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.white.opacity(colorScheme == .dark ? 0.15 : 0.95))
        )
    }

    /// Individual priority option
    private func priorityOption(_ priority: Todo.Priority) -> some View {
        Button(action: {
            withAnimation {
                selectedPriority = priority
                showPriorityPicker = false
            }
            generateHapticFeedback()
        }) {
            VStack(spacing: 4) {
                Image(systemName: priority.icon)
                    .font(.system(size: 20, weight: .semibold))
                    .foregroundColor(colorForPriority(priority))

                Text(priority.rawValue)
                    .font(.system(size: 10, weight: .medium))
                    .foregroundColor(
                        selectedPriority == priority ?
                        colorForPriority(priority) :
                        .white.opacity(0.6)
                    )
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 8)
            .background(
                RoundedRectangle(cornerRadius: 8)
                    .fill(
                        selectedPriority == priority ?
                        colorForPriority(priority).opacity(0.2) :
                        Color.clear
                    )
            )
            .overlay(
                RoundedRectangle(cornerRadius: 8)
                    .stroke(
                        selectedPriority == priority ?
                        colorForPriority(priority) :
                        Color.clear,
                        lineWidth: 2
                    )
            )
        }
    }

    /// Get color for priority
    private func colorForPriority(_ priority: Todo.Priority) -> Color {
        switch priority {
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

    // MARK: - Private Methods

    /// Add a new todo
    private func addTodo() {
        let trimmedText = inputText.trimmingCharacters(in: .whitespaces)
        guard !trimmedText.isEmpty else { return }

        // Add the todo via the view model
        todoViewModel.addTodo(
            title: trimmedText,
            priority: selectedPriority
        )

        // Clear the input
        withAnimation {
            inputText = ""
            selectedPriority = .medium
            showPriorityPicker = false
        }

        // Unfocus the text field
        isInputFocused = false

        // Haptic feedback
        generateHapticFeedback()
    }

    /// Generate haptic feedback
    private func generateHapticFeedback() {
        let generator = UIImpactFeedbackGenerator(style: .medium)
        generator.impactOccurred()
    }
}

// MARK: - Preview Provider

#Preview("Empty") {
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

        TodoInputView()
            .environmentObject(TodoViewModel())
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

        TodoInputView()
            .environmentObject(TodoViewModel())
            .padding()
    }
    .preferredColorScheme(.dark)
}

#Preview("With Text") {
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

        TodoInputView()
            .environmentObject(TodoViewModel())
            .padding()
    }
}
