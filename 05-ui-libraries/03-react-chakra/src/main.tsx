import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import App from './App'
import theme from './theme'

/**
 * Main Application Entry Point
 *
 * Sets up the React application with Chakra UI provider
 * and initializes color mode based on theme configuration
 */

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* ColorModeScript must be rendered before ChakraProvider */}
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
)
