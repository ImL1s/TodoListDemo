# Go + Gin TodoList API

A RESTful API for managing todos built with Go and the Gin web framework.

## 🛠 技术栈

- **Go** 1.21+
- **Gin** - Web Framework
- **GORM** - ORM Library
- **SQLite** - Database
- **gin-contrib/cors** - CORS Middleware

## 📋 功能特性

- RESTful API 设计
- GORM ORM 操作
- JSON 响应格式
- CORS 支持
- 错误处理中间件
- 数据验证

## 📦 安装步骤

1. **克隆项目** (如果还未克隆)
   ```bash
   cd 10-backend-apis/06-go-gin
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
  -d '{"text":"学习 Go 语言","completed":false}'
```

### 获取单个 Todo
```bash
curl http://localhost:8080/api/todos/1
```

### 更新 Todo
```bash
curl -X PUT http://localhost:8080/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"text":"学习 Gin 框架","completed":true}'
```

### 删除 Todo
```bash
curl -X DELETE http://localhost:8080/api/todos/1
```

## 📁 项目结构

```
06-go-gin/
├── main.go              # 应用入口
├── models/
│   └── todo.go         # Todo 结构体定义
├── handlers/
│   └── todo_handler.go # HTTP 处理函数
├── database/
│   └── database.go     # 数据库连接
├── logger/
│   ├── logger.go       # 日志初始化和配置
│   └── middleware.go   # 日志中间件
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

## 🛡 错误处理

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

- **gin-gonic/gin** - 高性能的 HTTP web 框架
- **gorm.io/gorm** - 强大的 ORM 库
- **gorm.io/driver/sqlite** - SQLite 数据库驱动
- **gin-contrib/cors** - CORS 中间件

## 🔥 构建生产版本

```bash
# 构建可执行文件
go build -o todolist-gin main.go

# 运行可执行文件
./todolist-gin
```

## 🧪 测试

本项目包含完整的单元测试和集成测试，覆盖所有 API 端点和业务逻辑。

### 运行所有测试

```bash
go test ./... -v
```

### 运行特定包的测试

```bash
# 测试 models 包
go test ./models -v

# 测试 handlers 包
go test ./handlers -v

# 测试集成测试
go test -v -run TestIntegration
```

### 查看测试覆盖率

```bash
# 生成覆盖率报告
go test ./... -coverprofile=coverage.out

# 查看覆盖率
go tool cover -func=coverage.out

# 在浏览器中查看详细覆盖率
go tool cover -html=coverage.out
```

### 运行特定测试

```bash
# 运行单个测试
go test ./handlers -v -run TestGetTodos

# 运行匹配模式的测试
go test ./... -v -run TestCreate
```

### 测试覆盖范围

- **模型测试** (`models/todo_test.go`)
  - Todo 结构体创建和验证
  - CreateTodoInput 验证
  - UpdateTodoInput 验证
  - 空值处理

- **处理器测试** (`handlers/todo_handler_test.go`)
  - 获取所有 todos (成功和空列表)
  - 获取单个 todo (成功和 404)
  - 创建 todo (成功、验证错误、无效 JSON)
  - 更新 todo (完整更新、部分更新、404)
  - 删除 todo (成功、404、无效 ID)

- **集成测试** (`main_test.go`)
  - 完整的 CRUD 操作流程
  - 多个操作的组合测试
  - 错误处理 (400, 404)
  - 边界条件测试 (空文本、超长文本)
  - 并发操作测试

### 测试数据库

所有测试使用内存数据库 (`:memory:`)，确保：
- 测试相互隔离
- 测试可重复执行
- 不影响开发数据库

### 持续集成

测试可以集成到 CI/CD 流程中：

```bash
# 在 CI 环境中运行
go test ./... -v -race -coverprofile=coverage.out
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
| `GIN_MODE` | `debug` | Gin 模式 |

### 生产环境部署建议

