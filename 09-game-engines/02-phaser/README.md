# Phaser Todo List - Gamified Task Management

一個使用 **Phaser 3** HTML5 遊戲引擎構建的遊戲化 Todo List 應用，展示如何將遊戲引擎技術應用於實用型應用開發。

## 目錄

- [專案簡介](#專案簡介)
- [什麼是 Phaser？](#什麼是-phaser)
- [為什麼用遊戲引擎做 Todo List？](#為什麼用遊戲引擎做-todo-list)
- [核心概念](#核心概念)
- [技術架構](#技術架構)
- [功能特性](#功能特性)
- [與傳統 UI 框架的對比](#與傳統-ui-框架的對比)
- [安裝和運行](#安裝和運行)
- [專案結構](#專案結構)
- [詳細實現解析](#詳細實現解析)
- [遊戲化元素](#遊戲化元素)
- [性能優化](#性能優化)
- [部署指南](#部署指南)
- [進階主題](#進階主題)
- [常見問題](#常見問題)
- [學習資源](#學習資源)

## 專案簡介

這是一個創新的 Todo List 應用，使用 Phaser 3 遊戲引擎而非傳統的 UI 框架。專案展示了：

- 🎮 如何使用遊戲引擎構建實用應用
- ✨ 豐富的動畫和視覺效果
- 🎯 遊戲化的任務管理體驗
- 🚀 WebGL/Canvas 渲染的高性能
- 📊 遊戲化統計和成就系統

## 什麼是 Phaser？

### 基本介紹

**Phaser** 是一個快速、免費、開源的 HTML5 遊戲框架，專為桌面和移動瀏覽器設計。它由 Photon Storm 開發並維護，是目前最流行的 HTML5 遊戲引擎之一。

### 主要特點

#### 1. 渲染引擎
```typescript
// Phaser 自動選擇最佳渲染器
type: Phaser.AUTO  // WebGL 優先，降級到 Canvas
```

- **WebGL 渲染器**: 利用 GPU 加速，適合複雜場景
- **Canvas 渲染器**: 兼容性更好，適合簡單場景
- **自動選擇**: 根據設備能力自動選擇最佳渲染器

#### 2. 場景系統（Scene System）
```typescript
class TodoScene extends Phaser.Scene {
  preload() {
    // 預加載資源
  }

  create() {
    // 創建遊戲對象
  }

  update(time, delta) {
    // 每幀更新邏輯
  }
}
```

Phaser 的場景系統提供：
- **生命週期管理**: preload → create → update → shutdown
- **場景切換**: 支持多場景同時運行
- **狀態管理**: 場景可以暫停、恢復、重啟

#### 3. 遊戲對象（Game Objects）

Phaser 提供豐富的遊戲對象類型：

```typescript
// 文本對象
const text = this.add.text(x, y, 'Hello', {
  fontSize: '32px',
  color: '#ffffff'
});

// 圖形對象
const graphics = this.add.graphics();
graphics.fillStyle(0xff0000, 1);
graphics.fillRect(0, 0, 100, 100);

// 精靈對象
const sprite = this.add.sprite(x, y, 'texture');

// 容器對象（組合多個對象）
const container = this.add.container(x, y);
container.add([text, graphics, sprite]);
```

#### 4. 動畫系統（Tweens）

```typescript
// 流暢的補間動畫
this.tweens.add({
  targets: object,
  x: 400,
  alpha: 0.5,
  duration: 1000,
  ease: 'Power2',
  yoyo: true,
  repeat: -1
});
```

#### 5. 物理引擎

```typescript
// Arcade Physics - 簡單快速
physics: {
  default: 'arcade',
  arcade: {
    gravity: { y: 300 },
    debug: false
  }
}

// Matter.js - 更真實的物理模擬
physics: {
  default: 'matter',
  matter: {
    debug: true
  }
}
```

#### 6. 輸入處理

```typescript
// 滑鼠/觸控輸入
this.input.on('pointerdown', (pointer) => {
  console.log(pointer.x, pointer.y);
});

// 鍵盤輸入
this.input.keyboard.on('keydown-SPACE', () => {
  console.log('Space pressed!');
});

// 拖放
this.input.setDraggable(gameObject);
```

### Phaser 的優勢

| 特性 | 說明 |
|------|------|
| **免費開源** | MIT 授權，完全免費使用 |
| **跨平台** | 支援所有現代瀏覽器和移動設備 |
| **高性能** | WebGL 渲染，60fps 流暢體驗 |
| **豐富生態** | 大量插件、工具和學習資源 |
| **TypeScript** | 完整的 TypeScript 支援 |
| **活躍社群** | 超過 30,000+ GitHub stars |

### Phaser 的應用場景

雖然 Phaser 主要用於遊戲開發，但它也適合：

1. **互動式可視化**: 數據視覺化、圖表展示
2. **教育應用**: 互動式學習工具
3. **創意 UI**: 需要豐富動畫的應用界面
4. **廣告和營銷**: 互動式廣告內容
5. **藝術裝置**: 數位藝術展示

## 為什麼用遊戲引擎做 Todo List？

### 教育價值

這個專案不是為了「實用」，而是為了「教學」和「探索」：

#### 1. 技術學習目標

```typescript
// 學習點 1: Scene 生命週期
class TodoScene extends Phaser.Scene {
  preload() {
    // 理解資源管理
    this.createParticleTexture();
  }

  create() {
    // 理解對象創建和初始化
    this.createBackground();
    this.createHeader();
    this.loadTodos();
  }

  update(time, delta) {
    // 理解遊戲循環
    // 每秒執行 60 次
  }
}
```

#### 2. 不同的思維方式

傳統 UI 框架思維：
```typescript
// React 思維 - 聲明式
function TodoList({ todos }) {
  return (
    <div>
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}
```

遊戲引擎思維：
```typescript
// Phaser 思維 - 對象導向 + 事件驅動
class TodoItem extends Phaser.GameObjects.Container {
  constructor(config) {
    super(config.scene, config.x, config.y);

    // 創建視覺元素
    this.createBackground();
    this.createText();

    // 設置交互
    this.setInteractive();
    this.on('pointerdown', this.handleClick);
  }

  update() {
    // 每幀更新
  }
}
```

#### 3. 動畫和視覺效果

遊戲引擎讓複雜動畫變得簡單：

```typescript
// 完成任務的慶祝動畫
playCompletionCelebration(x, y) {
  // 粒子爆炸效果
  this.particles.setPosition(x, y);
  this.particles.explode(30);

  // 浮動文字
  const floatingText = this.add.text(x, y, '+10 pts', {
    fontSize: '24px',
    color: '#2ecc71'
  });

  // 補間動畫
  this.tweens.add({
    targets: floatingText,
    y: y - 50,
    alpha: 0,
    duration: 1000,
    ease: 'Power2'
  });
}
```

在傳統 UI 框架中實現相同效果需要：
- CSS 動畫
- JavaScript 計時器
- Canvas API
- 更多的樣板代碼

### 創意價值

#### 1. 遊戲化體驗

```typescript
// 遊戲化統計
interface GameStats {
  totalCreated: number;      // 總任務數
  totalCompleted: number;    // 完成數
  streak: number;            // 連續完成天數
  longestStreak: number;     // 最長連續天數
  points: number;            // 積分
  level: number;             // 等級
}

// 完成任務獲得獎勵
updateStatsOnComplete(stats) {
  const basePoints = 10;
  const streakBonus = Math.floor(stats.streak / 5) * 5;
  stats.points += basePoints + streakBonus;
  stats.level = Math.floor(stats.points / 100) + 1;
}
```

#### 2. 更豐富的交互

```typescript
// 拖放排序（內建支援）
this.scene.input.setDraggable(this);

this.on('drag', (pointer, dragX, dragY) => {
  this.y = dragY;
  this.setAlpha(0.7);  // 拖動時半透明
});

this.on('dragend', () => {
  this.setAlpha(1);
  this.emit('dragend', this);
});
```

#### 3. 性能優勢

WebGL 渲染的優勢：
```typescript
// 可以輕鬆處理數百個動畫對象
for (let i = 0; i < 1000; i++) {
  const particle = this.add.sprite(
    Phaser.Math.Between(0, 800),
    Phaser.Math.Between(0, 600),
    'particle'
  );

  // 每個粒子都有獨立動畫
  this.tweens.add({
    targets: particle,
    alpha: 0,
    y: particle.y - 100,
    duration: 1000
  });
}
```

### 實用價值

雖然這是教學專案，但確實提供一些實用價值：

#### 1. 更好的視覺反饋

- ✅ 即時動畫反饋
- ✅ 粒子效果慶祝
- ✅ 流暢的過渡動畫
- ✅ 直觀的拖放交互

#### 2. 跨平台一致性

- ✅ 相同的代碼在所有平台運行
- ✅ WebGL 保證視覺一致性
- ✅ 不需要特定平台的調整

#### 3. 離線優先

- ✅ 整個應用可以打包為單個 HTML
- ✅ 無需網路即可運行
- ✅ 數據存儲在 localStorage

## 核心概念

### 1. Scene（場景）

Scene 是 Phaser 應用的基本單位，類似於：
- React 中的 Component
- Vue 中的 Component
- 但包含完整的生命週期和渲染邏輯

```typescript
class TodoScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TodoScene' });
  }

  // 生命週期方法
  preload() {
    // 在場景啟動前加載資源
    // 類似 React 的 componentWillMount
  }

  create() {
    // 場景創建時執行一次
    // 類似 React 的 componentDidMount
    this.createBackground();
    this.createUI();
  }

  update(time, delta) {
    // 每幀執行（60fps = 每秒60次）
    // 沒有直接對應的 React 生命週期
    // 類似遊戲的主循環
  }

  shutdown() {
    // 場景關閉時清理
    // 類似 React 的 componentWillUnmount
  }
}
```

### 2. Game Objects（遊戲對象）

Game Objects 是場景中的可見元素：

```typescript
// 內建對象
class TodoScene extends Phaser.Scene {
  create() {
    // 文本對象
    const text = this.add.text(100, 100, 'Hello', {
      fontSize: '32px'
    });

    // 圖形對象（繪製形狀）
    const graphics = this.add.graphics();
    graphics.fillStyle(0xff0000);
    graphics.fillRect(0, 0, 100, 100);

    // 圖片精靈
    const sprite = this.add.sprite(200, 200, 'logo');

    // 容器（組合多個對象）
    const container = this.add.container(0, 0);
    container.add([text, graphics, sprite]);
  }
}

// 自定義對象
class TodoItem extends Phaser.GameObjects.Container {
  constructor(config) {
    super(config.scene, config.x, config.y);

    // 添加子對象
    this.background = this.scene.add.graphics();
    this.text = this.scene.add.text(0, 0, config.text);

    this.add([this.background, this.text]);

    // 添加到場景
    config.scene.add.existing(this);
  }
}
```

### 3. Container（容器）

Container 允許組合多個對象：

```typescript
class TodoItem extends Phaser.GameObjects.Container {
  constructor(config) {
    super(config.scene, config.x, config.y);

    // 容器內的所有對象共享座標系統
    // (0, 0) 是容器的中心

    // 背景卡片
    this.background = this.scene.add.graphics();
    this.background.fillStyle(0xffffff);
    this.background.fillRect(0, 0, 700, 60);

    // 複選框（相對容器位置）
    this.checkbox = this.scene.add.graphics();
    this.checkbox.fillRect(10, 20, 20, 20);

    // 文本（相對容器位置）
    this.textObject = this.scene.add.text(40, 30, 'Task');

    // 添加到容器
    this.add([this.background, this.checkbox, this.textObject]);

    // 移動容器會移動所有子對象
    this.x = 100;  // 整個容器移動
  }
}
```

優勢：
- ✅ 統一管理多個對象
- ✅ 簡化座標計算
- ✅ 批量應用變換（旋轉、縮放）
- ✅ 事件冒泡

### 4. Tweens（補間動畫）

Tweens 是 Phaser 的動畫系統：

```typescript
// 基本動畫
this.tweens.add({
  targets: object,       // 動畫目標
  x: 400,               // 目標 x 座標
  y: 300,               // 目標 y 座標
  alpha: 0.5,           // 目標透明度
  duration: 1000,       // 持續時間（毫秒）
  ease: 'Power2',       // 緩動函數
});

// 複雜動畫
this.tweens.add({
  targets: object,
  scaleX: 1.5,
  scaleY: 1.5,
  duration: 500,
  yoyo: true,           // 反向播放
  repeat: 2,            // 重複次數
  delay: 1000,          // 延遲開始
  onComplete: () => {   // 完成回調
    console.log('Animation complete!');
  }
});

// 時間線動畫（序列）
const timeline = this.tweens.createTimeline();

timeline.add({
  targets: object,
  x: 200,
  duration: 1000
});

timeline.add({
  targets: object,
  y: 300,
  duration: 1000
});

timeline.play();
```

常用緩動函數：
- `Linear`: 線性
- `Power2`: 二次方
- `Sine`: 正弦
- `Bounce`: 彈跳
- `Elastic`: 彈性
- `Back`: 回彈

### 5. Input System（輸入系統）

```typescript
class TodoScene extends Phaser.Scene {
  create() {
    // 全局輸入事件
    this.input.on('pointerdown', (pointer) => {
      console.log(`Clicked at: ${pointer.x}, ${pointer.y}`);
    });

    // 對象交互
    const button = this.add.text(100, 100, 'Click me');
    button.setInteractive({ useHandCursor: true });

    button.on('pointerover', () => {
      button.setStyle({ color: '#ff0000' });
    });

    button.on('pointerout', () => {
      button.setStyle({ color: '#ffffff' });
    });

    button.on('pointerdown', () => {
      console.log('Button clicked!');
    });

    // 拖放
    this.input.setDraggable(button);

    button.on('drag', (pointer, dragX, dragY) => {
      button.x = dragX;
      button.y = dragY;
    });

    // 鍵盤輸入
    this.input.keyboard.on('keydown-SPACE', () => {
      console.log('Space pressed!');
    });

    // 滾輪事件
    this.input.on('wheel', (pointer, objects, deltaX, deltaY) => {
      console.log(`Scrolled: ${deltaY}`);
    });
  }
}
```

### 6. Particles（粒子系統）

```typescript
// 創建粒子紋理
const graphics = this.add.graphics();
graphics.fillStyle(0xffffff);
graphics.fillCircle(4, 4, 4);
graphics.generateTexture('particle', 8, 8);
graphics.destroy();

// 創建粒子發射器
const particles = this.add.particles(0, 0, 'particle', {
  speed: { min: 100, max: 300 },
  angle: { min: 0, max: 360 },
  scale: { start: 1, end: 0 },
  alpha: { start: 1, end: 0 },
  lifespan: 1000,
  gravityY: 200,
  quantity: 20,
  emitting: false
});

// 觸發爆炸效果
particles.setPosition(400, 300);
particles.explode(30);
```

## 技術架構

### 技術棧

```
┌─────────────────────────────────────┐
│         Application Layer           │
│   TodoScene, TodoItem, TodoInputUI  │
├─────────────────────────────────────┤
│         Phaser 3 Framework          │
│  Scene System, Game Objects, Tweens │
├─────────────────────────────────────┤
│         Rendering Layer             │
│      WebGL Renderer (GPU)           │
│      Canvas Renderer (Fallback)     │
├─────────────────────────────────────┤
│         Browser APIs                │
│   Canvas API, WebGL, LocalStorage   │
└─────────────────────────────────────┘
```

### 依賴關係

```typescript
// 依賴層次
main.ts
  └─> TodoScene
      ├─> TodoItem (Game Object)
      ├─> TodoInputUI (DOM Element)
      ├─> DataManager (Utility)
      └─> Particle System

// 數據流
User Input → TodoInputUI → TodoScene → DataManager → LocalStorage
                              ↓
                          TodoItem (Visual Representation)
```

### 配置文件

#### package.json
```json
{
  "dependencies": {
    "phaser": "^3.70.0"  // Phaser 框架
  },
  "devDependencies": {
    "typescript": "^5.3.3",  // TypeScript 編譯器
    "vite": "^5.0.8"         // 構建工具
  }
}
```

#### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "types": ["node"]
  }
}
```

#### vite.config.ts
```typescript
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser'],  // 分離 Phaser 到獨立 chunk
        },
      },
    },
  },
});
```

## 功能特性

### 1. 基本功能

#### 添加任務
```typescript
// 通過 DOM 輸入框添加
const inputUI = new TodoInputUI(this);
inputUI.onSubmit((text, priority) => {
  const todo = DataManager.createTodo(text, priority);
  this.todos.unshift(todo);
  this.renderTodos();
});
```

#### 完成任務
```typescript
// 點擊複選框切換狀態
toggleComplete() {
  this.todo.completed = !this.todo.completed;

  if (this.todo.completed) {
    this.playCompleteAnimation();
    this.emit('complete', this.x, this.y);
  }

  this.updateAppearance();
}
```

#### 刪除任務
```typescript
// 滑動刪除動畫
handleDelete() {
  this.scene.tweens.add({
    targets: this,
    x: this.x + 1000,
    alpha: 0,
    duration: 300,
    onComplete: () => {
      this.emit('delete', this.todo);
      this.destroy();
    }
  });
}
```

### 2. 進階功能

#### 優先級系統
```typescript
enum Priority {
  LOW = 'low',      // 綠色
  MEDIUM = 'medium', // 黃色
  HIGH = 'high'      // 紅色
}

// 優先級指示器
createPriorityIndicator() {
  const color = PRIORITY_COLORS[this.todo.priority];
  this.priorityIndicator.fillStyle(color, 0.8);
  this.priorityIndicator.fillRoundedRect(0, 0, 6, 60, 8);
}
```

#### 拖放排序
```typescript
// 啟用拖放
this.scene.input.setDraggable(this);

// 處理拖動
this.on('drag', (pointer, dragX, dragY) => {
  this.y = dragY;
  this.setAlpha(0.7);
});

// 處理放下（重新排序）
this.on('dragend', () => {
  const newIndex = this.calculateIndexFromPosition();
  this.scene.reorderTodo(this, newIndex);
});
```

#### 過濾系統
```typescript
setFilter(filter: 'all' | 'active' | 'completed') {
  this.currentFilter = filter;

  let filteredTodos = this.todos;
  if (filter === 'active') {
    filteredTodos = this.todos.filter(t => !t.completed);
  } else if (filter === 'completed') {
    filteredTodos = this.todos.filter(t => t.completed);
  }

  this.renderTodos(filteredTodos);
}
```

#### 滾動支持
```typescript
// 滑鼠滾輪滾動
this.input.on('wheel', (pointer, objects, deltaX, deltaY) => {
  this.scrollOffset += deltaY * 0.5;
  this.scrollOffset = Math.max(0, this.scrollOffset);
  this.renderTodos();
});
```

### 3. 遊戲化功能

#### 統計系統
```typescript
interface GameStats {
  totalCreated: number;    // 總創建數
  totalCompleted: number;  // 總完成數
  streak: number;          // 當前連續天數
  longestStreak: number;   // 最長連續天數
  points: number;          // 積分
  level: number;           // 等級
}
```

#### 經驗系統
```typescript
updateStatsOnComplete(stats: GameStats) {
  // 基礎獎勵
  const basePoints = 10;

  // 連續獎勵（每 5 天連續 +5 分）
  const streakBonus = Math.floor(stats.streak / 5) * 5;

  stats.points += basePoints + streakBonus;

  // 升級系統（每 100 分升一級）
  stats.level = Math.floor(stats.points / 100) + 1;

  return stats;
}
```

#### 連續天數追蹤
```typescript
updateStatsOnComplete(stats: GameStats) {
  const today = new Date().toDateString();
  const lastDate = stats.lastCompletedDate;

  // 檢查是否連續
  if (this.isConsecutiveDay(lastDate, today)) {
    stats.streak++;
  } else {
    stats.streak = 1;  // 重置連續天數
  }

  // 更新最長連續記錄
  if (stats.streak > stats.longestStreak) {
    stats.longestStreak = stats.streak;
  }

  stats.lastCompletedDate = today;
}
```

### 4. 動畫效果

#### 完成動畫
```typescript
playCompleteAnimation() {
  // 縮放脈衝
  this.scene.tweens.add({
    targets: this,
    scaleX: 1.1,
    scaleY: 1.1,
    duration: 150,
    yoyo: true,
    ease: 'Power2'
  });

  // 觸發粒子效果
  this.emit('complete', this.x, this.y);
}
```

#### 粒子慶祝
```typescript
playCompletionCelebration(x, y) {
  // 粒子爆炸
  this.particles.setPosition(x, y);
  this.particles.explode(30);

  // 浮動積分文字
  const floatingText = this.add.text(x, y, '+10 pts', {
    fontSize: '24px',
    color: '#2ecc71'
  });

  this.tweens.add({
    targets: floatingText,
    y: y - 50,
    alpha: 0,
    duration: 1000,
    onComplete: () => floatingText.destroy()
  });
}
```

#### 添加動畫
```typescript
playAddAnimation() {
  const firstItem = this.todoItems[0];
  firstItem.setAlpha(0);
  firstItem.setScale(0.8);

  this.tweens.add({
    targets: firstItem,
    alpha: 1,
    scale: 1,
    duration: 300,
    ease: 'Back.easeOut'  // 彈出效果
  });
}
```

#### 懸停效果
```typescript
showHoverState() {
  // 輕微放大
  this.scene.tweens.add({
    targets: this,
    scaleX: 1.02,
    scaleY: 1.05,
    duration: 200,
    ease: 'Power2'
  });

  // 顯示刪除按鈕
  this.scene.tweens.add({
    targets: this.deleteButton,
    alpha: 1,
    duration: 200
  });
}
```

### 5. 鍵盤快捷鍵

```typescript
setupKeyboardShortcuts() {
  // N - 新增任務（聚焦輸入框）
  this.input.keyboard.on('keydown-N', () => {
    this.inputUI.focus();
  });

  // C - 清除已完成
  this.input.keyboard.on('keydown-C', () => {
    this.clearCompleted();
  });

  // 1 - 顯示全部
  this.input.keyboard.on('keydown-ONE', () => {
    this.setFilter('all');
  });

  // 2 - 顯示進行中
  this.input.keyboard.on('keydown-TWO', () => {
    this.setFilter('active');
  });

  // 3 - 顯示已完成
  this.input.keyboard.on('keydown-THREE', () => {
    this.setFilter('completed');
  });
}
```

## 與傳統 UI 框架的對比

### 架構對比

#### React 方式
```tsx
// 聲明式組件
function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);

  return (
    <div className="todo-list">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}

function TodoItem({ todo, onToggle }: Props) {
  return (
    <div className="todo-item">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={onToggle}
      />
      <span>{todo.text}</span>
    </div>
  );
}
```

#### Phaser 方式
```typescript
// 對象導向 + 遊戲循環
class TodoScene extends Phaser.Scene {
  create() {
    this.todos.forEach((todo, index) => {
      const todoItem = new TodoItem({
        scene: this,
        x: 100,
        y: 100 + index * 70,
        todo
      });

      todoItem.on('toggle', this.handleToggle);
      todoItem.on('delete', this.handleDelete);
    });
  }

  update(time, delta) {
    // 每幀執行
  }
}

class TodoItem extends Phaser.GameObjects.Container {
  constructor(config) {
    super(config.scene, config.x, config.y);
    this.createVisuals();
    this.setupInteractivity();
  }
}
```

### 優勢對比

| 特性 | React/Vue | Phaser |
|------|-----------|--------|
| **學習曲線** | 低 | 中 |
| **開發速度** | 快 | 中 |
| **動畫能力** | 需要額外庫 | 內建強大動畫系統 |
| **性能** | DOM 操作 | WebGL/Canvas (更快) |
| **靈活性** | 結構化 | 高度自由 |
| **生態系統** | 豐富 | 專注於遊戲 |
| **適用場景** | 標準應用 | 創意/遊戲化應用 |

### 動畫實現對比

#### CSS/JavaScript 方式
```tsx
// React + CSS 動畫
function TodoItem({ todo }) {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = () => {
    setIsCompleting(true);
    setTimeout(() => {
      onComplete(todo);
      setIsCompleting(false);
    }, 300);
  };

  return (
    <div className={`todo-item ${isCompleting ? 'completing' : ''}`}>
      {/* ... */}
    </div>
  );
}
```

```css
.todo-item.completing {
  animation: complete 300ms ease-in-out;
}

@keyframes complete {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
```

#### Phaser 方式
```typescript
// Phaser Tweens
handleComplete() {
  this.scene.tweens.add({
    targets: this,
    scaleX: 1.1,
    scaleY: 1.1,
    duration: 150,
    yoyo: true,
    ease: 'Power2',
    onComplete: () => {
      this.emit('complete');
    }
  });
}
```

### 狀態管理對比

#### React 方式
```tsx
// 使用 hooks 或狀態管理庫
const TodoContext = createContext();

function TodoProvider({ children }) {
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState({});

  return (
    <TodoContext.Provider value={{ todos, stats, setTodos, setStats }}>
      {children}
    </TodoContext.Provider>
  );
}
```

#### Phaser 方式
```typescript
// 場景內狀態
class TodoScene extends Phaser.Scene {
  private todos: Todo[] = [];
  private stats: GameStats;

  // 直接管理狀態
  addTodo(todo: Todo) {
    this.todos.unshift(todo);
    this.stats = DataManager.updateStats(this.stats);
    this.renderTodos();
  }

  // 或使用 Phaser Data Manager
  create() {
    this.data.set('todos', []);
    this.data.events.on('changedata-todos', () => {
      this.renderTodos();
    });
  }
}
```

### 性能對比

#### DOM 操作（React）
```
渲染 1000 個任務:
- 創建 1000 個 DOM 節點
- 每次更新需要 diff 算法
- 重繪和重排
- 約 16ms（60fps）可能不夠
```

#### Canvas/WebGL（Phaser）
```
渲染 1000 個任務:
- 使用 GPU 渲染
- 批次處理
- 無 DOM 操作
- 輕鬆維持 60fps
```

### 適用場景

**選擇 React/Vue 當:**
- ✅ 構建標準的 CRUD 應用
- ✅ 需要 SEO
- ✅ 需要可訪問性（Accessibility）
- ✅ 團隊熟悉該框架
- ✅ 豐富的第三方組件

**選擇 Phaser 當:**
- ✅ 需要複雜動畫和視覺效果
- ✅ 構建遊戲或遊戲化應用
- ✅ 需要粒子系統、物理引擎
- ✅ 性能是關鍵（大量對象）
- ✅ 創意和互動性優先

## 安裝和運行

### 前置要求

```bash
node >= 18.0.0
npm >= 9.0.0
```

### 快速開始

```bash
# 1. 克隆或下載專案
cd 09-game-engines/02-phaser

# 2. 安裝依賴
npm install

# 3. 啟動開發服務器
npm run dev

# 4. 瀏覽器自動打開 http://localhost:3000
```

### 構建生產版本

```bash
# 構建
npm run build

# 構建產物在 dist/ 目錄

# 預覽構建結果
npm run preview
```

### 開發命令

```bash
# 開發模式（熱重載）
npm run dev

# 類型檢查
npx tsc --noEmit

# 代碼格式化
npm run format

# 代碼檢查
npm run lint
```

### Docker 部署

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# 構建和運行
docker build -t phaser-todo .
docker run -p 8080:80 phaser-todo
```

## 專案結構

```
02-phaser/
├── index.html                 # HTML 入口
├── package.json              # 依賴配置
├── tsconfig.json             # TypeScript 配置
├── vite.config.ts            # Vite 構建配置
├── README.md                 # 本文檔
│
├── src/
│   ├── main.ts               # 應用入口
│   ├── types.ts              # TypeScript 類型定義
│   │
│   ├── scenes/               # 場景目錄
│   │   └── TodoScene.ts      # 主場景（核心邏輯）
│   │
│   ├── objects/              # 遊戲對象目錄
│   │   └── TodoItem.ts       # Todo 項目對象
│   │
│   ├── ui/                   # UI 組件目錄
│   │   └── TodoInputUI.ts    # 輸入框 UI
│   │
│   └── utils/                # 工具目錄
│       └── DataManager.ts    # 數據管理器
│
└── dist/                     # 構建輸出（自動生成）
    ├── index.html
    ├── assets/
    │   ├── index-[hash].js
    │   └── phaser-[hash].js
    └── ...
```

### 核心文件說明

#### main.ts
```typescript
// 應用入口，配置 Phaser 遊戲實例
import { TodoScene } from './scenes/TodoScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [TodoScene],
  // ...其他配置
};

const game = new Phaser.Game(config);
```

#### types.ts
```typescript
// 全局類型定義
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}
```

#### scenes/TodoScene.ts
```typescript
// 主場景，管理所有 Todo 對象
export class TodoScene extends Phaser.Scene {
  preload() { /* 加載資源 */ }
  create() { /* 創建場景 */ }
  update() { /* 每幀更新 */ }
}
```

#### objects/TodoItem.ts
```typescript
// Todo 項目的視覺表示
export class TodoItem extends Phaser.GameObjects.Container {
  // 組合多個遊戲對象
  // 處理交互邏輯
  // 發出事件
}
```

#### ui/TodoInputUI.ts
```typescript
// DOM 輸入框（Phaser 沒有原生文本輸入）
export class TodoInputUI {
  // 創建 HTML 輸入元素
  // 處理表單提交
}
```

#### utils/DataManager.ts
```typescript
// 數據持久化和統計
export class DataManager {
  static loadTodos(): Todo[]
  static saveTodos(todos: Todo[]): void
  static updateStats(stats: GameStats): GameStats
}
```

## 詳細實現解析

### 1. 場景初始化流程

```typescript
class TodoScene extends Phaser.Scene {
  // 1. 構造函數
  constructor() {
    super({ key: 'TodoScene' });
    // 只在場景註冊時執行一次
  }

  // 2. 預加載階段
  preload() {
    // 創建粒子紋理
    this.createParticleTexture();
  }

  // 3. 創建階段（核心）
  create() {
    this.createBackground();       // 背景
    this.createHeader();           // 頭部
    this.createStatsDisplay();     // 統計顯示
    this.createFilterButtons();    // 過濾按鈕
    this.createParticleSystem();   // 粒子系統
    this.createInputUI();          // 輸入UI
    this.loadTodos();              // 加載數據
    this.setupKeyboardShortcuts(); // 快捷鍵
    this.setupScrolling();         // 滾動
  }

  // 4. 更新循環
  update(time, delta) {
    // 每幀執行（60fps）
    // 本專案中未使用，因為沒有持續動畫
  }

  // 5. 關閉階段
  shutdown() {
    // 清理資源
    this.inputUI.destroy();
  }
}
```

### 2. TodoItem 對象創建

```typescript
class TodoItem extends Phaser.GameObjects.Container {
  constructor(config: TodoItemConfig) {
    // 1. 調用父類構造函數
    super(config.scene, config.x, config.y);

    // 2. 保存配置
    this.todo = config.todo;
    this.itemWidth = config.width;

    // 3. 創建視覺元素（順序很重要）
    this.createBackground();        // 底層：背景卡片
    this.createPriorityIndicator(); // 優先級條
    this.createCheckbox();          // 複選框
    this.createText();              // 文本
    this.createDeleteButton();      // 刪除按鈕

    // 4. 設置交互
    this.setupInteractivity();

    // 5. 添加到場景
    config.scene.add.existing(this);

    // 6. 設置碰撞區域
    this.setSize(this.itemWidth, CONFIG.CARD_HEIGHT);
    this.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, this.itemWidth, CONFIG.CARD_HEIGHT),
      Phaser.Geom.Rectangle.Contains
    );
  }
}
```

### 3. 事件系統

```typescript
// 發送事件（TodoItem）
class TodoItem extends Phaser.GameObjects.Container {
  toggleComplete() {
    this.todo.completed = !this.todo.completed;

    // 發出事件
    this.emit('toggle', this.todo);

    if (this.todo.completed) {
      this.emit('complete', this.x, this.y);
    }
  }
}

// 接收事件（TodoScene）
class TodoScene extends Phaser.Scene {
  renderTodos() {
    filteredTodos.forEach(todo => {
      const todoItem = new TodoItem({ /* ... */ });

      // 監聽事件
      todoItem.on('toggle', (updatedTodo: Todo) => {
        this.handleToggle(updatedTodo);
      });

      todoItem.on('complete', (x: number, y: number) => {
        this.playCompletionCelebration(x, y);
      });
    });
  }
}
```

### 4. 動畫時間線

```typescript
// 複雜的序列動畫
playComplexAnimation() {
  const timeline = this.scene.tweens.createTimeline();

  // 步驟 1: 縮放
  timeline.add({
    targets: this,
    scaleX: 1.2,
    scaleY: 1.2,
    duration: 200,
    ease: 'Power2'
  });

  // 步驟 2: 旋轉
  timeline.add({
    targets: this,
    angle: 360,
    duration: 500,
    ease: 'Sine.easeInOut'
  });

  // 步驟 3: 淡出
  timeline.add({
    targets: this,
    alpha: 0,
    duration: 300,
    ease: 'Power2',
    onComplete: () => {
      this.destroy();
    }
  });

  // 開始播放
  timeline.play();
}
```

### 5. 粒子效果詳解

```typescript
// 創建粒子紋理
createParticleTexture() {
  const graphics = this.add.graphics();

  // 繪製圓形
  graphics.fillStyle(0xffffff, 1);
  graphics.fillCircle(4, 4, 4);

  // 生成紋理
  graphics.generateTexture('particle', 8, 8);

  // 銷毀圖形對象（紋理已保存）
  graphics.destroy();
}

// 創建粒子發射器
createParticleSystem() {
  this.particles = this.add.particles(0, 0, 'particle', {
    // 速度範圍
    speed: { min: 100, max: 300 },

    // 發射角度（360度）
    angle: { min: 0, max: 360 },

    // 大小變化（從 1 縮小到 0）
    scale: { start: 1, end: 0 },

    // 透明度變化（從 1 淡出到 0）
    alpha: { start: 1, end: 0 },

    // 粒子壽命（毫秒）
    lifespan: 1000,

    // 重力
    gravityY: 200,

    // 每次發射的數量
    quantity: 20,

    // 不自動發射
    emitting: false
  });
}

// 觸發粒子效果
playCompletionCelebration(x, y) {
  this.particles.setPosition(x, y);
  this.particles.explode(30);  // 一次性發射30個粒子
}
```

### 6. 拖放實現

```typescript
setupInteractivity() {
  // 1. 啟用拖放
  this.scene.input.setDraggable(this);

  // 2. 拖動開始
  this.on('dragstart', () => {
    console.log('Drag started');
  });

  // 3. 拖動中（每幀調用）
  this.on('drag', (pointer, dragX, dragY) => {
    // 只允許垂直拖動
    this.y = dragY;

    // 拖動時半透明
    this.setAlpha(0.7);
  });

  // 4. 拖動結束
  this.on('dragend', () => {
    // 恢復透明度
    this.setAlpha(1);

    // 計算新位置並重新排序
    this.emit('dragend', this);
  });
}

// 場景中處理重新排序
handleDragEnd(draggedItem: TodoItem) {
  // 計算新索引
  const startY = CONFIG.HEADER_HEIGHT + CONFIG.INPUT_HEIGHT + 20;
  const itemHeight = CONFIG.CARD_HEIGHT + CONFIG.CARD_SPACING;
  const newIndex = Math.round(
    (draggedItem.y - startY + this.scrollOffset) / itemHeight
  );

  // 限制範圍
  const clampedIndex = Phaser.Math.Clamp(
    newIndex,
    0,
    this.todos.length - 1
  );

  // 重新排序數組
  const draggedTodo = draggedItem.getTodo();
  const oldIndex = this.todos.findIndex(t => t.id === draggedTodo.id);

  if (clampedIndex !== oldIndex) {
    const [removed] = this.todos.splice(oldIndex, 1);
    this.todos.splice(clampedIndex, 0, removed);
    DataManager.saveTodos(this.todos);
  }

  // 重新渲染（帶動畫對齊）
  this.renderTodos();
}
```

### 7. 數據持久化

```typescript
// DataManager 實現
class DataManager {
  private static readonly STORAGE_KEY = 'phaser-todos';

  // 加載
  static loadTodos(): Todo[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading todos:', error);
      return [];
    }
  }

  // 保存
  static saveTodos(todos: Todo[]): void {
    try {
      localStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(todos)
      );
    } catch (error) {
      console.error('Error saving todos:', error);
    }
  }

  // 創建
  static createTodo(text: string, priority: Priority): Todo {
    return {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      completed: false,
      createdAt: Date.now(),
      priority,
      tags: []
    };
  }
}
```

### 8. 響應式設計

```typescript
// Phaser 配置
const config = {
  scale: {
    mode: Phaser.Scale.FIT,          // 適應容器
    autoCenter: Phaser.Scale.CENTER_BOTH,  // 居中
  },
};

// 監聽窗口大小變化
window.addEventListener('resize', () => {
  game.scale.refresh();

  // 更新 DOM 元素位置
  this.inputUI.updatePosition();
});

// TodoInputUI 位置更新
updatePosition() {
  const canvas = this.scene.game.canvas;
  const rect = canvas.getBoundingClientRect();

  this.container.style.left = `${rect.left + CONFIG.GAME_WIDTH / 2}px`;
  this.container.style.top = `${rect.top + CONFIG.HEADER_HEIGHT}px`;
}
```

## 遊戲化元素

### 1. 等級系統

```typescript
// 基於積分的等級計算
calculateLevel(points: number): number {
  return Math.floor(points / 100) + 1;
}

// 等級 1: 0-99 分
// 等級 2: 100-199 分
// 等級 3: 200-299 分
// ...
```

### 2. 積分系統

```typescript
calculatePoints(stats: GameStats): number {
  // 基礎分數
  const basePoints = 10;

  // 連續獎勵（每 5 天 +5 分）
  const streakBonus = Math.floor(stats.streak / 5) * 5;

  // 優先級獎勵
  const priorityBonus = this.getPriorityBonus();

  return basePoints + streakBonus + priorityBonus;
}

getPriorityBonus(): number {
  switch (this.todo.priority) {
    case Priority.HIGH:
      return 5;  // 高優先級 +5 分
    case Priority.MEDIUM:
      return 2;  // 中優先級 +2 分
    case Priority.LOW:
      return 0;  // 低優先級 +0 分
  }
}
```

### 3. 連續天數系統

```typescript
updateStreak(stats: GameStats): GameStats {
  const today = new Date().toDateString();
  const lastDate = stats.lastCompletedDate;

  if (!lastDate) {
    // 第一次完成
    stats.streak = 1;
  } else {
    const last = new Date(lastDate);
    const current = new Date(today);
    const diffDays = this.getDaysDifference(last, current);

    if (diffDays === 0) {
      // 同一天，不改變連續
    } else if (diffDays === 1) {
      // 連續天數
      stats.streak++;
    } else {
      // 中斷，重置
      stats.streak = 1;
    }
  }

  // 更新最長連續記錄
  if (stats.streak > stats.longestStreak) {
    stats.longestStreak = stats.streak;
  }

  stats.lastCompletedDate = today;
  return stats;
}
```

### 4. 成就系統（可擴展）

```typescript
// 成就定義
interface Achievement {
  id: string;
  name: string;
  description: string;
  condition: (stats: GameStats) => boolean;
  reward: number;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_todo',
    name: '初次嘗試',
    description: '創建第一個任務',
    condition: (stats) => stats.totalCreated >= 1,
    reward: 10
  },
  {
    id: 'streak_7',
    name: '一週戰士',
    description: '連續 7 天完成任務',
    condition: (stats) => stats.streak >= 7,
    reward: 50
  },
  {
    id: 'complete_100',
    name: '世紀成就',
    description: '完成 100 個任務',
    condition: (stats) => stats.totalCompleted >= 100,
    reward: 100
  },
  {
    id: 'level_10',
    name: '大師級',
    description: '達到等級 10',
    condition: (stats) => stats.level >= 10,
    reward: 200
  }
];

// 檢查成就
checkAchievements(stats: GameStats): Achievement[] {
  const unlockedAchievements = localStorage.getItem('achievements');
  const unlocked = unlockedAchievements ? JSON.parse(unlockedAchievements) : [];

  const newAchievements: Achievement[] = [];

  ACHIEVEMENTS.forEach(achievement => {
    if (!unlocked.includes(achievement.id) && achievement.condition(stats)) {
      newAchievements.push(achievement);
      unlocked.push(achievement.id);

      // 顯示成就通知
      this.showAchievementNotification(achievement);

      // 獎勵積分
      stats.points += achievement.reward;
    }
  });

  localStorage.setItem('achievements', JSON.stringify(unlocked));
  return newAchievements;
}
```

### 5. 視覺反饋強化

```typescript
// 完成任務的多層反饋
playEnhancedCompletionFeedback(x: number, y: number) {
  // 1. 粒子效果
  this.particles.setPosition(x, y);
  this.particles.explode(30);

  // 2. 屏幕震動
  this.cameras.main.shake(200, 0.005);

  // 3. 閃光效果
  this.cameras.main.flash(300, 255, 255, 255, false, 0.3);

  // 4. 浮動文字
  const floatingText = this.add.text(x, y, '+10 pts', {
    fontSize: '24px',
    color: '#2ecc71',
    fontStyle: 'bold'
  });

  this.tweens.add({
    targets: floatingText,
    y: y - 50,
    alpha: 0,
    duration: 1000,
    onComplete: () => floatingText.destroy()
  });

  // 5. 音效（如果有）
  // this.sound.play('complete');
}
```

## 性能優化

### 1. 對象池（Object Pooling）

```typescript
class TodoItemPool {
  private pool: TodoItem[] = [];
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, initialSize: number = 10) {
    this.scene = scene;

    // 預創建對象
    for (let i = 0; i < initialSize; i++) {
      const item = new TodoItem({
        scene,
        x: 0,
        y: 0,
        todo: {} as Todo,
        width: CONFIG.CARD_WIDTH
      });
      item.setVisible(false);
      this.pool.push(item);
    }
  }

  // 獲取對象
  acquire(config: TodoItemConfig): TodoItem {
    let item = this.pool.pop();

    if (!item) {
      // 池已空，創建新對象
      item = new TodoItem(config);
    } else {
      // 重用對象
      item.setPosition(config.x, config.y);
      item.updateTodo(config.todo);
      item.setVisible(true);
    }

    return item;
  }

  // 釋放對象
  release(item: TodoItem): void {
    item.setVisible(false);
    this.pool.push(item);
  }
}
```

### 2. 虛擬滾動

```typescript
// 只渲染可見的項目
renderVisibleTodos() {
  const startY = CONFIG.HEADER_HEIGHT + CONFIG.INPUT_HEIGHT + 20;
  const itemHeight = CONFIG.CARD_HEIGHT + CONFIG.CARD_SPACING;

  // 計算可見範圍
  const firstVisibleIndex = Math.floor(this.scrollOffset / itemHeight);
  const lastVisibleIndex = firstVisibleIndex + CONFIG.MAX_VISIBLE_TODOS;

  // 只渲染可見項目
  const visibleTodos = this.todos.slice(
    firstVisibleIndex,
    lastVisibleIndex + 1
  );

  // 清理舊對象
  this.todoItems.forEach(item => this.pool.release(item));
  this.todoItems = [];

  // 創建可見對象
  visibleTodos.forEach((todo, index) => {
    const actualIndex = firstVisibleIndex + index;
    const y = startY + actualIndex * itemHeight - this.scrollOffset;

    const todoItem = this.pool.acquire({
      scene: this,
      x: (CONFIG.GAME_WIDTH - CONFIG.CARD_WIDTH) / 2,
      y,
      todo,
      width: CONFIG.CARD_WIDTH
    });

    this.todoItems.push(todoItem);
  });
}
```

### 3. 事件節流

```typescript
// 滾動事件節流
setupScrolling() {
  let scrollTimeout: NodeJS.Timeout;

  this.input.on('wheel', (pointer, objects, deltaX, deltaY) => {
    // 更新滾動偏移
    this.scrollOffset += deltaY * 0.5;
    this.scrollOffset = Math.max(0, this.scrollOffset);

    // 清除之前的定時器
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    // 設置新的定時器（防抖）
    scrollTimeout = setTimeout(() => {
      this.renderTodos();
    }, 50);
  });
}
```

### 4. 紋理打包

```typescript
// 使用紋理圖集
preload() {
  // 加載圖集
  this.load.atlas(
    'ui',
    'assets/ui.png',
    'assets/ui.json'
  );
}

create() {
  // 使用圖集中的紋理
  const checkbox = this.add.sprite(x, y, 'ui', 'checkbox');
  const deleteBtn = this.add.sprite(x, y, 'ui', 'delete');
}
```

### 5. 批次渲染

```typescript
// 使用 RenderTexture 批次渲染靜態內容
createStaticBackground() {
  const rt = this.add.renderTexture(0, 0, 800, 600);

  // 渲染靜態內容到紋理
  const bg = this.add.graphics();
  bg.fillStyle(COLORS.BACKGROUND);
  bg.fillRect(0, 0, 800, 600);

  const header = this.add.graphics();
  header.fillStyle(COLORS.HEADER);
  header.fillRect(0, 0, 800, 80);

  // 繪製到 RenderTexture
  rt.draw([bg, header]);

  // 銷毀原始對象
  bg.destroy();
  header.destroy();

  // RenderTexture 比多個 Graphics 對象更高效
}
```

## 部署指南

### 1. 靜態網站部署

#### Netlify
```bash
# 1. 構建
npm run build

# 2. 在 Netlify 配置
Build command: npm run build
Publish directory: dist

# 3. 或使用 CLI
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

#### Vercel
```bash
# 1. 安裝 Vercel CLI
npm install -g vercel

# 2. 部署
vercel --prod

# 3. 或通過 GitHub 自動部署
# 連接 GitHub 倉庫，自動 CI/CD
```

#### GitHub Pages
```bash
# 1. 修改 vite.config.ts
export default defineConfig({
  base: '/repository-name/',  // 你的倉庫名
  // ...
});

# 2. 構建
npm run build

# 3. 部署到 gh-pages 分支
npm install -g gh-pages
gh-pages -d dist

# 4. 在 GitHub 設置中啟用 GitHub Pages
```

### 2. 服務器部署

#### Nginx 配置
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    root /var/www/phaser-todo/dist;
    index index.html;

    # Gzip 壓縮
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    # 緩存靜態資源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA 路由
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### Apache 配置
```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    DocumentRoot /var/www/phaser-todo/dist

    <Directory /var/www/phaser-todo/dist>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted

        # SPA 路由
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>

    # Gzip 壓縮
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/html text/plain text/css application/json application/javascript
    </IfModule>
</VirtualHost>
```

### 3. CDN 優化

```html
<!-- 使用 CDN 加載 Phaser -->
<script src="https://cdn.jsdelivr.net/npm/phaser@3.70.0/dist/phaser.min.js"></script>

<!-- 修改 vite.config.ts -->
export default defineConfig({
  build: {
    rollupOptions: {
      external: ['phaser'],
      output: {
        globals: {
          phaser: 'Phaser'
        }
      }
    }
  }
});
```

### 4. PWA 支持

```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Phaser Todo List',
        short_name: 'PhaserTodo',
        description: 'A gamified todo list built with Phaser',
        theme_color: '#3498db',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});
```

## 進階主題

### 1. 添加音效

```typescript
// preload 階段
preload() {
  this.load.audio('complete', 'assets/sounds/complete.mp3');
  this.load.audio('add', 'assets/sounds/add.mp3');
  this.load.audio('delete', 'assets/sounds/delete.mp3');
}

// create 階段
create() {
  // 創建音效
  this.completeSound = this.sound.add('complete');
  this.addSound = this.sound.add('add');
}

// 播放音效
playCompleteAnimation() {
  this.completeSound.play({
    volume: 0.5,
    rate: 1.2  // 加快播放速度
  });

  // ... 其他動畫
}
```

### 2. 添加背景音樂

```typescript
create() {
  this.bgMusic = this.sound.add('bgm', {
    loop: true,
    volume: 0.3
  });

  // 用戶交互後播放（瀏覽器限制）
  this.input.once('pointerdown', () => {
    this.bgMusic.play();
  });
}

// 音量控制
setMusicVolume(volume: number) {
  this.bgMusic.setVolume(volume);
}

// 靜音切換
toggleMute() {
  this.sound.mute = !this.sound.mute;
}
```

### 3. 多場景管理

```typescript
// 主菜單場景
class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const startButton = this.add.text(400, 300, 'Start', { fontSize: '32px' });
    startButton.setInteractive();

    startButton.on('pointerdown', () => {
      this.scene.start('TodoScene');
    });
  }
}

// 統計場景
class StatsScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StatsScene' });
  }

  create() {
    const stats = DataManager.loadStats();

    this.add.text(400, 200, `Level: ${stats.level}`, { fontSize: '24px' });
    this.add.text(400, 250, `Points: ${stats.points}`, { fontSize: '24px' });
  }
}

// 註冊場景
const config = {
  scene: [MenuScene, TodoScene, StatsScene]
};
```

### 4. 物理引擎集成

```typescript
// 啟用物理引擎
const config = {
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  }
};

// 為 TodoItem 添加物理屬性
class TodoItem extends Phaser.GameObjects.Container {
  constructor(config) {
    super(config.scene, config.x, config.y);

    // 啟用物理
    config.scene.physics.world.enable(this);

    // 設置物理屬性
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    body.setBounce(0.5);
  }
}

// 刪除時的物理效果
handleDelete() {
  const body = this.body as Phaser.Physics.Arcade.Body;

  // 施加向右的力
  body.setVelocityX(500);
  body.setVelocityY(-300);
  body.setAngularVelocity(360);

  // 延遲銷毀
  this.scene.time.delayedCall(2000, () => {
    this.destroy();
  });
}
```

### 5. 數據導出導入

```typescript
// 導出為 JSON
exportData() {
  const data = {
    todos: DataManager.loadTodos(),
    stats: DataManager.loadStats(),
    timestamp: Date.now()
  };

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `phaser-todo-${Date.now()}.json`;
  a.click();

  URL.revokeObjectURL(url);
}

// 導入
importData(file: File) {
  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target?.result as string);

      DataManager.saveTodos(data.todos);
      DataManager.saveStats(data.stats);

      this.scene.restart();
    } catch (error) {
      console.error('Invalid data file:', error);
    }
  };

  reader.readAsText(file);
}
```

## 常見問題

### Q1: 為什麼使用 DOM 輸入框而不是 Phaser 文本輸入？

**A:** Phaser 沒有原生的文本輸入組件。雖然可以自己實現（監聽鍵盤事件），但：

1. **複雜度高**: 需要處理光標、選擇、IME 輸入等
2. **可訪問性差**: 無法使用屏幕閱讀器
3. **移動設備問題**: 無法喚起虛擬鍵盤

使用 DOM 輸入框的優勢：
```typescript
// 簡單且功能完整
const input = document.createElement('input');
input.type = 'text';
input.placeholder = 'Enter text...';

