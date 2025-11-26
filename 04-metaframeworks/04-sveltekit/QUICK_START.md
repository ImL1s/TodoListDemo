# SvelteKit Todo List - 快速開始指南

## 安裝與運行

### 1. 進入專案目錄

```bash
cd /home/user/TodoListDemo/04-metaframeworks/04-sveltekit
```

### 2. 安裝依賴

```bash
npm install
```

### 3. 啟動開發伺服器

```bash
npm run dev
```

應用將在 http://localhost:5173 啟動

## 測試 API Endpoints

### 使用 curl 測試

#### 獲取所有 todos
```bash
curl http://localhost:5173/api/todos
```

#### 添加新 todo
```bash
curl -X POST http://localhost:5173/api/todos \
  -H "Content-Type: application/json" \
  -d '{"text": "測試任務"}'
```

#### 獲取單個 todo
```bash
curl http://localhost:5173/api/todos/1
```

#### 更新 todo
```bash
curl -X PATCH http://localhost:5173/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

#### 刪除 todo
```bash
curl -X DELETE http://localhost:5173/api/todos/1
```

#### 清除已完成的 todos
```bash
curl -X PATCH http://localhost:5173/api/todos \
  -H "Content-Type: application/json" \
  -d '{"clearCompleted": true}'
```

## 專案結構說明

### 核心文件

- **src/routes/+page.svelte** - 前端頁面組件
- **src/routes/+page.server.ts** - 伺服器端邏輯（Load Functions + Form Actions）
- **src/routes/api/todos/+server.ts** - Todos API 集合端點
- **src/routes/api/todos/[id]/+server.ts** - 單個 Todo API 端點
- **src/lib/store.ts** - 共享數據存儲

### 配置文件

- **svelte.config.js** - SvelteKit 配置
- **vite.config.ts** - Vite 配置
- **tsconfig.json** - TypeScript 配置

## SvelteKit 核心概念

### 1. Load Functions

Load functions 在 `+page.server.ts` 中定義，用於在伺服器端加載數據：

```typescript
export const load: PageServerLoad = async () => {
	return {
		todos: todoStore.getAll()
	};
};
```

### 2. Form Actions

Form actions 處理表單提交和數據變更：

```typescript
export const actions: Actions = {
	add: async ({ request }) => {
		const data = await request.formData();
		const text = data.get('text') as string;
		todoStore.add(text);
		return { success: true };
	}
};
```

### 3. Server Routes

Server routes 定義在 `+server.ts` 文件中，提供 API 端點：

```typescript
export const GET: RequestHandler = async () => {
	return json({ todos: todoStore.getAll() });
};
```

### 4. Progressive Enhancement

使用 `use:enhance` 提升用戶體驗：

```svelte
<form method="POST" action="?/add" use:enhance>
	<input type="text" name="text" required />
	<button type="submit">添加</button>
</form>
```

## 常用命令

```bash
# 開發模式
npm run dev

# 類型檢查
npm run check

# 建置生產版本
npm run build

# 預覽生產版本
npm run preview
```

## 開發技巧

### 1. 熱模組替換（HMR）

SvelteKit 使用 Vite，提供快速的 HMR。修改文件後瀏覽器會自動更新。

### 2. TypeScript 支援

專案完全支援 TypeScript，包括自動生成的類型：

```typescript
import type { PageData } from './$types';
export let data: PageData;
```

### 3. 路徑別名

使用 `$lib` 導入共享模塊：

```typescript
import { todoStore } from '$lib/store';
```

## 疑難排解

### 端口已被佔用

如果 5173 端口被佔用，Vite 會自動使用下一個可用端口。

### 類型錯誤

運行 `npm run check` 檢查 TypeScript 錯誤。

### 建置失敗

確保所有依賴都已正確安裝：
```bash
rm -rf node_modules .svelte-kit
npm install
```

## 下一步

- 閱讀 [SvelteKit 官方文檔](https://kit.svelte.dev/)
- 嘗試修改代碼，添加新功能
- 探索不同的適配器選項
- 學習 Svelte 的響應式系統

祝你學習愉快！
