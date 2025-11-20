# TodoList - JavaFX Desktop Application

一个功能完整的跨平台桌面 TodoList 应用，使用 JavaFX 构建，支持数据持久化和现代化 UI。

## 技术栈

- **Java**: 17+
- **JavaFX**: 21.0.1
- **FXML**: UI 布局
- **CSS**: 自定义样式
- **Gson**: JSON 数据持久化
- **Maven**: 项目构建

## 项目结构

```
13-javafx/
├── src/main/java/com/example/todolist/
│   ├── TodoApp.java                      # 主应用入口
│   ├── controller/
│   │   └── TodoController.java           # FXML 控制器
│   ├── model/
│   │   └── Todo.java                     # Todo 模型 (JavaFX Properties)
│   └── util/
│       └── StorageService.java           # JSON 持久化服务
├── src/main/resources/
│   ├── fxml/
│   │   └── TodoView.fxml                 # UI 布局定义
│   └── css/
│       └── style.css                     # 应用样式
├── pom.xml                                # Maven 配置
├── .gitignore
└── README.md
```

## 功能特性

### 核心功能

- ✅ **添加任务**: 通过输入框添加新的待办事项
- ✅ **完成任务**: 点击复选框标记任务完成/未完成
- ✅ **删除任务**: 删除单个任务（带确认提示）
- ✅ **任务筛选**: 查看全部/活动/已完成任务
- ✅ **清除已完成**: 一键清除所有已完成任务
- ✅ **实时统计**: 显示总任务数、活动任务数、已完成任务数
- ✅ **数据持久化**: 自动保存到本地 JSON 文件

### UI 特性

- 🎨 **现代化设计**: 清爽的 Material Design 风格
- 🌈 **美观的色彩**: 精心设计的配色方案
- ✨ **流畅动画**: 按钮悬停和点击效果
- 📱 **响应式布局**: 支持窗口大小调整
- 🖱️ **友好交互**: 直观的用户操作体验

## 快速开始

### 前置要求

- **JDK 17** 或更高版本
- **Maven 3.6+** (可选，可使用 Maven Wrapper)

### 安装与运行

#### 方法 1: 使用 Maven

```bash
# 进入项目目录
cd 08-desktop/13-javafx

# 清理并编译项目
mvn clean compile

# 运行应用
mvn javafx:run
```

#### 方法 2: 使用 Maven Wrapper (如果有)

```bash
# 运行应用
./mvnw javafx:run
```

#### 方法 3: 打包并运行 JAR

```bash
# 打包应用
mvn clean package

# 运行打包后的 JAR
java -jar target/todolist-javafx-1.0.0.jar
```

### 数据存储位置

应用数据自动保存在用户主目录：

- **Windows**: `C:\Users\<username>\.todolist-javafx\todos.json`
- **macOS**: `/Users/<username>/.todolist-javafx/todos.json`
- **Linux**: `/home/<username>/.todolist-javafx/todos.json`

## 使用指南

### 基本操作

#### 1. 添加任务

1. 在输入框中输入任务描述
2. 点击 "Add" 按钮或按 Enter 键
3. 任务会自动添加到列表并保存

#### 2. 完成任务

- 点击任务前面的复选框即可标记为完成
- 已完成的任务会显示删除线和灰色文本

#### 3. 删除任务

- 点击任务右侧的 "Delete" 按钮
- 确认删除提示框中点击 "OK"

#### 4. 筛选任务

使用筛选器查看不同状态的任务：

- **All**: 显示所有任务
- **Active**: 仅显示未完成的任务
- **Completed**: 仅显示已完成的任务

#### 5. 清除已完成任务

- 点击 "Clear Completed" 按钮
- 确认删除提示框中点击 "OK"
- 所有已完成的任务将被删除

### 键盘快捷键

- **Enter**: 在输入框中按 Enter 快速添加任务

## 技术细节

### JavaFX Properties

使用 JavaFX 的 Property 系统实现数据绑定：

```java
public class Todo {
    private final StringProperty text;
    private final BooleanProperty completed;
    private final ObjectProperty<LocalDateTime> createdAt;

    // Properties enable automatic UI updates
}
```

### FXML 架构

采用 MVC 架构模式：

- **Model**: `Todo.java` - 数据模型
- **View**: `TodoView.fxml` + `style.css` - UI 视图
- **Controller**: `TodoController.java` - 业务逻辑

### 自定义 ListView Cell

使用自定义 Cell Factory 实现复杂的列表项布局：

```java
todoListView.setCellFactory(param -> new ListCell<>() {
    // Custom cell rendering with CheckBox, Label, and Button
});
```

### JSON 持久化

使用 Gson 库进行 JSON 序列化/反序列化：

```java
// 自定义 LocalDateTime 适配器
GsonBuilder()
    .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeAdapter())
    .setPrettyPrinting()
    .create();
```

## 开发指南

### 修改 UI 布局

编辑 `src/main/resources/fxml/TodoView.fxml` 文件：

```xml
<VBox xmlns:fx="http://javafx.com/fxml/1"
      fx:controller="com.example.todolist.controller.TodoController">
    <!-- 修改布局 -->
</VBox>
```