// 自動支持：
// - 光標和選擇
// - 複製粘貼
// - 自動完成
// - IME 輸入（中文、日文等）
// - 移動虛擬鍵盤
// - 可訪問性
```

### Q2: Phaser 適合生產環境的應用嗎？

**A:** 取決於需求：

**適合：**
- ✅ 遊戲化應用
- ✅ 互動式可視化
- ✅ 創意展示
- ✅ 教育工具

**不適合：**
- ❌ 標準 CRUD 應用
- ❌ 需要 SEO 的應用
- ❌ 複雜的表單處理
- ❌ 企業管理系統

### Q3: 如何優化首次加載時間？

**A:** 多種策略：

```typescript
// 1. 代碼分割
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser'],
          utils: ['src/utils/DataManager.ts']
        }
      }
    }
  }
});

// 2. 延遲加載場景
class LoadingScene extends Phaser.Scene {
  preload() {
    // 只加載必要資源
    this.load.image('logo', 'logo.png');
  }

  create() {
    // 異步加載其他資源
    this.load.once('complete', () => {
      this.scene.start('MainScene');
    });

    this.load.audio('bgm', 'music.mp3');
    this.load.start();
  }
}

// 3. 使用 CDN
<script src="https://cdn.jsdelivr.net/npm/phaser@3.70.0"></script>

