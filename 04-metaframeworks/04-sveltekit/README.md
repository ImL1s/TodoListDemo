# SvelteKit Todo List

一個使用 SvelteKit 構建的全棧 Todo List 應用，展示 Svelte 元框架的強大功能。

## 技術特點

### SvelteKit 核心特性

1. **Load Functions（加載函數）**
   - 在 `+page.server.ts` 中實作伺服器端數據加載
   - 自動序列化數據並傳遞給頁面
   - 支援 SSR 和預渲染

2. **Form Actions（表單操作）**
   - 使用 SvelteKit 的表單系統處理數據變更
   - 無需手動處理 API 請求
   - 自動處理表單驗證和錯誤處理

3. **Server Routes（伺服器路由）**
   - API 路由定義在 `/api/todos/+server.ts`
   - 支援 RESTful API 風格
   - 類型安全的請求處理

4. **Progressive Enhancement（漸進式增強）**
   - 使用 `use:enhance` 提升用戶體驗
   - JavaScript 禁用時仍可正常工作
   - 平滑的頁面更新無需完整刷新

5. **File-based Routing（檔案系統路由）**
   - 基於檔案結構的自動路由
   - 支援動態路由參數
   - 清晰的專案結構

## 專案結構

```
04-sveltekit/
├── src/
│   ├── routes/
│   │   ├── +page.svelte              # 主頁面組件（UI）
│   │   ├── +page.server.ts            # 伺服器端邏輯（Load + Actions）
│   │   └── api/
│   │       └── todos/
│   │           ├── +server.ts         # Todos API endpoints
│   │           └── [id]/
│   │               └── +server.ts     # 單個 Todo API
│   ├── app.html                        # HTML 模板
│   └── app.d.ts                        # TypeScript 類型定義
├── svelte.config.js                    # SvelteKit 配置
├── vite.config.ts                      # Vite 配置
├── tsconfig.json                       # TypeScript 配置
├── package.json                        # 專案依賴
└── README.md                           # 專案文檔
```

## 安裝與運行

### 1. 安裝依賴

```bash
cd 04-metaframeworks/04-sveltekit
npm install
```

### 2. 啟動開發伺服器

```bash
npm run dev
```

應用將在 http://localhost:5173 啟動

### 3. 建置生產版本

```bash
npm run build
```

### 4. 預覽生產版本

```bash
npm run preview
```

## 核心實作說明

### Load Function（+page.server.ts）

```typescript
export const load: PageServerLoad = async () => {
	return {
		todos: todos
	};
};
```

- 在伺服器端執行
- 為頁面提供初始數據
- 支援 SSR，首次載入即可看到內容

### Form Actions（+page.server.ts）

```typescript
export const actions: Actions = {
	add: async ({ request }) => {
		const data = await request.formData();
		// 處理數據...
		return { success: true };
	}
};
```

- 處理表單提交
- 自動處理 CSRF 保護
- 支援漸進式增強

### Server Routes（+server.ts）

```typescript
export const GET: RequestHandler = async () => {
	return json({ todos });
};

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();
	// 處理請求...
	return json(newTodo, { status: 201 });
};
```

- RESTful API 風格
- 類型安全的請求處理
- 支援多種 HTTP 方法

### Progressive Enhancement（+page.svelte）

```svelte
<form method="POST" action="?/add" use:enhance>
	<input type="text" name="text" required />
	<button type="submit">添加</button>
</form>
```

- `use:enhance` 提供 JavaScript 增強
- JavaScript 禁用時表單仍可工作
- 自動處理載入狀態

## API Endpoints

### GET /api/todos
獲取所有 todos 及統計資訊

**回應範例:**
```json
{
	"todos": [...],
	"stats": {
		"total": 3,
		"active": 2,
		"completed": 1
	}
}
```

### POST /api/todos
創建新的 todo

**請求體:**
```json
{
	"text": "新任務"
}
```

### GET /api/todos/[id]
獲取特定 todo

### PATCH /api/todos/[id]
更新特定 todo

**請求體:**
```json
{
	"text": "更新的文字",
	"completed": true
}
```

### DELETE /api/todos/[id]
刪除特定 todo

### PATCH /api/todos
批量操作

**清除已完成:**
```json
{
	"clearCompleted": true
}
```

**標記全部:**
```json
{
	"markAllCompleted": true
}
```

## 功能特性

- ✅ 添加新任務
- ✅ 標記任務完成/未完成
- ✅ 刪除任務
- ✅ 過濾任務（全部/進行中/已完成）
- ✅ 清除所有已完成任務
- ✅ 實時統計
- ✅ 響應式設計
- ✅ 伺服器端渲染（SSR）
- ✅ 漸進式增強
- ✅ 類型安全（TypeScript）

## SvelteKit vs 其他框架

### 相比 Next.js
- **更簡潔**: 更少的樣板代碼，更直觀的 API
- **更輕量**: 編譯器而非運行時框架
- **更快**: 優異的建置速度和運行效能
- **Form Actions**: 內建表單處理系統

### 相比 Nuxt
- **編譯器優勢**: Svelte 編譯成原生 JavaScript
- **更小的包大小**: 無需運行時框架
- **更好的開發體驗**: 更快的 HMR 和建置
- **TypeScript 整合**: 更好的類型推導

### SvelteKit 優勢
1. **編譯器方法**: 無運行時開銷
2. **檔案系統路由**: 簡單直觀
3. **Form Actions**: 優雅的表單處理
4. **適配器系統**: 部署到任何平台
5. **Vite 驅動**: 極速的開發體驗

## 學習資源

- [SvelteKit 官方文檔](https://kit.svelte.dev/)
- [Svelte 教程](https://svelte.dev/tutorial)
- [SvelteKit FAQ](https://kit.svelte.dev/faq)
- [Svelte Discord](https://svelte.dev/chat)

## 技術棧

- **框架**: SvelteKit 2.0
- **語言**: TypeScript
- **建置工具**: Vite 5
- **樣式**: CSS（Scoped Styles）
- **適配器**: adapter-auto

## 開發注意事項

### Load Functions
- 只在伺服器端執行
- 可以安全地訪問數據庫和 API
- 數據會自動序列化傳給客戶端

### Form Actions
- 使用標準 HTML 表單
- 支援 Progressive Enhancement
- 自動處理 CSRF

### Server Routes
- 可以與 Load Functions 共享代碼
- 支援所有 HTTP 方法
- 返回 JSON 或其他格式

## 部署

SvelteKit 支援多種部署平台：

```bash
# Vercel
npm install @sveltejs/adapter-vercel

# Netlify
npm install @sveltejs/adapter-netlify

# Node.js
npm install @sveltejs/adapter-node

# Static
npm install @sveltejs/adapter-static
```

更新 `svelte.config.js` 中的 adapter 即可。

## 授權

MIT

## 作者

TodoListDemo Project - SvelteKit Implementation
