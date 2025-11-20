# Tkinter Todo List

一个使用 Python 内置 Tkinter 库构建的轻量级跨平台待办事项应用。

## 📋 技术栈

- **Python**: 3.10+ (内置 Tkinter)
- **GUI 框架**: Tkinter (标准库)
- **主题组件**: ttk (Themed Tk Widgets)
- **数据持久化**: JSON
- **架构模式**: MVC

## ✨ 功能特性

- ✅ 添加新任务（支持回车快捷键）
- ✅ 切换任务完成状态（复选框）
- ✅ 删除单个任务
- ✅ 批量清除已完成任务
- ✅ 实时统计信息（总计/进行中/已完成）
- ✅ 数据自动持久化到 JSON
- ✅ 滚动列表支持大量任务
- ✅ ttk 主题化组件
- ✅ 无需额外依赖

## 🚀 安装步骤

### 前置要求

Tkinter 是 Python 的标准库，通常已预装。如果未安装：

#### Windows
Python 安装包已包含 Tkinter，无需额外安装。

#### macOS
```bash
# macOS 自带 Python 已包含 Tkinter
# 如果使用 Homebrew 安装的 Python，也已包含
```

#### Linux

```bash
# Ubuntu/Debian
sudo apt-get install python3-tk

# Fedora/RHEL
sudo dnf install python3-tkinter

# Arch Linux
sudo pacman -S tk
```

### 验证安装

```bash
python -m tkinter
```
如果弹出一个简单的窗口，说明 Tkinter 已正确安装。

## 🎮 运行应用

```bash
cd src
python main.py
```

## 📁 项目结构

```
11-tkinter/
├── src/
│   ├── main.py              # 应用程序入口
│   ├── app.py               # Tk 主窗口和应用逻辑
│   ├── todo_frame.py        # 任务列表 Frame 组件
│   └── storage.py           # JSON 存储管理器
├── requirements.txt         # 依赖说明（Tkinter 无需安装）
├── .gitignore              # Git 忽略文件
└── README.md               # 项目文档
```

## 🖥️ UI 布局说明

### 主窗口组件层次

```
Tk Root (600x500)
└── TodoFrame (主容器)
    ├── Label ("📝 Todo List" - 标题，24pt 粗体)
    ├── Frame (输入区域)
    │   ├── Entry (任务输入框，支持回车)
    │   └── Button ("添加")
    ├── Canvas + Scrollbar (滚动列表容器)
    │   └── Frame (可滚动内容)
    │       └── TodoItem Frame (重复)
    │           ├── Checkbutton (完成状态)
    │           ├── Label (任务标题)
    │           └── Button ("删除")
    └── Frame (统计区域)
        ├── Label (统计信息)
        └── Button ("清除已完成")
```

### UI 特性

- **ttk 主题**: 使用 'clam' 主题，现代化外观
- **滚动支持**: Canvas + Scrollbar 实现任务列表滚动
- **完成标记**: 已完成任务显示删除线和灰色
- **响应式**: 窗口可调整大小（最小 500x400）
- **快捷键**: 输入框支持回车键快速添加任务

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
- ✅ **模块化设计** 清晰的组件分离

## 🌍 跨平台兼容性

| 平台 | 支持状态 | 备注 |
|------|---------|------|
| Windows | ✅ 完全支持 | Python 安装包已包含 Tkinter |
| Linux | ✅ 完全支持 | 需安装 python3-tk 包 |
| macOS | ✅ 完全支持 | 系统自带 Tkinter |

## 📦 依赖说明

**无需额外安装依赖！** Tkinter 是 Python 标准库的一部分。

### Tkinter 优势

- **零依赖**: 随 Python 一起分发
- **轻量级**: 体积小，启动快
- **成熟稳定**: Python 官方 GUI 解决方案
- **跨平台**: 在所有主流平台上一致表现
- **学习曲线低**: 简单易学的 API

## 🎨 样式定制

应用使用 ttk.Style 进行样式定制：

```python
# 在 app.py 中修改样式
style = ttk.Style()
style.configure("TButton", background="#4CAF50")  # 绿色按钮
```

## 📝 使用示例

1. **添加任务**: 在输入框输入内容，点击"添加"或按回车
2. **完成任务**: 点击任务前的复选框
3. **删除任务**: 点击任务右侧的"删除"按钮
4. **批量清理**: 点击底部"清除已完成"按钮删除所有已完成任务
5. **滚动列表**: 当任务较多时，使用鼠标滚轮或右侧滚动条

## 🆚 与其他框架对比

| 特性 | Tkinter | PyQt6 | Kivy |
|------|---------|-------|------|
| 安装复杂度 | ⭐ 无需安装 | ⭐⭐ 需 pip | ⭐⭐⭐ 需 pip + 依赖 |
| 应用体积 | ⭐ 最小 | ⭐⭐ 较大 | ⭐⭐⭐ 最大 |
| UI 现代化 | ⭐⭐ 传统 | ⭐⭐⭐ 现代 | ⭐⭐⭐ 现代 |
| 学习曲线 | ⭐ 简单 | ⭐⭐⭐ 中等 | ⭐⭐⭐ 中等 |
| 移动端支持 | ❌ 无 | ❌ 无 | ✅ 支持 |

## 🔒 许可证

MIT License

## 👨‍💻 开发者

TodoListDemo Project
