# 使用範例

這個文檔提供了各種功能的實際使用範例和代碼片段，幫助您快速理解和擴展應用程式。

## 目錄

1. [Svelte 響應式範例](#svelte-響應式範例)
2. [Tauri Commands 範例](#tauri-commands-範例)
3. [Store 使用範例](#store-使用範例)
4. [動畫範例](#動畫範例)
5. [事件處理範例](#事件處理範例)
6. [擴展功能範例](#擴展功能範例)

## Svelte 響應式範例

### 基本響應式變數

```svelte
<script lang="ts">
  // 響應式變數
  let count = 0;

  // count 改變時，UI 自動更新
  function increment() {
    count += 1;
  }
</script>

<button on:click={increment}>
  點擊次數: {count}
</button>
```

### 響應式語句（$:）

```svelte
<script lang="ts">
  let firstName = 'John';
  let lastName = 'Doe';

  // 自動計算全名
  $: fullName = `${firstName} ${lastName}`;

  // 響應式副作用
  $: console.log('Full name is:', fullName);

  // 條件響應式
  $: if (fullName.length > 20) {
    console.log('Name is too long!');
  }
</script>

<input bind:value={firstName} placeholder="First name" />
<input bind:value={lastName} placeholder="Last name" />
<p>全名: {fullName}</p>
```

### 雙向綁定

```svelte
<script lang="ts">
  let text = '';
  let checked = false;
  let selected = 'option1';
  let number = 0;
</script>

<!-- 文本輸入 -->
<input bind:value={text} />

<!-- 複選框 -->
<input type="checkbox" bind:checked />

<!-- 下拉選單 -->
<select bind:value={selected}>
  <option value="option1">選項 1</option>
  <option value="option2">選項 2</option>
</select>

<!-- 數字輸入 -->
<input type="number" bind:value={number} />
```

## Tauri Commands 範例

### 基本 Command

```rust
// src-tauri/src/main.rs

#[tauri::command]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}

// 註冊命令
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

```typescript
// Frontend
import { invoke } from '@tauri-apps/api/core';

async function greetUser() {
  const message = await invoke<string>('greet', { name: 'Alice' });
  console.log(message);  // "Hello, Alice!"
}
```

### 帶狀態的 Command

```rust
use tauri::State;
use std::sync::Mutex;

struct AppState {
    counter: Mutex<i32>,
}

#[tauri::command]
fn increment_counter(state: State<AppState>) -> i32 {
    let mut counter = state.counter.lock().unwrap();
    *counter += 1;
    *counter
}

#[tauri::command]
fn get_counter(state: State<AppState>) -> i32 {
    *state.counter.lock().unwrap()
}
```

### 錯誤處理

```rust
#[tauri::command]
fn divide(a: i32, b: i32) -> Result<i32, String> {
    if b == 0 {
        Err("Cannot divide by zero".to_string())
    } else {
        Ok(a / b)
    }
}
```

```typescript
// Frontend
try {
  const result = await invoke<number>('divide', { a: 10, b: 2 });
  console.log(result);  // 5
} catch (error) {
  console.error(error);  // "Cannot divide by zero"
}
```

### 異步 Command

```rust
#[tauri::command]
async fn fetch_data(url: String) -> Result<String, String> {
    let response = reqwest::get(&url)
        .await
        .map_err(|e| e.to_string())?;

    let body = response.text()
        .await
        .map_err(|e| e.to_string())?;

    Ok(body)
}
```

## Store 使用範例

### 創建 Writable Store

```typescript
// stores/counter.ts
import { writable } from 'svelte/store';

export const counter = writable(0);

export const counterActions = {
  increment() {
    counter.update(n => n + 1);
  },

  decrement() {
    counter.update(n => n - 1);
  },

  reset() {
    counter.set(0);
  }
};
```

```svelte
<!-- Component.svelte -->
<script lang="ts">
  import { counter, counterActions } from './stores/counter';
</script>

<div>
  <p>Count: {$counter}</p>
  <button on:click={counterActions.increment}>+</button>
  <button on:click={counterActions.decrement}>-</button>
  <button on:click={counterActions.reset}>Reset</button>
</div>
```

### 創建 Derived Store

```typescript
// stores/user.ts
import { writable, derived } from 'svelte/store';

interface User {
  firstName: string;
  lastName: string;
  age: number;
}

export const user = writable<User>({
  firstName: 'John',
  lastName: 'Doe',
  age: 30,
});

// 派生 store - 自動計算
export const fullName = derived(
  user,
  $user => `${$user.firstName} ${$user.lastName}`
);

export const isAdult = derived(
  user,
  $user => $user.age >= 18
);

// 組合多個 stores
export const userInfo = derived(
  [user, fullName, isAdult],
  ([$user, $fullName, $isAdult]) => ({
    name: $fullName,
    age: $user.age,
    status: $isAdult ? 'Adult' : 'Minor',
  })
);
```

### 自定義 Store

```typescript
// stores/notifications.ts
import { writable } from 'svelte/store';

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error';
}

function createNotificationStore() {
  const { subscribe, update } = writable<Notification[]>([]);

  return {
    subscribe,

    add(message: string, type: Notification['type'] = 'info') {
      const id = Math.random().toString(36);
      const notification = { id, message, type };

      update(notifications => [...notifications, notification]);

      // 自動移除
      setTimeout(() => {
        this.remove(id);
      }, 3000);
    },

    remove(id: string) {
      update(notifications =>
        notifications.filter(n => n.id !== id)
      );
    },

    clear() {
      update(() => []);
    }
  };
}

export const notifications = createNotificationStore();
```

## 動畫範例

### Transition 基礎

```svelte
<script lang="ts">
  import { fade, fly, slide, scale } from 'svelte/transition';
  let visible = true;
</script>

<button on:click={() => visible = !visible}>
  Toggle
</button>

{#if visible}
  <!-- Fade 淡入淡出 -->
  <div transition:fade>
    Fade animation
  </div>

  <!-- Fly 飛入飛出 -->
  <div transition:fly={{ y: 200, duration: 300 }}>
    Fly from bottom
  </div>

  <!-- Slide 滑動 -->
  <div transition:slide>
    Slide animation
  </div>

  <!-- Scale 縮放 -->
  <div transition:scale={{ start: 0.5 }}>
    Scale animation
  </div>
{/if}
```

### In/Out 分離動畫

```svelte
<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  let visible = true;
</script>

{#if visible}
  <div
    in:fly={{ y: -20, duration: 300 }}
    out:fade={{ duration: 200 }}
  >
    不同的進入和退出動畫
  </div>
{/if}
```

### 列表動畫（FLIP）

```svelte
<script lang="ts">
  import { flip } from 'svelte/animate';
  import { fade } from 'svelte/transition';

  let items = ['Item 1', 'Item 2', 'Item 3'];

  function shuffle() {
    items = items.sort(() => Math.random() - 0.5);
  }

  function remove(index: number) {
    items = items.filter((_, i) => i !== index);
  }
</script>

<button on:click={shuffle}>Shuffle</button>

{#each items as item, i (item)}
  <div
    animate:flip={{ duration: 300 }}
    transition:fade
  >
    {item}
    <button on:click={() => remove(i)}>Remove</button>
  </div>
{/each}
```

### 自定義動畫

```typescript
// transitions/custom.ts
import { cubicOut } from 'svelte/easing';

export function typewriter(node: HTMLElement, { speed = 1 }) {
  const text = node.textContent || '';
  const duration = text.length / (speed * 0.01);

  return {
    duration,
    tick: (t: number) => {
      const i = Math.trunc(text.length * t);
      node.textContent = text.slice(0, i);
    }
  };
}
```

```svelte
<script lang="ts">
  import { typewriter } from './transitions/custom';
  let visible = true;
</script>

{#if visible}
  <p transition:typewriter={{ speed: 1 }}>
    This text will type out character by character
  </p>
{/if}
```

## 事件處理範例

### 基本事件

```svelte
<script lang="ts">
  function handleClick() {
    console.log('Button clicked!');
  }

  function handleMouseEnter() {
    console.log('Mouse entered!');
  }

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    console.log('Input value:', target.value);
  }
</script>

<button on:click={handleClick}>Click me</button>
<div on:mouseenter={handleMouseEnter}>Hover me</div>
<input on:input={handleInput} />
```

### 事件修飾符

```svelte
<script lang="ts">
  function handleClick() {
    console.log('Clicked!');
  }
</script>

<!-- preventDefault - 阻止默認行為 -->
<form on:submit|preventDefault={handleSubmit}>
  <button>Submit</button>
</form>

<!-- stopPropagation - 阻止事件冒泡 -->
<div on:click|stopPropagation={handleClick}>
  Click me
</div>

<!-- once - 只觸發一次 -->
<button on:click|once={handleClick}>
  One-time click
</button>

<!-- capture - 捕獲階段觸發 -->
<div on:click|capture={handleClick}>
  Capture phase
</div>

<!-- 組合使用 -->
<button on:click|preventDefault|stopPropagation={handleClick}>
  Multiple modifiers
</button>
```

### 組件事件

```svelte
<!-- Child.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{
    submit: { text: string };
    cancel: void;
  }>();

  let text = '';

  function handleSubmit() {
    dispatch('submit', { text });
    text = '';
  }
</script>

<input bind:value={text} />
<button on:click={handleSubmit}>Submit</button>
<button on:click={() => dispatch('cancel')}>Cancel</button>
```

```svelte
<!-- Parent.svelte -->
<script lang="ts">
  import Child from './Child.svelte';

  function handleSubmit(event: CustomEvent<{ text: string }>) {
    console.log('Submitted:', event.detail.text);
  }

  function handleCancel() {
    console.log('Cancelled');
  }
</script>

<Child
  on:submit={handleSubmit}
  on:cancel={handleCancel}
/>
```

## 擴展功能範例

### 添加標籤系統

```typescript
// types/Todo.ts (擴展)
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  tags: string[];  // 新增
  createdAt: number;
  updatedAt: number;
}
```

```rust
// main.rs (擴展)
#[derive(Debug, Clone, Serialize, Deserialize)]
struct Todo {
    id: String,
    text: String,
    completed: bool,
    tags: Vec<String>,  // 新增
    created_at: i64,
    updated_at: i64,
}

#[tauri::command]
fn add_tag(id: String, tag: String, state: State<AppState>) -> Result<Todo, String> {
    let mut todos = state.todos.lock().unwrap();

    let todo = todos
        .iter_mut()
        .find(|t| t.id == id)
        .ok_or("Todo not found")?;

    if !todo.tags.contains(&tag) {
        todo.tags.push(tag);
    }

    todo.updated_at = chrono::Utc::now().timestamp_millis();
    let updated_todo = todo.clone();
    drop(todos);

    state.save_to_file().map_err(|e| e.to_string())?;
    Ok(updated_todo)
}
```

### 添加通知功能

```typescript
// utils/notifications.ts
import { sendNotification } from '@tauri-apps/plugin-notification';

export async function notifyTodoCompleted(text: string) {
  await sendNotification({
    title: 'Todo Completed!',
    body: `✅ ${text}`,
  });
}

export async function notifyTodoAdded(text: string) {
  await sendNotification({
    title: 'Todo Added',
    body: `📝 ${text}`,
  });
}
```

### 添加撤銷/重做

```typescript
// stores/history.ts
import { writable } from 'svelte/store';

interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

export function createHistoryStore<T>(initialState: T) {
  const { subscribe, set, update } = writable<HistoryState<T>>({
    past: [],
    present: initialState,
    future: [],
  });

  return {
    subscribe,

    push(newState: T) {
      update(state => ({
        past: [...state.past, state.present],
        present: newState,
        future: [],
      }));
    },

    undo() {
      update(state => {
        if (state.past.length === 0) return state;

        const previous = state.past[state.past.length - 1];
        const newPast = state.past.slice(0, -1);

        return {
          past: newPast,
          present: previous,
          future: [state.present, ...state.future],
        };
      });
    },

    redo() {
      update(state => {
        if (state.future.length === 0) return state;

        const next = state.future[0];
        const newFuture = state.future.slice(1);

        return {
          past: [...state.past, state.present],
          present: next,
          future: newFuture,
        };
      });
    },

    canUndo: () => {
      let canUndo = false;
      subscribe(state => {
        canUndo = state.past.length > 0;
      })();
      return canUndo;
    },

    canRedo: () => {
      let canRedo = false;
      subscribe(state => {
        canRedo = state.future.length > 0;
      })();
      return canRedo;
    },
  };
}
```

### 添加導入/導出功能

```rust
use tauri::api::dialog;

#[tauri::command]
async fn export_todos(
    app_handle: tauri::AppHandle,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let todos = state.todos.lock().unwrap();
    let json = serde_json::to_string_pretty(&*todos)
        .map_err(|e| e.to_string())?;

    // 打開保存對話框
    let file_path = dialog::FileDialogBuilder::new()
        .set_title("Export Todos")
        .add_filter("JSON", &["json"])
        .save_file();

    if let Some(path) = file_path {
        std::fs::write(path, json)
            .map_err(|e| e.to_string())?;
    }

    Ok(())
}

#[tauri::command]
async fn import_todos(
    app_handle: tauri::AppHandle,
    state: State<'_, AppState>,
) -> Result<Vec<Todo>, String> {
    // 打開文件對話框
    let file_path = dialog::FileDialogBuilder::new()
        .set_title("Import Todos")
        .add_filter("JSON", &["json"])
        .pick_file();

    if let Some(path) = file_path {
        let content = std::fs::read_to_string(path)
            .map_err(|e| e.to_string())?;

        let imported_todos: Vec<Todo> = serde_json::from_str(&content)
            .map_err(|e| e.to_string())?;

        let mut todos = state.todos.lock().unwrap();
        todos.extend(imported_todos);
        let result = todos.clone();
        drop(todos);

        state.save_to_file().map_err(|e| e.to_string())?;

        return Ok(result);
    }

    Err("No file selected".to_string())
}
```

### 添加全局快捷鍵

```rust
use tauri::GlobalShortcutManager;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let mut shortcuts = app.global_shortcut_manager();

            // 註冊全局快捷鍵
            shortcuts.register("CommandOrControl+Shift+T", || {
                println!("Global shortcut triggered!");
                // 顯示應用視窗
            })?;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

## 總結

這些範例展示了：

1. **Svelte 響應式系統** - 簡潔而強大
2. **Tauri Commands** - 安全的前後端通訊
3. **Store 管理** - 優雅的狀態管理
4. **動畫系統** - 流暢的用戶體驗
5. **事件處理** - 完整的交互支援
6. **擴展功能** - 如何添加新特性

您可以基於這些範例構建更複雜的功能，同時保持代碼的簡潔性和可維護性。

Happy Coding! 🎉
