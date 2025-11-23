# PHP Laravel 安全加固实施指南

## 已完成 ✅

- [x] .env.example 已更新（添加 CORS 和速率限制配置）

## 待实施

### 1. CORS 配置修复

**文件**: `config/cors.php`

```php
<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => explode(',', env('ALLOWED_ORIGINS', 'http://localhost:3000')),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 3600,

    'supports_credentials' => true,

];
```

### 2. 速率限制配置

**文件**: `app/Http/Kernel.php`

找到 `$middlewareGroups` 中的 `api` 部分，修改为：

```php
'api' => [
    'throttle:'.env('RATE_LIMIT_MAX', 100).',1',
    \Illuminate\Routing\Middleware\SubstituteBindings::class,
],
```

### 3. 安全响应头中间件

**创建文件**: `app/Http/Middleware/SecurityHeaders.php`

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

        return $response;
    }
}
```

**注册中间件**: 在 `app/Http/Kernel.php` 的 `$middleware` 数组中添加：

```php
protected $middleware = [
    // ...
    \App\Http\Middleware\SecurityHeaders::class,
];
```

### 4. 输入验证增强

**创建文件**: `app/Http/Requests/TodoRequest.php`

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TodoRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'text' => 'required|string|min:1|max:500',
            'completed' => 'sometimes|boolean'
        ];
    }

    public function messages()
    {
        return [
            'text.required' => 'Text is required',
            'text.min' => 'Text must be at least 1 character',
            'text.max' => 'Text must not exceed 500 characters',
            'completed.boolean' => 'Completed must be a boolean value'
        ];
    }

    protected function prepareForValidation()
    {
        // Sanitize HTML
        if ($this->has('text')) {
            $this->merge([
                'text' => htmlspecialchars($this->text, ENT_QUOTES, 'UTF-8')
            ]);
        }
    }
}
```

**更新控制器**: 在 `app/Http/Controllers/TodoController.php` 中使用：

```php
use App\Http\Requests\TodoRequest;

public function store(TodoRequest $request)
{
    $todo = Todo::create($request->validated());
    return response()->json($todo, 201);
}

public function update(TodoRequest $request, Todo $todo)
{
    $todo->update($request->validated());
    return response()->json($todo);
}
```

### 5. 健康检查端点

**文件**: `routes/api.php`

添加：

```php
use Illuminate\Support\Facades\DB;

Route::get('/health', function () {
    try {
        DB::connection()->getPdo();
        $dbStatus = 'ok';
        $statusCode = 200;
    } catch (\Exception $e) {
        $dbStatus = 'unavailable';
        $statusCode = 503;
    }

    return response()->json([
        'status' => 'ok',
        'database' => $dbStatus,
        'version' => '1.0.0',
        'time' => now()->toIso8601String()
    ], $statusCode);
});
```

### 6. ID 验证

**文件**: `app/Http/Controllers/TodoController.php`

```php
public function show($id)
{
    if (!is_numeric($id) || $id <= 0) {
        return response()->json(['error' => 'Invalid ID format'], 400);
    }

    $todo = Todo::find($id);
    if (!$todo) {
        return response()->json(['error' => 'Todo not found'], 404);
    }

    return response()->json($todo);
}
```

### 7. 错误处理改进

**文件**: `app/Exceptions/Handler.php`

```php
public function register()
{
    $this->renderable(function (\Illuminate\Database\Eloquent\ModelNotFoundException $e, $request) {
        if ($request->is('api/*')) {
            return response()->json(['error' => 'Resource not found'], 404);
        }
    });

    $this->renderable(function (\Illuminate\Validation\ValidationException $e, $request) {
        if ($request->is('api/*')) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    });
}
```

## 测试安全配置

```bash
# 1. 测试 CORS
curl -H "Origin: http://unauthorized.com" \
  -H "Access-Control-Request-Method: POST" \
  -X OPTIONS http://localhost:8000/api/todos

# 2. 测试速率限制
for i in {1..110}; do curl http://localhost:8000/api/todos; done

# 3. 测试 XSS 防护
curl -X POST http://localhost:8000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"text":"<script>alert(\"XSS\")</script>"}'

# 4. 测试健康检查
curl http://localhost:8000/api/health
```

## 部署前检查清单

- [ ] 设置 `ALLOWED_ORIGINS` 环境变量
- [ ] 生成应用密钥: `php artisan key:generate`
- [ ] 运行数据库迁移: `php artisan migrate`
- [ ] 清除配置缓存: `php artisan config:clear`
- [ ] 优化自动加载: `composer install --optimize-autoloader --no-dev`
- [ ] 缓存配置: `php artisan config:cache`
- [ ] 缓存路由: `php artisan route:cache`
