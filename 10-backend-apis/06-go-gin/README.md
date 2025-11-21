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

## 📄 许可证

MIT License
