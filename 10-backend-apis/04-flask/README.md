# Flask TodoList API

A lightweight RESTful API for managing todos built with **Flask**, featuring clean architecture and Blueprint organization.

## 🚀 技术栈

- **Python**: 3.10+
- **Framework**: Flask 3.0
- **ORM**: Flask-SQLAlchemy 3.1
- **CORS**: Flask-CORS 4.0
- **Database**: SQLite (development)

## 📋 功能特性

- ✅ **完整 CRUD API**: 创建、读取、更新、删除 todos
- ✅ **Application Factory**: 灵活的应用工厂模式
- ✅ **Blueprint 组织**: 模块化路由管理
- ✅ **Flask-SQLAlchemy**: 简洁的 ORM 集成
- ✅ **CORS 支持**: 跨域请求配置
- ✅ **数据验证**: 完善的输入验证
- ✅ **JSON 序列化**: 自动 JSON 响应
- ✅ **错误处理**: 友好的错误消息

## 📁 项目结构

```
04-flask/
├── app/
│   ├── __init__.py              # Application factory
│   ├── models.py                # Todo 模型 + JSON 序列化
│   ├── routes.py                # Blueprint 路由
│   └── database.py              # SQLAlchemy 初始化
├── run.py                       # 应用启动入口
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
# 方式 1: 使用 run.py
python run.py

# 方式 2: 使用 Flask CLI
export FLASK_APP=run.py       # Linux/macOS
set FLASK_APP=run.py          # Windows
flask run

# 方式 3: 指定主机和端口
python run.py --host 0.0.0.0 --port 5000
```

服务器将运行在: `http://localhost:5000`

## 📡 API 端点

### 基础 CRUD

| 方法 | 端点 | 描述 | 响应状态 |
|------|------|------|----------|
| `GET` | `/api/todos` | 获取所有 todos | 200 |
| `POST` | `/api/todos` | 创建新 todo | 201 |
| `GET` | `/api/todos/<id>` | 获取单个 todo | 200 |
| `PUT` | `/api/todos/<id>` | 更新 todo | 200 |
| `DELETE` | `/api/todos/<id>` | 删除 todo | 204 |

### 自定义操作

| 方法 | 端点 | 描述 |
|------|------|------|
| `POST` | `/api/todos/<id>/toggle` | 切换完成状态 |
| `DELETE` | `/api/todos/completed` | 删除所有已完成 |

### 系统端点

- **API Root**: `GET /` - API 信息
- **Health Check**: `GET /health` - 健康检查

## 📊 查询参数

### GET `/api/todos` 支持的参数:

```
completed: bool = None # 过滤完成状态（true/false）
skip: int = 0          # 跳过记录数（分页）
limit: int = 100       # 返回最大记录数
```

**示例**:
```bash
# 获取前 10 条
GET /api/todos?limit=10

# 获取已完成的 todos
GET /api/todos?completed=true

# 分页：跳过前 20 条，获取 10 条
GET /api/todos?skip=20&limit=10
```

## 🧪 API 测试示例

### 使用 curl

```bash
# 获取所有 todos
curl http://localhost:5000/api/todos

# 创建新 todo
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"text": "Learn Flask", "completed": false}'

# 获取单个 todo
curl http://localhost:5000/api/todos/1

# 更新 todo
curl -X PUT http://localhost:5000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# 部分更新（只更新文本）
curl -X PUT http://localhost:5000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"text": "Learn Flask and SQLAlchemy"}'

# 切换完成状态
curl -X POST http://localhost:5000/api/todos/1/toggle

# 删除 todo
curl -X DELETE http://localhost:5000/api/todos/1

# 清除已完成的 todos
curl -X DELETE http://localhost:5000/api/todos/completed

# 过滤已完成的 todos
curl "http://localhost:5000/api/todos?completed=true"

# 分页
curl "http://localhost:5000/api/todos?skip=0&limit=10"
```

### 使用 HTTPie

```bash
# 获取所有 todos
http :5000/api/todos

# 创建新 todo
http POST :5000/api/todos text="Learn Flask" completed=false

# 更新 todo
http PUT :5000/api/todos/1 completed=true

# 切换状态
http POST :5000/api/todos/1/toggle

# 删除已完成
http DELETE :5000/api/todos/completed

# 过滤和分页
http :5000/api/todos completed==true limit==10
```

### 使用 Python requests

```python
import requests

BASE_URL = "http://localhost:5000/api"

# 创建 todo
response = requests.post(
    f"{BASE_URL}/todos",
    json={"text": "Learn Flask", "completed": False}
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

# 切换状态
response = requests.post(f"{BASE_URL}/todos/{todo['id']}/toggle")
toggled_todo = response.json()
print(f"Toggled: {toggled_todo}")
```

