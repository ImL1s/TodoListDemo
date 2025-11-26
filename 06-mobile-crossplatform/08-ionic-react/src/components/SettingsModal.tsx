import React from 'react';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonListHeader,
  IonNote,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from '@ionic/react';
import {
  close,
  informationCircle,
  settings,
  colorPalette,
  moon,
} from 'ionicons/icons';
import { usePlatform } from '../hooks';

interface SettingsModalProps {
  onDismiss: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onDismiss }) => {
  const { platformName, isIOS, isAndroid, isWeb, isHybrid } = usePlatform();

  return (
    <>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Settings</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onDismiss}>
              <IonIcon icon={close} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* App Information */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IonIcon icon={informationCircle} />
                <span>App Information</span>
              </div>
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList inset={false}>
              <IonItem lines="none">
                <IonLabel>
                  <h3>Version</h3>
                  <p>1.0.0</p>
                </IonLabel>
              </IonItem>
              <IonItem lines="none">
                <IonLabel>
                  <h3>Platform</h3>
                  <p>{platformName}</p>
                </IonLabel>
              </IonItem>
              <IonItem lines="none">
                <IonLabel>
                  <h3>Runtime</h3>
                  <p>{isHybrid ? 'Native (Capacitor)' : 'Web Browser'}</p>
                </IonLabel>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>

        {/* Platform Features */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IonIcon icon={settings} />
                <span>Platform Features</span>
              </div>
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonListHeader>
                <IonLabel>Enabled Features</IonLabel>
              </IonListHeader>

              <IonItem>
                <IonIcon icon={colorPalette} slot="start" color="primary" />
                <IonLabel>
                  <h3>Platform Adaptive UI</h3>
                  <p>
                    {isIOS && 'iOS design patterns'}
                    {isAndroid && 'Material Design'}
                    {isWeb && 'Responsive web design'}
                  </p>
                </IonLabel>
              </IonItem>

              <IonItem>
                <IonIcon icon={moon} slot="start" color="primary" />
                <IonLabel>
                  <h3>Dark Mode</h3>
                  <p>System preference based</p>
                </IonLabel>
              </IonItem>

              {isHybrid && (
                <>
                  <IonItem>
                    <IonLabel>
                      <h3>Haptic Feedback</h3>
                      <p>Touch feedback on interactions</p>
                    </IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonLabel>
                      <h3>Native Storage</h3>
                      <p>Capacitor Preferences API</p>
                    </IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonLabel>
                      <h3>Keyboard Control</h3>
                      <p>Automatic keyboard handling</p>
                    </IonLabel>
                  </IonItem>
                </>
              )}
            </IonList>
          </IonCardContent>
        </IonCard>

        {/* About */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>About</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>
              This is a demonstration Todo List application built with Ionic Framework 7
              and React 18, showcasing cross-platform mobile development capabilities.
            </p>
            <IonNote>
              <p style={{ marginTop: '12px' }}>
                Technologies: Ionic 7, React 18, Capacitor 5, TypeScript, Vite
              </p>
            </IonNote>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </>
  );
};

export default SettingsModal;
