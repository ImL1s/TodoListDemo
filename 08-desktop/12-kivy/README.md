# Kivy Todo List

一个使用 Kivy 构建的现代化、触摸友好的跨平台待办事项应用，支持桌面和移动端。

## 📋 技术栈

- **Python**: 3.10+
- **GUI 框架**: Kivy 2.2.1
- **UI 定义**: Kivy 语言 (.kv 文件)
- **数据持久化**: JSON
- **架构模式**: MVC

## ✨ 功能特性

- ✅ 添加新任务（支持回车快捷键）
- ✅ 切换任务完成状态（复选框）
- ✅ 删除单个任务
- ✅ 批量清除已完成任务（带确认对话框）
- ✅ 实时统计信息（总计/进行中/已完成）
- ✅ 数据自动持久化到 JSON
- ✅ Kivy 语言声明式 UI
- ✅ 响应式布局
- ✅ 触摸友好（支持移动/桌面）
- ✅ 现代化 Material Design 风格
- ✅ 平滑滚动支持

## 🚀 安装步骤

### 1. 创建虚拟环境（推荐）

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/macOS
source venv/bin/activate
```

### 2. 安装依赖

```bash
pip install -r requirements.txt
```

### Linux 额外依赖（如果需要）

```bash
# Ubuntu/Debian
sudo apt-get install python3-pip build-essential git python3-dev \
    ffmpeg libsdl2-dev libsdl2-image-dev libsdl2-mixer-dev \
    libsdl2-ttf-dev libportmidi-dev libswscale-dev libavformat-dev \
    libavcodec-dev zlib1g-dev

# Fedora
sudo dnf install python3-devel SDL2-devel SDL2_image-devel \
    SDL2_mixer-devel SDL2_ttf-devel portmidi-devel \
    libavcodec-devel libavformat-devel libswscale-dev zlib-devel
```

## 🎮 运行应用

```bash
cd src
python main.py
```

## 📁 项目结构

```
12-kivy/
├── src/
│   ├── main.py              # Kivy 应用入口和主逻辑
│   ├── todo.kv              # Kivy 语言 UI 定义
│   ├── models.py            # Todo 数据模型（dataclass）
│   └── storage.py           # JSON 存储管理器
├── requirements.txt         # 项目依赖
├── .gitignore              # Git 忽略文件
└── README.md               # 项目文档
```

## 🖥️ UI 布局说明

### Kivy 语言文件结构 (todo.kv)

```yaml
TodoListScreen (BoxLayout, vertical):
  ├── Label ("📝 Todo List" - 标题，32sp 粗体)
  ├── BoxLayout (输入区域，horizontal)
  │   ├── TextInput (任务输入框，支持回车)
  │   └── Button ("添加"，绿色)
  ├── ScrollView (任务列表容器)
  │   └── BoxLayout (todo_container)
  │       └── TodoItem (重复，自定义 Widget)
  │           ├── CheckBox (完成状态)
  │           ├── Label (任务标题)
  │           └── Button ("删除"，红色)
  └── BoxLayout (统计区域，horizontal)
      ├── Label (统计信息)
      └── Button ("清除已完成"，灰色)
