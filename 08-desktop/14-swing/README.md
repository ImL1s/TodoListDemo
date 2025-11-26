# TodoList - Swing Desktop Application

一个使用 Java Swing 和 FlatLaf 现代主题构建的跨平台桌面 TodoList 应用，具有美观的界面和完整的功能。

## 技术栈

- **Java**: 17+
- **Swing**: Java 原生 GUI 框架
- **FlatLaf**: 3.3 - 现代化 Look and Feel
- **Gson**: 2.10.1 - JSON 数据持久化
- **Maven**: 项目构建工具

## 项目结构

```
14-swing/
├── src/main/java/com/example/todolist/
│   ├── TodoApp.java                      # 主应用入口 (JFrame)
│   ├── model/
│   │   └── Todo.java                     # Todo 数据模型
│   ├── ui/
│   │   ├── TodoListPanel.java            # 主面板容器
│   │   └── TodoItemPanel.java            # 单个 Todo 项面板
│   └── service/
│       └── StorageService.java           # JSON 持久化服务
├── pom.xml                                # Maven 配置
├── .gitignore
└── README.md
```

## 功能特性

### 核心功能

- ✅ **添加任务**: 输入框 + 添加按钮，支持 Enter 键快速添加
- ✅ **完成任务**: 点击复选框标记完成/未完成，自动更新样式
- ✅ **删除任务**: 每个任务带删除按钮（带确认对话框）
- ✅ **任务筛选**: 全部/活动/已完成三种视图
- ✅ **清除已完成**: 一键清除所有已完成任务
- ✅ **实时统计**: 底部状态栏显示任务统计
- ✅ **数据持久化**: 自动保存到本地 JSON 文件

### UI 特性

- 🎨 **现代主题**: 使用 FlatLaf 提供现代化外观
- 🌈 **美观设计**: 精心设计的颜色和布局
- ✨ **交互反馈**: 按钮悬停效果、面板高亮
- 📱 **响应式**: 支持窗口大小调整，最小尺寸保护
- 🖱️ **用户友好**: 直观的操作界面

## 快速开始

### 前置要求

- **JDK 17** 或更高版本
- **Maven 3.6+** (可选)

### 安装与运行

#### 方法 1: 使用 Maven

```bash
# 进入项目目录
cd 08-desktop/14-swing

# 编译项目
mvn clean compile

# 运行应用
mvn exec:java -Dexec.mainClass="com.example.todolist.TodoApp"
```

#### 方法 2: 打包运行

```bash
# 打包应用 (包含所有依赖)
mvn clean package

# 运行打包后的 JAR
java -jar target/todolist-swing.jar
```

#### 方法 3: 使用 IDE

1. 导入项目到 IntelliJ IDEA / Eclipse / NetBeans
2. 等待 Maven 依赖下载完成
3. 运行 `TodoApp.java` 的 main 方法

### 数据存储位置

应用数据自动保存在用户主目录：

- **Windows**: `C:\Users\<username>\.todolist-swing\todos.json`
- **macOS**: `/Users/<username>/.todolist-swing/todos.json`
- **Linux**: `/home/<username>/.todolist-swing/todos.json`

## 使用指南

### 基本操作

#### 1. 添加任务

**方法一**:
1. 在输入框中输入任务描述
2. 点击 "Add" 按钮

**方法二**:
1. 在输入框中输入任务描述
2. 按 Enter 键

#### 2. 完成/取消完成任务

- 点击任务左侧的复选框
- 已完成的任务会显示删除线和灰色文本

#### 3. 删除任务

1. 点击任务右侧的 "Delete" 按钮
2. 在确认对话框中点击 "Yes"

#### 4. 筛选任务

使用顶部的筛选器：

- **All**: 显示所有任务
- **Active**: 仅显示未完成的任务
- **Completed**: 仅显示已完成的任务

#### 5. 清除所有已完成任务

1. 点击 "Clear Completed" 按钮
2. 在确认对话框中点击 "Yes"

### 键盘快捷键

- **Enter**: 在输入框中按 Enter 快速添加任务

## 技术细节

### FlatLaf Look and Feel

FlatLaf 是一个现代化的 Swing Look and Feel，提供：

