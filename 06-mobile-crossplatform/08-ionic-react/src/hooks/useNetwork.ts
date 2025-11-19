import { useEffect, useState } from 'react';
import { Network } from '@capacitor/network';

interface UseNetworkReturn {
  isOnline: boolean;
  connectionType: string;
}

export const useNetwork = (): UseNetworkReturn => {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionType, setConnectionType] = useState('unknown');

  useEffect(() => {
    let mounted = true;

    // 获取初始网络状态
    const getStatus = async () => {
      try {
        const status = await Network.getStatus();
        if (mounted) {
          setIsOnline(status.connected);
          setConnectionType(status.connectionType);
        }
      } catch (error) {
        // Network plugin not available (web)
        if (mounted) {
          setIsOnline(navigator.onLine);
          setConnectionType('unknown');
        }
      }
    };

    getStatus();

    // 监听网络状态变化
    let listener: any;
    const setupListener = async () => {
      try {
        listener = await Network.addListener('networkStatusChange', (status) => {
          if (mounted) {
            setIsOnline(status.connected);
            setConnectionType(status.connectionType);
          }
        });
      } catch (error) {
        // Fallback to browser events
        const handleOnline = () => mounted && setIsOnline(true);
        const handleOffline = () => mounted && setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
          window.removeEventListener('online', handleOnline);
          window.removeEventListener('offline', handleOffline);
        };
      }
    };

    setupListener();

    return () => {
      mounted = false;
      if (listener) {
        listener.remove();
      }
    };
  }, []);

  return { isOnline, connectionType };
};
