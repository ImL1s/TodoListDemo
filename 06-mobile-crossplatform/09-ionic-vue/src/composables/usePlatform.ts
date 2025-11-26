import { onMounted, onUnmounted } from 'vue'
import { Capacitor } from '@capacitor/core'
import { App } from '@capacitor/app'
import { StatusBar, Style } from '@capacitor/status-bar'
import { Keyboard } from '@capacitor/keyboard'

export interface PlatformInfo {
  isNative: boolean
  isWeb: boolean
  isIOS: boolean
  isAndroid: boolean
  platform: 'ios' | 'android' | 'web'
}

/**
 * Composable for platform-specific functionality
 */
export function usePlatform() {
  const platform = Capacitor.getPlatform()
  const isNative = Capacitor.isNativePlatform()

  const platformInfo: PlatformInfo = {
    isNative,
    isWeb: platform === 'web',
    isIOS: platform === 'ios',
    isAndroid: platform === 'android',
    platform: platform as 'ios' | 'android' | 'web'
  }

  /**
   * Setup status bar (iOS/Android)
   */
  const setupStatusBar = async (options?: {
    style?: Style
    backgroundColor?: string
  }) => {
    if (!isNative) return

    try {
      // Set style
      await StatusBar.setStyle({
        style: options?.style || Style.Dark
      })

      // Set background color (Android only)
      if (platformInfo.isAndroid && options?.backgroundColor) {
        await StatusBar.setBackgroundColor({
          color: options.backgroundColor
        })
      }
    } catch (error) {
      console.warn('Failed to setup status bar:', error)
    }
  }

  /**
   * Show status bar
   */
  const showStatusBar = async () => {
    if (!isNative) return
    try {
      await StatusBar.show()
    } catch (error) {
      console.warn('Failed to show status bar:', error)
    }
  }

  /**
   * Hide status bar
   */
  const hideStatusBar = async () => {
    if (!isNative) return
    try {
      await StatusBar.hide()
    } catch (error) {
      console.warn('Failed to hide status bar:', error)
    }
  }

  /**
   * Setup keyboard listeners
   */
  const setupKeyboard = (callbacks?: {
    onShow?: (info: { keyboardHeight: number }) => void
    onHide?: () => void
  }) => {
    if (!isNative) return

    const listeners = {
      show: Keyboard.addListener('keyboardWillShow', info => {
        callbacks?.onShow?.(info)
      }),
      hide: Keyboard.addListener('keyboardWillHide', () => {
        callbacks?.onHide?.()
      })
    }

    // Cleanup function
    return () => {
      listeners.show.remove()
      listeners.hide.remove()
    }
  }

  /**
   * Hide keyboard
   */
  const hideKeyboard = async () => {
    if (!isNative) return
    try {
      await Keyboard.hide()
    } catch (error) {
      console.warn('Failed to hide keyboard:', error)
    }
  }

  /**
   * Setup Android back button handler
   */
  const setupBackButton = (onBackButton?: (canGoBack: boolean) => void) => {
    if (!platformInfo.isAndroid) return

    const listener = App.addListener('backButton', ({ canGoBack }) => {
      if (onBackButton) {
        onBackButton(canGoBack)
      } else {
        // Default behavior
        if (!canGoBack) {
          App.exitApp()
        } else {
          window.history.back()
        }
      }
    })

    // Cleanup function
    return () => {
      listener.remove()
    }
  }

  /**
   * Exit the app (Android)
   */
  const exitApp = () => {
    if (!platformInfo.isAndroid) return
    App.exitApp()
  }

  /**
   * Minimize the app (Android)
   */
  const minimizeApp = () => {
    if (!platformInfo.isAndroid) return
    App.minimizeApp()
  }

  /**
   * Get app info
   */
  const getAppInfo = async () => {
    if (!isNative) return null
    try {
      return await App.getInfo()
    } catch (error) {
      console.warn('Failed to get app info:', error)
      return null
    }
  }

  /**
   * Get app state
   */
  const getAppState = async () => {
    if (!isNative) return null
    try {
      return await App.getState()
    } catch (error) {
      console.warn('Failed to get app state:', error)
      return null
    }
  }

  /**
   * Setup app state change listener
   */
  const setupAppStateListener = (callback: (state: { isActive: boolean }) => void) => {
    if (!isNative) return

    const listener = App.addListener('appStateChange', callback)

    // Cleanup function
    return () => {
      listener.remove()
    }
  }

  return {
    ...platformInfo,
    setupStatusBar,
    showStatusBar,
    hideStatusBar,
    setupKeyboard,
    hideKeyboard,
    setupBackButton,
    exitApp,
    minimizeApp,
    getAppInfo,
    getAppState,
    setupAppStateListener
  }
}

/**
 * Auto-setup platform features on mount
 */
export function useAutoSetupPlatform(options?: {
  statusBarStyle?: Style
  statusBarBackgroundColor?: string
  onBackButton?: (canGoBack: boolean) => void
  onKeyboardShow?: (info: { keyboardHeight: number }) => void
  onKeyboardHide?: () => void
}) {
  const platform = usePlatform()

  onMounted(async () => {
    // Setup status bar
    await platform.setupStatusBar({
      style: options?.statusBarStyle || Style.Dark,
      backgroundColor: options?.statusBarBackgroundColor || '#3880ff'
    })

    // Setup keyboard listeners
    const cleanupKeyboard = platform.setupKeyboard({
      onShow: options?.onKeyboardShow,
      onHide: options?.onKeyboardHide
    })

    // Setup back button (Android)
    const cleanupBackButton = platform.setupBackButton(options?.onBackButton)

    // Cleanup on unmount
    onUnmounted(() => {
      cleanupKeyboard?.()
      cleanupBackButton?.()
    })
  })

  return platform
}
