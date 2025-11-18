# Ant Design Todo List

A modern, enterprise-grade Todo List application built with **React** and **Ant Design**.

## Features

- Add, complete, and delete todos
- Filter todos by status (All, Active, Completed)
- Real-time statistics with beautiful Statistic components
- Dark/Light theme toggle with ConfigProvider
- Persistent storage using localStorage
- Responsive design for all screen sizes
- Clean and professional UI with Ant Design components

## Ant Design Components Used

This project demonstrates the usage of various Ant Design components:

### Layout & Structure
- **Layout**: Main application structure with Header and Content
- **Card**: Container for grouped content
- **Space**: Consistent spacing between elements

### Data Entry
- **Input**: Text input for new todos
- **Checkbox**: Toggle todo completion status
- **Button**: Action buttons with icons
- **Radio.Group**: Filter selection

### Data Display
- **List**: Display todo items
- **Typography** (Title, Text): Text rendering with built-in styles
- **Statistic**: Beautiful statistics cards with icons
- **Empty**: Empty state placeholder

### Feedback
- **Icons** (@ant-design/icons): Rich icon library
  - CheckSquareOutlined
  - PlusOutlined
  - DeleteOutlined
  - CheckCircleOutlined
  - ClockCircleOutlined
  - UnorderedListOutlined
  - BgColorsOutlined

### Theme & Styling
- **ConfigProvider**: Global theme configuration
- **theme.darkAlgorithm**: Built-in dark mode
- **theme.defaultAlgorithm**: Default light theme

## Ant Design Key Features Demonstrated

### 1. Enterprise-Grade UI
- Professional design language
- Consistent component styles
- Accessibility built-in

### 2. Theme Customization
```typescript
<ConfigProvider
  theme={{
    algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: '#1890ff',
      borderRadius: 6,
    },
  }}
>
```

### 3. Internationalization Support
Ant Design has built-in support for 50+ languages (can be easily configured).

### 4. Responsive Design
- Grid system (Row, Col) for responsive layouts
- Mobile-friendly components
- Adaptive spacing

### 5. Icon System
Rich icon library from @ant-design/icons with various styles:
- Outlined (default)
- Filled
- Two-tone

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The application will be available at `http://localhost:3002`

## Build

```bash
npm run build
```

## Project Structure

```
02-react-antd/
├── src/
│   ├── components/
│   │   ├── TodoInput.tsx       # Input component with Input & Button
│   │   ├── TodoItem.tsx        # Individual todo with Checkbox & Button
│   │   ├── TodoList.tsx        # List component with Empty state
│   │   ├── TodoStats.tsx       # Statistics with Statistic & Icons
│   │   └── FilterButtons.tsx   # Radio.Group for filtering
│   ├── App.tsx                 # Main app with ConfigProvider
│   ├── types.ts                # TypeScript interfaces
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Component Architecture

### App.tsx
- Main container using Layout component
- State management for todos and theme
- ConfigProvider for global theming
- Header with title and action buttons
- Content area with all child components

### TodoInput.tsx
- Uses `Space.Compact` for inline input-button combination
- Large size components for better UX
- Enter key support for adding todos

### TodoItem.tsx
- `List.Item` with integrated actions
- Checkbox for completion toggle
- Typography.Text with delete decoration
- Danger button for deletion

### TodoList.tsx
- `List` component with dataSource
- Empty state with custom messages
- Filtered rendering based on status

### TodoStats.tsx
- Row and Col for responsive grid
- Three Statistic components with different colors
- Icons for visual enhancement

### FilterButtons.tsx
- Radio.Group with button style
- Icons in each option
- Solid button style for better visibility

## Why Ant Design?

### Advantages
1. **Enterprise-Ready**: Battle-tested in production environments
2. **Comprehensive**: 50+ high-quality components
3. **TypeScript**: Full TypeScript support with excellent type definitions
4. **Theme System**: Powerful theme customization with design tokens
5. **Internationalization**: Built-in i18n support for 50+ languages
6. **Accessibility**: ARIA attributes and keyboard navigation
7. **Documentation**: Extensive documentation with examples
8. **Active Community**: Large community and regular updates

### Design Philosophy
- **Deterministic**: Predictable behavior across components
- **Meaningful**: Every design choice has a purpose
- **Growing**: Continuous improvement and additions
- **Natural**: Follows natural user behavior patterns

## Customization

### Changing Theme Colors
Edit the ConfigProvider token in `App.tsx`:

```typescript
token: {
  colorPrimary: '#1890ff',  // Primary color
  borderRadius: 6,           // Border radius
  // Add more design tokens
}
```

### Available Design Tokens
- colorPrimary
- colorSuccess
- colorWarning
- colorError
- fontSize
- borderRadius
- And many more...

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE 11+ (with polyfills)

## License

MIT

## Learn More

- [Ant Design Documentation](https://ant.design/)
- [Ant Design Components](https://ant.design/components/overview/)
- [Design Values](https://ant.design/docs/spec/values)
- [Customize Theme](https://ant.design/docs/react/customize-theme)
