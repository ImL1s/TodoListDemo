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

3. **运行应用**
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

## 🚦 生产环境配置

在生产环境中，建议：

1. 使用环境变量配置端口和数据库
2. 启用 HTTPS
3. 配置适当的 CORS 策略
4. 使用 PostgreSQL 或 MySQL 替代 SQLite
5. 添加认证和授权中间件

## 📄 许可证

MIT License
