//
//  PreferencesWindowController.swift
//  TodoListMac
//
//  Created on 2025-11-19
//  AppKit macOS Todo List Application
//

import Cocoa

class PreferencesWindowController: NSWindowController {

    // MARK: - IBOutlets

    @IBOutlet weak var storageTypePopUp: NSPopUpButton!
    @IBOutlet weak var defaultPriorityPopUp: NSPopUpButton!
    @IBOutlet weak var showCompletionAnimationsCheckbox: NSButton!
    @IBOutlet weak var enableSoundEffectsCheckbox: NSButton!
    @IBOutlet weak var autoSaveCheckbox: NSButton!
    @IBOutlet weak var storageLocationLabel: NSTextField!
    @IBOutlet weak var storageSizeLabel: NSTextField!

    // MARK: - Properties

    private let storageService = StorageService.shared

    // MARK: - Lifecycle

    convenience init() {
        self.init(windowNibName: "PreferencesWindow")
    }

    override func windowDidLoad() {
        super.windowDidLoad()

        configureWindow()
        setupUI()
        loadPreferences()
    }

    // MARK: - Configuration

    private func configureWindow() {
        guard let window = window else { return }

        window.title = "Preferences"
        window.styleMask = [.titled, .closable]
        window.isMovableByWindowBackground = true
        window.center()
    }

    private func setupUI() {
        // Setup storage type popup
        storageTypePopUp?.removeAllItems()
        storageTypePopUp?.addItems(withTitles: ["UserDefaults", "JSON File", "iCloud"])

        // Setup default priority popup
        defaultPriorityPopUp?.removeAllItems()
        defaultPriorityPopUp?.addItems(withTitles: ["None", "Low", "Medium", "High"])
    }

    private func loadPreferences() {
        // Load storage type
        switch storageService.currentStorageType {
        case .userDefaults:
            storageTypePopUp?.selectItem(at: 0)
        case .jsonFile:
            storageTypePopUp?.selectItem(at: 1)
        case .iCloud:
            storageTypePopUp?.selectItem(at: 2)
        }

        // Load other preferences
        let defaults = UserDefaults.standard
        defaultPriorityPopUp?.selectItem(at: defaults.integer(forKey: "defaultPriority"))
        showCompletionAnimationsCheckbox?.state = defaults.bool(forKey: "showCompletionAnimations") ? .on : .off
        enableSoundEffectsCheckbox?.state = defaults.bool(forKey: "enableSoundEffects") ? .on : .off
        autoSaveCheckbox?.state = defaults.bool(forKey: "autoSave") ? .on : .off

        // Update storage info
        updateStorageInfo()
    }

    private func updateStorageInfo() {
        storageSizeLabel?.stringValue = "Storage Size: \(storageService.formattedStorageSize)"

        // Show storage location based on type
        switch storageService.currentStorageType {
        case .userDefaults:
            storageLocationLabel?.stringValue = "Location: UserDefaults"
        case .jsonFile:
            if let url = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first {
                storageLocationLabel?.stringValue = "Location: \(url.path)/todos.json"
            }
        case .iCloud:
            storageLocationLabel?.stringValue = "Location: iCloud Drive"
        }
    }

    // MARK: - Actions

    @IBAction func storageTypeChanged(_ sender: NSPopUpButton) {
        let selectedIndex = sender.indexOfSelectedItem
        let storageTypes: [StorageService.StorageType] = [.userDefaults, .jsonFile, .iCloud]

        guard selectedIndex < storageTypes.count else { return }

        let newStorageType = storageTypes[selectedIndex]

        // Confirm change
        let alert = NSAlert()
        alert.messageText = "Change Storage Type?"
        alert.informativeText = "Changing storage type will migrate your data. This operation cannot be undone."
        alert.alertStyle = .warning
        alert.addButton(withTitle: "Change")
        alert.addButton(withTitle: "Cancel")

        alert.beginSheetModal(for: window!) { [weak self] response in
            if response == .alertFirstButtonReturn {
                self?.storageService.changeStorageType(to: newStorageType)
                self?.updateStorageInfo()
                self?.showSuccess(message: "Storage type changed successfully!")
            } else {
                // Revert selection
                self?.loadPreferences()
            }
        }
    }

    @IBAction func defaultPriorityChanged(_ sender: NSPopUpButton) {
        UserDefaults.standard.set(sender.indexOfSelectedItem, forKey: "defaultPriority")
    }

    @IBAction func showCompletionAnimationsChanged(_ sender: NSButton) {
        UserDefaults.standard.set(sender.state == .on, forKey: "showCompletionAnimations")
    }

