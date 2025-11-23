# Go + Echo TodoList API

A RESTful API for managing todos built with Go and the Echo web framework.

## 🛠 技术栈

- **Go** 1.21+
- **Echo** v4 - High performance web framework
- **GORM** - ORM Library
- **SQLite** - Database
- **go-playground/validator** - Request validation

## 📋 功能特性

- RESTful API 设计
- Echo 框架特性（中间件、错误处理）
- GORM 集成
- 请求验证
- 日志记录
- 优雅关闭
- CORS 支持

## 📦 安装步骤

1. **克隆项目** (如果还未克隆)
   ```bash
   cd 10-backend-apis/07-go-echo
   ```

2. **安装依赖**
   ```bash
   go mod download
   ```

3. **配置环境变量** (可选)
   ```bash
   cp .env.example .env
   # 编辑 .env 文件，配置你的环境变量
   ```

4. **运行应用**
   ```bash
   go run main.go
   ```

   服务器将在 `http://localhost:8080` 启动

## 🚀 API 端点

| 方法   | 端点              | 描述           |
|--------|-------------------|----------------|
| GET    | `/api/todos`      | 获取所有 todos |
| GET    | `/api/todos/:id`  | 获取单个 todo  |
| POST   | `/api/todos`      | 创建新 todo    |
| PUT    | `/api/todos/:id`  | 更新 todo      |
| DELETE | `/api/todos/:id`  | 删除 todo      |
| GET    | `/health`         | 健康检查       |

## 📝 API 使用示例

### 获取所有 Todos
```bash
curl http://localhost:8080/api/todos
```

### 创建新 Todo
```bash
curl -X POST http://localhost:8080/api/todos \
  -H "Content-Type: application/json" \
  -d '{"text":"学习 Echo 框架","completed":false}'
```

### 获取单个 Todo
```bash
curl http://localhost:8080/api/todos/1
```

### 更新 Todo
```bash
curl -X PUT http://localhost:8080/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"text":"精通 Echo 框架","completed":true}'
```

### 删除 Todo
```bash
curl -X DELETE http://localhost:8080/api/todos/1
```

### 健康检查
```bash
curl http://localhost:8080/health
```

## 📁 项目结构

```
07-go-echo/
├── main.go              # 应用入口，服务器配置
├── models/
│   └── todo.go         # Todo 结构体定义
├── handlers/
│   └── todo_handler.go # HTTP 处理函数
├── database/
│   └── database.go     # 数据库连接
├── go.mod              # Go modules
├── go.sum              # 依赖锁定文件
├── .gitignore
└── README.md
```

## 🔧 数据模型

### Todo
```go
type Todo struct {
    ID        uint      `json:"id"`
    Text      string    `json:"text"`
    Completed bool      `json:"completed"`
    CreatedAt time.Time `json:"createdAt"`
    UpdatedAt time.Time `json:"updatedAt"`
}
```

## 🛡 中间件

Echo 提供了强大的中间件支持：

- **Logger** - 记录所有请求
- **Recover** - 从 panic 中恢复
- **CORS** - 跨域资源共享

## 🔥 Echo 特性

### 1. 优雅关闭
应用支持优雅关闭，确保所有请求处理完成后再停止服务器。使用 `Ctrl+C` 发送中断信号。

### 2. 请求验证
使用 `go-playground/validator` 进行请求验证：

```go
type CreateTodoInput struct {
    Text      string `json:"text" validate:"required"`
    Completed bool   `json:"completed"`
}
```

### 3. 错误处理
Echo 提供了统一的错误处理机制，所有 handler 返回 `error` 类型。

## 📊 错误响应

API 返回标准的 HTTP 状态码：

- `200 OK` - 请求成功
- `201 Created` - 资源创建成功
- `400 Bad Request` - 请求参数错误
- `404 Not Found` - 资源不存在
- `500 Internal Server Error` - 服务器错误

