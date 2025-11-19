import { useCallback } from 'react';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

interface UseHapticsReturn {
  impact: (style?: ImpactStyle) => Promise<void>;
  notification: (type?: NotificationType) => Promise<void>;
  vibrate: (duration?: number) => Promise<void>;
  selectionStart: () => Promise<void>;
  selectionChanged: () => Promise<void>;
  selectionEnd: () => Promise<void>;
}

export const useHaptics = (): UseHapticsReturn => {
  const impact = useCallback(async (style: ImpactStyle = ImpactStyle.Light) => {
    try {
      await Haptics.impact({ style });
    } catch (error) {
      // Haptics not available
    }
  }, []);

  const notification = useCallback(
    async (type: NotificationType = NotificationType.Success) => {
      try {
        await Haptics.notification({ type });
      } catch (error) {
        // Haptics not available
      }
    },
    []
  );

  const vibrate = useCallback(async (duration: number = 300) => {
    try {
      await Haptics.vibrate({ duration });
    } catch (error) {
      // Haptics not available
    }
  }, []);

  const selectionStart = useCallback(async () => {
    try {
      await Haptics.selectionStart();
    } catch (error) {
      // Haptics not available
    }
  }, []);

  const selectionChanged = useCallback(async () => {
    try {
      await Haptics.selectionChanged();
    } catch (error) {
      // Haptics not available
    }
  }, []);

  const selectionEnd = useCallback(async () => {
    try {
      await Haptics.selectionEnd();
    } catch (error) {
      // Haptics not available
    }
  }, []);

  return {
    impact,
    notification,
    vibrate,
    selectionStart,
    selectionChanged,
    selectionEnd,
  };
};
