import { isPlatform } from '@ionic/react';
import { useEffect, useState } from 'react';

interface UsePlatformReturn {
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
  isWeb: boolean;
  isDesktop: boolean;
  isHybrid: boolean;
  platformName: string;
}

export const usePlatform = (): UsePlatformReturn => {
  const [platform, setPlatform] = useState<UsePlatformReturn>({
    isIOS: isPlatform('ios'),
    isAndroid: isPlatform('android'),
    isMobile: isPlatform('mobile'),
    isWeb: !isPlatform('hybrid'),
    isDesktop: isPlatform('desktop'),
    isHybrid: isPlatform('hybrid'),
    platformName: getPlatformName(),
  });

  useEffect(() => {
    // 响应式更新平台信息
    const handleResize = () => {
      setPlatform({
        isIOS: isPlatform('ios'),
        isAndroid: isPlatform('android'),
        isMobile: isPlatform('mobile'),
        isWeb: !isPlatform('hybrid'),
        isDesktop: isPlatform('desktop'),
        isHybrid: isPlatform('hybrid'),
        platformName: getPlatformName(),
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return platform;
};

function getPlatformName(): string {
  if (isPlatform('ios')) return 'iOS';
  if (isPlatform('android')) return 'Android';
  if (isPlatform('desktop')) return 'Desktop';
  if (isPlatform('mobile')) return 'Mobile Web';
  return 'Web';
}