### 修改样式

编辑 `src/main/resources/css/style.css` 文件：

```css
.add-button {
    -fx-background-color: #3b82f6;
    -fx-text-fill: white;
}
```

### 添加新功能

1. **更新模型**: 在 `Todo.java` 中添加新属性
2. **更新 UI**: 在 `TodoView.fxml` 中添加新控件
3. **更新控制器**: 在 `TodoController.java` 中实现业务逻辑
4. **更新存储**: 在 `StorageService.java` 中处理新字段

## 构建与部署

### 创建可执行 JAR

```bash
# 使用 Maven Shade Plugin 打包
mvn clean package

# 生成的 JAR 位于
target/todolist-javafx-1.0.0.jar
```

### 创建原生安装包

使用 jpackage 工具（JDK 14+）：

```bash
# Windows (创建 .exe 和 .msi)
jpackage --input target --name TodoList \
  --main-jar todolist-javafx-1.0.0.jar \
  --main-class com.example.todolist.TodoApp \
  --type msi

# macOS (创建 .dmg)
jpackage --input target --name TodoList \
  --main-jar todolist-javafx-1.0.0.jar \
  --main-class com.example.todolist.TodoApp \
  --type dmg

# Linux (创建 .deb 或 .rpm)
jpackage --input target --name TodoList \
  --main-jar todolist-javafx-1.0.0.jar \
  --main-class com.example.todolist.TodoApp \
  --type deb
```

## 常见问题

### Q: 运行时找不到 JavaFX 模块？

A: 确保使用 `mvn javafx:run` 而不是 `java -jar`，或者在运行时添加 JavaFX 模块：

```bash
java --module-path /path/to/javafx-sdk/lib \
     --add-modules javafx.controls,javafx.fxml \
     -jar target/todolist-javafx-1.0.0.jar
```

### Q: FXML 文件加载失败？

A: 检查以下几点：

1. FXML 文件路径：`src/main/resources/fxml/TodoView.fxml`
2. FXML 中的 controller 属性：`fx:controller="com.example.todolist.controller.TodoController"`
3. 包名是否正确

### Q: 样式未生效？

A: 确保：

1. CSS 文件位于 `src/main/resources/css/style.css`
2. 在 `TodoApp.java` 中正确加载 CSS

### Q: 数据未保存？

A: 检查：

1. 用户主目录是否有写入权限
2. 查看控制台日志是否有错误信息
3. 确认 `StorageService` 正常工作

## 系统要求

### 最低配置

- **操作系统**: Windows 10+, macOS 10.14+, Linux (任意主流发行版)
- **处理器**: 1 GHz 双核处理器
- **内存**: 512 MB RAM
- **磁盘空间**: 100 MB

### 推荐配置

- **操作系统**: Windows 11, macOS 12+, Ubuntu 20.04+
- **处理器**: 2 GHz 四核处理器
- **内存**: 1 GB RAM
- **磁盘空间**: 200 MB

## 性能优化

- 使用 JavaFX Properties 实现高效的数据绑定
- ListView 虚拟化技术，支持大量任务
- 异步加载和保存数据
- 优化的 CSS 渲染

## 扩展功能建议

- [ ] 添加任务优先级（高/中/低）
- [ ] 实现任务分类/标签
- [ ] 添加任务到期日期和提醒
- [ ] 支持任务拖拽排序
- [ ] 实现任务搜索功能
- [ ] 添加深色模式支持
- [ ] 支持任务备注/详情
- [ ] 实现任务导入/导出（JSON/CSV）
- [ ] 添加任务统计图表
- [ ] 云端同步支持

## 截图说明

### 主界面

- 顶部：应用标题和副标题
- 输入区：文本框 + 添加按钮
- 筛选区：All/Active/Completed 单选按钮 + 清除已完成按钮
- 列表区：显示所有任务（复选框 + 任务文本 + 删除按钮）
- 底部：统计信息显示

### 配色方案

- **主色调**: 蓝色 (#3b82f6) - 现代感
- **背景色**: 浅灰色 (#f5f7fa) - 舒适
- **文本色**: 深灰色 (#1f2937) - 易读
- **成功色**: 绿色 - 已完成任务
- **危险色**: 红色 (#ef4444) - 删除按钮

## 许可证

MIT License

## 作者

TodoList Demo Project

## 版本历史

- **v1.0.0** (2025-11-20)
  - 初始版本发布
  - 完整的 CRUD 功能
  - JavaFX Properties 数据绑定
  - FXML + CSS 现代化 UI
  - JSON 本地持久化
  - 任务筛选和统计功能

## 相关资源

- [JavaFX 官方文档](https://openjfx.io/)
- [Scene Builder](https://gluonhq.com/products/scene-builder/) - FXML 可视化编辑器
- [Gson 文档](https://github.com/google/gson)
- [JavaFX CSS 参考](https://openjfx.io/javadoc/21/javafx.graphics/javafx/scene/doc-files/cssref.html)

---

**享受使用 JavaFX TodoList 提升您的生产力！** 🚀
