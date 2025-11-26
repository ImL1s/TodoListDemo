# Icons for Tauri Application

This directory should contain the application icons in various formats:

## Required Icon Files

- `32x32.png` - 32x32 pixels PNG icon
- `128x128.png` - 128x128 pixels PNG icon
- `128x128@2x.png` - 256x256 pixels PNG icon (retina)
- `icon.png` - 512x512 pixels PNG icon (base icon)
- `icon.icns` - macOS icon file
- `icon.ico` - Windows icon file

## Generating Icons

You can use the Tauri CLI to generate all required icons from a single source image:

```bash
# Install tauri-cli if not already installed
npm install -g @tauri-apps/cli

# Generate icons from a single 1024x1024 PNG image
tauri icon path/to/your/icon.png
```

## Icon Requirements

- **Source image**: 1024x1024 pixels or larger, PNG format with transparency
- **Design**: Simple, recognizable design that scales well
- **Background**: Transparent background recommended
- **Safe area**: Keep important elements within the central 80% of the icon

## Manual Creation

If you prefer to create icons manually:

1. **PNG files**: Export your design at the exact sizes listed above
2. **ICNS (macOS)**: Use `iconutil` on macOS or online tools
3. **ICO (Windows)**: Use tools like ImageMagick or online converters

## For Development

During development, you can use placeholder icons. The application will still run, but you'll see default icons in the system tray and window.

For a production-ready app, make sure to replace these with proper branded icons.
