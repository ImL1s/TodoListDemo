# FastAPI TodoList API

A high-performance RESTful API for managing todos built with **FastAPI**, featuring automatic OpenAPI documentation and type safety.

## 🚀 技术栈

- **Python**: 3.10+
- **Framework**: FastAPI 0.109
- **ASGI Server**: Uvicorn
- **ORM**: SQLAlchemy 2.0
- **Validation**: Pydantic v2
- **Database**: SQLite (development)

## 📋 功能特性

- ✅ **完整 CRUD API**: 创建、读取、更新、删除 todos
- ✅ **自动文档**: Swagger UI & ReDoc (开箱即用)
- ✅ **类型安全**: 完整的 type hints 和 Pydantic 验证
- ✅ **高性能**: 基于 ASGI 的异步框架
- ✅ **数据验证**: Pydantic schemas 自动验证和序列化
- ✅ **CORS 支持**: 跨域请求配置
- ✅ **依赖注入**: FastAPI 的依赖注入系统
- ✅ **SQLAlchemy ORM**: 强大的数据库抽象层

## 📁 项目结构

```
03-fastapi/
├── app/
│   ├── __init__.py
│   ├── main.py                  # FastAPI 应用 + 路由定义
│   ├── models.py                # SQLAlchemy 模型
│   ├── schemas.py               # Pydantic schemas (验证)
│   ├── database.py              # 数据库连接和会话
│   └── crud.py                  # CRUD 操作逻辑
├── requirements.txt             # Python 依赖
├── .gitignore
└── README.md
```

## 🔧 安装步骤

### 1. 创建虚拟环境

```bash
# Linux/macOS
python3 -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
venv\Scripts\activate
```

### 2. 安装依赖

```bash
pip install -r requirements.txt
```

### 3. 启动开发服务器

```bash
# 标准启动
uvicorn app.main:app --reload

# 指定端口和主机
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**启动参数说明**:
- `app.main:app` - 模块路径:FastAPI实例名
- `--reload` - 代码变更自动重载（仅开发环境）
- `--host` - 监听地址
- `--port` - 端口号

服务器将运行在: `http://localhost:8000`

## 📡 API 端点

### 基础 CRUD

| 方法 | 端点 | 描述 | 响应 |
|------|------|------|------|
| `GET` | `/todos` | 获取所有 todos | `TodosResponse` |
| `POST` | `/todos` | 创建新 todo | `TodoResponse` |
| `GET` | `/todos/{id}` | 获取单个 todo | `TodoResponse` |
| `PUT` | `/todos/{id}` | 更新 todo | `TodoResponse` |
| `DELETE` | `/todos/{id}` | 删除 todo | `204 No Content` |

### 自定义操作

| 方法 | 端点 | 描述 |
|------|------|------|
| `POST` | `/todos/{id}/toggle` | 切换完成状态 |
| `DELETE` | `/todos/completed/clear` | 删除所有已完成 |

### 系统端点

- **API Root**: `GET /` - API 信息
- **Health Check**: `GET /health` - 健康检查
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`
- **OpenAPI Schema**: `http://localhost:8000/openapi.json`

## 📊 查询参数

### GET `/todos` 支持的参数:

```
skip: int = 0          # 跳过记录数（分页）
limit: int = 100       # 返回最大记录数（1-1000）
completed: bool = None # 过滤完成状态（true/false/null）
```

**示例**:
```bash
# 获取前 10 条
GET /todos?limit=10

# 获取已完成的 todos
GET /todos?completed=true

# 分页：跳过前 20 条，获取 10 条
GET /todos?skip=20&limit=10
```

## 🧪 API 测试示例

### 使用 curl

```bash
# 获取所有 todos
curl http://localhost:8000/todos

# 创建新 todo
curl -X POST http://localhost:8000/todos \
  -H "Content-Type: application/json" \
  -d '{"text": "Learn FastAPI", "completed": false}'

# 获取单个 todo
curl http://localhost:8000/todos/1

# 更新 todo
curl -X PUT http://localhost:8000/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# 部分更新（只更新文本）
curl -X PUT http://localhost:8000/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"text": "Learn FastAPI and SQLAlchemy"}'

# 切换完成状态
curl -X POST http://localhost:8000/todos/1/toggle

# 删除 todo
curl -X DELETE http://localhost:8000/todos/1

# 清除已完成的 todos
curl -X DELETE http://localhost:8000/todos/completed/clear

# 过滤已完成的 todos
curl "http://localhost:8000/todos?completed=true"

# 分页
curl "http://localhost:8000/todos?skip=0&limit=10"
```