- 扁平化设计
- 更好的字体渲染
- 现代化的颜色方案
- 改进的组件外观

```java
// 在 TodoApp 中设置 FlatLaf
UIManager.setLookAndFeel(new FlatLightLaf());
```

### BorderLayout 布局

主面板使用 BorderLayout：

- **NORTH**: 标题、输入框、筛选器
- **CENTER**: 滚动任务列表
- **SOUTH**: 状态栏

### BoxLayout 任务列表

任务列表使用 BoxLayout（Y_AXIS）垂直排列任务项。

### 自定义面板组件

每个任务项是一个自定义的 `TodoItemPanel`：

```java
public class TodoItemPanel extends JPanel {
    private JCheckBox checkBox;
    private JLabel textLabel;
    private JButton deleteButton;
    // ...
}
```

### JSON 持久化

使用 Gson 库实现数据持久化：

```java
// 保存
String json = gson.toJson(dataList);
Files.writeString(dataFilePath, json);

// 加载
List<TodoData> dataList = gson.fromJson(json, listType);
```

### LocalDateTime 处理

自定义 Gson 适配器处理 LocalDateTime：

```java
.registerTypeAdapter(LocalDateTime.class, new LocalDateTimeAdapter())
```

## 开发指南

### 修改主题颜色

在 `TodoListPanel.java` 中修改颜色常量：

```java
// 主色调
private static final Color PRIMARY_COLOR = new Color(59, 130, 246);

// 背景色
private static final Color BACKGROUND_COLOR = new Color(245, 247, 250);
```

### 添加新的筛选器

1. 在 `TodoListPanel` 中添加新的 RadioButton
2. 更新 `getFilteredTodos()` 方法
3. 添加对应的事件处理器

### 自定义 TodoItem 外观

修改 `TodoItemPanel.java` 中的样式设置：

```java
// 修改字体
textLabel.setFont(new Font("Segoe UI", Font.PLAIN, 14));

// 修改颜色
setBackground(Color.WHITE);

// 修改边框
setBorder(BorderFactory.createEmptyBorder(12, 15, 12, 15));
```

## 构建与部署

### 创建可执行 JAR

```bash
# 使用 Maven Shade Plugin 打包
mvn clean package

# 生成的 JAR 包含所有依赖
# target/todolist-swing.jar
```

### 运行打包的应用

```bash
# 直接运行
java -jar target/todolist-swing.jar

# 或双击 JAR 文件（如果系统关联了 .jar 文件）
```

### 创建原生安装包

使用 jpackage（JDK 14+）：

```bash
# Windows
jpackage --input target --name TodoList \
  --main-jar todolist-swing.jar \
  --main-class com.example.todolist.TodoApp \
  --type exe

# macOS
jpackage --input target --name TodoList \
  --main-jar todolist-swing.jar \
  --main-class com.example.todolist.TodoApp \
  --type dmg

# Linux
jpackage --input target --name TodoList \
  --main-jar todolist-swing.jar \
  --main-class com.example.todolist.TodoApp \
  --type deb
```

## 常见问题

### Q: 如何切换到深色主题？

A: 修改 `TodoApp.java` 中的 Look and Feel：

```java
import com.formdev.flatlaf.FlatDarkLaf;

// 使用深色主题
UIManager.setLookAndFeel(new FlatDarkLaf());
```

### Q: FlatLaf 未加载？

A: 检查以下几点：

1. Maven 依赖是否正确下载
2. 查看控制台错误信息
3. 确认使用的是 FlatLaf 3.3 版本

### Q: 数据未保存？

A: 确认：

1. 用户主目录有写入权限
2. 查看控制台日志
3. 检查 `.todolist-swing` 目录是否创建

### Q: 界面显示异常？

A: 尝试：

1. 更新到最新 JDK
2. 重新编译项目
3. 清除 Maven 缓存：`mvn clean`

## 性能优化

- **轻量级组件**: Swing 组件性能优异
- **虚拟化列表**: 仅渲染可见的任务项
- **事件驱动**: 高效的事件处理机制
- **延迟加载**: 按需创建 UI 组件

## 系统要求

### 最低配置