// 4. 壓縮資源
// - 使用 WebP 圖片
// - 壓縮音頻
// - Minify 代碼
```

### Q4: 如何處理不同屏幕尺寸？

**A:** Phaser 提供多種縮放模式：

```typescript
const config = {
  scale: {
    // 縮放模式
    mode: Phaser.Scale.FIT,  // 適應容器，保持比例
    // mode: Phaser.Scale.ENVELOP,  // 填滿容器
    // mode: Phaser.Scale.RESIZE,  // 響應式調整大小

    // 居中
    autoCenter: Phaser.Scale.CENTER_BOTH,

    // 父容器
    parent: 'game-container',

    // 基礎尺寸
    width: 800,
    height: 600,
  }
};

// 響應式處理
window.addEventListener('resize', () => {
  game.scale.refresh();
});

// 不同尺寸的布局
create() {
  const { width, height } = this.cameras.main;

  if (width < 600) {
    // 移動設備布局
    this.createMobileLayout();
  } else {
    // 桌面布局
    this.createDesktopLayout();
  }
}
```

### Q5: 如何調試 Phaser 應用？

**A:** 多種調試工具：

```typescript
// 1. 啟用調試模式
const config = {
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,  // 顯示物理邊界
    }
  }
};

// 2. 使用瀏覽器控制台
window.game = game;  // 在控制台訪問遊戲實例

