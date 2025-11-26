# Images Directory

This directory is for storing image assets used by the Bevy Todo List application.

## Purpose

While the current implementation uses a minimal UI with text and colored boxes, you can enhance the visual appearance by adding custom images:

- Icons for buttons (checkboxes, delete, etc.)
- Background images
- Logo or branding
- Decorative elements

## Supported Formats

Bevy supports the following image formats:
- PNG (`.png`) - Recommended for UI elements with transparency
- JPEG (`.jpg`, `.jpeg`) - Good for photos and backgrounds
- BMP (`.bmp`)
- TGA (`.tga`)
- DDS (`.dds`)
- HDR (`.hdr`)

## Using Images in Code

To load and use an image:

```rust
// In a system with access to AssetServer
let image_handle: Handle<Image> = asset_server.load("images/checkbox.png");

// Use in an ImageBundle
commands.spawn(ImageBundle {
    image: UiImage::new(image_handle),
    style: Style {
        width: Val::Px(32.0),
        height: Val::Px(32.0),
        ..default()
    },
    ..default()
});
```

## Potential Enhancements

You could add images for:

1. **Icons**:
   - `checkbox-unchecked.png` - Unchecked checkbox icon
   - `checkbox-checked.png` - Checked checkbox icon
   - `delete-icon.png` - Delete button icon
   - `add-icon.png` - Add button icon

2. **Backgrounds**:
   - `background.png` - Main background image
   - `header-bg.png` - Header background

3. **Branding**:
   - `logo.png` - Application logo
   - `icon.png` - Window icon

## Creating Icons

You can create icons using:
- [GIMP](https://www.gimp.org/) - Free, open-source image editor
- [Inkscape](https://inkscape.org/) - Free, open-source vector graphics editor
- [Figma](https://www.figma.com/) - Web-based design tool
- [Canva](https://www.canva.com/) - Simple online design tool

## Free Icon Resources

- [Font Awesome](https://fontawesome.com/) - Popular icon library
- [Material Icons](https://fonts.google.com/icons) - Google's icon library
- [Heroicons](https://heroicons.com/) - Beautiful hand-crafted SVG icons
- [Feather Icons](https://feathericons.com/) - Simply beautiful open-source icons

## Note

The current implementation doesn't require any images to run. All UI elements are rendered using Bevy's built-in UI primitives (colored boxes, text, etc.). Images are optional enhancements.
