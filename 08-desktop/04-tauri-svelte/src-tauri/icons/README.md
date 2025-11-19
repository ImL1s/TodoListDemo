# Icons Directory

This directory should contain the application icons for different platforms.

## Required Icons

For production builds, you need to provide:

### macOS
- `icon.icns` - macOS application icon

### Windows
- `icon.ico` - Windows application icon

### Linux
- `32x32.png` - 32x32 PNG icon
- `128x128.png` - 128x128 PNG icon
- `128x128@2x.png` - 256x256 PNG icon (2x)
- `icon.png` - Default PNG icon (512x512 recommended)

## Generating Icons

You can use the Tauri CLI to generate icons from a single source image:

```bash
# Install tauri-cli if not already installed
npm install -D @tauri-apps/cli

# Generate icons from a source PNG (1024x1024 recommended)
npx tauri icon /path/to/your/icon.png
```

This will automatically generate all required icon formats.

## Development

For development, placeholder icons are acceptable. The build will warn you if production icons are missing.

## Icon Design Guidelines

- Use a square image (1:1 aspect ratio)
- Recommended size: 1024x1024 pixels
- Use transparent background for PNG
- Keep design simple and recognizable at small sizes
- Test at different sizes to ensure clarity
