//
//  NSTableView+Extensions.swift
//  TodoListMac
//
//  Created on 2025-11-19
//  AppKit macOS Todo List Application
//

import Cocoa

// MARK: - NSTableView Extensions

extension NSTableView {

    /// Reload data with animation
    /// - Parameter animation: The animation options to use
    func reloadDataWithAnimation(_ animation: NSTableView.AnimationOptions = [.effectFade, .slideUp]) {
        NSAnimationContext.runAnimationGroup { context in
            context.duration = 0.3
            self.animator().reloadData()
        }
    }

    /// Get the selected row indexes
    var selectedRowIndexes: IndexSet {
        return self.selectedRowIndexes
    }

    /// Select a specific row
    /// - Parameters:
    ///   - row: The row index to select
    ///   - animated: Whether to animate the selection
    func selectRow(_ row: Int, animated: Bool = true) {
        guard row >= 0 && row < numberOfRows else { return }

        if animated {
            NSAnimationContext.runAnimationGroup { context in
                context.duration = 0.2
                selectRowIndexes(IndexSet(integer: row), byExtendingSelection: false)
            }
        } else {
            selectRowIndexes(IndexSet(integer: row), byExtendingSelection: false)
        }

        scrollRowToVisible(row)
    }

    /// Deselect all rows
    /// - Parameter animated: Whether to animate the deselection
    func deselectAll(animated: Bool = true) {
        if animated {
            NSAnimationContext.runAnimationGroup { context in
                context.duration = 0.2
                deselectAll(nil)
            }
        } else {
            deselectAll(nil)
        }
    }

    /// Insert rows with animation
    /// - Parameters:
    ///   - indexes: The row indexes to insert
    ///   - animation: The animation options
    func insertRows(at indexes: IndexSet, withAnimation animation: NSTableView.AnimationOptions = [.effectFade, .slideDown]) {
        beginUpdates()
        insertRows(at: indexes, withAnimation: animation)
        endUpdates()
    }

    /// Remove rows with animation
    /// - Parameters:
    ///   - indexes: The row indexes to remove
    ///   - animation: The animation options
    func removeRows(at indexes: IndexSet, withAnimation animation: NSTableView.AnimationOptions = [.effectFade, .slideUp]) {
        beginUpdates()
        removeRows(at: indexes, withAnimation: animation)
        endUpdates()
    }

    /// Get the view for a specific row and column
    /// - Parameters:
    ///   - row: The row index
    ///   - column: The column index
    /// - Returns: The view, if available
    func view(atRow row: Int, column: Int) -> NSView? {
        guard row >= 0 && row < numberOfRows,
              column >= 0 && column < numberOfColumns else {
            return nil
        }
        return view(atColumn: column, row: row, makeIfNecessary: false)
    }

    /// Scroll to show a specific row
    /// - Parameters:
    ///   - row: The row index
    ///   - animated: Whether to animate the scroll
    func scrollToRow(_ row: Int, animated: Bool = true) {
        guard row >= 0 && row < numberOfRows else { return }

        if animated {
            NSAnimationContext.runAnimationGroup { context in
                context.duration = 0.3
                scrollRowToVisible(row)
            }
        } else {
            scrollRowToVisible(row)
        }
    }
}

// MARK: - NSView Extensions

extension NSView {

    /// Add a subtle shadow to the view
    func addShadow(
        color: NSColor = .black,
        opacity: Float = 0.1,
        offset: CGSize = CGSize(width: 0, height: -2),
        radius: CGFloat = 4
    ) {
        wantsLayer = true
        layer?.shadowColor = color.cgColor
        layer?.shadowOpacity = opacity
        layer?.shadowOffset = offset
        layer?.shadowRadius = radius
    }

    /// Add a border to the view
    /// - Parameters:
    ///   - color: Border color
    ///   - width: Border width
    func addBorder(color: NSColor, width: CGFloat = 1.0) {
        wantsLayer = true
        layer?.borderColor = color.cgColor
        layer?.borderWidth = width
    }

    /// Round the corners of the view
    /// - Parameter radius: Corner radius
    func roundCorners(radius: CGFloat) {
        wantsLayer = true
        layer?.cornerRadius = radius
        layer?.masksToBounds = true
    }

    /// Fade in animation
    /// - Parameter duration: Animation duration
    func fadeIn(duration: TimeInterval = 0.3) {
        alphaValue = 0
        NSAnimationContext.runAnimationGroup { context in
            context.duration = duration
            animator().alphaValue = 1.0
        }
    }

    /// Fade out animation
    /// - Parameter duration: Animation duration
    func fadeOut(duration: TimeInterval = 0.3) {
        NSAnimationContext.runAnimationGroup { context in
            context.duration = duration
            animator().alphaValue = 0
        }
    }

