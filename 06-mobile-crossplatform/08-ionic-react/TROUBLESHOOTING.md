# Ionic React Todo - 故障排除指南

## 📋 常见问题解决方案

本指南涵盖了开发和部署 Ionic React 应用时可能遇到的常见问题及其解决方案。

---

## 🔧 开发环境问题

### 1. 安装依赖失败

#### 问题：`npm install` 或 `yarn install` 失败

**症状**：
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**解决方案**：

方案 1：清除缓存
```bash
# 删除 node_modules 和 lock 文件
rm -rf node_modules package-lock.json yarn.lock

# 清除 npm 缓存
npm cache clean --force

# 重新安装
npm install
```

方案 2：使用 --legacy-peer-deps
```bash
npm install --legacy-peer-deps
```

方案 3：使用正确的 Node.js 版本
```bash
# 检查 Node 版本
node --version

# 应该是 v16.x 或更高
# 如果不是，使用 nvm 切换
nvm install 18
nvm use 18
```

---

### 2. TypeScript 编译错误

#### 问题：类型错误导致无法启动

**症状**：
```
TS2307: Cannot find module '@ionic/react' or its corresponding type declarations.
```

**解决方案**：

方案 1：安装类型定义
```bash
npm install --save-dev @types/react @types/react-dom
```

方案 2：检查 tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

### 3. Vite 开发服务器问题

#### 问题：无法启动开发服务器

**症状**：
```
Error: Cannot find module 'vite'
```

**解决方案**：

```bash
# 确保 Vite 已安装
npm install --save-dev vite @vitejs/plugin-react

# 检查 vite.config.ts 配置
# 确保包含正确的插件配置
```

#### 问题：端口被占用

**症状**：
```
Port 3000 is already in use
```

**解决方案**：

方案 1：使用其他端口
```bash
# 修改 package.json
"start": "vite --port 3001"

# 或临时指定
npm run start -- --port 3001
```

方案 2：杀死占用进程
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

## 📱 Capacitor 问题

### 1. Capacitor 同步失败

#### 问题：`npx cap sync` 失败

**症状**：
```
[error] Unable to find node_modules/@capacitor/android
```

**解决方案**：

```bash
# 1. 确保构建了 Web 应用
npm run build

# 2. 确保安装了平台
npm install @capacitor/android @capacitor/ios

# 3. 添加平台（如果未添加）
npx cap add android
npx cap add ios

# 4. 同步
npx cap sync
```

---

### 2. iOS 构建问题

#### 问题：CocoaPods 安装失败

**症状**：
```
[error] CocoaPods not installed
```

**解决方案**：

```bash
# 安装 CocoaPods
sudo gem install cocoapods

# 如果使用 Homebrew
brew install cocoapods

# 更新 pods
cd ios/App
pod install
pod update
```

#### 问题：Xcode 版本不兼容

**症状**：
```
error: Xcode 14.0 or higher is required
```

**解决方案**：

1. 从 App Store 更新 Xcode
2. 设置命令行工具：
```bash
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
```

#### 问题：Signing 证书问题

**症状**：
```
error: Signing for "App" requires a development team
```

**解决方案**：

1. 在 Xcode 中打开项目
2. 选择 App 目标
3. 在 "Signing & Capabilities" 选项卡中：
   - 勾选 "Automatically manage signing"
   - 选择你的 Team（需要 Apple Developer 账号）

---

### 3. Android 构建问题

#### 问题：Gradle 构建失败

**症状**：
```
FAILURE: Build failed with an exception
```

**解决方案**：

方案 1：清除 Gradle 缓存
```bash
cd android
./gradlew clean

# 或完全清除
rm -rf .gradle
./gradlew clean build
```

方案 2：检查 Java 版本
```bash
# 需要 JDK 11 或更高
java -version

# 设置 JAVA_HOME
export JAVA_HOME=/path/to/jdk
```

方案 3：更新 Gradle
```bash
# android/build.gradle
buildscript {
    dependencies {
        classpath 'com.android.tools.build:gradle:8.0.0'
    }
}

# android/gradle/wrapper/gradle-wrapper.properties
distributionUrl=https\://services.gradle.org/distributions/gradle-8.0-all.zip
```

#### 问题：Android SDK 未找到

**症状**：
```
ANDROID_HOME is not set
```

**解决方案**：

```bash
# 设置环境变量（添加到 ~/.bashrc 或 ~/.zshrc）
export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
export ANDROID_HOME=$HOME/Android/Sdk          # Linux
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools

# 重新加载配置
source ~/.bashrc  # 或 source ~/.zshrc
```

---

## 🔌 插件问题

### 1. Capacitor Preferences 问题

#### 问题：数据无法持久化

**症状**：应用重启后数据丢失

**解决方案**：

