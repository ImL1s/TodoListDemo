# PyQt6 Todo List

一个使用 PyQt6 构建的现代化跨平台待办事项应用。

## 📋 技术栈

- **Python**: 3.10+
- **GUI 框架**: PyQt6 6.6.0
- **数据持久化**: JSON
- **架构模式**: MVC (Model-View-Controller)

## ✨ 功能特性

- ✅ 添加新任务
- ✅ 切换任务完成状态
- ✅ 删除单个任务
- ✅ 批量清除已完成任务
- ✅ 实时统计信息（总计/进行中/已完成）
- ✅ 数据自动持久化到 JSON
- ✅ 现代化 UI 设计
- ✅ Signal/Slot 机制
- ✅ 响应式布局

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

## 🎮 运行应用

```bash
cd src
python main.py
```

## 📁 项目结构

```
10-pyqt6/
├── src/
│   ├── main.py              # 应用程序入口
│   ├── main_window.py       # 主窗口实现（QMainWindow）
│   ├── todo_item.py         # 单个任务 Widget
│   ├── todo_model.py        # Todo 数据模型（dataclass）
│   └── storage.py           # JSON 存储管理器
├── resources/
│   └── style.qss            # Qt 样式表（可选）
├── requirements.txt         # 项目依赖
├── .gitignore              # Git 忽略文件
└── README.md               # 项目文档
```

## 🖥️ UI 布局说明

### 主窗口组件层次

```
QMainWindow (600x500)
└── QVBoxLayout (主布局)
    ├── QLabel ("📝 Todo List" - 标题，20pt 粗体)
    ├── QHBoxLayout (输入区域)
    │   ├── QLineEdit (任务输入框，支持回车添加)
    │   └── QPushButton ("添加")
    ├── QListWidget (任务列表)
    │   └── TodoItemWidget (自定义 Widget)
    │       ├── QCheckBox (完成状态)
    │       ├── QLabel (任务标题)
    │       └── QPushButton ("删除")
    └── QHBoxLayout (统计区域)
        ├── QLabel (统计信息)
        └── QPushButton ("清除已完成")
```

### UI 特性

- **输入框**: 带焦点高亮效果，支持回车快速添加
- **任务项**: 完成的任务显示删除线和灰色文字
- **按钮**: 现代化圆角设计，悬停和按下效果
- **列表**: 白色背景，分隔线清晰
- **响应式**: 窗口可调整大小，组件自适应

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
- **自动保存**: 每次操作（添加/删除/切换状态）后自动保存
- **自动加载**: 应用启动时自动加载

## 🔧 代码质量

- ✅ **PEP 8** 代码风格
- ✅ **Type Hints** 类型注解
- ✅ **Docstrings** 完整的文档字符串
- ✅ **异常处理** JSON 加载/保存错误处理
- ✅ **信号槽机制** PyQt6 标准模式

## 🌍 跨平台兼容性

| 平台 | 支持状态 | 备注 |
|------|---------|------|
| Windows | ✅ 完全支持 | Windows 10/11 |
| Linux | ✅ 完全支持 | Ubuntu 20.04+, Fedora 35+ |
| macOS | ✅ 完全支持 | macOS 11+ (Big Sur) |

## 📦 依赖说明

- **PyQt6**: 跨平台 GUI 框架
  - 包含所有必需的 Qt 模块
  - 自动处理平台差异
  - 无需额外系统依赖（在 Linux 上可能需要安装 X11 相关包）

### Linux 额外依赖（如果需要）

```bash
# Ubuntu/Debian
sudo apt-get install python3-pyqt6

# Fedora
sudo dnf install python3-pyqt6
```

## 🎨 自定义样式

可以通过修改 `resources/style.qss` 文件自定义应用外观：

```python
# 在 main_window.py 中加载样式表
with open('../resources/style.qss', 'r') as f:
    self.setStyleSheet(f.read())
```

## 📝 使用示例

1. **添加任务**: 在输入框输入内容，点击"添加"或按回车
2. **完成任务**: 点击任务前的复选框
3. **删除任务**: 点击任务右侧的"删除"按钮
4. **批量清理**: 点击底部"清除已完成"按钮删除所有已完成任务

## 🔒 许可证

MIT License

## 👨‍💻 开发者

TodoListDemo Project