1. **使用 HTTPS**
   ```bash
   # 使用 Nginx 或其他反向代理配置 SSL/TLS
   ```

2. **设置环境变量**
   ```bash
   export ENV=production
   export GIN_MODE=release
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

## 📊 日志和监控

本项目集成了结构化日志系统和性能监控，使用 Uber 的 Zap 日志库。

### 日志级别

支持以下日志级别：

- **ERROR**: 错误和异常
- **WARN**: 警告（如验证失败、未找到资源）
- **INFO**: 重要操作（CRUD 操作、服务器启动）
- **DEBUG**: 详细调试信息（健康检查）

### 配置日志级别

通过环境变量 `LOG_LEVEL` 设置日志级别：

```bash
# 开发环境 - 显示所有日志
export LOG_LEVEL=debug
go run main.go

# 生产环境 - 仅显示重要日志
export LOG_LEVEL=info
go run main.go
```

### 日志格式

日志使用 JSON 格式输出，便于日志聚合和分析：

```json
{
  "level": "info",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "message": "Todo created",
  "id": 123,
  "text": "Learn Go",
  "duration": 45000000
}
```

### 记录的操作

#### CRUD 操作日志

每个 CRUD 操作都会记录详细信息：

```json
// 创建 Todo
{
  "level": "info",
  "message": "Todo created",
  "id": 1,
  "text": "Learn Gin",
  "duration": "45ms"
}

// 更新 Todo
{
  "level": "info",
  "message": "Todo updated",
  "id": 1,
  "updates": {"completed": true},
  "duration": "23ms"
}
```

#### HTTP 请求日志

所有 HTTP 请求自动记录：

```json
{
  "level": "info",
  "message": "Request completed",
  "method": "POST",
  "path": "/api/todos",
  "status": 201,
  "duration": "50ms",
  "ip": "127.0.0.1",
  "user_agent": "curl/7.68.0"
}
```

#### 错误日志

错误包含详细的上下文信息：

```json
{
  "level": "error",
  "message": "Failed to create todo",
  "error": "database connection lost",
  "text": "Learn Go",
  "path": "/api/todos"
}
```

### 性能监控

#### 慢操作检测

自动检测和记录超过 100ms 的操作：

```json
{
  "level": "warn",
  "message": "Slow operation detected",
  "operation": "create_todo",
  "duration": "156ms"
}
```

#### 操作性能追踪

每个 CRUD 操作都记录执行时间：
- 获取所有 todos
- 获取单个 todo
- 创建 todo
- 更新 todo
- 删除 todo

### 健康检查日志

健康检查端点记录系统状态：

```bash
curl http://localhost:8080/health
```

日志输出：
```json
{
  "level": "debug",
  "message": "Health check",
  "database": "ok",
  "version": "1.0.0"
}
```

### 启动日志

服务器启动时记录配置信息：

```json
{
  "level": "info",
  "message": "Starting Todo List API",
  "version": "1.0.0",
  "environment": "development"
}
{
  "level": "info",
  "message": "Server configuration",
  "address": "0.0.0.0:8080",
  "cors_allowed_origins": ["http://localhost:3000"],
  "rate_limit_max": 100,
  "rate_limit_window_minutes": 1
}
```

### 日志最佳实践

1. **生产环境使用 INFO 级别**
   ```bash
   export LOG_LEVEL=info
   ```

2. **日志聚合**
   - 使用 ELK Stack (Elasticsearch, Logstash, Kibana)
   - 或使用 Loki + Grafana
   - 或使用云服务 (CloudWatch, Stackdriver)

3. **日志轮转**
   - 使用 logrotate 或类似工具管理日志文件
   - 配置最大文件大小和保留天数

4. **监控告警**
   - 监控 ERROR 级别日志数量
   - 设置慢操作告警阈值
   - 监控 4xx/5xx 错误率

### 环境变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `LOG_LEVEL` | `info` | 日志级别 (debug, info, warn, error) |

## 📄 许可证

MIT License