```

### UI 特性

- **Kivy 语言**: 声明式 UI 定义，分离逻辑和视图
- **Material Design**: 现代化配色和圆角设计
- **触摸优化**: 大按钮和间距，适合移动设备
- **动态属性**: 使用 DictProperty 实现数据绑定
- **完成标记**: 已完成任务显示删除线和灰色
- **响应式**: 自适应不同屏幕尺寸
- **流畅动画**: Kivy 原生支持平滑过渡

## 💾 数据存储

- **格式**: JSON
- **文件**: `todos.json`（位于运行目录）
- **结构**:
  ```json
  [
    {
      "id": "uuid-string",
      "title": "任务标题",
      "completed": false,
      "created_at": "2025-11-20T10:30:00"
    }
  ]
  ```
- **自动保存**: 每次操作后自动保存
- **自动加载**: 应用启动时自动加载

## 🔧 代码质量

- ✅ **PEP 8** 代码风格
- ✅ **Type Hints** 类型注解
- ✅ **Docstrings** 完整的文档字符串
- ✅ **异常处理** JSON 加载/保存错误处理
- ✅ **Kivy 属性** 使用 DictProperty 进行数据绑定
- ✅ **分离关注点** .kv 文件处理 UI，.py 文件处理逻辑

## 🌍 跨平台兼容性

| 平台 | 支持状态 | 备注 |
|------|---------|------|
| Windows | ✅ 完全支持 | Windows 10/11 |
| Linux | ✅ 完全支持 | Ubuntu 20.04+, Fedora 35+ |
| macOS | ✅ 完全支持 | macOS 11+ (Big Sur) |
| Android | ✅ 支持 | 通过 Buildozer 打包 |
| iOS | ✅ 支持 | 通过 Kivy-iOS 打包 |

## 📱 移动端支持

Kivy 的最大优势是支持移动平台：

### Android 打包

```bash
# 安装 Buildozer
pip install buildozer

# 初始化配置
buildozer init

# 打包 APK
buildozer -v android debug
```

### iOS 打包

```bash
# macOS 上使用 Kivy-iOS
pip install kivy-ios
toolchain build kivy
```

## 📦 依赖说明

- **Kivy**: 跨平台 Python GUI 框架
  - 支持桌面（Windows/Linux/macOS）
  - 支持移动端（Android/iOS）
  - 基于 OpenGL ES 2 渲染
  - 丰富的触摸和手势支持
  - 自带多种小部件

### Kivy 优势

- **真正跨平台**: 一套代码运行在所有平台
- **触摸优先**: 专为触摸交互设计
- **高性能**: GPU 加速渲染
- **可定制**: 完全自定义 UI 外观
- **活跃社区**: 丰富的第三方库和插件

## 🎨 自定义样式

可以在 `todo.kv` 文件中自定义样式：

```yaml
# 修改按钮颜色
Button:
    background_color: 0.3, 0.69, 0.31, 1  # RGBA (绿色)

# 修改字体大小
Label:
    font_size: sp(20)  # 使用 sp 单位自适应
```

## 📝 使用示例

1. **添加任务**: 在输入框输入内容，点击"添加"或按回车
2. **完成任务**: 点击/触摸任务前的复选框
3. **删除任务**: 点击/触摸任务右侧的"删除"按钮
4. **批量清理**: 点击底部"清除已完成"按钮，确认后删除所有已完成任务
5. **滚动列表**: 触摸拖动或鼠标滚轮滚动任务列表

## 🆚 与其他框架对比

| 特性 | Kivy | PyQt6 | Tkinter |
|------|------|-------|---------|
| 移动端支持 | ✅ 原生支持 | ❌ 无 | ❌ 无 |
| UI 现代化 | ⭐⭐⭐ 非常现代 | ⭐⭐⭐ 现代 | ⭐⭐ 传统 |
| 触摸支持 | ⭐⭐⭐ 优秀 | ⭐⭐ 基础 | ⭐ 有限 |
| 学习曲线 | ⭐⭐⭐ 中等 | ⭐⭐⭐ 中等 | ⭐ 简单 |
| 包体积 | ⭐⭐ 较大 | ⭐⭐ 较大 | ⭐ 最小 |
| GPU 加速 | ✅ 支持 | ✅ 部分支持 | ❌ 无 |

## 🚀 性能优化

- **RecycleView**: 对于大量任务，可使用 RecycleView 替代 BoxLayout
- **异步加载**: 使用 Clock.schedule_once 延迟加载
- **减少重绘**: 合理使用 Property 避免不必要的 UI 更新

## 🔒 许可证

MIT License

## 👨‍💻 开发者

TodoListDemo Project