// 控制台中：
game.scene.getScene('TodoScene').todos  // 檢查數據
game.scene.getScene('TodoScene').renderTodos()  // 調用方法

// 3. Phaser Inspector (Chrome 擴展)
// https://chrome.google.com/webstore/detail/phaser-inspector

// 4. 自定義調試信息
create() {
  this.debugText = this.add.text(10, 10, '', {
    fontSize: '12px',
    color: '#00ff00'
  });
}

update() {
  this.debugText.setText([
    `FPS: ${Math.round(this.game.loop.actualFps)}`,
    `Objects: ${this.children.length}`,
    `Todos: ${this.todos.length}`
  ]);
}
```

### Q6: 如何添加測試？

**A:** 使用標準測試工具：

```typescript
// 安裝
npm install -D vitest @vitest/ui

// DataManager.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { DataManager } from './DataManager';

describe('DataManager', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should create todo with correct properties', () => {
    const todo = DataManager.createTodo('Test task', Priority.HIGH);

    expect(todo.text).toBe('Test task');
    expect(todo.priority).toBe(Priority.HIGH);
    expect(todo.completed).toBe(false);
    expect(todo.id).toBeTruthy();
  });

  it('should save and load todos', () => {
    const todos = [
      DataManager.createTodo('Task 1', Priority.LOW),
      DataManager.createTodo('Task 2', Priority.MEDIUM)
    ];

    DataManager.saveTodos(todos);
    const loaded = DataManager.loadTodos();

    expect(loaded).toHaveLength(2);
    expect(loaded[0].text).toBe('Task 1');
  });
});