### 使用 HTTPie

```bash
# 获取所有 todos
http :8000/todos

# 创建新 todo
http POST :8000/todos text="Learn FastAPI" completed=false

# 更新 todo
http PUT :8000/todos/1 completed=true

# 切换状态
http POST :8000/todos/1/toggle

# 删除已完成
http DELETE :8000/todos/completed/clear

# 过滤和分页
http :8000/todos completed==true limit==10
```

### 使用 Python requests

```python
import requests

BASE_URL = "http://localhost:8000"

# 创建 todo
response = requests.post(
    f"{BASE_URL}/todos",
    json={"text": "Learn FastAPI", "completed": false}
)
todo = response.json()
print(f"Created: {todo}")

# 获取所有 todos
response = requests.get(f"{BASE_URL}/todos")
data = response.json()
print(f"Total: {data['total']}, Todos: {data['todos']}")

# 更新 todo
response = requests.put(
    f"{BASE_URL}/todos/{todo['id']}",
    json={"completed": True}
)
updated_todo = response.json()
print(f"Updated: {updated_todo}")
```

## 📊 数据模型

### TodoResponse Schema

```json
{
  "id": 1,
  "text": "Learn FastAPI",
  "completed": false,
  "created_at": "2025-11-20T10:30:00.123456Z"
}
```

### TodosResponse Schema

```json
{
  "todos": [
    {
      "id": 1,
      "text": "Learn FastAPI",
      "completed": false,
      "created_at": "2025-11-20T10:30:00.123456Z"
    }
  ],
  "total": 1
}
```

### TodoCreate Schema

```json
{
  "text": "Learn FastAPI",
  "completed": false  // optional, default: false
}
```

### TodoUpdate Schema

```json
{
  "text": "Updated text",     // optional
  "completed": true            // optional
}
```

## 🎯 FastAPI 特色功能

### 1. 自动 API 文档

访问 `http://localhost:8000/docs` 获得:
- 交互式 Swagger UI
- 直接测试 API
- 自动生成的 request/response 示例

访问 `http://localhost:8000/redoc` 获得:
- 优雅的文档界面
- 更好的可读性

### 2. Type Hints 和数据验证

```python
# Pydantic 自动验证
class TodoCreate(BaseModel):
    text: str = Field(..., min_length=1, max_length=500)
    completed: bool = False

    @field_validator('text')
    @classmethod
    def validate_text(cls, v: str) -> str:
        if not v.strip():
            raise ValueError('Text cannot be empty')
        return v.strip()
```

### 3. 依赖注入

```python
# 数据库会话自动注入和清理
@app.get("/todos")
async def get_todos(db: Session = Depends(get_db)):
    return crud.get_todos(db)
```

### 4. 异步支持

FastAPI 原生支持异步操作，可轻松集成异步数据库驱动:
```python
async def get_todos(db: AsyncSession = Depends(get_db)):
    # 异步数据库操作
    pass
```

### 5. 错误处理

自动生成标准 HTTP 错误响应:
```python
raise HTTPException(
    status_code=404,
    detail="Todo not found"
)
```

## 📈 性能优化

### 1. 使用异步数据库

安装异步驱动:
```bash
pip install databases[asyncpg]  # PostgreSQL
pip install databases[aiosqlite]  # SQLite
```

### 2. 启用生产服务器

```bash
# 使用 Gunicorn + Uvicorn workers
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### 3. 数据库连接池

在 `database.py` 中配置:
```python
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_size=10,
    max_overflow=20
)
```

## 🔒 安全配置

### 生产环境配置:

1. **CORS 配置**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
```

2. **环境变量**
```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    secret_key: str

    class Config:
        env_file = ".env"
```

3. **HTTPS Only**
```python
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
app.add_middleware(HTTPSRedirectMiddleware)
```

## 🧪 测试

创建 `tests/test_main.py`:
```python
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_todo():
    response = client.post(
        "/todos",
        json={"text": "Test todo", "completed": false}
    )
    assert response.status_code == 201
    assert response.json()["text"] == "Test todo"
```

运行测试:
```bash
pip install pytest
pytest
```

## 📚 学习资源

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy 2.0 Documentation](https://docs.sqlalchemy.org/)
- [Pydantic Documentation](https://docs.pydantic.dev/)
- [Uvicorn Documentation](https://www.uvicorn.org/)

## 🚀 部署

### Docker 部署

创建 `Dockerfile`:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

构建和运行:
```bash
docker build -t fastapi-todo .
docker run -p 8000:8000 fastapi-todo
```

## 📝 许可证

MIT License