```typescript
// 检查保存是否成功
const saveTodos = async (todos: Todo[]) => {
  try {
    await Preferences.set({
      key: 'todos',
      value: JSON.stringify(todos),
    });
    console.log('Saved successfully');
  } catch (error) {
    console.error('Save failed:', error);
    // 检查是否超出存储限制
    const size = new Blob([JSON.stringify(todos)]).size;
    console.log('Data size:', size, 'bytes');
  }
};

// 检查读取
const loadTodos = async () => {
  try {
    const { value } = await Preferences.get({ key: 'todos' });
    console.log('Loaded value:', value);
    if (value) {
      return JSON.parse(value);
    }
  } catch (error) {
    console.error('Load failed:', error);
  }
  return [];
};
```

---

### 2. Network 插件问题

#### 问题：无法检测网络状态

**症状**：`isOnline` 始终为 true

**解决方案**：

```typescript
// 添加降级处理
import { Network } from '@capacitor/network';

const checkNetwork = async () => {
  try {
    const status = await Network.getStatus();
    console.log('Network status:', status);
    return status.connected;
  } catch (error) {
    // 降级到浏览器 API
    console.warn('Network plugin not available, using navigator.onLine');
    return navigator.onLine;
  }
};
```

---

### 3. Haptics 插件问题

#### 问题：触觉反馈不工作

**症状**：调用 `Haptics.impact()` 无效果

**解决方案**：

1. 确保在真机上测试（模拟器不支持）
2. 检查设备设置：
   - iOS: 设置 > 声音与触感 > 系统触感反馈
   - Android: 设置 > 声音和振动 > 触感反馈

3. 添加错误处理：
```typescript
const triggerHaptic = async () => {
  try {
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch (error) {
    console.log('Haptics not supported:', error);
    // 提供视觉反馈作为替代
  }
};
```

---

## 🎨 样式和 UI 问题

### 1. Ionic 组件不显示

#### 问题：组件渲染为空白

**症状**：页面空白或组件不可见

**解决方案**：

检查是否导入了 Ionic CSS：
```typescript
// App.tsx
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
```

---

### 2. CSS 变量不生效

#### 问题：自定义主题颜色不显示

**症状**：颜色保持默认

**解决方案**：

```css
/* src/theme/variables.css */
/* 确保在 :root 中定义 */
:root {
  --ion-color-primary: #3880ff;
  --ion-color-primary-rgb: 56, 128, 255;
  --ion-color-primary-contrast: #ffffff;
  --ion-color-primary-contrast-rgb: 255, 255, 255;
  --ion-color-primary-shade: #3171e0;
  --ion-color-primary-tint: #4c8dff;
}

/* 创建自定义颜色类 */
.ion-color-custom {
  --ion-color-base: var(--ion-color-custom);
  --ion-color-base-rgb: var(--ion-color-custom-rgb);
  --ion-color-contrast: var(--ion-color-custom-contrast);
  --ion-color-contrast-rgb: var(--ion-color-custom-contrast-rgb);
  --ion-color-shade: var(--ion-color-custom-shade);
  --ion-color-tint: var(--ion-color-custom-tint);
}
```

---

### 3. 平台特定样式问题

#### 问题：iOS 和 Android 显示不一致

**症状**：同一组件在不同平台显示不同

**解决方案**：

```typescript
// 方法 1：使用平台检测
import { isPlatform } from '@ionic/react';

const styles = isPlatform('ios')
  ? { borderRadius: '10px' }
  : { borderRadius: '4px' };

// 方法 2：使用 CSS 类
<div className={isPlatform('ios') ? 'ios-style' : 'md-style'}>
  Content
</div>

// 方法 3：CSS 平台选择器
.ios .my-component {
  /* iOS specific styles */
}

.md .my-component {
  /* Material Design specific styles */
}
```

---

## 🚀 性能问题

### 1. 应用启动缓慢

#### 问题：首次加载时间过长

**解决方案**：

1. 检查包大小：
```bash
npm run build
# 查看 dist/ 目录大小

# 分析包内容
npx vite-bundle-visualizer
```

2. 优化导入：
```typescript
// ❌ 错误：导入整个库
import * as Icons from 'ionicons/icons';

// ✅ 正确：按需导入
import { addCircle, trashOutline } from 'ionicons/icons';
```

3. 启用代码分割：
```typescript
// 懒加载组件
import { lazy, Suspense } from 'react';

const TodoList = lazy(() => import('./components/TodoList'));

<Suspense fallback={<IonSpinner />}>
  <TodoList />
</Suspense>
```

---

### 2. 列表滚动卡顿

#### 问题：长列表滚动不流畅

**解决方案**：

1. 使用虚拟滚动：
```typescript
import { IonVirtualScroll } from '@ionic/react';

<IonVirtualScroll
  items={todos}
  approxItemHeight={60}
  renderItem={(todo, index) => (
    <TodoItem key={todo.id} todo={todo} />
  )}
/>
```

