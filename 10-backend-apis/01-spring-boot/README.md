# TodoList - Spring Boot REST API

一个基于 Spring Boot 的完整 TodoList RESTful API 应用，提供完整的 CRUD 操作和数据持久化功能。

## 技术栈

- **Java**: 17+
- **Spring Boot**: 3.2.0
- **Spring Data JPA**: 数据持久化
- **H2 Database**: 内存数据库
- **Lombok**: 减少样板代码
- **Maven**: 项目构建工具
- **Hibernate Validator**: 数据验证

## 项目结构

```
01-spring-boot/
├── src/main/java/com/example/todolist/
│   ├── TodoListApplication.java          # 主应用入口
│   ├── model/
│   │   └── Todo.java                     # Todo 实体类
│   ├── repository/
│   │   └── TodoRepository.java           # JPA Repository
│   ├── service/
│   │   └── TodoService.java              # 业务逻辑层
│   └── controller/
│       └── TodoController.java           # REST API 控制器
├── src/main/resources/
│   └── application.properties            # 应用配置
├── pom.xml                                # Maven 配置
├── .gitignore
└── README.md
```

## 快速开始

### 前置要求

- JDK 17 或更高版本
- Maven 3.6+ (可选，可使用 Maven Wrapper)

### 安装与运行

1. **克隆项目**
   ```bash
   cd 10-backend-apis/01-spring-boot
   ```

2. **构建项目**
   ```bash
   # 使用 Maven
   mvn clean install

   # 或使用 Maven Wrapper (如果有)
   ./mvnw clean install
   ```

3. **运行应用**
   ```bash
   # 使用 Maven
   mvn spring-boot:run

   # 或使用 Maven Wrapper
   ./mvnw spring-boot:run

   # 或直接运行 JAR
   java -jar target/todolist-spring-boot-1.0.0.jar
   ```

4. **访问应用**
   - API Base URL: http://localhost:8080/api/todos
   - H2 Console: http://localhost:8080/h2-console
     - JDBC URL: `jdbc:h2:mem:todolistdb`
     - Username: `sa`
     - Password: (留空)

## API 文档

### 基础端点

#### 1. 获取所有任务
```http
GET /api/todos
```

**响应示例**:
```json
[
  {
    "id": 1,
    "text": "学习 Spring Boot",
    "completed": false,
    "createdAt": "2025-11-20T10:30:00"
  },
  {
    "id": 2,
    "text": "完成项目文档",
    "completed": true,
    "createdAt": "2025-11-20T09:15:00"
  }
]
```

#### 2. 获取单个任务
```http
GET /api/todos/{id}
```

**响应示例**:
```json
{
  "id": 1,
  "text": "学习 Spring Boot",
  "completed": false,
  "createdAt": "2025-11-20T10:30:00"
}
```

#### 3. 创建任务
```http
POST /api/todos
Content-Type: application/json

{
  "text": "学习 Spring Boot"
}
```

**响应**: 201 Created
```json
{
  "id": 1,
  "text": "学习 Spring Boot",
  "completed": false,
  "createdAt": "2025-11-20T10:30:00"
}
```

#### 4. 更新任务
```http
PUT /api/todos/{id}
Content-Type: application/json

{
  "text": "深入学习 Spring Boot",
  "completed": true
}
```

**响应**: 200 OK
```json
{
  "id": 1,
  "text": "深入学习 Spring Boot",
  "completed": true,
  "createdAt": "2025-11-20T10:30:00"
}
```

#### 5. 切换完成状态
```http
PATCH /api/todos/{id}/toggle
```

**响应**: 200 OK

#### 6. 删除任务
```http
DELETE /api/todos/{id}
```

**响应**: 204 No Content

#### 7. 删除所有任务
```http
DELETE /api/todos
```

**响应**: 204 No Content

### 高级端点

#### 8. 按状态筛选
```http
GET /api/todos/filter?completed=true
```

#### 9. 搜索任务
```http
GET /api/todos/search?q=Spring
```

#### 10. 获取统计信息
```http
GET /api/todos/stats
```

**响应示例**:
```json
{
  "total": 10,
  "completed": 6,
  "active": 4
}
```

## 数据模型