错误响应格式：
```json
{
  "error": "错误描述信息"
}
```

## 📚 依赖说明

- **labstack/echo/v4** - 高性能、极简的 Go web 框架
- **gorm.io/gorm** - 功能完善的 ORM 库
- **gorm.io/driver/sqlite** - SQLite 数据库驱动
- **go-playground/validator** - 强大的数据验证库

## 🏗 构建生产版本

```bash
# 构建可执行文件
go build -o todolist-echo main.go

# 运行可执行文件
./todolist-echo
```

## 🛡 安全配置

本项目已实施多层安全措施以保护 API：

### CORS 配置

默认情况下，CORS 仅允许 `http://localhost:3000` 访问。生产环境需要配置允许的域名：

```bash
# .env 文件
ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com
```

**注意**：
- 多个域名使用逗号分隔
- 切勿在生产环境使用 `*` 允许所有域名
- 建议只添加必要的域名

### 速率限制

API 默认限制每个 IP 每分钟最多 100 次请求，防止滥用和 DoS 攻击：

```bash
# .env 文件
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MINUTES=1
```

速率限制超出后，API 将返回 `429 Too Many Requests` 状态码。

### 输入验证

所有输入都经过严格验证：
- Todo 文本长度：1-500 字符
- ID 必须是正整数
- 自动转义 HTML 特殊字符，防止 XSS 攻击

### 安全响应头

自动添加以下安全响应头：
- `X-Content-Type-Options: nosniff` - 防止 MIME 类型嗅探
- `X-Frame-Options: DENY` - 防止点击劫持
- `X-XSS-Protection: 1; mode=block` - 启用 XSS 过滤
- `Strict-Transport-Security` - 强制 HTTPS（生产环境）

### 环境变量

所有敏感配置通过环境变量管理，支持的环境变量：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `PORT` | `8080` | 服务器端口 |
| `HOST` | `0.0.0.0` | 监听地址 |
| `DATABASE_URL` | `todos.db` | 数据库文件路径 |
| `ALLOWED_ORIGINS` | `http://localhost:3000` | CORS 允许的域名 |
| `RATE_LIMIT_MAX` | `100` | 速率限制最大请求数 |
| `RATE_LIMIT_WINDOW_MINUTES` | `1` | 速率限制时间窗口（分钟） |
| `ENV` | `development` | 运行环境 |

### 生产环境部署建议

1. **使用 HTTPS**
   ```bash
   # 使用 Nginx 或其他反向代理配置 SSL/TLS
   ```

2. **设置环境变量**
   ```bash
   export ENV=production
   export ALLOWED_ORIGINS=https://yourdomain.com
   ```

3. **数据库**
   - 生产环境建议使用 PostgreSQL 或 MySQL
   - 定期备份数据库
   - 使用数据库连接池

4. **日志管理**
   - 配置日志轮转
   - 监控错误日志
   - 不在日志中记录敏感信息

5. **定期更新**
   ```bash
   go get -u ./...
   go mod tidy
   ```

## 📄 许可证

MIT License

## 📊 日志和监控

本项目集成了结构化日志系统和性能监控，使用 Uber 的 Zap 日志库。

### 日志级别

- **ERROR**: 错误和异常
- **WARN**: 警告（如验证失败、未找到资源）
- **INFO**: 重要操作（CRUD 操作、服务器启动）
- **DEBUG**: 详细调试信息（健康检查）

### 配置日志级别

```bash
export LOG_LEVEL=info
go run main.go
```

### 日志格式

日志使用 JSON 格式输出：

```json
{
  "level": "info",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "message": "Todo created",
  "id": 123,
  "duration": "45ms"
}
```

### 性能监控

- 自动记录所有 HTTP 请求的响应时间
- 检测并警告超过 100ms 的慢操作
- 记录每个 CRUD 操作的执行时间

### 环境变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `LOG_LEVEL` | `info` | 日志级别 (debug, info, warn, error) |
