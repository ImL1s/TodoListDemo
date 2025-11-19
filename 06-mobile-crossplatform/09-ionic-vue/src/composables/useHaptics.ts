import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'
import { Capacitor } from '@capacitor/core'

/**
 * Composable for haptic feedback
 * Only works on native platforms (iOS/Android)
 */
export function useHaptics() {
  const isNativePlatform = Capacitor.isNativePlatform()

  /**
   * Light impact haptic feedback
   * Use for: minor UI interactions
   */
  const lightImpact = async () => {
    if (!isNativePlatform) return
    try {
      await Haptics.impact({ style: ImpactStyle.Light })
    } catch (error) {
      console.warn('Haptics not available:', error)
    }
  }

  /**
   * Medium impact haptic feedback
   * Use for: important actions like delete
   */
  const mediumImpact = async () => {
    if (!isNativePlatform) return
    try {
      await Haptics.impact({ style: ImpactStyle.Medium })
    } catch (error) {
      console.warn('Haptics not available:', error)
    }
  }

  /**
   * Heavy impact haptic feedback
   * Use for: critical actions
   */
  const heavyImpact = async () => {
    if (!isNativePlatform) return
    try {
      await Haptics.impact({ style: ImpactStyle.Heavy })
    } catch (error) {
      console.warn('Haptics not available:', error)
    }
  }

  /**
   * Success notification haptic
   * Use for: successful operations
   */
  const success = async () => {
    if (!isNativePlatform) return
    try {
      await Haptics.notification({ type: NotificationType.Success })
    } catch (error) {
      console.warn('Haptics not available:', error)
    }
  }

  /**
   * Warning notification haptic
   * Use for: warnings or reversible actions
   */
  const warning = async () => {
    if (!isNativePlatform) return
    try {
      await Haptics.notification({ type: NotificationType.Warning })
    } catch (error) {
      console.warn('Haptics not available:', error)
    }
  }

  /**
   * Error notification haptic
   * Use for: errors or failed operations
   */
  const error = async () => {
    if (!isNativePlatform) return
    try {
      await Haptics.notification({ type: NotificationType.Error })
    } catch (error) {
      console.warn('Haptics not available:', error)
    }
  }

  /**
   * Selection haptic (light vibration)
   * Use for: selecting items in a list
   */
  const selectionStart = async () => {
    if (!isNativePlatform) return
    try {
      await Haptics.selectionStart()
    } catch (error) {
      console.warn('Haptics not available:', error)
    }
  }

  const selectionChanged = async () => {
    if (!isNativePlatform) return
    try {
      await Haptics.selectionChanged()
    } catch (error) {
      console.warn('Haptics not available:', error)
    }
  }

  const selectionEnd = async () => {
    if (!isNativePlatform) return
    try {
      await Haptics.selectionEnd()
    } catch (error) {
      console.warn('Haptics not available:', error)
    }
  }

  /**
   * Vibrate device for a specific duration (Android only)
   * @param duration - Duration in milliseconds
   */
  const vibrate = async (duration = 300) => {
    if (!isNativePlatform) return
    try {
      await Haptics.vibrate({ duration })
    } catch (error) {
      console.warn('Haptics not available:', error)
    }
  }

  return {
    isNativePlatform,
    lightImpact,
    mediumImpact,
    heavyImpact,
    success,
    warning,
    error,
    selectionStart,
    selectionChanged,
    selectionEnd,
    vibrate
  }
}
