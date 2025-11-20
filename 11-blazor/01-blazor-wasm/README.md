# Blazor WebAssembly - TodoList

A fully client-side TodoList application built with Blazor WebAssembly and .NET 8, featuring LocalStorage persistence.

## 技术栈

- **.NET 8** - Modern cross-platform framework
- **Blazor WebAssembly** - Client-side C# in the browser
- **Blazored.LocalStorage** - Browser LocalStorage API wrapper
- **Component-based Architecture** - Reusable Razor components
- **CSS3** - Modern styling with animations

## 前置要求

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)

## 项目结构

```
01-blazor-wasm/
├── Pages/
│   └── TodoList.razor          # Main todo list page
├── Components/
│   ├── TodoItem.razor          # Individual todo item component
│   └── TodoInput.razor         # Todo input component
├── Models/
│   └── Todo.cs                 # Todo data model
├── Services/
│   └── TodoService.cs          # State management & LocalStorage
├── wwwroot/
│   ├── index.html              # HTML host
│   └── css/
│       └── app.css             # Application styles
├── Program.cs                  # Application entry point
├── App.razor                   # Root component
├── MainLayout.razor            # Layout component
├── _Imports.razor              # Global using statements
├── TodoBlazorWasm.csproj       # Project configuration
└── README.md
```

## 核心特性

### 组件化架构
- **TodoList.razor** - 主页面，协调所有组件
- **TodoItem.razor** - 可重用的单个 Todo 项组件
- **TodoInput.razor** - 输入组件，处理新 Todo 创建

### 数据绑定
- `@bind` 双向数据绑定
- `@bind:event` 自定义绑定事件
- 实时 UI 更新

### 事件处理
- `EventCallback<T>` 用于组件通信
- 键盘事件处理（Enter 提交，Escape 取消）
- 双击编辑功能

### 状态管理
- 集中式 TodoService
- 事件驱动的状态更新
- 跨组件状态同步

### 数据持久化
- LocalStorage 自动保存
- 页面刷新后数据保留
- 完全离线工作

### 用户体验
- 过滤功能（全部/活动/已完成）
- 内联编辑
- 平滑动画和过渡效果
- 响应式设计

## 快速开始

### 1. 安装依赖

```bash
cd 11-blazor/01-blazor-wasm
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

## 组件通信

### EventCallback 模式

```razor
<!-- Parent Component -->
<TodoInput OnAdd="HandleAdd" />

@code {
    private async Task HandleAdd(string text)
    {
        // Handle the event
    }
}

<!-- Child Component -->
@code {
    [Parameter]
    public EventCallback<string> OnAdd { get; set; }

    private async Task Submit()
    {
        await OnAdd.InvokeAsync(inputValue);
    }
}
```

## 数据持久化

数据通过 Blazored.LocalStorage 保存在浏览器的 LocalStorage 中：

```csharp
// Save
await _localStorage.SetItemAsync("todos", _todos);

// Load
var todos = await _localStorage.GetItemAsync<List<Todo>>("todos");
```

## 生产部署

### 发布应用

```bash
dotnet publish -c Release -o ./publish
```

发布后的文件位于 `./publish/wwwroot/` 目录，可以部署到任何静态网站托管服务：

- **GitHub Pages**
- **Netlify**
- **Vercel**
- **Azure Static Web Apps**
- **AWS S3 + CloudFront**

### 部署示例（静态托管）

发布的应用是纯静态文件，只需将 `wwwroot` 目录内容上传到 Web 服务器即可。

## 浏览器兼容性

支持所有现代浏览器：
- Chrome/Edge (推荐)
- Firefox
- Safari
- Opera

要求支持 WebAssembly。

## 性能优化

- 使用 `@key` 指令优化列表渲染
- 组件按需更新（不是整个页面）
- AOT 编译可进一步减少包大小（需要额外配置）

## License

MIT
