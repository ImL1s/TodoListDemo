import { toastController } from '@ionic/vue'

export type ToastColor = 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'light' | 'medium' | 'dark'
export type ToastPosition = 'top' | 'bottom' | 'middle'

export interface ToastOptions {
  message: string
  duration?: number
  color?: ToastColor
  position?: ToastPosition
  icon?: string
}

/**
 * Composable for showing toast notifications
 */
export function useToast() {
  const DEFAULT_DURATION = 2000
  const DEFAULT_POSITION: ToastPosition = 'bottom'

  /**
   * Show a toast notification
   * @param options - Toast options
   */
  const showToast = async (options: ToastOptions | string) => {
    const config: ToastOptions = typeof options === 'string'
      ? { message: options }
      : options

    try {
      const toast = await toastController.create({
        message: config.message,
        duration: config.duration || DEFAULT_DURATION,
        color: config.color || 'primary',
        position: config.position || DEFAULT_POSITION,
        icon: config.icon,
        buttons: [
          {
            text: 'Dismiss',
            role: 'cancel'
          }
        ]
      })

      await toast.present()
    } catch (error) {
      console.error('Failed to show toast:', error)
    }
  }

  /**
   * Show a success toast
   * @param message - Toast message
   * @param duration - Toast duration (default: 2000ms)
   */
  const showSuccess = async (message: string, duration?: number) => {
    await showToast({
      message,
      duration,
      color: 'success',
      icon: 'checkmark-circle-outline'
    })
  }

  /**
   * Show an error toast
   * @param message - Toast message
   * @param duration - Toast duration (default: 2000ms)
   */
  const showError = async (message: string, duration?: number) => {
    await showToast({
      message,
      duration,
      color: 'danger',
      icon: 'alert-circle-outline'
    })
  }

  /**
   * Show a warning toast
   * @param message - Toast message
   * @param duration - Toast duration (default: 2000ms)
   */
  const showWarning = async (message: string, duration?: number) => {
    await showToast({
      message,
      duration,
      color: 'warning',
      icon: 'warning-outline'
    })
  }

  /**
   * Show an info toast
   * @param message - Toast message
   * @param duration - Toast duration (default: 2000ms)
   */
  const showInfo = async (message: string, duration?: number) => {
    await showToast({
      message,
      duration,
      color: 'primary',
      icon: 'information-circle-outline'
    })
  }

  return {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}