    @IBAction func enableSoundEffectsChanged(_ sender: NSButton) {
        UserDefaults.standard.set(sender.state == .on, forKey: "enableSoundEffects")
    }

    @IBAction func autoSaveChanged(_ sender: NSButton) {
        UserDefaults.standard.set(sender.state == .on, forKey: "autoSave")
    }

    @IBAction func clearAllDataClicked(_ sender: NSButton) {
        let alert = NSAlert()
        alert.messageText = "Clear All Data?"
        alert.informativeText = "This will permanently delete all your todos. This action cannot be undone."
        alert.alertStyle = .critical
        alert.addButton(withTitle: "Delete All")
        alert.addButton(withTitle: "Cancel")

        alert.beginSheetModal(for: window!) { [weak self] response in
            if response == .alertFirstButtonReturn {
                self?.storageService.clearAll()
                TodoManager.shared.todos = []
                self?.updateStorageInfo()
                self?.showSuccess(message: "All data cleared successfully!")
            }
        }
    }

    @IBAction func createBackupClicked(_ sender: NSButton) {
        if let backupURL = storageService.createBackup() {
            let alert = NSAlert()
            alert.messageText = "Backup Created"
            alert.informativeText = "Backup saved to:\n\(backupURL.path)"
            alert.alertStyle = .informational
            alert.addButton(withTitle: "OK")
            alert.addButton(withTitle: "Show in Finder")

            alert.beginSheetModal(for: window!) { response in
                if response == .alertSecondButtonReturn {
                    NSWorkspace.shared.activateFileViewerSelecting([backupURL])
                }
            }
        } else {
            showError(message: "Failed to create backup")
        }
    }

    @IBAction func restoreBackupClicked(_ sender: NSButton) {
        let openPanel = NSOpenPanel()
        openPanel.allowedContentTypes = [.json]
        openPanel.allowsMultipleSelection = false
        openPanel.prompt = "Restore Backup"

        openPanel.beginSheetModal(for: window!) { [weak self] response in
            guard response == .OK, let url = openPanel.url else { return }

            if self?.storageService.restoreFromBackup(url: url) == true {
                self?.showSuccess(message: "Backup restored successfully!")
                TodoManager.shared.reloadTodos()
                self?.updateStorageInfo()
            } else {
                self?.showError(message: "Failed to restore backup")
            }
        }
    }

    @IBAction func resetPreferencesClicked(_ sender: NSButton) {
        let alert = NSAlert()
        alert.messageText = "Reset Preferences?"
        alert.informativeText = "This will reset all preferences to their default values."
        alert.alertStyle = .warning
        alert.addButton(withTitle: "Reset")
        alert.addButton(withTitle: "Cancel")

        alert.beginSheetModal(for: window!) { [weak self] response in
            if response == .alertFirstButtonReturn {
                self?.resetPreferencesToDefaults()
                self?.loadPreferences()
                self?.showSuccess(message: "Preferences reset successfully!")
            }
        }
    }

    // MARK: - Helper Methods

    private func resetPreferencesToDefaults() {
        let defaults = UserDefaults.standard
        defaults.set(0, forKey: "defaultPriority")
        defaults.set(true, forKey: "showCompletionAnimations")
        defaults.set(false, forKey: "enableSoundEffects")
        defaults.set(true, forKey: "autoSave")
    }

    private func showSuccess(message: String) {
        let alert = NSAlert()
        alert.messageText = "Success"
        alert.informativeText = message
        alert.alertStyle = .informational
        alert.addButton(withTitle: "OK")
        alert.beginSheetModal(for: window!) { _ in }
    }

    private func showError(message: String) {
        let alert = NSAlert()
        alert.messageText = "Error"
        alert.informativeText = message
        alert.alertStyle = .critical
        alert.addButton(withTitle: "OK")
        alert.beginSheetModal(for: window!) { _ in }
    }
}

// MARK: - Preferences Constants

extension UserDefaults {
    var defaultPriority: Int {
        get { return integer(forKey: "defaultPriority") }
        set { set(newValue, forKey: "defaultPriority") }
    }

    var showCompletionAnimations: Bool {
        get { return bool(forKey: "showCompletionAnimations") }
        set { set(newValue, forKey: "showCompletionAnimations") }
    }

    var enableSoundEffects: Bool {
        get { return bool(forKey: "enableSoundEffects") }
        set { set(newValue, forKey: "enableSoundEffects") }
    }

    var autoSave: Bool {
        get { return bool(forKey: "autoSave") }
        set { set(newValue, forKey: "autoSave") }
    }
}