- **操作系统**: Windows 7+, macOS 10.10+, Linux (任意主流发行版)
- **处理器**: 1 GHz 单核处理器
- **内存**: 256 MB RAM
- **磁盘空间**: 50 MB

### 推荐配置

- **操作系统**: Windows 10+, macOS 11+, Ubuntu 20.04+
- **处理器**: 1.5 GHz 双核处理器
- **内存**: 512 MB RAM
- **磁盘空间**: 100 MB

## 扩展功能建议

- [ ] 添加任务优先级（高/中/低）
- [ ] 实现任务分类/标签系统
- [ ] 添加任务到期日期
- [ ] 支持任务拖拽排序
- [ ] 实现搜索/过滤功能
- [ ] 添加任务备注/详情
- [ ] 支持深色模式切换
- [ ] 实现数据导入/导出（CSV/Excel）
- [ ] 添加系统托盘图标
- [ ] 实现快捷键支持
- [ ] 添加任务提醒功能
- [ ] 云端同步支持

## 截图说明

### 主界面布局

```
┌─────────────────────────────────────────┐
│ TodoList                                │
│ Organize your tasks efficiently        │
├─────────────────────────────────────────┤
│ [输入框...........................] [Add] │
├─────────────────────────────────────────┤
│ Filter: ○All ○Active ○Completed [Clear]│
├─────────────────────────────────────────┤
│ ☐ 任务 1                      [Delete]  │
│ ☑ 任务 2 (已完成)             [Delete]  │
│ ☐ 任务 3                      [Delete]  │
│ ...                                     │
├─────────────────────────────────────────┤
│ Total: 10 | Active: 6 | Completed: 4   │
└─────────────────────────────────────────┘
```

### 配色方案

- **主按钮**: 蓝色 (#3B82F6) - 现代感
- **删除按钮**: 红色 (#EF4444) - 警告色
- **背景色**: 浅灰色 (#F5F7FA) - 舒适
- **文本色**: 深灰色 (#1F2937) - 易读
- **边框色**: 浅灰色 (#E5E7EB) - 分隔

## FlatLaf 主题

### 可用主题

```java
// Light 主题
UIManager.setLookAndFeel(new FlatLightLaf());

// Dark 主题
UIManager.setLookAndFeel(new FlatDarkLaf());

// IntelliJ 主题
UIManager.setLookAndFeel(new FlatIntelliJLaf());

// Darcula 主题
UIManager.setLookAndFeel(new FlatDarculaLaf());
```

### 自定义 FlatLaf 属性

```java
// 设置圆角半径
UIManager.put("Button.arc", 8);
UIManager.put("Component.arc", 8);

// 设置焦点边框颜色
UIManager.put("Component.focusColor", new Color(59, 130, 246));
```

## 许可证

MIT License

## 作者

TodoList Demo Project

## 版本历史

- **v1.0.0** (2025-11-20)
  - 初始版本发布
  - 完整的 CRUD 功能
  - FlatLaf 现代化主题
  - JSON 本地持久化
  - 任务筛选和统计
  - 自定义面板组件

## 相关资源

- [Swing 官方文档](https://docs.oracle.com/javase/tutorial/uiswing/)
- [FlatLaf 官网](https://www.formdev.com/flatlaf/)
- [FlatLaf GitHub](https://github.com/JFormDesigner/FlatLaf)
- [Gson 文档](https://github.com/google/gson)

## 对比其他框架

### Swing vs JavaFX

| 特性 | Swing | JavaFX |
|------|-------|--------|
| 成熟度 | 非常成熟 | 较新 |
| 学习曲线 | 中等 | 较陡 |
| 性能 | 优秀 | 优秀 |
| 主题支持 | FlatLaf 等 | CSS |
| 布局方式 | Layout Managers | FXML/代码 |
| 数据绑定 | 手动 | Properties |

### 为什么选择 Swing?

- ✅ **简单直接**: 无需学习 FXML
- ✅ **轻量级**: 资源占用低
- ✅ **兼容性好**: JDK 内置，无需额外模块
- ✅ **FlatLaf**: 现代化外观
- ✅ **文档丰富**: 大量示例和教程

---

**享受使用 Swing TodoList 管理您的任务！** 🚀
