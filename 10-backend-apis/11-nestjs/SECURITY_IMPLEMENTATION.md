# NestJS 安全加固实施指南

## 已完成 ✅

- [x] .env.example 已创建（包含 CORS 和速率限制配置）

## 待实施

### 1. 安装依赖

```bash
npm install @nestjs/throttler helmet
npm install --save-dev @types/node
npm install class-validator class-transformer
npm install sanitize-html
npm install @types/sanitize-html --save-dev
```

### 2. CORS 和安全头配置

**文件**: `src/main.ts`

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS configuration
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:3000',
  ];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Security headers
  app.use(helmet({
    contentSecurityPolicy: false, // Adjust based on your needs
    crossOriginEmbedderPolicy: false,
  }));

  // Add custom security headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Set global prefix
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  const host = process.env.HOST || '0.0.0.0';

  await app.listen(port, host);
  console.log(`Server running on http://${host}:${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
}
bootstrap();
```

### 3. 速率限制

**文件**: `src/app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: parseInt(process.env.RATE_LIMIT_TTL || '60', 10),
      limit: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    }]),
    // ... other modules
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
```

### 4. 输入验证和 HTML 转义

**文件**: `src/todos/dto/create-todo.dto.ts`

```typescript
import { IsString, IsBoolean, IsOptional, MinLength, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import * as sanitizeHtml from 'sanitize-html';

export class CreateTodoDto {
  @IsString()
  @MinLength(1, { message: 'Text must be at least 1 character long' })
  @MaxLength(500, { message: 'Text must not exceed 500 characters' })
  @Transform(({ value }) => sanitizeHtml(value, {
    allowedTags: [],
    allowedAttributes: {},
  }))
  text: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
```

**文件**: `src/todos/dto/update-todo.dto.ts`

```typescript
import { IsString, IsBoolean, IsOptional, MinLength, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import * as sanitizeHtml from 'sanitize-html';

export class UpdateTodoDto {
  @IsString()
  @IsOptional()
  @MinLength(1, { message: 'Text must be at least 1 character long' })
  @MaxLength(500, { message: 'Text must not exceed 500 characters' })
  @Transform(({ value }) => value ? sanitizeHtml(value, {
    allowedTags: [],
    allowedAttributes: {},
  }) : value)
  text?: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
```

### 5. ID 验证

**文件**: `src/todos/todos.controller.ts`

```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    if (id <= 0) {
      throw new BadRequestException('Invalid ID format');
    }

    const todo = await this.todosService.findOne(id);
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    return todo;
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    if (id <= 0) {
      throw new BadRequestException('Invalid ID format');
    }

    const todo = await this.todosService.update(id, updateTodoDto);
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    return todo;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    if (id <= 0) {
      throw new BadRequestException('Invalid ID format');
    }

    const result = await this.todosService.remove(id);
    if (!result) {
      throw new NotFoundException('Todo not found');
    }

    return { message: 'Todo deleted successfully' };
  }
}
```

### 6. 健康检查端点

**安装依赖**:
```bash
npm install @nestjs/terminus
```

**创建文件**: `src/health/health.controller.ts`

```typescript
import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck, TypeOrmHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      async () => {
        try {
          await this.db.pingCheck('database', { timeout: 300 });
          return {
            database: { status: 'up' },
          };
        } catch (error) {
          return {
            database: { status: 'down' },
          };
        }
      },
      () => ({
        version: { status: '1.0.0' },
      }),
    ]);
  }
}
```

**创建文件**: `src/health/health.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
})
export class HealthModule {}
```

在 `app.module.ts` 中导入：

```typescript
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    // ...
    HealthModule,
  ],
})
export class AppModule {}
```

### 7. 错误处理

**创建文件**: `src/common/filters/http-exception.filter.ts`

```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    // Log error (but don't expose details to client in production)
    this.logger.error(
      `${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : JSON.stringify(exception),
    );

    // Send sanitized error to client
    response.status(status).json({
      error: typeof message === 'string' ? message : (message as any).message || 'An error occurred',
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

在 `main.ts` 中使用：

```typescript
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

app.useGlobalFilters(new AllExceptionsFilter());
```

## 测试

```bash
# 运行开发服务器
npm run start:dev

# 运行测试
npm run test

# 测试 CORS
curl -H "Origin: http://unauthorized.com" \
  -H "Access-Control-Request-Method: POST" \
  -X OPTIONS http://localhost:3000/api/todos

# 测试速率限制
for i in {1..110}; do curl http://localhost:3000/api/todos; done

# 测试健康检查
curl http://localhost:3000/health
```

## 生产环境部署

```bash
# 设置环境变量
export NODE_ENV=production
export ALLOWED_ORIGINS=https://yourdomain.com

# 构建
npm run build

# 启动
npm run start:prod
```