// Scene 測試（較複雜）
import { TodoScene } from './TodoScene';

describe('TodoScene', () => {
  let scene: TodoScene;

  beforeEach(() => {
    // 創建測試場景
    scene = new TodoScene();

    // 模擬 Phaser 環境
    scene.add = {
      text: vi.fn(),
      graphics: vi.fn(),
      // ...
    } as any;
  });

  it('should render todos', () => {
    scene.todos = [
      DataManager.createTodo('Task 1', Priority.LOW)
    ];

    scene.renderTodos();

    expect(scene.todoItems).toHaveLength(1);
  });
});
```

## 學習資源

### 官方資源

1. **Phaser 官網**: https://phaser.io
2. **官方文檔**: https://photonstorm.github.io/phaser3-docs/
3. **官方示例**: https://phaser.io/examples
4. **官方教程**: https://phaser.io/tutorials

### 書籍

1. **"Phaser 3 Game Development"** by Pablo Farias Navarro
2. **"HTML5 Game Development with Phaser 3"** by Richard Davey
3. **"Game Development with Phaser and TypeScript"** by Emanuele Feronato

### 線上課程

1. **Udemy**: "HTML5 Game Development with Phaser 3"
2. **Codecademy**: "Learn Phaser: Make Snake!"
3. **YouTube**: Ourcade 頻道（高質量 Phaser 教程）

### 社群

1. **Discord**: https://discord.gg/phaser
2. **論壇**: https://phaser.discourse.group
3. **GitHub**: https://github.com/photonstorm/phaser

### 相關工具

1. **Tiled**: 瓦片地圖編輯器
2. **TexturePacker**: 紋理圖集工具
3. **Spine**: 骨骼動畫工具
4. **Phaser Editor**: 可視化場景編輯器

### TypeScript 資源

1. **官方手冊**: https://www.typescriptlang.org/docs/
2. **TypeScript + Phaser**: https://phaser.io/tutorials/getting-started-phaser3/part5

## 總結

這個 Phaser Todo List 專案展示了：

### 技術層面
- ✅ 如何使用遊戲引擎構建實用應用
- ✅ Phaser 3 的核心概念和 API
- ✅ TypeScript 類型安全的遊戲開發
- ✅ 遊戲對象的創建和管理
- ✅ 事件驅動的架構設計
- ✅ 動畫和視覺效果的實現
- ✅ 數據持久化和狀態管理

### 教育層面
- ✅ 對比不同技術棧的思維方式
- ✅ 理解遊戲引擎的工作原理
- ✅ 學習對象導向的遊戲開發
- ✅ 掌握動畫和粒子系統
- ✅ 探索創意應用的可能性

### 實用層面
- ✅ 完整的功能實現
- ✅ 遊戲化的用戶體驗
- ✅ 豐富的視覺反饋
- ✅ 性能優化的實踐
- ✅ 可部署的生產代碼

雖然在實際生產中，我們更可能選擇 React、Vue 等傳統框架來構建 Todo List，但這個專案證明了：**技術選擇沒有絕對的對錯，關鍵是理解每種技術的優勢和適用場景。**

遊戲引擎不僅僅是用來做遊戲的，它們代表了一種不同的思維方式和解決問題的方法。通過這個專案，我們不僅學習了 Phaser，更重要的是拓展了我們的技術視野。

## 授權

MIT License

Copyright (c) 2025

## 貢獻

歡迎提交 Issue 和 Pull Request！

---

**製作**: 多平台 Todo List 專案系列
**版本**: 1.0.0
**最後更新**: 2025-01-18
