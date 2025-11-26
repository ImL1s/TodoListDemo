import { useIonToast } from '@ionic/react';
import { useCallback } from 'react';

type ToastColor = 'success' | 'warning' | 'danger' | 'medium' | 'primary';
type ToastPosition = 'top' | 'bottom' | 'middle';

interface UseToastReturn {
  showToast: (message: string, color?: ToastColor, duration?: number) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
}

export const useToast = (): UseToastReturn => {
  const [present] = useIonToast();

  const showToast = useCallback(
    (
      message: string,
      color: ToastColor = 'success',
      duration: number = 2000,
      position: ToastPosition = 'bottom'
    ) => {
      present({
        message,
        duration,
        position,
        color,
        cssClass: 'custom-toast',
        buttons: [
          {
            text: 'Dismiss',
            role: 'cancel',
          },
        ],
      });
    },
    [present]
  );

  const showSuccess = useCallback(
    (message: string) => showToast(message, 'success'),
    [showToast]
  );

  const showError = useCallback(
    (message: string) => showToast(message, 'danger', 3000),
    [showToast]
  );

  const showWarning = useCallback(
    (message: string) => showToast(message, 'warning'),
    [showToast]
  );

  const showInfo = useCallback(
    (message: string) => showToast(message, 'medium'),
    [showToast]
  );

  return {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
