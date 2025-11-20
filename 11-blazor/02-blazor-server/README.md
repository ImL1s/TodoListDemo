# Blazor Server - TodoList

A real-time TodoList application built with Blazor Server, SignalR, Entity Framework Core, and SQLite.

## 技术栈

- **.NET 8** - Modern cross-platform framework
- **Blazor Server** - Server-side rendering with SignalR
- **SignalR** - Real-time client-server communication
- **Entity Framework Core** - Code-First ORM
- **SQLite** - Lightweight database
- **Component-based Architecture** - Reusable Razor components

## 前置要求

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)

## 项目结构

```
02-blazor-server/
├── Pages/
│   ├── TodoList.razor          # Main todo list page
│   ├── _Host.cshtml            # Host page
│   ├── Error.cshtml            # Error page
│   └── Error.cshtml.cs         # Error page model
├── Components/
│   ├── TodoItem.razor          # Individual todo item component
│   └── TodoInput.razor         # Todo input component
├── Models/
│   └── Todo.cs                 # Todo entity model
├── Data/
│   └── TodoContext.cs          # EF Core DbContext
├── Services/
│   └── TodoService.cs          # Business logic & data access
├── wwwroot/
│   └── css/
│       └── app.css             # Application styles
├── Program.cs                  # Application entry point
├── App.razor                   # Root component
├── MainLayout.razor            # Layout component
├── _Imports.razor              # Global using statements
├── appsettings.json            # Configuration
├── TodoBlazorServer.csproj     # Project configuration
└── README.md
```

## 核心特性

### SignalR 实时通信
- 服务端渲染，客户端通过 WebSocket 实时更新
- 低延迟的 UI 交互
- 自动重连机制

### Entity Framework Core
- Code-First 数据库设计
- 自动迁移和种子数据
- DbContext Factory 模式（避免作用域问题）
- LINQ 查询优化

### 组件化架构
- **TodoList.razor** - 主页面，协调所有组件
- **TodoItem.razor** - 可重用的单个 Todo 项组件
- **TodoInput.razor** - 输入组件，处理新 Todo 创建

### 状态管理
- 集中式 TodoService
- 事件驱动的状态更新
- Circuit 状态管理（保持连接期间的用户状态）

### 数据持久化
- SQLite 数据库
- 自动保存到磁盘
- 服务器重启后数据保留

### 依赖注入
- Scoped services（每个 Circuit 一个实例）
- IDbContextFactory 用于多线程安全
- ILogger 用于结构化日志

## 快速开始

### 1. 安装依赖

```bash
cd 11-blazor/02-blazor-server
dotnet restore
```

### 2. 构建项目

```bash
dotnet build
```

### 3. 运行应用

```bash
dotnet run
```

或者使用监视模式（自动重载）：

```bash
dotnet watch
```

### 4. 访问应用

打开浏览器访问：
- **HTTPS**: `https://localhost:5001`
- **HTTP**: `http://localhost:5000`

## 开发命令

```bash
# 恢复依赖
dotnet restore

# 构建项目
dotnet build

# 运行开发服务器
dotnet run

# 监视模式（文件更改时自动重新编译）
dotnet watch

# 发布生产版本
dotnet publish -c Release
```

## 功能说明

### 添加 Todo
1. 在输入框中输入 Todo 文本
2. 按 Enter 或点击 "Add" 按钮

### 完成 Todo
- 点击 Todo 左侧的复选框

### 编辑 Todo
1. 双击 Todo 文本
2. 修改内容
3. 按 Enter 保存或按 Escape 取消

### 删除 Todo
- 点击 Todo 右侧的 "×" 按钮

### 过滤 Todo
- **All** - 显示所有 Todos
- **Active** - 仅显示未完成的 Todos
- **Completed** - 仅显示已完成的 Todos

### 清除已完成
- 点击 "Clear completed" 按钮删除所有已完成的 Todos

## 架构说明

### Blazor Server 工作原理

1. **初始加载**：服务器生成初始 HTML 并发送到客户端
2. **SignalR 连接**：客户端通过 WebSocket 建立持久连接（Circuit）
3. **UI 事件**：用户交互通过 SignalR 发送到服务器
4. **服务器处理**：服务器执行 C# 代码，更新组件状态
5. **UI 更新**：服务器计算 diff 并通过 SignalR 发送最小更新到客户端
6. **DOM 更新**：客户端应用 diff 更新 DOM

### DbContext Factory 模式

```csharp
// 注册
services.AddDbContextFactory<TodoContext>(options => ...);

// 使用
public class TodoService
{
    private readonly IDbContextFactory<TodoContext> _contextFactory;

    public async Task<List<Todo>> GetTodosAsync()
    {
        using var context = await _contextFactory.CreateDbContextAsync();
        return await context.Todos.ToListAsync();
    }
}
```

这种模式确保每次数据操作都使用新的 DbContext 实例，避免线程安全和作用域问题。

### 事件驱动状态更新

```csharp
// Service
public event Action? OnChange;
private void NotifyStateChanged() => OnChange?.Invoke();

// Component
protected override void OnInitialized()
{
    TodoService.OnChange += StateHasChanged;
}

public void Dispose()
{
    TodoService.OnChange -= StateHasChanged;
}
```

## 生产部署

### 发布应用

```bash
dotnet publish -c Release -o ./publish
```

### 运行已发布的应用

```bash
cd publish
dotnet TodoBlazorServer.dll
```

### Docker 部署示例

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY ./publish .
ENTRYPOINT ["dotnet", "TodoBlazorServer.dll"]
```

## 环境配置

### 连接字符串

在 `appsettings.json` 中配置：

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=todos.db"
  }
}
```

或通过环境变量：

```bash
export ConnectionStrings__DefaultConnection="Data Source=/data/todos.db"
dotnet run
```

## 性能优化

### 渲染优化
- 使用 `@key` 指令优化列表渲染
- 避免不必要的 StateHasChanged() 调用
- 使用 `ShouldRender()` 控制组件重新渲染

### 数据库优化
- 使用异步操作（async/await）
- DbContext Factory 避免作用域问题
- LINQ 查询优化

### SignalR 优化
- 调整 Circuit 超时时间
- 配置重连策略
- 限制并发连接数

## 浏览器兼容性

支持所有现代浏览器：
- Chrome/Edge (推荐)
- Firefox
- Safari
- Opera

要求支持 WebSocket。

## 与 Blazor WebAssembly 对比

| 特性 | Blazor Server | Blazor WebAssembly |
|------|--------------|-------------------|
| 运行位置 | 服务器 | 客户端浏览器 |
| 首次加载 | 快速 | 较慢（需下载 .NET 运行时） |
| 离线支持 | 无 | 可支持 |
| SEO 友好 | 是（服务端预渲染） | 需特殊处理 |
| 服务器资源 | 较高（每个用户一个 Circuit） | 低（仅 API 调用） |
| 延迟 | 依赖网络 | 低（本地执行） |
| 安全性 | 高（代码在服务器） | 低（代码可被检查） |

## License

MIT