### Todo Entity

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| id | Long | 唯一标识符 | 自动生成 |
| text | String | 任务描述 | 必填，1-500字符 |
| completed | Boolean | 完成状态 | 默认 false |
| createdAt | LocalDateTime | 创建时间 | 自动生成 |

## 测试 API

### 使用 cURL

```bash
# 获取所有任务
curl http://localhost:8080/api/todos

# 创建任务
curl -X POST http://localhost:8080/api/todos \
  -H "Content-Type: application/json" \
  -d '{"text":"学习 Spring Boot"}'

# 更新任务
curl -X PUT http://localhost:8080/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"text":"深入学习 Spring Boot","completed":true}'

# 切换完成状态
curl -X PATCH http://localhost:8080/api/todos/1/toggle

# 删除任务
curl -X DELETE http://localhost:8080/api/todos/1

# 获取统计信息
curl http://localhost:8080/api/todos/stats
```

### 使用 HTTPie

```bash
# 获取所有任务
http GET localhost:8080/api/todos

# 创建任务
http POST localhost:8080/api/todos text="学习 Spring Boot"

# 更新任务
http PUT localhost:8080/api/todos/1 text="深入学习 Spring Boot" completed=true

# 删除任务
http DELETE localhost:8080/api/todos/1
```

## 配置说明

### application.properties

主要配置项：

```properties
# 服务器端口
server.port=8080

# H2 数据库配置
spring.datasource.url=jdbc:h2:mem:todolistdb
spring.h2.console.enabled=true

# JPA 配置
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

## 开发指南

### 添加新功能

1. **添加实体字段**: 修改 `Todo.java`
2. **添加 Repository 方法**: 在 `TodoRepository.java` 中添加自定义查询
3. **添加业务逻辑**: 在 `TodoService.java` 中实现
4. **添加 API 端点**: 在 `TodoController.java` 中添加映射

### 日志级别

可在 `application.properties` 中调整：

```properties
# 应用日志
logging.level.com.example.todolist=DEBUG

# SQL 日志
logging.level.org.hibernate.SQL=DEBUG
```

## 构建与部署

### 打包应用

```bash
# 构建 JAR 文件
mvn clean package

# 跳过测试构建
mvn clean package -DskipTests
```

### 运行生产环境

```bash
# 使用生产配置
java -jar target/todolist-spring-boot-1.0.0.jar --spring.profiles.active=prod

# 指定端口
java -jar target/todolist-spring-boot-1.0.0.jar --server.port=9090
```

## 注意事项

1. **数据持久化**: 当前使用 H2 内存数据库，应用重启后数据会丢失。生产环境建议使用 MySQL/PostgreSQL。

2. **CORS 配置**: 当前允许所有来源的跨域请求 (`@CrossOrigin(origins = "*")`)，生产环境建议限制具体域名。

3. **安全性**: 当前未启用 Spring Security，生产环境建议添加认证授权机制。

4. **数据验证**: Todo 文本长度限制为 1-500 字符，可根据需求调整。

## 常见问题

### Q: 如何切换到 MySQL 数据库？

A: 修改 `pom.xml` 添加 MySQL 驱动依赖，并在 `application.properties` 中配置：

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/todolistdb
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
```

### Q: 如何启用 HTTPS？

A: 生成 SSL 证书并在 `application.properties` 中配置：

```properties
server.ssl.enabled=true
server.ssl.key-store=classpath:keystore.p12
server.ssl.key-store-password=your_password
server.ssl.key-store-type=PKCS12
```

## 扩展功能建议

- [ ] 添加用户认证 (Spring Security + JWT)
- [ ] 实现任务分类/标签功能
- [ ] 添加任务优先级
- [ ] 实现任务到期提醒
- [ ] 添加 Swagger/OpenAPI 文档
- [ ] 实现任务搜索高亮
- [ ] 添加文件上传功能
- [ ] 实现 WebSocket 实时同步

## 许可证

MIT License

## 作者

TodoList Demo Project

## 版本历史

- **v1.0.0** (2025-11-20)
  - 初始版本发布
  - 实现基础 CRUD 操作
  - H2 数据库集成
  - RESTful API 完整实现