## 📊 数据模型

### Todo Response

```json
{
  "id": 1,
  "text": "Learn Flask",
  "completed": false,
  "created_at": "2025-11-20T10:30:00.123456"
}
```

### Todos List Response

```json
{
  "todos": [
    {
      "id": 1,
      "text": "Learn Flask",
      "completed": false,
      "created_at": "2025-11-20T10:30:00.123456"
    }
  ],
  "total": 1
}
```

### Create/Update Request

```json
{
  "text": "Learn Flask",
  "completed": false  // optional for create, both optional for update
}
```

### Error Response

```json
{
  "error": "Todo with id 999 not found"
}
```

## 🎯 Flask 特色功能

### 1. Application Factory 模式

使用工厂函数创建应用实例，便于测试和配置:

```python
# app/__init__.py
def create_app(config=None):
    app = Flask(__name__)
    # Configure app
    # Initialize extensions
    # Register blueprints
    return app
```

**优点**:
- 灵活的配置管理
- 便于单元测试
- 支持多实例

### 2. Blueprint 组织

使用 Blueprint 模块化路由:

```python
# app/routes.py
todos_bp = Blueprint('todos', __name__)

@todos_bp.route('/todos', methods=['GET'])
def get_todos():
    pass
```

**优点**:
- 代码组织清晰
- 易于维护和扩展
- URL 前缀管理

### 3. JSON 序列化

模型内置 `to_dict()` 方法:

```python
class Todo(db.Model):
    def to_dict(self):
        return {
            'id': self.id,
            'text': self.text,
            'completed': self.completed,
            'created_at': self.created_at.isoformat()
        }
```

### 4. 数据验证

自定义验证函数:

```python
def validate_todo_data(data, required=True):
    # Validate text, completed fields
    return is_valid, error_message
```

## 🔧 配置管理

### 环境变量配置

创建 `config.py`:

```python
import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL',
        'sqlite:///todos.db'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False
```

使用配置:

```python
from config import DevelopmentConfig

app = create_app()
app.config.from_object(DevelopmentConfig)
```

## 📈 扩展功能

### 1. 添加认证

```bash
pip install Flask-JWT-Extended
```

```python
from flask_jwt_extended import JWTManager, jwt_required

jwt = JWTManager(app)

@todos_bp.route('/todos', methods=['POST'])
@jwt_required()
def create_todo():
    # Only authenticated users can create
    pass
```

### 2. API 文档

```bash
pip install flask-swagger-ui
```

### 3. 数据库迁移

```bash
pip install Flask-Migrate
```

```python
from flask_migrate import Migrate

migrate = Migrate(app, db)
```

```bash
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

### 4. 添加限流

```bash
pip install Flask-Limiter
```

```python
from flask_limiter import Limiter

limiter = Limiter(app, key_func=lambda: request.remote_addr)

@todos_bp.route('/todos', methods=['POST'])
@limiter.limit("10 per minute")
def create_todo():
    pass
```

## 🧪 测试

创建 `tests/test_api.py`:

```python
import pytest
from app import create_app
from app.database import db

@pytest.fixture
def client():
    app = create_app({'TESTING': True, 'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:'})
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client

def test_create_todo(client):
    response = client.post('/api/todos', json={'text': 'Test todo'})
    assert response.status_code == 201
    assert response.json['text'] == 'Test todo'

def test_get_todos(client):
    response = client.get('/api/todos')
    assert response.status_code == 200
    assert 'todos' in response.json
```

运行测试:
```bash
pip install pytest
pytest
```

## 🚀 生产部署

### 使用 Gunicorn

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 run:app
```

### 使用 Docker

创建 `Dockerfile`:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

COPY . .

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8000", "run:app"]
```

构建和运行:
```bash
docker build -t flask-todo .
docker run -p 8000:8000 flask-todo
```

## 🔒 安全最佳实践

1. **使用环境变量存储敏感信息**
2. **启用 HTTPS**
3. **设置 CORS 白名单**
   ```python
   CORS(app, origins=["https://yourdomain.com"])
   ```
4. **使用生产数据库** (PostgreSQL/MySQL)
5. **添加 SQL 注入防护** (Flask-SQLAlchemy 已内置)
6. **实现请求限流**
7. **添加日志记录**

## 📚 学习资源

- [Flask Documentation](https://flask.palletsprojects.com/)
- [Flask-SQLAlchemy Documentation](https://flask-sqlalchemy.palletsprojects.com/)
- [Flask-CORS Documentation](https://flask-cors.readthedocs.io/)
- [Flask Mega-Tutorial](https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world)

## 📝 许可证

MIT License