2. 优化组件渲染：
```typescript
// 使用 React.memo
export default React.memo(TodoItem, (prevProps, nextProps) => {
  return prevProps.todo.id === nextProps.todo.id &&
         prevProps.todo.completed === nextProps.todo.completed;
});
```

---

### 3. 内存泄漏

#### 问题：应用使用时间长后变慢

**解决方案**：

1. 清理事件监听器：
```typescript
useEffect(() => {
  const listener = Network.addListener('networkStatusChange', handler);

  return () => {
    listener.remove(); // 清理
  };
}, []);
```

2. 取消未完成的请求：
```typescript
useEffect(() => {
  let cancelled = false;

  const loadData = async () => {
    const data = await fetchData();
    if (!cancelled) {
      setData(data);
    }
  };

  loadData();

  return () => {
    cancelled = true; // 防止更新已卸载的组件
  };
}, []);
```

---

## 📦 部署问题

### 1. Web 部署问题

#### 问题：构建后白屏

**症状**：部署到服务器后页面空白

**解决方案**：

1. 检查 base 路径：
```typescript
// vite.config.ts
export default defineConfig({
  base: '/', // 或你的子路径如 '/app/'
  // ...
});
```

2. 检查路由配置：
```typescript
// 确保使用 BrowserRouter 或 HashRouter
import { IonReactRouter } from '@ionic/react-router';

// IonReactRouter 默认使用 BrowserRouter
```

3. 检查服务器配置（Nginx 示例）：
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

---

### 2. iOS App Store 提交问题

#### 问题：审核被拒

**常见原因**：
1. 缺少隐私政策
2. 权限说明不清楚
3. 应用崩溃或 bug

**解决方案**：

1. 添加隐私说明（Info.plist）：
```xml
<key>NSCameraUsageDescription</key>
<string>We need camera access to take photos for todos</string>

<key>NSLocationWhenInUseUsageDescription</key>
<string>We need location to show nearby tasks</string>
```

2. 测试应用：
```bash
# 在真机上彻底测试
# 使用 TestFlight 进行 beta 测试
```

---

### 3. Android Play Store 发布问题

#### 问题：AAB 上传失败

**症状**：
```
Upload failed: Invalid package name
```

**解决方案**：

1. 检查 package name：
```gradle
// android/app/build.gradle
defaultConfig {
    applicationId "com.yourcompany.todoapp" // 必须唯一
    // ...
}
```

2. 检查签名配置：
```bash
# 验证签名
keytool -list -v -keystore my-release-key.keystore
```

---

## 🐛 调试技巧

### 1. 浏览器调试

```typescript
// 使用 console 调试
console.log('Todo added:', todo);
console.table(todos); // 表格形式
console.time('operation');
// ... code
console.timeEnd('operation');
```

### 2. React DevTools

1. 安装 React DevTools 浏览器扩展
2. 检查组件树和 Props
3. 分析渲染性能

### 3. Ionic DevTools

```bash
# 启动 DevTools
ionic serve --devapp
```

### 4. 原生调试

**iOS**:
```bash
# Safari Web Inspector
1. Safari > Develop > [Your Device] > [Your App]
2. 查看控制台和网络请求
```

**Android**:
```bash
# Chrome DevTools
1. chrome://inspect
2. 连接设备
3. 选择应用进行调试
```

---

## 📞 获取帮助

### 官方资源

1. **Ionic 文档**: https://ionicframework.com/docs
2. **Ionic 论坛**: https://forum.ionicframework.com
3. **Capacitor 文档**: https://capacitorjs.com/docs
4. **React 文档**: https://react.dev

### 社区支持

1. **Discord**: https://ionic.link/discord
2. **Stack Overflow**: 标签 `ionic-framework`, `capacitor`
3. **GitHub Issues**:
   - Ionic: https://github.com/ionic-team/ionic-framework/issues
   - Capacitor: https://github.com/ionic-team/capacitor/issues

### 常用命令

```bash
# 诊断命令
ionic info                    # 系统信息
npm doctor                    # 检查 npm 环境
npx cap doctor               # 检查 Capacitor 配置

# 日志查看
npx cap run ios --livereload  # iOS 实时日志
npx cap run android --log     # Android 实时日志
adb logcat                    # Android 详细日志
```

---

## 🔍 总结

遇到问题时的调试流程：

1. **识别问题**：明确症状和错误信息
2. **查看日志**：检查控制台和构建日志
3. **搜索文档**：查阅官方文档和本指南
4. **简化问题**：创建最小复现案例
5. **寻求帮助**：在社区提问时提供详细信息

记住：大多数问题都有解决方案，保持耐心，善用搜索引擎和社区资源！
