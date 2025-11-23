# TodoList API - NestJS

A scalable and maintainable RESTful API for managing todos built with NestJS and TypeORM.

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: NestJS 10+
- **ORM**: TypeORM
- **Database**: SQLite
- **Validation**: class-validator & class-transformer
- **Features**: Dependency Injection, Decorators, Type Safety

## Installation

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Setup

1. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Start development server**:
   ```bash
   npm run start:dev
   # or
   yarn start:dev
   ```

The API will be available at `http://localhost:3000`

## Build & Run

### Development Mode
```bash
npm run start:dev
```

### Production Build
```bash
npm run build
npm run start:prod
```

## API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### Get All Todos
```http
GET /api/todos
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "text": "Learn NestJS",
    "completed": false,
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
]
```

#### Get Single Todo
```http
GET /api/todos/{id}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "text": "Learn NestJS",
  "completed": false,
  "createdAt": "2024-01-01T12:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

#### Create Todo
```http
POST /api/todos
Content-Type: application/json

{
  "text": "New todo item"
}
```

**Response** (201 Created):
```json
{
  "id": 1,
  "text": "New todo item",
  "completed": false,
  "createdAt": "2024-01-01T12:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

#### Update Todo
```http
PUT /api/todos/{id}
Content-Type: application/json

{
  "text": "Updated text",
  "completed": true
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "text": "Updated text",
  "completed": true,
  "createdAt": "2024-01-01T12:00:00.000Z",
  "updatedAt": "2024-01-01T12:30:00.000Z"
}
```

#### Delete Todo
```http
DELETE /api/todos/{id}
```

**Response** (204 No Content)

## Project Structure

```
11-nestjs/
├── src/
│   ├── todos/
│   │   ├── todo.entity.ts        # TypeORM entity
│   │   ├── todo.dto.ts           # Data transfer objects
│   │   ├── todos.controller.ts   # HTTP endpoints
│   │   ├── todos.service.ts      # Business logic
│   │   └── todos.module.ts       # Module definition
│   ├── app.module.ts             # Root module
│   └── main.ts                   # Application entry point
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── nest-cli.json                 # NestJS CLI config
└── README.md
```

## Key Features

### Dependency Injection
NestJS provides a powerful DI container:
```typescript
@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private todosRepository: Repository<Todo>,
  ) {}
}
```

### Decorators
Clean and expressive API definitions:
```typescript
@Controller('api/todos')
export class TodosController {
  @Get()
  async findAll(): Promise<Todo[]> {
    return this.todosService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateTodoDto): Promise<Todo> {
    return this.todosService.create(dto);
  }
}
```

### Validation
Automatic request validation with class-validator:
```typescript
export class CreateTodoDto {
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  text: string;
}
```

### Type Safety
Full TypeScript support with strict typing:
```typescript
async findOne(id: number): Promise<Todo> {
  const todo = await this.todosRepository.findOne({ where: { id } });
  if (!todo) {
    throw new NotFoundException(`Todo with ID ${id} not found`);
  }
  return todo;
}
```

## Validation Rules

- **text**: Required, string, 1-500 characters
- **completed**: Optional, boolean

## Error Handling

The API returns appropriate HTTP status codes:

- `200 OK`: Successful GET/PUT request
- `201 Created`: Successful POST request
- `204 No Content`: Successful DELETE request
- `400 Bad Request`: Validation error
- `404 Not Found`: Todo not found
- `500 Internal Server Error`: Server error

Error responses include detailed messages:
```json
{
  "statusCode": 400,
  "message": ["text must be shorter than or equal to 500 characters"],
  "error": "Bad Request"
}
```

## Testing

### Unit Tests
```bash
npm run test
```

### Test Coverage
```bash
npm run test:cov
```

### E2E Tests
```bash
npm run test:e2e
```

## Code Quality

### Linting
```bash
npm run lint
```

### Formatting
```bash
npm run format
```

## Environment Variables

Create a `.env` file:
```env
PORT=3000
NODE_ENV=development
```

## Production Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Run in production mode:
   ```bash
   npm run start:prod
   ```

## Architecture Benefits

- **Modular**: Easy to scale and maintain
- **Testable**: Built-in testing utilities
- **Type-Safe**: Full TypeScript support
- **Enterprise-Ready**: Follows SOLID principles
- **Well-Documented**: Extensive NestJS documentation

## License

MIT

## 📊 日志和监控

本项目集成 Winston 日志库实现结构化日志。

### 日志级别

- **ERROR**: 错误和异常
- **WARN**: 警告
- **INFO**: 重要操作
- **DEBUG**: 调试信息

### 配置日志级别

```bash
LOG_LEVEL=info npm start
```

### 安装依赖

```bash
npm install winston nest-winston
```

### 日志格式

JSON 格式输出：

```json
{
  "timestamp": "2024-01-01T12:00:00.000Z",
  "level": "info",
  "message": "Todo created",
  "context": {
    "todoId": 123,
    "duration": 45
  }
}
```

### 性能监控

- HTTP 请求自动日志
- 慢操作检测（>100ms）
- 错误追踪和上下文

### 环境变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `LOG_LEVEL` | `info` | 日志级别 |
