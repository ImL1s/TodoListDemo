# Ruby on Rails TodoList API

A RESTful API for managing todos built with Ruby on Rails in API-only mode.

## 🛠 技术栈

- **Ruby** 3.2+
- **Rails** 7.1+
- **SQLite3** - Database
- **Puma** - Web Server
- **Rack CORS** - Cross-Origin Resource Sharing

## 📋 功能特性

- Rails API-only 模式
- RESTful resources 设计
- ActiveRecord 模型验证
- Rack CORS 配置
- 数据库迁移
- 统一错误处理
- JSON 响应格式

## 📦 安装步骤

1. **确保已安装 Ruby 3.2+**
   ```bash
   ruby --version
   ```

2. **进入项目目录**
   ```bash
   cd 10-backend-apis/08-ruby-rails
   ```

3. **安装依赖**
   ```bash
   bundle install
   ```

4. **创建数据库**
   ```bash
   rails db:create
   ```

5. **运行数据库迁移**
   ```bash
   rails db:migrate
   ```

6. **启动服务器**
   ```bash
   rails server
   # 或者使用简写
   rails s
   ```

   服务器将在 `http://localhost:3000` 启动

## 🚀 API 端点

| 方法   | 端点              | 描述           |
|--------|-------------------|----------------|
| GET    | `/api/todos`      | 获取所有 todos |
| GET    | `/api/todos/:id`  | 获取单个 todo  |
| POST   | `/api/todos`      | 创建新 todo    |
| PUT    | `/api/todos/:id`  | 更新 todo      |
| PATCH  | `/api/todos/:id`  | 部分更新 todo  |
| DELETE | `/api/todos/:id`  | 删除 todo      |
| GET    | `/health`         | 健康检查       |

## 📝 API 使用示例

### 获取所有 Todos
```bash
curl http://localhost:3000/api/todos
```

### 创建新 Todo
```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"todo":{"text":"学习 Ruby on Rails","completed":false}}'
```

### 获取单个 Todo
```bash
curl http://localhost:3000/api/todos/1
```

### 更新 Todo
```bash
curl -X PUT http://localhost:3000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"todo":{"text":"精通 Ruby on Rails","completed":true}}'
```

### 部分更新 Todo
```bash
curl -X PATCH http://localhost:3000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"todo":{"completed":true}}'
```

### 删除 Todo
```bash
curl -X DELETE http://localhost:3000/api/todos/1
```

### 健康检查
```bash
curl http://localhost:3000/health
```

## 📁 项目结构

```
08-ruby-rails/
├── app/
│   ├── controllers/
│   │   ├── application_controller.rb  # 基础控制器
│   │   └── todos_controller.rb        # Todos 控制器
│   └── models/
│       └── todo.rb                    # Todo 模型
├── config/
│   ├── application.rb                 # 应用配置
│   ├── boot.rb                        # 启动配置
│   ├── database.yml                   # 数据库配置
│   ├── environment.rb                 # 环境加载
│   ├── routes.rb                      # 路由配置
│   └── environments/
│       ├── development.rb             # 开发环境配置
│       └── production.rb              # 生产环境配置
├── db/
│   ├── migrate/
│   │   └── 20231121000001_create_todos.rb  # 数据库迁移
│   └── schema.rb                      # 数据库架构 (自动生成)
├── Gemfile                            # Gem 依赖
├── Gemfile.lock                       # Gem 锁定文件 (自动生成)
├── config.ru                          # Rack 配置
├── .gitignore
└── README.md
```

## 🔧 数据模型

### Todo Model
```ruby
class Todo < ApplicationRecord
  validates :text, presence: true, length: { maximum: 500 }
  validates :completed, inclusion: { in: [true, false] }

  scope :active, -> { where(completed: false) }
  scope :completed, -> { where(completed: true) }
  scope :recent, -> { order(created_at: :desc) }
end
```

### 数据库架构
```ruby
create_table "todos" do |t|
  t.string "text", null: false
  t.boolean "completed", default: false, null: false
  t.datetime "created_at", null: false
  t.datetime "updated_at", null: false
  t.index ["completed"], name: "index_todos_on_completed"
end
```

## 🛡 验证规则

- **text**: 必填，最大长度 500 字符
- **completed**: 布尔值，默认为 false

## 📊 错误响应

API 返回标准的 HTTP 状态码：

- `200 OK` - 请求成功
- `201 Created` - 资源创建成功
- `400 Bad Request` - 请求参数错误
- `404 Not Found` - 资源不存在
- `422 Unprocessable Entity` - 验证失败
- `500 Internal Server Error` - 服务器错误

错误响应格式：
```json
{
  "error": "Text can't be blank"
}
```

## 🔧 Rails 控制台

使用 Rails 控制台进行调试和数据操作：

```bash
rails console
# 或简写
rails c
```

在控制台中：
```ruby
# 创建 todo
Todo.create(text: "学习 Rails", completed: false)

# 查询所有 todos
Todo.all

# 查询未完成的 todos
Todo.active

# 查询已完成的 todos
Todo.completed
```

## 🗄 数据库命令

```bash
# 创建数据库
rails db:create

# 运行迁移
rails db:migrate

# 回滚最后一次迁移
rails db:rollback

# 重置数据库
rails db:reset

# 删除数据库
rails db:drop

# 查看数据库状态
rails db:migrate:status
```

## 📚 依赖说明

- **rails** - 全栈 Web 框架
- **sqlite3** - 轻量级数据库
- **puma** - 高性能 Web 服务器
- **rack-cors** - CORS 中间件
- **bootsnap** - 加速启动时间
- **debug** - 调试工具 (开发环境)

## 🚦 生产环境配置

在生产环境中，建议：

1. 使用 PostgreSQL 或 MySQL 替代 SQLite
2. 配置环境变量管理敏感信息
3. 启用 SSL/TLS
4. 配置适当的 CORS 策略
5. 使用缓存提升性能
6. 添加认证和授权

### 使用 PostgreSQL (生产环境推荐)

修改 `Gemfile`:
```ruby
# 生产环境使用 PostgreSQL
gem 'pg', '~> 1.5', group: :production
gem 'sqlite3', '~> 1.6', group: [:development, :test]
```

修改 `config/database.yml`:
```yaml
production:
  adapter: postgresql
  encoding: unicode
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  database: todolist_production
  username: <%= ENV['DATABASE_USERNAME'] %>
  password: <%= ENV['DATABASE_PASSWORD'] %>
  host: <%= ENV['DATABASE_HOST'] %>
```

## 🔥 性能优化

1. **数据库索引**: 已在 `completed` 字段添加索引
2. **缓存**: 可配置 Redis 缓存
3. **分页**: 可添加 `kaminari` 或 `pagy` gem
4. **N+1 查询**: 使用 `bullet` gem 检测

## 🧪 测试

添加测试框架 (可选):
```ruby
# Gemfile
group :test do
  gem 'rspec-rails'
  gem 'factory_bot_rails'
  gem 'faker'
end
```

## 📄 许可证

MIT License
