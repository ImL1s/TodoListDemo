# React + Chakra UI Todo List

A beautiful, fully-featured Todo List application built with **React 18** and **Chakra UI v2**. This project demonstrates the power and simplicity of Chakra UI's component-based design system with built-in accessibility, theming, and responsive design.

![React](https://img.shields.io/badge/React-18.2.0-61dafb?logo=react)
![Chakra UI](https://img.shields.io/badge/Chakra_UI-2.8.2-319795?logo=chakra-ui)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-3178c6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.0.12-646cff?logo=vite)

## 📋 Table of Contents

- [Features](#-features)
- [Why Chakra UI?](#-why-chakra-ui)
- [Chakra UI vs Other UI Libraries](#-chakra-ui-vs-other-ui-libraries)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Usage](#-usage)
- [Chakra UI Components Used](#-chakra-ui-components-used)
- [Theme System](#-theme-system)
- [Responsive Design](#-responsive-design)
- [Dark Mode Implementation](#-dark-mode-implementation)
- [Animation & Motion](#-animation--motion)
- [TypeScript Integration](#-typescript-integration)
- [LocalStorage Persistence](#-localstorage-persistence)
- [Performance Optimizations](#-performance-optimizations)
- [Accessibility](#-accessibility)
- [Best Practices](#-best-practices)
- [Common Patterns](#-common-patterns)
- [Troubleshooting](#-troubleshooting)
- [Further Learning](#-further-learning)

## ✨ Features

### Core Functionality
- ✅ **Add Todos** - Create new tasks with validation (minimum 3 characters)
- ✅ **Complete Todos** - Toggle completion status with smooth animations
- ✅ **Delete Todos** - Remove tasks with confirmation feedback
- ✅ **Filter Todos** - View all, active, or completed tasks
- ✅ **Clear Completed** - Bulk remove completed tasks
- ✅ **Statistics Dashboard** - Real-time progress tracking and metrics

### UI/UX Features
- 🌗 **Dark/Light Mode** - Seamless theme switching with `useColorMode`
- 📱 **Responsive Design** - Optimized for mobile, tablet, and desktop
- 🎨 **Beautiful Gradients** - Theme-aware gradient backgrounds
- ⚡ **Smooth Animations** - Framer Motion integration for fluid transitions
- 🎯 **Toast Notifications** - User feedback for all actions
- 💾 **LocalStorage** - Automatic data persistence
- ♿ **Accessibility** - WCAG 2.1 compliant components
- 🎭 **Custom Theme** - Extended Chakra UI theme with brand colors

### Developer Experience
- 🔷 **TypeScript** - Full type safety throughout the application
- 🧩 **Component-Based** - Modular, reusable components
- 🎨 **Style Props** - Inline styling with type checking
- 📦 **Tree-Shakable** - Optimized bundle size
- 🔥 **Fast Refresh** - Instant feedback during development

## 🎯 Why Chakra UI?

Chakra UI is a modern React component library that provides a set of accessible, reusable, and composable React components. Here's why it's an excellent choice:

### 1. **Simplicity & Developer Experience**

Chakra UI's API is incredibly intuitive. Compare these approaches:

```tsx
// Traditional CSS approach
<div className="container">
  <button className="btn btn-primary btn-lg">Click me</button>
</div>

// Chakra UI approach
<Container>
  <Button colorScheme="blue" size="lg">Click me</Button>
</Container>
```

### 2. **Style Props - The Game Changer**

Style directly in JSX with type-safe props:

```tsx
<Box
  bg="blue.500"
  color="white"
  p={4}
  borderRadius="lg"
  _hover={{ bg: "blue.600" }}
  transition="all 0.2s"
>
  Styled Box
</Box>
```

Benefits:
- No CSS files needed
- IntelliSense support
- Theme-aware values
- Pseudo-selectors as props
- Responsive values: `p={[2, 4, 6]}` (mobile, tablet, desktop)

### 3. **Built-in Accessibility**

All components follow WAI-ARIA standards out of the box:

```tsx
// Accessible by default
<Button aria-label="Close menu">
  <CloseIcon />
</Button>

// Modal with proper focus management
<Modal isOpen={isOpen} onClose={onClose}>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Title</ModalHeader>
    <ModalBody>Content</ModalBody>
  </ModalContent>
</Modal>
```

### 4. **Theming System**

Powerful theming with TypeScript support:

```tsx
const theme = extendTheme({
  colors: {
    brand: {
      50: '#e3f2fd',
      500: '#2196f3',
      900: '#0d47a1',
    }
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
      },
      variants: {
        custom: {
          bg: 'brand.500',
          color: 'white',
        }
      }
    }
  }
})
```

### 5. **Dark Mode - No Hassle**

Built-in dark mode support:

```tsx
function App() {
  const { colorMode, toggleColorMode } = useColorMode()
  const bg = useColorModeValue('white', 'gray.800')

  return (
    <Box bg={bg}>
      <Button onClick={toggleColorMode}>
        Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
      </Button>
    </Box>
  )
}
```

### 6. **Responsive Design Made Easy**

Array syntax for responsive values:

```tsx
<Box
  width={['100%', '50%', '33%']}  // mobile, tablet, desktop
  fontSize={['sm', 'md', 'lg']}
  p={[2, 4, 6]}
>
  Responsive Content
</Box>

// Or use object syntax
<Box
  width={{ base: '100%', md: '50%', lg: '33%' }}
  fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}
>
  Responsive Content
</Box>
```

### 7. **Composition Pattern**

Build complex UIs from simple components:

```tsx
<VStack spacing={4} align="stretch">
  <HStack>
    <Icon as={CheckIcon} />
    <Text>Item 1</Text>
  </HStack>
  <HStack>
    <Icon as={CheckIcon} />
    <Text>Item 2</Text>
  </HStack>
</VStack>
```

### 8. **Hooks for Everything**

Chakra provides hooks for common patterns:

```tsx
// Toast notifications
const toast = useToast()
toast({ title: 'Success!', status: 'success' })

// Breakpoint detection
const isMobile = useBreakpointValue({ base: true, md: false })

// Clipboard
const { onCopy, hasCopied } = useClipboard('text to copy')

// Disclosure (toggle state)
const { isOpen, onToggle } = useDisclosure()
```

## 📊 Chakra UI vs Other UI Libraries

### Chakra UI vs Material-UI (MUI)

| Feature | Chakra UI | Material-UI |
|---------|-----------|-------------|
| **Design System** | Unopinionated, customizable | Material Design (opinionated) |
| **Bundle Size** | ~40KB (gzipped) | ~80KB (gzipped) |
| **API Complexity** | Simple, intuitive | More complex, steeper learning curve |
| **Style Props** | ✅ First-class support | ❌ Limited (via `sx` prop) |
| **Dark Mode** | ✅ Built-in, easy to use | ✅ Built-in, requires more setup |
| **Accessibility** | ✅ Excellent (WAI-ARIA) | ✅ Excellent |
| **TypeScript** | ✅ Full support | ✅ Full support |
| **Learning Curve** | Low | Medium-High |
| **Customization** | Easy with `extendTheme` | Complex with theme overrides |
| **Component Composition** | Excellent | Good |
| **Documentation** | Excellent | Excellent |
| **Community** | Growing | Large, mature |

**When to choose Chakra UI over MUI:**
- You want a lighter bundle size
- You prefer a simpler, more intuitive API
- You don't need Material Design aesthetics
- You want easier theme customization
- You prefer style props over CSS-in-JS

**When to choose MUI:**
- You need Material Design specifically
- You want more pre-built complex components
- You need extensive enterprise-level components
- You want a more mature ecosystem

### Chakra UI vs Ant Design

| Feature | Chakra UI | Ant Design |
|---------|-----------|------------|
| **Design System** | Flexible, modern | Ant Design (Chinese design language) |
| **Bundle Size** | ~40KB | ~150KB+ |
| **Target Audience** | General web apps | Enterprise applications |
| **Customization** | Very easy | Moderate (requires less variables) |
| **Components** | 50+ components | 60+ components |
| **Form Handling** | Basic | Advanced (built-in validation) |
| **Table Component** | Basic | Very advanced |
| **Style Props** | ✅ Excellent | ❌ No |
| **TypeScript** | ✅ Excellent | ✅ Good |
| **Internationalization** | Manual | Built-in |

**When to choose Chakra UI over Ant Design:**
- You want a lighter, more modern library
- Style props are important to you
- You prefer a more flexible design system
- Bundle size is a concern
- You want better customization options

**When to choose Ant Design:**
- Building enterprise applications
- Need advanced data tables
- Need built-in form validation
- Prefer comprehensive components out-of-box

### Chakra UI vs Tailwind CSS (with headlessui)

| Feature | Chakra UI | Tailwind + Headless UI |
|---------|-----------|------------------------|
| **Approach** | Component library | Utility-first CSS + unstyled components |
| **Bundle Size** | ~40KB | Varies (can be larger) |
| **Learning Curve** | Low | Medium (need to learn Tailwind utilities) |
| **Flexibility** | High | Very High |
| **JavaScript Required** | Yes (React components) | Minimal (Headless UI for logic) |
| **Style Props** | ✅ Yes | ❌ No (className only) |
| **Dark Mode** | ✅ Built-in hook | ✅ Class-based |
| **Accessibility** | ✅ Built-in | ✅ Headless UI provides |
| **TypeScript** | ✅ Excellent | ✅ Good |
| **Build-time CSS** | ❌ No | ✅ Yes (PurgeCSS) |

**When to choose Chakra UI over Tailwind:**
- You prefer component-based approach
- You want hooks for common patterns (toast, modal, etc.)
- Style props are more intuitive to you
- You want faster development
- You prefer JSX-based styling

**When to choose Tailwind:**
- You prefer utility-first CSS
- You want more control over styling
- You want smaller production bundles (with PurgeCSS)
- You're comfortable with HTML/CSS classes
- You want to avoid React-specific libraries

## 🛠️ Tech Stack

### Core Technologies
- **React 18.2.0** - UI library with concurrent features
- **TypeScript 5.3.3** - Type-safe JavaScript
- **Vite 5.0.12** - Next-generation frontend tooling

### UI Framework
- **@chakra-ui/react 2.8.2** - Component library
- **@emotion/react 11.11.3** - CSS-in-JS for Chakra
- **@emotion/styled 11.11.0** - Styled components
- **framer-motion 11.0.3** - Animation library

### Development Tools
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting rules

## 📁 Project Structure

```
03-react-chakra/
├── src/
│   ├── components/
│   │   ├── TodoInput.tsx      # Input component for adding todos
│   │   ├── TodoItem.tsx       # Individual todo item with animations
│   │   └── TodoList.tsx       # List container with filtering & stats
│   ├── App.tsx                # Main application component
│   ├── main.tsx               # Entry point with ChakraProvider
│   ├── theme.ts               # Custom Chakra UI theme
│   └── types.ts               # TypeScript type definitions
├── index.html                 # HTML template
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite configuration
└── README.md                  # This file
```

### Component Architecture

```
App (ChakraProvider + ColorMode)
├── Header
│   ├── Title (with gradient)
│   ├── Tech Badges
│   └── Color Mode Toggle
├── Card Container
│   ├── TodoInput
│   │   ├── Input (Chakra)
│   │   └── Button (with icon)
│   └── TodoList
│       ├── Statistics Dashboard
│       │   ├── StatGroup
│       │   └── Progress Bar
│       ├── Filter Buttons
│       └── Todo Items (AnimatePresence)
│           └── TodoItem
│               ├── Checkbox
│               ├── Text (with strikethrough)
│               ├── Timestamp Badge
│               └── Delete IconButton
└── Footer
```

## 📦 Installation

### Prerequisites

- **Node.js** 16.x or higher
- **npm** 7.x or higher (or yarn/pnpm)

### Steps

1. **Clone or navigate to the project directory:**

```bash
cd 05-ui-libraries/03-react-chakra
```

2. **Install dependencies:**

```bash
npm install
```

This will install all required packages including:
- React and React DOM
- Chakra UI and its dependencies
- TypeScript and type definitions
- Vite and build tools
- Framer Motion for animations

3. **Verify installation:**

```bash
npm list --depth=0
```

You should see all dependencies listed without errors.

## 🚀 Usage

### Development Mode

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will open automatically at `http://localhost:3000`

Features in dev mode:
- ⚡ Lightning-fast Hot Module Replacement (HMR)
- 🔄 Instant updates on file changes
- 🐛 Source maps for debugging
- 📝 TypeScript error checking

### Production Build

Create an optimized production build:

```bash
npm run build
```

This will:
1. Run TypeScript compiler for type checking
2. Bundle and minify the application
3. Generate optimized chunks
4. Create source maps
5. Output to `dist/` directory

Build optimizations:
- Code splitting (React, Chakra UI, Framer Motion)
- Tree shaking
- Minification
- Asset optimization

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

This serves the production build at `http://localhost:4173`

### Linting

Check code quality:

```bash
npm run lint
```

## 🎨 Chakra UI Components Used

This project demonstrates the usage of various Chakra UI components:

### Layout Components

#### Box
The fundamental building block:
```tsx
<Box
  bg="white"
  p={4}
  borderRadius="lg"
  boxShadow="md"
>
  Content
</Box>
```

#### Container
Responsive container with max-width:
```tsx
<Container maxW="container.md">
  {/* Content automatically centered and responsive */}
</Container>
```

#### VStack & HStack
Vertical and horizontal stacks:
```tsx
<VStack spacing={4} align="stretch">
  <Box>Item 1</Box>
  <Box>Item 2</Box>
</VStack>

<HStack spacing={3}>
  <Box>Left</Box>
  <Box>Right</Box>
</HStack>
```

### Form Components

#### Input
Styled input with variants:
```tsx
<Input
  variant="filled"
  placeholder="Enter text"
  size="lg"
  _focus={{
    borderColor: "brand.500",
    boxShadow: "0 0 0 1px brand.500"
  }}
/>
```

#### Button
Versatile button component:
```tsx
<Button
  colorScheme="brand"
  size="lg"
  leftIcon={<AddIcon />}
  _hover={{
    transform: "translateY(-2px)",
    boxShadow: "lg"
  }}
>
  Add Todo
</Button>
```

#### Checkbox
Accessible checkbox:
```tsx
<Checkbox
  isChecked={completed}
  onChange={handleToggle}
  colorScheme="brand"
  size="lg"
>
  Task description
</Checkbox>
```

#### IconButton
Button with icon only:
```tsx
<IconButton
  aria-label="Delete todo"
  icon={<DeleteIcon />}
  colorScheme="red"
  variant="ghost"
  size="sm"
/>
```

### Data Display

#### Card, CardHeader, CardBody
Card components for content:
```tsx
<Card variant="elevated">
  <CardHeader>
    <Heading size="lg">Title</Heading>
  </CardHeader>
  <CardBody>
    <Text>Content goes here</Text>
  </CardBody>
</Card>
```

#### Badge
Small status indicators:
```tsx
<Badge colorScheme="blue" variant="subtle">
  React 18
</Badge>
```

#### Stat, StatGroup
Statistics display:
```tsx
<StatGroup>
  <Stat>
    <StatLabel>Total</StatLabel>
    <StatNumber>10</StatNumber>
  </Stat>
</StatGroup>
```

#### Progress
Progress bar:
```tsx
<Progress
  value={65}
  colorScheme="brand"
  size="sm"
  hasStripe
  isAnimated
/>
```

### Feedback

#### useToast
Toast notifications:
```tsx
const toast = useToast()

toast({
  title: 'Success!',
  description: 'Todo added successfully',
  status: 'success',
  duration: 3000,
  isClosable: true,
  position: 'top',
})
```

Status options:
- `success` - Green checkmark
- `error` - Red error
- `warning` - Orange warning
- `info` - Blue info

#### Tooltip
Hover tooltips:
```tsx
<Tooltip label="Click to delete" placement="top" hasArrow>
  <IconButton icon={<DeleteIcon />} />
</Tooltip>
```

### Typography

#### Heading
Semantic headings:
```tsx
<Heading
  size="2xl"
  bgGradient="linear(to-r, blue.400, purple.500)"
  bgClip="text"
>
  Beautiful Title
</Heading>
```

#### Text
Styled text:
```tsx
<Text
  fontSize="md"
  fontWeight="medium"
  color="gray.600"
  textDecoration="line-through"
>
  Completed task
</Text>
```

### Transitions

#### Fade
Fade in/out animation:
```tsx
<Fade in={isVisible}>
  <Box>Content that fades</Box>
</Fade>
```

### Other Components

#### Divider
Visual separator:
```tsx
<Divider borderColor="gray.200" />
```

#### ButtonGroup
Group related buttons:
```tsx
<ButtonGroup isAttached variant="outline">
  <Button>All</Button>
  <Button>Active</Button>
  <Button>Completed</Button>
</ButtonGroup>
```

## 🎨 Theme System

Chakra UI's theme system is one of its most powerful features. Here's how this project uses it:

### Theme Structure

```tsx
const theme = extendTheme({
  config: ThemeConfig,      // Color mode config
  colors: {},               // Custom colors
  breakpoints: {},          // Responsive breakpoints
  fonts: {},                // Typography
  components: {},           // Component styles
  styles: {},               // Global styles
  textStyles: {},           // Reusable text styles
  layerStyles: {},          // Reusable layer styles
})
```

### Custom Colors

```tsx
const colors = {
  brand: {
    50: '#e3f2fd',
    100: '#bbdefb',
    // ... up to 900
    900: '#0d47a1',
  },
}
```

Access in components:
```tsx
<Box bg="brand.500" color="brand.50">
  Content
</Box>
```

### Component Style Overrides

#### Global Button Styling

```tsx
components: {
  Button: {
    baseStyle: {
      fontWeight: 'semibold',
      borderRadius: 'lg',
    },
    variants: {
      solid: (props) => ({
        bg: props.colorMode === 'dark' ? 'brand.600' : 'brand.500',
        _hover: {
          bg: props.colorMode === 'dark' ? 'brand.700' : 'brand.600',
        },
      }),
    },
  },
}
```

#### Custom Card Variant

```tsx
Card: {
  variants: {
    elevated: (props) => ({
      container: {
        bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
        boxShadow: 'lg',
        _hover: {
          transform: 'translateY(-4px)',
        },
      },
    }),
  },
}
```

### Using Custom Theme

```tsx
// In component
<Card variant="elevated">
  <CardBody>Custom styled card</CardBody>
</Card>
```

### Theme Tokens

Chakra provides semantic tokens:

```tsx
// Spacing
<Box p={4} m={2} />  // p=1rem, m=0.5rem

// Colors
<Box bg="blue.500" color="white" />

// Sizes
<Button size="lg" />  // Predefined sizes

// Shadows
<Box boxShadow="lg" />

// Border radius
<Box borderRadius="xl" />
```

### Accessing Theme in Components

```tsx
import { useTheme } from '@chakra-ui/react'

function MyComponent() {
  const theme = useTheme()
  console.log(theme.colors.brand[500])

  return <Box bg={theme.colors.brand[500]} />
}
```

## 📱 Responsive Design

Chakra UI makes responsive design incredibly easy with two approaches:

### Array Syntax

Values correspond to breakpoints: `[base, sm, md, lg, xl]`

```tsx
<Box
  width={['100%', '100%', '50%', '33%']}
  fontSize={['sm', 'md', 'lg']}
  padding={[2, 4, 6]}
>
  Responsive content
</Box>
```

### Object Syntax

More explicit and readable:

```tsx
<Box
  width={{
    base: '100%',  // 0-479px
    sm: '100%',    // 480px+
    md: '50%',     // 768px+
    lg: '33%',     // 992px+
  }}
  fontSize={{
    base: 'sm',
    md: 'md',
    lg: 'lg',
  }}
>
  Responsive content
</Box>
```

### Custom Breakpoints

Defined in theme:

```tsx
const breakpoints = {
  sm: '30em',   // 480px
  md: '48em',   // 768px
  lg: '62em',   // 992px
  xl: '80em',   // 1280px
  '2xl': '96em', // 1536px
}
```

### useBreakpointValue Hook

Get different values based on breakpoint:

```tsx
import { useBreakpointValue } from '@chakra-ui/react'

function MyComponent() {
  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  })

  const columns = useBreakpointValue({
    base: 1,
    md: 2,
    lg: 3,
  })

  return (
    <Box>
      {isMobile ? <MobileView /> : <DesktopView />}
      <Grid columns={columns}>...</Grid>
    </Box>
  )
}
```

### Responsive Stacks

```tsx
// Stack direction changes based on screen size
<Stack
  direction={{ base: 'column', md: 'row' }}
  spacing={4}
>
  <Box>Item 1</Box>
  <Box>Item 2</Box>
</Stack>
```

### Show/Hide Components

```tsx
import { Show, Hide } from '@chakra-ui/react'

<Show above="md">
  <Box>Only visible on medium screens and up</Box>
</Show>

<Hide below="md">
  <Box>Hidden on small screens</Box>
</Hide>
```

## 🌗 Dark Mode Implementation

Chakra UI provides excellent dark mode support out of the box.

### Setup

1. **Configure theme:**

```tsx
// theme.ts
const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const theme = extendTheme({ config })
```

2. **Add ColorModeScript:**

```tsx
// main.tsx
import { ColorModeScript } from '@chakra-ui/react'

<React.StrictMode>
  <ColorModeScript initialColorMode={theme.config.initialColorMode} />
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>
</React.StrictMode>
```

### Using Dark Mode

#### Toggle Color Mode

```tsx
import { useColorMode } from '@chakra-ui/react'

function ColorModeToggle() {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Button onClick={toggleColorMode}>
      {colorMode === 'light' ? '🌙' : '☀️'}
    </Button>
  )
}
```

#### Theme-Aware Values

```tsx
import { useColorModeValue } from '@chakra-ui/react'

function ThemedComponent() {
  const bg = useColorModeValue('white', 'gray.800')
  const color = useColorModeValue('gray.800', 'white')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  return (
    <Box bg={bg} color={color} borderColor={borderColor}>
      Content adapts to theme
    </Box>
  )
}
```

#### Gradient Backgrounds

```tsx
const bgGradient = useColorModeValue(
  'linear(to-br, blue.50, purple.50, pink.50)',
  'linear(to-br, gray.900, blue.900, purple.900)'
)

<Box bgGradient={bgGradient}>
  Beautiful gradient
</Box>
```

#### Color Mode in Component Styles

```tsx
components: {
  Button: {
    variants: {
      solid: (props) => ({
        bg: props.colorMode === 'dark' ? 'brand.600' : 'brand.500',
        _hover: {
          bg: props.colorMode === 'dark' ? 'brand.700' : 'brand.600',
        },
      }),
    },
  },
}
```

### Semantic Tokens

Use semantic tokens that automatically adapt:

```tsx
<Box bg="bg-surface" color="text-primary">
  // These tokens change with color mode
</Box>
```

### LocalStorage

Color mode preference is automatically saved to localStorage by Chakra UI.

## 🎬 Animation & Motion

This project uses Framer Motion integrated with Chakra UI for smooth animations.

### Framer Motion Integration

Chakra UI components can be animated with Framer Motion:

```tsx
import { motion } from 'framer-motion'
import { Box } from '@chakra-ui/react'

const MotionBox = motion(Box)

<MotionBox
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, x: -10 }}
  transition={{ duration: 0.2 }}
>
  Animated content
</MotionBox>
```

### AnimatePresence

Animate components entering and leaving:

```tsx
import { AnimatePresence } from 'framer-motion'

<AnimatePresence>
  {todos.map((todo) => (
    <MotionBox
      key={todo.id}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
    >
      {todo.text}
    </MotionBox>
  ))}
</AnimatePresence>
```

### Chakra UI Transitions

Built-in transition components:

```tsx
import { Fade, Slide, ScaleFade, SlideFade } from '@chakra-ui/react'

// Fade
<Fade in={isOpen}>
  <Box>Content</Box>
</Fade>

// Slide
<Slide direction="bottom" in={isOpen}>
  <Box>Slides from bottom</Box>
</Slide>

// Scale Fade
<ScaleFade initialScale={0.9} in={isOpen}>
  <Box>Scales and fades</Box>
</ScaleFade>
```

### Hover Animations

CSS transitions with Chakra props:

```tsx
<Box
  _hover={{
    transform: 'translateY(-4px)',
    boxShadow: 'lg',
  }}
  transition="all 0.3s"
>
  Hover me
</Box>
```

### Custom Animation Variants

```tsx
const variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
}

<MotionBox variants={variants}>
  Content
</MotionBox>
```

## 🔷 TypeScript Integration

Chakra UI has excellent TypeScript support.

### Component Props Types

```tsx
import { BoxProps, ButtonProps } from '@chakra-ui/react'

interface CustomBoxProps extends BoxProps {
  customProp: string
}

function CustomBox({ customProp, ...rest }: CustomBoxProps) {
  return <Box {...rest}>{customProp}</Box>
}
```

### Type-Safe Theme

```tsx
import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}
```

### Hook Types

```tsx
import { useColorMode, UseColorModeReturn } from '@chakra-ui/react'

const colorMode: UseColorModeReturn = useColorMode()
```

### Custom Types

```tsx
// types.ts
export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number
  completedAt?: number
}

export type FilterType = 'all' | 'active' | 'completed'
```

### Props with Generics

```tsx
interface ListProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return <VStack>{items.map(renderItem)}</VStack>
}
```

## 💾 LocalStorage Persistence

### Save to LocalStorage

```tsx
useEffect(() => {
  if (todos.length > 0) {
    localStorage.setItem('chakra-todos', JSON.stringify(todos))
  } else {
    localStorage.removeItem('chakra-todos')
  }
}, [todos])
```

### Load from LocalStorage

```tsx
useEffect(() => {
  const stored = localStorage.getItem('chakra-todos')
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      setTodos(parsed)
    } catch (error) {
      console.error('Failed to parse todos:', error)
    }
  }
}, [])
```

### Type-Safe Storage Keys

```tsx
export const STORAGE_KEYS = {
  TODOS: 'chakra-todos',
  THEME: 'chakra-color-mode',
} as const
```

## ⚡ Performance Optimizations

### 1. Component Memoization

```tsx
import { memo } from 'react'

const TodoItem = memo(({ todo, onToggle, onDelete }) => {
  // Component only re-renders if props change
  return <Box>...</Box>
})
```

### 2. useMemo for Expensive Calculations

```tsx
const stats = useMemo(() => {
  const total = todos.length
  const completed = todos.filter((t) => t.completed).length
  return { total, completed }
}, [todos])
```

### 3. useCallback for Event Handlers

```tsx
const handleToggle = useCallback((id: string) => {
  setTodos((prev) =>
    prev.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  )
}, [])
```

### 4. Code Splitting

```tsx
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom'],
        'chakra-vendor': ['@chakra-ui/react'],
        'motion-vendor': ['framer-motion'],
      },
    },
  },
}
```

### 5. Lazy Loading

```tsx
const HeavyComponent = lazy(() => import('./HeavyComponent'))

<Suspense fallback={<Spinner />}>
  <HeavyComponent />
</Suspense>
```

## ♿ Accessibility

Chakra UI components are accessible by default following WAI-ARIA guidelines.

### Keyboard Navigation

- **Tab** - Navigate between interactive elements
- **Enter** - Add todo (when input focused)
- **Space** - Toggle checkbox
- **Escape** - Close modals/menus

### ARIA Labels

```tsx
<IconButton
  aria-label="Delete todo"
  icon={<DeleteIcon />}
/>
```

### Focus Management

Chakra automatically manages focus:
- Focus trap in modals
- Focus return after modal close
- Visible focus indicators

### Screen Reader Support

- Semantic HTML elements
- Proper heading hierarchy
- Descriptive labels
- Status announcements via toast

### Color Contrast

All colors meet WCAG 2.1 AA standards:
- Text contrast ratio ≥ 4.5:1
- Interactive elements ≥ 3:1

## 🎓 Best Practices

### 1. Use Style Props Over CSS

❌ **Avoid:**
```tsx
<div className="box">
  <style>{`.box { padding: 16px; }`}</style>
</div>
```

✅ **Prefer:**
```tsx
<Box p={4}>Content</Box>
```

### 2. Leverage Theme Tokens

❌ **Avoid:**
```tsx
<Box bg="#2196f3">Content</Box>
```

✅ **Prefer:**
```tsx
<Box bg="brand.500">Content</Box>
```

### 3. Use Semantic Components

❌ **Avoid:**
```tsx
<Box as="button" onClick={handleClick}>
  Click me
</Box>
```

✅ **Prefer:**
```tsx
<Button onClick={handleClick}>Click me</Button>
```

### 4. Compose Components

❌ **Avoid:**
```tsx
<div style={{ display: 'flex', gap: '16px' }}>
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

✅ **Prefer:**
```tsx
<HStack spacing={4}>
  <Box>Item 1</Box>
  <Box>Item 2</Box>
</HStack>
```

### 5. Use Hooks for Common Patterns

❌ **Avoid:**
```tsx
const [isOpen, setIsOpen] = useState(false)
const handleOpen = () => setIsOpen(true)
const handleClose = () => setIsOpen(false)
```

✅ **Prefer:**
```tsx
const { isOpen, onOpen, onClose } = useDisclosure()
```

### 6. Extract Custom Components

When you repeat patterns, create reusable components:

```tsx
// components/Card.tsx
function Card({ title, children }: CardProps) {
  return (
    <Box
      bg={useColorModeValue('white', 'gray.800')}
      p={6}
      borderRadius="lg"
      boxShadow="lg"
    >
      <Heading size="md" mb={4}>{title}</Heading>
      {children}
    </Box>
  )
}
```

## 🔧 Common Patterns

### Loading States

```tsx
const [isLoading, setIsLoading] = useState(false)

<Button
  isLoading={isLoading}
  loadingText="Processing"
  onClick={handleSubmit}
>
  Submit
</Button>
```

### Conditional Rendering

```tsx
{isLoading ? (
  <Spinner />
) : (
  <TodoList todos={todos} />
)}
```

### Error Handling

```tsx
const toast = useToast()

try {
  await saveTodos()
  toast({
    title: 'Success',
    status: 'success',
  })
} catch (error) {
  toast({
    title: 'Error',
    description: error.message,
    status: 'error',
  })
}
```

### Form Validation

```tsx
const [error, setError] = useState('')

<FormControl isInvalid={!!error}>
  <FormLabel>Todo</FormLabel>
  <Input value={value} onChange={handleChange} />
  <FormErrorMessage>{error}</FormErrorMessage>
</FormControl>
```

## 🐛 Troubleshooting

### Issue: Theme not applying

**Solution:** Make sure `ColorModeScript` is before `ChakraProvider`:

```tsx
<ColorModeScript initialColorMode={theme.config.initialColorMode} />
<ChakraProvider theme={theme}>
  <App />
</ChakraProvider>
```

### Issue: TypeScript errors with style props

**Solution:** Make sure `@types/react` is installed and tsconfig includes proper settings:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@emotion/react"
  }
}
```

### Issue: Animations not working

**Solution:** Ensure `framer-motion` is installed:

```bash
npm install framer-motion
```

### Issue: Dark mode not persisting

**Solution:** Check localStorage key matches theme config:

```tsx
const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false, // Don't follow system
}
```

### Issue: Build size too large

**Solution:** Implement code splitting in vite.config.ts (already configured in this project)

## 📚 Further Learning

### Official Documentation
- [Chakra UI Docs](https://chakra-ui.com/) - Official documentation
- [Chakra UI GitHub](https://github.com/chakra-ui/chakra-ui) - Source code
- [Component API](https://chakra-ui.com/docs/components) - All components

### Advanced Topics
- [Custom Components](https://chakra-ui.com/docs/styled-system/component-style) - Create your own
- [Recipes](https://chakra-ui.com/docs/styled-system/recipes) - Common patterns
- [CLI](https://chakra-ui.com/docs/styled-system/cli) - Chakra CLI tools

### Video Tutorials
- [Chakra UI Crash Course](https://www.youtube.com/results?search_query=chakra+ui+tutorial) - YouTube tutorials
- [Building with Chakra](https://egghead.io/q/chakra-ui) - Egghead.io courses

### Community
- [Discord](https://discord.gg/chakra-ui) - Official Discord
- [Twitter](https://twitter.com/chakra_ui) - Latest updates
- [GitHub Discussions](https://github.com/chakra-ui/chakra-ui/discussions) - Ask questions

### Migration Guides
- [From v1 to v2](https://chakra-ui.com/docs/migration) - Migration guide
- [From Material-UI](https://chakra-ui.com/guides/migration-from-mui) - MUI to Chakra

### Example Projects
- [Chakra Templates](https://chakra-templates.dev/) - Ready-to-use templates
- [Pro Components](https://pro.chakra-ui.com/) - Premium components

---

## 📝 Summary

This React + Chakra UI Todo List demonstrates:

✅ **Modern React Patterns**
- Hooks (useState, useEffect, useMemo, useCallback)
- Component composition
- TypeScript integration
- Performance optimizations

✅ **Chakra UI Features**
- Style props system
- Theme customization
- Dark mode support
- Responsive design
- Accessibility
- Built-in components

✅ **Developer Experience**
- Type safety with TypeScript
- Fast development with Vite
- Hot module replacement
- Code splitting

✅ **User Experience**
- Beautiful UI with gradients
- Smooth animations
- Toast notifications
- LocalStorage persistence
- Mobile-friendly design

Chakra UI is an excellent choice for building modern React applications, offering the perfect balance between flexibility and convenience. Its intuitive API, excellent TypeScript support, and comprehensive component library make it ideal for projects of any size.

**Happy coding!** 🎨✨

