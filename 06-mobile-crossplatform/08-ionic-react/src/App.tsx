import { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { App as CapacitorApp } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import Home from './pages/Home';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact({
  mode: 'md', // 使用 Material Design 模式，可选 'ios' 或 'md'
  rippleEffect: true,
  animated: true,
});

const App: React.FC = () => {
  useEffect(() => {
    // 初始化原生功能
    const initializeApp = async () => {
      try {
        // 隐藏启动画面
        await SplashScreen.hide();

        // 设置状态栏样式
        await StatusBar.setStyle({ style: Style.Dark });

        // 监听应用状态变化
        CapacitorApp.addListener('appStateChange', ({ isActive }) => {
          console.log('App state changed. Is active?', isActive);
        });

        // 监听返回按钮（Android）
        CapacitorApp.addListener('backButton', ({ canGoBack }) => {
          if (!canGoBack) {
            CapacitorApp.exitApp();
          } else {
            window.history.back();
          }
        });

        // 监听深度链接
        CapacitorApp.addListener('appUrlOpen', (data) => {
          console.log('App opened with URL:', data);
        });
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };

    initializeApp();

    // 清理监听器
    return () => {
      CapacitorApp.removeAllListeners();
    };
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/home" component={Home} exact />
          <Route
            exact
            path="/"
            render={() => <Redirect to="/home" />}
          />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
