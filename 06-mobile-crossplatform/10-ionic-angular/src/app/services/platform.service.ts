import { Injectable } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Network } from '@capacitor/network';
import { StatusBar, Style } from '@capacitor/status-bar';

/**
 * PlatformService
 *
 * Service for handling platform-specific features and native capabilities.
 *
 * Features:
 * - Platform detection (iOS, Android, Web)
 * - Haptic feedback
 * - Network status monitoring
 * - Status bar customization
 * - Alert dialogs
 */
@Injectable({
  providedIn: 'root'
})
export class PlatformService {
  constructor(
    private platform: Platform,
    private alertController: AlertController
  ) {
    this.initializePlatform();
  }

  /**
   * Initialize platform-specific features
   */
  private async initializePlatform(): Promise<void> {
    await this.platform.ready();

    if (this.isNative()) {
      await this.setupStatusBar();
      await this.setupNetworkListener();
    }
  }

  /**
   * Setup status bar for native platforms
   */
  private async setupStatusBar(): Promise<void> {
    try {
      if (this.isIOS()) {
        await StatusBar.setStyle({ style: Style.Light });
      } else if (this.isAndroid()) {
        await StatusBar.setBackgroundColor({ color: '#3880ff' });
      }
    } catch (error) {
      console.log('Status bar not available:', error);
    }
  }

  /**
   * Setup network status listener
   */
  private async setupNetworkListener(): Promise<void> {
    try {
      Network.addListener('networkStatusChange', status => {
        console.log('Network status changed:', status);
        if (!status.connected) {
          this.showOfflineAlert();
        }
      });
    } catch (error) {
      console.log('Network monitoring not available:', error);
    }
  }

  /**
   * Check if running on native platform
   */
  public isNative(): boolean {
    return this.platform.is('capacitor');
  }

  /**
   * Check if running on iOS
   */
  public isIOS(): boolean {
    return this.platform.is('ios');
  }

  /**
   * Check if running on Android
   */
  public isAndroid(): boolean {
    return this.platform.is('android');
  }

  /**
   * Check if running on web
   */
  public isWeb(): boolean {
    return !this.isNative();
  }

  /**
   * Trigger haptic feedback
   */
  public async hapticImpact(style: ImpactStyle = ImpactStyle.Light): Promise<void> {
    if (!this.isNative()) {
      return;
    }

    try {
      await Haptics.impact({ style });
    } catch (error) {
      console.log('Haptics not available:', error);
    }
  }

  /**
   * Trigger notification haptic
   */
  public async hapticNotification(type: NotificationType): Promise<void> {
    if (!this.isNative()) {
      return;
    }

    try {
      await Haptics.notification({ type });
    } catch (error) {
      console.log('Haptics not available:', error);
    }
  }

  /**
   * Show confirmation alert
   */
  public async showConfirmAlert(
    header: string,
    message: string,
    confirmText = 'Confirm',
    cancelText = 'Cancel'
  ): Promise<boolean> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        {
          text: cancelText,
          role: 'cancel'
        },
        {
          text: confirmText,
          role: 'confirm'
        }
      ]
    });

    await alert.present();
    const { role } = await alert.onDidDismiss();
    return role === 'confirm';
  }

  /**
   * Show offline alert
   */
  private async showOfflineAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'No Internet Connection',
      message: 'You are currently offline. Some features may not be available.',
      buttons: ['OK']
    });

    await alert.present();
  }

  /**
   * Get network status
   */
  public async getNetworkStatus(): Promise<boolean> {
    if (!this.isNative()) {
      return navigator.onLine;
    }

    try {
      const status = await Network.getStatus();
      return status.connected;
    } catch (error) {
      console.log('Network status check failed:', error);
      return true; // Assume online if check fails
    }
  }

  /**
   * Get platform name
   */
  public getPlatformName(): string {
    if (this.isIOS()) return 'iOS';
    if (this.isAndroid()) return 'Android';
    return 'Web';
  }

  /**
   * Vibrate device (if supported)
   */
  public async vibrate(duration = 100): Promise<void> {
    if (!this.isNative()) {
      if ('vibrate' in navigator) {
        navigator.vibrate(duration);
      }
      return;
    }

    try {
      await Haptics.vibrate({ duration });
    } catch (error) {
      console.log('Vibration not available:', error);
    }
  }
}
