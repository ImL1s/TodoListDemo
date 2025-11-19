//
//  TodoListApp.swift
//  TodoList
//
//  SwiftUI Todo List Application
//  iOS 15.0+
//
//  Created on 2025-11-17
//

import SwiftUI

/// Main application entry point
///
/// This is the entry point for the SwiftUI application.
/// It uses the @main attribute to indicate the application's main entry point.
/// The App protocol provides the structure for an app's behavior and content.
@main
struct TodoListApp: App {
    // MARK: - Properties

    /// StateObject ensures the view model persists for the lifetime of the app
    /// and is not recreated when the view updates
    @StateObject private var todoViewModel = TodoViewModel()

    /// Scene phase to detect app lifecycle changes (active, inactive, background)
    @Environment(\.scenePhase) private var scenePhase

    // MARK: - Body

    /// The content and behavior of the app
    var body: some Scene {
        WindowGroup {
            ContentView()
                // Inject the view model into the environment
                // This allows all child views to access it
                .environmentObject(todoViewModel)
                // Apply app-wide appearance settings
                .preferredColorScheme(.none) // Respect system dark/light mode
        }
        // Monitor scene phase changes
        .onChange(of: scenePhase) { oldPhase, newPhase in
            handleScenePhaseChange(from: oldPhase, to: newPhase)
        }
    }

    // MARK: - Private Methods

    /// Handle app lifecycle changes
    /// - Parameters:
    ///   - oldPhase: Previous scene phase
    ///   - newPhase: New scene phase
    private func handleScenePhaseChange(from oldPhase: ScenePhase, to newPhase: ScenePhase) {
        switch newPhase {
        case .active:
            // App became active (foreground)
            print("App is active")
            // Could reload data or refresh UI here

        case .inactive:
            // App became inactive (e.g., phone call, notification)
            print("App is inactive")

        case .background:
            // App moved to background
            print("App moved to background")
            // Save any pending changes immediately (don't wait for debounce)
            todoViewModel.saveImmediately()

        @unknown default:
            print("Unknown scene phase: \(newPhase)")
        }
    }
}

// MARK: - App Configuration Extension

extension TodoListApp {
    /// Configure app-wide settings
    /// This could include things like appearance, networking, analytics, etc.
    func configureApp() {
        // Configure navigation bar appearance
        let appearance = UINavigationBarAppearance()
        appearance.configureWithOpaqueBackground()
        appearance.backgroundColor = UIColor(Color.blue.opacity(0.1))
        appearance.titleTextAttributes = [.foregroundColor: UIColor.label]
        appearance.largeTitleTextAttributes = [.foregroundColor: UIColor.label]

        UINavigationBar.appearance().standardAppearance = appearance
        UINavigationBar.appearance().scrollEdgeAppearance = appearance

        // Configure table view appearance
        UITableView.appearance().backgroundColor = .clear
        UITableViewCell.appearance().backgroundColor = .clear
    }
}

// MARK: - Preview Provider

#Preview {
    ContentView()
        .environmentObject(TodoViewModel())
}
