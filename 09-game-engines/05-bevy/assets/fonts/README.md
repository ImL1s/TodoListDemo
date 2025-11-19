# Fonts Directory

This directory is for storing font files used by the Bevy Todo List application.

## Default Font

Bevy comes with a default embedded font, so no additional fonts are required for the application to run. However, you can add custom fonts here to enhance the visual appearance.

## Adding Custom Fonts

To add a custom font:

1. Download a TrueType Font (`.ttf`) or OpenType Font (`.otf`) file
2. Place it in this directory
3. Update the code to load the font:

```rust
let font: Handle<Font> = asset_server.load("fonts/YourFont.ttf");
```

## Recommended Fonts

- **Fira Sans**: A clean, modern sans-serif font (comes with Bevy by default)
- **Roboto**: Google's popular sans-serif font
- **Open Sans**: A humanist sans-serif typeface
- **Lato**: A semi-rounded sans-serif font

## Font Resources

- [Google Fonts](https://fonts.google.com/) - Free, open-source fonts
- [Font Squirrel](https://www.fontsquirrel.com/) - Free fonts for commercial use
- [DaFont](https://www.dafont.com/) - Large collection of free fonts

## Note

The current implementation uses Bevy's default font. If you want to use a custom font, you'll need to:

1. Add the font file to this directory
2. Modify the `setup_ui` system in `src/systems/setup.rs` to load and use the custom font
3. Update the `TextStyle` components to use the loaded font handle

Example:
```rust
let font = asset_server.load("fonts/FiraSans-Regular.ttf");

// Use in TextStyle
TextStyle {
    font: font.clone(),
    font_size: 24.0,
    color: Color::WHITE,
}
```
