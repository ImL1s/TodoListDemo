use bevy::prelude::*;

/// Marker component for the root UI container
#[derive(Component, Clone, Copy, Debug)]
pub struct RootUI;

/// Marker component for the main todo list container
#[derive(Component, Clone, Copy, Debug)]
pub struct TodoListContainer;

/// Marker component for the input field where users type new todos
#[derive(Component, Clone, Copy, Debug)]
pub struct TodoInputField;

/// Marker component for the "Add Todo" button
#[derive(Component, Clone, Copy, Debug)]
pub struct AddTodoButton;

/// Marker component for filter buttons
#[derive(Component, Clone, Copy, Debug)]
pub struct FilterButton {
    /// Which filter this button represents
    pub filter_type: FilterType,
}

/// Types of filters available for displaying todos
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum FilterType {
    All,
    Active,
    Completed,
}

impl FilterType {
    /// Returns the display name for this filter
    pub fn display_name(&self) -> &str {
        match self {
            FilterType::All => "All",
            FilterType::Active => "Active",
            FilterType::Completed => "Completed",
        }
    }
}

/// Marker component for the "Clear Completed" button
#[derive(Component, Clone, Copy, Debug)]
pub struct ClearCompletedButton;

/// Marker component for the items remaining counter text
#[derive(Component, Clone, Copy, Debug)]
pub struct ItemsRemainingText;

/// Marker component for the application title/header
#[derive(Component, Clone, Copy, Debug)]
pub struct AppTitle;

/// Marker component for the save button
#[derive(Component, Clone, Copy, Debug)]
pub struct SaveButton;

/// Marker component for the load button
#[derive(Component, Clone, Copy, Debug)]
pub struct LoadButton;

/// Component that holds the current input text for new todos
#[derive(Component, Clone, Debug, Default)]
pub struct InputText {
    /// The current text being entered
    pub value: String,
}

impl InputText {
    /// Creates a new empty InputText
    pub fn new() -> Self {
        Self::default()
    }

    /// Adds a character to the input
    pub fn push(&mut self, c: char) {
        self.value.push(c);
    }

    /// Removes the last character from the input
    pub fn pop(&mut self) {
        self.value.pop();
    }

    /// Clears all input text
    pub fn clear(&mut self) {
        self.value.clear();
    }

    /// Returns true if the input is empty
    pub fn is_empty(&self) -> bool {
        self.value.is_empty()
    }
}

/// Marker component for interactive buttons
#[derive(Component, Clone, Copy, Debug)]
pub struct InteractiveButton;

/// Component for storing button colors for hover effects
#[derive(Component, Clone, Copy, Debug)]
pub struct ButtonColors {
    pub normal: Color,
    pub hovered: Color,
    pub pressed: Color,
}

impl ButtonColors {
    /// Creates a new ButtonColors with default color scheme
    pub fn new() -> Self {
        Self {
            normal: Color::rgb(0.15, 0.15, 0.15),
            hovered: Color::rgb(0.25, 0.25, 0.25),
            pressed: Color::rgb(0.35, 0.75, 0.35),
        }
    }

    /// Creates a new ButtonColors with a specific color scheme
    pub fn with_colors(normal: Color, hovered: Color, pressed: Color) -> Self {
        Self {
            normal,
            hovered,
            pressed,
        }
    }
}

impl Default for ButtonColors {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_filter_type_display_name() {
        assert_eq!(FilterType::All.display_name(), "All");
        assert_eq!(FilterType::Active.display_name(), "Active");
        assert_eq!(FilterType::Completed.display_name(), "Completed");
    }

    #[test]
    fn test_input_text_new() {
        let input = InputText::new();
        assert!(input.is_empty());
        assert_eq!(input.value, "");
    }

    #[test]
    fn test_input_text_push() {
        let mut input = InputText::new();
        input.push('a');
        input.push('b');
        input.push('c');
        assert_eq!(input.value, "abc");
        assert!(!input.is_empty());
    }

    #[test]
    fn test_input_text_pop() {
        let mut input = InputText::new();
        input.push('a');
        input.push('b');
        input.pop();
        assert_eq!(input.value, "a");
    }

    #[test]
    fn test_input_text_clear() {
        let mut input = InputText::new();
        input.push('a');
        input.push('b');
        input.clear();
        assert!(input.is_empty());
        assert_eq!(input.value, "");
    }

    #[test]
    fn test_button_colors_new() {
        let colors = ButtonColors::new();
        assert_eq!(colors.normal, Color::rgb(0.15, 0.15, 0.15));
        assert_eq!(colors.hovered, Color::rgb(0.25, 0.25, 0.25));
        assert_eq!(colors.pressed, Color::rgb(0.35, 0.75, 0.35));
    }

    #[test]
    fn test_button_colors_with_colors() {
        let normal = Color::rgb(1.0, 0.0, 0.0);
        let hovered = Color::rgb(0.0, 1.0, 0.0);
        let pressed = Color::rgb(0.0, 0.0, 1.0);

        let colors = ButtonColors::with_colors(normal, hovered, pressed);
        assert_eq!(colors.normal, normal);
        assert_eq!(colors.hovered, hovered);
        assert_eq!(colors.pressed, pressed);
    }

    #[test]
    fn test_button_colors_default() {
        let colors = ButtonColors::default();
        let new_colors = ButtonColors::new();
        assert_eq!(colors.normal, new_colors.normal);
        assert_eq!(colors.hovered, new_colors.hovered);
        assert_eq!(colors.pressed, new_colors.pressed);
    }
}
