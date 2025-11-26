use bevy::prelude::*;

/// Resource that tracks the UI state
#[derive(Resource, Clone, Debug, Default)]
pub struct UIState {
    /// Whether the UI needs to be rebuilt
    pub needs_rebuild: bool,
    /// The currently focused element (if any)
    pub focused_element: Option<Entity>,
    /// Whether the input field is currently active
    pub input_active: bool,
}

impl UIState {
    /// Creates a new UIState
    pub fn new() -> Self {
        Self {
            needs_rebuild: true, // Initially needs to be built
            focused_element: None,
            input_active: true, // Input is active by default
        }
    }

    /// Marks the UI as needing a rebuild
    pub fn mark_dirty(&mut self) {
        self.needs_rebuild = true;
    }

    /// Marks the UI as clean (just rebuilt)
    pub fn mark_clean(&mut self) {
        self.needs_rebuild = false;
    }

    /// Sets the focused element
    pub fn set_focus(&mut self, entity: Entity) {
        self.focused_element = Some(entity);
    }

    /// Clears the focus
    pub fn clear_focus(&mut self) {
        self.focused_element = None;
    }

    /// Activates the input field
    pub fn activate_input(&mut self) {
        self.input_active = true;
    }

    /// Deactivates the input field
    pub fn deactivate_input(&mut self) {
        self.input_active = false;
    }

    /// Toggles input activation
    pub fn toggle_input(&mut self) {
        self.input_active = !self.input_active;
    }
}

/// Resource for tracking application-wide settings
#[derive(Resource, Clone, Debug)]
pub struct AppSettings {
    /// Font size for normal text
    pub normal_font_size: f32,
    /// Font size for headings
    pub heading_font_size: f32,
    /// Font size for small text
    pub small_font_size: f32,
    /// Background color
    pub background_color: Color,
    /// Primary text color
    pub text_color: Color,
    /// Secondary text color (for less important text)
    pub secondary_text_color: Color,
    /// Accent color for interactive elements
    pub accent_color: Color,
    /// Whether to show debug information
    pub show_debug: bool,
}

impl Default for AppSettings {
    fn default() -> Self {
        Self {
            normal_font_size: 20.0,
            heading_font_size: 48.0,
            small_font_size: 16.0,
            background_color: Color::rgb(0.95, 0.95, 0.95),
            text_color: Color::rgb(0.2, 0.2, 0.2),
            secondary_text_color: Color::rgb(0.5, 0.5, 0.5),
            accent_color: Color::rgb(0.3, 0.6, 0.9),
            show_debug: false,
        }
    }
}

impl AppSettings {
    /// Creates a new AppSettings with default values
    pub fn new() -> Self {
        Self::default()
    }

    /// Toggles debug mode
    pub fn toggle_debug(&mut self) {
        self.show_debug = !self.show_debug;
    }
}

/// Resource for managing animations and transitions
#[derive(Resource, Clone, Debug, Default)]
pub struct AnimationState {
    /// Timer for fade-in animations
    pub fade_timer: f32,
    /// Whether animations are enabled
    pub animations_enabled: bool,
}

impl AnimationState {
    /// Creates a new AnimationState
    pub fn new() -> Self {
        Self {
            fade_timer: 0.0,
            animations_enabled: true,
        }
    }

    /// Updates the animation timer
    pub fn update(&mut self, delta: f32) {
        if self.animations_enabled {
            self.fade_timer += delta;
        }
    }

    /// Resets the fade timer
    pub fn reset_fade(&mut self) {
        self.fade_timer = 0.0;
    }

    /// Toggles animations
    pub fn toggle_animations(&mut self) {
        self.animations_enabled = !self.animations_enabled;
    }
}