    /// Shake animation (for errors)
    func shake() {
        let animation = CAKeyframeAnimation(keyPath: "transform.translation.x")
        animation.values = [0, -10, 10, -10, 10, -5, 5, 0]
        animation.duration = 0.6
        animation.timingFunction = CAMediaTimingFunction(name: .easeInEaseOut)

        wantsLayer = true
        layer?.add(animation, forKey: "shake")
    }
}

// MARK: - NSColor Extensions

extension NSColor {

    /// Create a color from hex string
    /// - Parameter hex: Hex color string (e.g., "#FF0000" or "FF0000")
    convenience init?(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)

        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            return nil
        }

        self.init(
            red: CGFloat(r) / 255,
            green: CGFloat(g) / 255,
            blue: CGFloat(b) / 255,
            alpha: CGFloat(a) / 255
        )
    }

    /// Get the hex string representation of the color
    var hexString: String {
        guard let rgbColor = usingColorSpace(.deviceRGB) else {
            return "#000000"
        }

        let r = Int(rgbColor.redComponent * 255)
        let g = Int(rgbColor.greenComponent * 255)
        let b = Int(rgbColor.blueComponent * 255)

        return String(format: "#%02X%02X%02X", r, g, b)
    }
}

// MARK: - NSWindow Extensions

extension NSWindow {

    /// Center the window on screen
    func centerOnScreen() {
        if let screen = screen {
            let screenRect = screen.visibleFrame
            let windowRect = frame
            let x = screenRect.midX - windowRect.width / 2
            let y = screenRect.midY - windowRect.height / 2
            setFrameOrigin(NSPoint(x: x, y: y))
        }
    }

    /// Shake the window (for errors)
    func shake() {
        let numberOfShakes = 3
        let durationOfShake = 0.3
        let vigourOfShake: CGFloat = 0.02

        let frame = self.frame
        let animation = CAKeyframeAnimation(keyPath: "frame")

        var values: [NSValue] = []
        for i in 0..<numberOfShakes {
            let value1 = NSValue(rect: NSRect(
                x: frame.origin.x - frame.size.width * vigourOfShake,
                y: frame.origin.y,
                width: frame.size.width,
                height: frame.size.height
            ))
            let value2 = NSValue(rect: NSRect(
                x: frame.origin.x + frame.size.width * vigourOfShake,
                y: frame.origin.y,
                width: frame.size.width,
                height: frame.size.height
            ))
            values.append(contentsOf: [value1, value2])
        }
        values.append(NSValue(rect: frame))

        animation.values = values
        animation.duration = durationOfShake

        animations = ["frame": animation]
        animator().setFrame(frame, display: true)
    }
}

// MARK: - String Extensions

extension String {

    /// Trim whitespace and newlines
    var trimmed: String {
        return trimmingCharacters(in: .whitespacesAndNewlines)
    }

    /// Check if string is empty or only whitespace
    var isBlank: Bool {
        return trimmed.isEmpty
    }

    /// Validate email format (basic)
    var isValidEmail: Bool {
        let emailRegex = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}"
        let emailPredicate = NSPredicate(format: "SELF MATCHES %@", emailRegex)
        return emailPredicate.evaluate(with: self)
    }
}

// MARK: - Date Extensions

extension Date {

    /// Check if date is today
    var isToday: Bool {
        return Calendar.current.isDateInToday(self)
    }

    /// Check if date is yesterday
    var isYesterday: Bool {
        return Calendar.current.isDateInYesterday(self)
    }

    /// Check if date is tomorrow
    var isTomorrow: Bool {
        return Calendar.current.isDateInTomorrow(self)
    }

    /// Get relative date string (e.g., "2 hours ago")
    var relativeString: String {
        let formatter = RelativeDateTimeFormatter()
        formatter.unitsStyle = .full
        return formatter.localizedString(for: self, relativeTo: Date())
    }

    /// Get short relative date string (e.g., "2h ago")
    var shortRelativeString: String {
        let formatter = RelativeDateTimeFormatter()
        formatter.unitsStyle = .abbreviated
        return formatter.localizedString(for: self, relativeTo: Date())
    }
}

// MARK: - Array Extensions

extension Array where Element: Equatable {

    /// Remove a specific element
    /// - Parameter element: The element to remove
    mutating func remove(_ element: Element) {
        if let index = firstIndex(of: element) {
            remove(at: index)
        }
    }

    /// Remove elements that satisfy the predicate
    /// - Parameter predicate: The predicate to test
    mutating func removeAll(where predicate: (Element) -> Bool) {
        self = filter { !predicate($0) }
    }
}
