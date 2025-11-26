# App Icon Setup

This directory contains the app icon configuration for TodoListMac.

## Required Icon Sizes

For macOS applications, you need to provide the following icon sizes:

- **16x16** (1x and 2x = 32x32)
- **32x32** (1x and 2x = 64x64)
- **128x128** (1x and 2x = 256x256)
- **256x256** (1x and 2x = 512x512)
- **512x512** (1x and 2x = 1024x1024)

## Creating App Icons

### Option 1: Using Icon Composer or Design Tools

1. Create a master icon at 1024x1024 pixels
2. Use tools like:
   - macOS Icon Composer
   - Sketch with icon template
   - Figma with macOS icon plugin
   - Adobe Illustrator/Photoshop

### Option 2: Using Online Generators

1. Create a master icon (1024x1024)
2. Use services like:
   - [Icon Set Creator](https://www.iconsets.com/)
   - [App Icon Generator](https://appicon.co/)
   - [Icon Slate](https://www.kodlian.com/apps/icon-slate)

### Option 3: Manual Creation

1. Create images for each size:
   - icon_16x16.png (16x16)
   - icon_16x16@2x.png (32x32)
   - icon_32x32.png (32x32)
   - icon_32x32@2x.png (64x64)
   - icon_128x128.png (128x128)
   - icon_128x128@2x.png (256x256)
   - icon_256x256.png (256x256)
   - icon_256x256@2x.png (512x512)
   - icon_512x512.png (512x512)
   - icon_512x512@2x.png (1024x1024)

2. Place all PNG files in this directory

## Icon Design Guidelines

### macOS Human Interface Guidelines

- Use simple, recognizable shapes
- Avoid text in small sizes (16x16, 32x32)
- Use vibrant colors
- Consider dark mode appearance
- Add subtle gradients for depth
- Include a subtle shadow

### Todo App Icon Suggestions

For a todo list app, consider:

- **Checkmark**: Classic todo symbol
- **List/Document**: Represents lists or notes
- **Pencil/Pen**: Writing/editing metaphor
- **Calendar**: Organization theme

### Color Scheme Suggestions

- **Primary**: Blue (#007AFF) - Productivity, trust
- **Accent**: Green (#34C759) - Completion, success
- **Alternative**: Orange (#FF9500) - Energy, motivation

## Sample SVG Icon Template

```svg
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1024" height="1024" rx="225" fill="#007AFF"/>

  <!-- Checkmark -->
  <path d="M 300,500 L 450,650 L 750,350"
        stroke="white"
        stroke-width="80"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"/>

  <!-- List lines -->
  <rect x="200" y="250" width="600" height="30" rx="15" fill="white" opacity="0.3"/>
  <rect x="200" y="350" width="500" height="30" rx="15" fill="white" opacity="0.3"/>
  <rect x="200" y="650" width="550" height="30" rx="15" fill="white" opacity="0.3"/>
  <rect x="200" y="750" width="450" height="30" rx="15" fill="white" opacity="0.3"/>
</svg>
```

## Xcode Integration

Once you have all icon files:

1. Open TodoListMac.xcodeproj in Xcode
2. Select Assets.xcassets in Project Navigator
3. Select AppIcon
4. Drag and drop each icon to its corresponding slot
5. Xcode will automatically validate the icons

## Verification

Build and run the app to verify:

1. Icon appears in Dock
2. Icon appears in Finder
3. Icon appears in About panel
4. Icon looks good in both light and dark modes
5. Icon scales well at all sizes

## Troubleshooting

### Icon not appearing
- Clean build folder (⌘⇧K)
- Delete DerivedData
- Rebuild the project

### Icon looks pixelated
- Ensure PNG files are exact pixel dimensions
- Use 72 DPI resolution
- Don't upscale smaller images

### Icon wrong color in dark mode
- Test icon on both light and dark backgrounds
- Adjust colors for better contrast
- Consider using SF Symbols for system integration

## Resources

- [Apple Human Interface Guidelines - App Icons](https://developer.apple.com/design/human-interface-guidelines/app-icons)
- [SF Symbols](https://developer.apple.com/sf-symbols/)
- [macOS Icon Gallery](https://macosicons.com/)
