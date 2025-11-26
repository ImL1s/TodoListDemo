# ASP.NET Core Web API - TodoList

A complete RESTful API built with ASP.NET Core 8, Entity Framework Core, and SQLite.

## 技术栈

- **.NET 8** - Modern cross-platform framework
- **ASP.NET Core Web API** - RESTful API framework
- **Entity Framework Core** - Code-First ORM
- **SQLite** - Lightweight database
- **Swagger/OpenAPI** - API documentation
- **CORS** - Cross-origin resource sharing

## 前置要求

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)

## 项目结构

```
05-aspnet-core-api/
├── Controllers/
│   └── TodosController.cs      # REST API endpoints
├── Models/
│   └── Todo.cs                 # Todo entity model
├── Data/
│   └── TodoContext.cs          # EF Core DbContext
├── Program.cs                  # Application entry point
├── TodoApi.csproj              # Project configuration
├── appsettings.json            # App settings
└── README.md
```

## API 端点

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/todos` | 获取所有 Todo 项 |
| GET | `/api/todos/{id}` | 获取指定 ID 的 Todo |
| POST | `/api/todos` | 创建新 Todo |
| PUT | `/api/todos/{id}` | 更新指定 Todo |
| DELETE | `/api/todos/{id}` | 删除指定 Todo |

## 快速开始

### 1. 安装依赖

```bash
cd 10-backend-apis/05-aspnet-core-api
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

### 4. 访问应用

- **API 基础地址**: `https://localhost:5001` 或 `http://localhost:5000`
- **Swagger UI**: `https://localhost:5001/swagger`
- **OpenAPI 规范**: `https://localhost:5001/swagger/v1/swagger.json`

## 使用示例

### 获取所有 Todos

```bash
curl -X GET https://localhost:5001/api/todos
```

### 创建新 Todo

```bash
curl -X POST https://localhost:5001/api/todos \
  -H "Content-Type: application/json" \
  -d '{"text": "Learn ASP.NET Core", "isCompleted": false}'
```

### 更新 Todo

```bash
curl -X PUT https://localhost:5001/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"id": 1, "text": "Learn ASP.NET Core", "isCompleted": true}'
```

### 删除 Todo

```bash
curl -X DELETE https://localhost:5001/api/todos/1
```

## 核心特性

### 依赖注入
- DbContext 通过 DI 容器注入
- ILogger 用于结构化日志记录

### 异步操作
- 所有数据库操作使用 async/await
- 提升并发性能和可扩展性

### Entity Framework Core
- Code-First 方式定义模型
- 自动数据库迁移和种子数据
- LINQ 查询优化

### Swagger/OpenAPI
- 自动生成 API 文档
- 交互式 API 测试界面
- XML 注释支持

### CORS 配置
- 允许跨域请求
- 支持前端应用集成

## 数据模型

```csharp
public class Todo
{
    public int Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public bool IsCompleted { get; set; }
    public DateTime CreatedAt { get; set; }
}
```

## 开发命令

```bash
# 恢复依赖
dotnet restore

# 构建项目
dotnet build

# 运行项目（开发模式）
dotnet run

# 运行项目（生产模式）
dotnet run --configuration Release

# 监视模式（自动重载）
dotnet watch run
```

## 生产部署

### 发布应用

```bash
dotnet publish -c Release -o ./publish
```

### 运行已发布的应用

```bash
cd publish
dotnet TodoApi.dll
```

## 环境变量

可通过环境变量覆盖配置：

```bash
export ASPNETCORE_URLS="http://localhost:8080"
export ConnectionStrings__DefaultConnection="Data Source=production.db"
dotnet run
```

## License

MIT
