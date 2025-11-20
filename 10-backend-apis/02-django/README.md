# Django TodoList API

A RESTful API for managing todos built with **Django 5.0** and **Django REST Framework**.

## 🚀 技术栈

- **Python**: 3.10+
- **Framework**: Django 5.0
- **API Framework**: Django REST Framework 3.14
- **Database**: SQLite (development)
- **CORS**: django-cors-headers
- **API Documentation**: drf-spectacular (OpenAPI 3.0)

## 📋 功能特性

- ✅ **完整 CRUD API**: 创建、读取、更新、删除 todos
- ✅ **Django Admin**: 强大的后台管理界面
- ✅ **自动 API 文档**: Swagger UI & ReDoc
- ✅ **ViewSet 架构**: 使用 ModelViewSet 简化代码
- ✅ **CORS 支持**: 跨域请求配置
- ✅ **数据验证**: DRF serializers 自动验证
- ✅ **自定义操作**: toggle 和 clear_completed 端点

## 📁 项目结构

```
02-django/
├── todolist_project/         # Django 项目配置
│   ├── __init__.py
│   ├── settings.py           # 设置 (DRF, CORS, drf-spectacular)
│   ├── urls.py               # 主路由
│   └── wsgi.py               # WSGI 配置
├── todos/                    # Todos 应用
│   ├── __init__.py
│   ├── models.py             # Todo 模型 (text, completed, created_at)
│   ├── serializers.py        # TodoSerializer
│   ├── views.py              # TodoViewSet (CRUD + 自定义操作)
│   ├── urls.py               # API 路由
│   ├── admin.py              # Admin 配置
│   └── apps.py               # App 配置
├── manage.py                 # Django 管理脚本
├── requirements.txt          # Python 依赖
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

### 3. 数据库迁移

```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. 创建超级用户（访问 Admin）

```bash
python manage.py createsuperuser
```

### 5. 启动开发服务器

```bash
python manage.py runserver
```

服务器将运行在: `http://localhost:8000`

## 📡 API 端点

### 基础 CRUD

| 方法 | 端点 | 描述 |
|------|------|------|
| `GET` | `/api/todos/` | 获取所有 todos |
| `POST` | `/api/todos/` | 创建新 todo |
| `GET` | `/api/todos/{id}/` | 获取单个 todo |
| `PUT` | `/api/todos/{id}/` | 完整更新 todo |
| `PATCH` | `/api/todos/{id}/` | 部分更新 todo |
| `DELETE` | `/api/todos/{id}/` | 删除 todo |

### 自定义操作

| 方法 | 端点 | 描述 |
|------|------|------|
| `POST` | `/api/todos/{id}/toggle/` | 切换完成状态 |
| `POST` | `/api/todos/clear_completed/` | 删除所有已完成 |

### 文档端点

- **Swagger UI**: `http://localhost:8000/api/docs/`
- **ReDoc**: `http://localhost:8000/api/redoc/`
- **OpenAPI Schema**: `http://localhost:8000/api/schema/`
- **Django Admin**: `http://localhost:8000/admin/`

## 🧪 API 测试示例

### 使用 curl

```bash
# 获取所有 todos
curl http://localhost:8000/api/todos/

# 创建新 todo
curl -X POST http://localhost:8000/api/todos/ \
  -H "Content-Type: application/json" \
  -d '{"text": "Learn Django REST Framework", "completed": false}'

# 获取单个 todo
curl http://localhost:8000/api/todos/1/

# 更新 todo
curl -X PATCH http://localhost:8000/api/todos/1/ \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# 切换完成状态
curl -X POST http://localhost:8000/api/todos/1/toggle/

# 删除 todo
curl -X DELETE http://localhost:8000/api/todos/1/

# 清除已完成的 todos
curl -X POST http://localhost:8000/api/todos/clear_completed/
```

### 使用 HTTPie

```bash
# 获取所有 todos
http GET :8000/api/todos/

# 创建新 todo
http POST :8000/api/todos/ text="Learn Django" completed=false

# 更新 todo
http PATCH :8000/api/todos/1/ completed=true

# 切换完成状态
http POST :8000/api/todos/1/toggle/

# 删除已完成
http POST :8000/api/todos/clear_completed/
```

## 📊 数据模型

### Todo Model

```python
{
  "id": 1,
  "text": "Learn Django REST Framework",
  "completed": false,
  "created_at": "2025-11-20T10:30:00Z"
}
```

**字段说明**:
- `id`: 自动生成的主键
- `text`: Todo 文本内容 (max 500 字符)
- `completed`: 完成状态 (默认 false)
- `created_at`: 创建时间戳 (自动生成)

## 🎯 Django 特色功能

### 1. ModelViewSet

使用 DRF 的 `ModelViewSet` 自动生成标准 CRUD 操作，大大减少代码量。

### 2. Django Admin

访问 `http://localhost:8000/admin/` 使用强大的后台管理:
- 批量操作 (标记完成/未完成)
- 搜索和过滤
- 富文本编辑

### 3. 自动 API 文档

使用 `drf-spectacular` 自动生成 OpenAPI 3.0 文档:
- 交互式 Swagger UI
- 优雅的 ReDoc 文档
- 可下载的 schema.json

### 4. 自定义操作

使用 `@action` 装饰器添加自定义端点:
- `toggle/`: 快速切换状态
- `clear_completed/`: 批量删除

## 🔒 安全注意事项

**生产环境配置**:

1. **SECRET_KEY**: 使用环境变量存储
   ```python
   SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')
   ```

2. **DEBUG**: 设置为 False
   ```python
   DEBUG = False
   ```

3. **ALLOWED_HOSTS**: 配置允许的域名
   ```python
   ALLOWED_HOSTS = ['yourdomain.com']
   ```

4. **CORS**: 限制允许的源
   ```python
   CORS_ALLOWED_ORIGINS = ['https://yourdomain.com']
   ```

5. **数据库**: 使用 PostgreSQL/MySQL 替代 SQLite

## 📚 学习资源

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [drf-spectacular](https://drf-spectacular.readthedocs.io/)

## 📝 许可证

MIT License
