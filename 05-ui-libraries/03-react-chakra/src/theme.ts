import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

/**
 * Custom Chakra UI Theme Configuration
 *
 * This theme provides:
 * - Custom color palette with brand colors
 * - Dark mode support with custom colors
 * - Custom component styles
 * - Responsive breakpoints
 * - Custom fonts and typography
 */

// Theme configuration for color mode
const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

// Custom colors
const colors = {
  brand: {
    50: '#e3f2fd',
    100: '#bbdefb',
    200: '#90caf9',
    300: '#64b5f6',
    400: '#42a5f5',
    500: '#2196f3',
    600: '#1e88e5',
    700: '#1976d2',
    800: '#1565c0',
    900: '#0d47a1',
  },
  gradient: {
    light: 'linear(to-br, blue.50, purple.50, pink.50)',
    dark: 'linear(to-br, gray.900, blue.900, purple.900)',
  },
}

// Custom breakpoints
const breakpoints = {
  sm: '30em',   // 480px
  md: '48em',   // 768px
  lg: '62em',   // 992px
  xl: '80em',   // 1280px
  '2xl': '96em', // 1536px
}

// Custom fonts
const fonts = {
  heading: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif`,
  body: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif`,
  mono: `"Fira Code", "Courier New", monospace`,
}

// Component style overrides
const components = {
  Button: {
    baseStyle: {
      fontWeight: 'semibold',
      borderRadius: 'lg',
    },
    variants: {
      solid: (props: any) => ({
        bg: props.colorMode === 'dark' ? 'brand.600' : 'brand.500',
        color: 'white',
        _hover: {
          bg: props.colorMode === 'dark' ? 'brand.700' : 'brand.600',
          transform: 'translateY(-2px)',
          boxShadow: 'lg',
        },
        _active: {
          transform: 'translateY(0)',
        },
        transition: 'all 0.2s',
      }),
      ghost: {
        _hover: {
          bg: 'whiteAlpha.200',
        },
      },
    },
  },
  Card: {
    baseStyle: {
      container: {
        borderRadius: 'xl',
        boxShadow: 'lg',
        overflow: 'hidden',
      },
    },
    variants: {
      elevated: (props: any) => ({
        container: {
          bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
          boxShadow: props.colorMode === 'dark'
            ? 'dark-lg'
            : '0 10px 30px rgba(0, 0, 0, 0.1)',
          _hover: {
            transform: 'translateY(-4px)',
            boxShadow: props.colorMode === 'dark'
              ? '0 20px 40px rgba(0, 0, 0, 0.4)'
              : '0 20px 40px rgba(0, 0, 0, 0.15)',
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      }),
    },
  },
  Input: {
    variants: {
      filled: (props: any) => ({
        field: {
          bg: props.colorMode === 'dark' ? 'whiteAlpha.100' : 'gray.50',
          borderRadius: 'lg',
          _hover: {
            bg: props.colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.100',
          },
          _focus: {
            bg: props.colorMode === 'dark' ? 'whiteAlpha.200' : 'white',
            borderColor: 'brand.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
          },
        },
      }),
    },
  },
  Checkbox: {
    baseStyle: {
      control: {
        borderRadius: 'md',
        _checked: {
          bg: 'brand.500',
          borderColor: 'brand.500',
          _hover: {
            bg: 'brand.600',
            borderColor: 'brand.600',
          },
        },
      },
    },
  },
}

// Global styles
const styles = {
  global: (props: any) => ({
    body: {
      bg: props.colorMode === 'dark'
        ? 'gray.900'
        : 'gray.50',
      color: props.colorMode === 'dark'
        ? 'whiteAlpha.900'
        : 'gray.800',
    },
    '*::placeholder': {
      color: props.colorMode === 'dark'
        ? 'whiteAlpha.400'
        : 'gray.400',
    },
  }),
}

// Text styles
const textStyles = {
  h1: {
    fontSize: ['2xl', '3xl', '4xl'],
    fontWeight: 'bold',
    lineHeight: '110%',
    letterSpacing: '-0.01em',
  },
  h2: {
    fontSize: ['xl', '2xl', '3xl'],
    fontWeight: 'semibold',
    lineHeight: '110%',
    letterSpacing: '-0.01em',
  },
}

// Layer styles
const layerStyles = {
  card: {
    bg: 'white',
    borderRadius: 'xl',
    boxShadow: 'lg',
    p: 6,
  },
  'card-dark': {
    bg: 'gray.800',
    borderRadius: 'xl',
    boxShadow: 'dark-lg',
    p: 6,
  },
}

// Export the custom theme
const theme = extendTheme({
  config,
  colors,
  breakpoints,
  fonts,
  components,
  styles,
  textStyles,
  layerStyles,
  shadows: {
    outline: '0 0 0 3px rgba(33, 150, 243, 0.6)',
  },
  radii: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
  },
})

export default theme
