# Quick Start Guide

## Installation & Running

```bash
# Navigate to the project directory
cd 05-ui-libraries/02-react-antd

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser at http://localhost:3002
```

## Key Files Overview

### 1. **App.tsx** - Main Application
- ConfigProvider for theme management
- Layout with Header and Content
- Dark/Light mode toggle
- Global state management

### 2. **Components**

#### TodoInput.tsx
```typescript
// Uses Ant Design components:
- Input (large size)
- Button with icon
- Space.Compact for inline layout
- Card wrapper
```

#### TodoItem.tsx
```typescript
// Features:
- List.Item with actions
- Checkbox for completion
- Typography.Text with delete style
- Delete button with icon
```

#### TodoList.tsx
```typescript
// Features:
- List component with dataSource
- Empty state handling
- Filter logic integration
```

#### TodoStats.tsx
```typescript
// Features:
- Row & Col for responsive grid
- Statistic components
- Color-coded statistics
- Icons for visual enhancement
```

#### FilterButtons.tsx
```typescript
// Features:
- Radio.Group with button style
- Icon integration
- Centered layout
```

## Ant Design Features Showcased

### 1. Theme System
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

### 2. Icon System
```typescript
import {
  CheckSquareOutlined,
  DeleteOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
```

### 3. Layout Components
```typescript
- Layout (Header, Content)
- Card (containers)
- Space (spacing)
- Row & Col (grid)
```

### 4. Form Components
```typescript
- Input (text input)
- Button (actions)
- Checkbox (toggles)
- Radio.Group (filters)
```

### 5. Data Display
```typescript
- List (todo items)
- Typography (text)
- Statistic (numbers)
- Empty (empty state)
```

## Testing the Application

1. **Add Todos**: Type in the input and click "Add" or press Enter
2. **Complete Todos**: Click the checkbox to mark as complete
3. **Delete Todos**: Click the delete icon
4. **Filter**: Use the radio buttons to filter (All/Active/Completed)
5. **Theme Toggle**: Click the "Dark/Light" button to toggle theme
6. **Clear Completed**: Click "Clear Completed" to remove all completed todos
7. **Statistics**: View real-time statistics at the top

## Customization Tips

### Change Primary Color
Edit `App.tsx`:
```typescript
token: {
  colorPrimary: '#52c41a', // Green
  // or '#f5222d' for Red
  // or '#fa8c16' for Orange
}
```

### Add More Design Tokens
```typescript
token: {
  colorPrimary: '#1890ff',
  colorSuccess: '#52c41a',
  colorWarning: '#faad14',
  colorError: '#f5222d',
  fontSize: 14,
  borderRadius: 8,
}
```

### Modify Component Sizes
Change `size` prop in components:
- `large` - Larger size
- `middle` - Default size
- `small` - Smaller size

## Learn More

- [Ant Design Documentation](https://ant.design/)
- [Component API](https://ant.design/components/overview/)
- [Theme Customization](https://ant.design/docs/react/customize-theme)
