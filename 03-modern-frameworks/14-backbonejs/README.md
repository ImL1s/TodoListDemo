# Backbone.js Todo List

> 使用經典 MVC 框架 Backbone.js 建構的 Todo List 應用程式

## 目錄

- [簡介](#簡介)
- [Backbone.js 歷史與重要性](#backbonejs-歷史與重要性)
- [為什麼要學習 Backbone.js](#為什麼要學習-backbonejs)
- [核心概念](#核心概念)
- [MVC/MVP 模式](#mvcmvp-模式)
- [專案結構](#專案結構)
- [功能特性](#功能特性)
- [技術棧](#技術棧)
- [快速開始](#快速開始)
- [詳細代碼解析](#詳細代碼解析)
- [與現代框架的對比](#與現代框架的對比)
- [Backbone.js 的遺產與影響](#backbonejs-的遺產與影響)
- [最佳實踐](#最佳實踐)
- [常見問題](#常見問題)
- [延伸閱讀](#延伸閱讀)

---

## 簡介

這是一個使用 Backbone.js 建構的完整 Todo List 應用程式。Backbone.js 是一個輕量級的 JavaScript MVC 框架，為 Web 應用程式提供了基本的結構，包括 Models、Collections、Views 和 Events。

### 為什麼選擇 Backbone.js？

- **歷史地位**：Backbone.js 是現代前端框架的先驅之一
- **學習價值**：理解 MVC 架構和事件驅動編程
- **輕量級**：核心代碼只有 8KB (gzipped)
- **靈活性**：不強制特定的結構，可以根據需求自由組織
- **生態系統**：大量的插件和擴展

---

## Backbone.js 歷史與重要性

### 誕生背景

Backbone.js 由 **Jeremy Ashkenas** 於 **2010 年 10 月**創建並發布，當時正值前端開發的轉型期：

#### 2010 年之前的前端開發

```javascript
// jQuery 意大利麵代碼（Spaghetti Code）
$(document).ready(function() {
    $('#add-button').click(function() {
        var text = $('#input').val();
        var html = '<li>' + text + '<button class="delete">×</button></li>';
        $('#list').append(html);

        // 資料散落在 DOM 中，沒有統一的資料模型
        // 事件處理邏輯混亂
        // 難以維護和測試
    });

    $(document).on('click', '.delete', function() {
        $(this).parent().remove();
    });
});
```

#### Backbone.js 帶來的改變

```javascript
// Backbone.js：結構化的代碼
var Todo = Backbone.Model.extend({
    defaults: {
        title: '',
        completed: false
    }
});

var TodoList = Backbone.Collection.extend({
    model: Todo,
    localStorage: new Backbone.LocalStorage('todos')
});

var TodoView = Backbone.View.extend({
    tagName: 'li',
    template: _.template($('#item-template').html()),

    events: {
        'click .delete': 'remove'
    },

    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});
```

### 發展歷程

| 時間 | 版本 | 重要特性 |
|------|------|----------|
| 2010.10 | 0.1.0 | 首次發布 |
| 2011.03 | 0.3.0 | 添加 Router 和 History |
| 2012.03 | 0.9.0 | 改進事件系統 |
| 2013.05 | 1.0.0 | 正式版本發布 |
| 2015.04 | 1.2.0 | 改進 Collection 和 View |
| 2016.04 | 1.3.0 | 支持 ES6 Promise |
| 2019.11 | 1.4.0 | 最新穩定版本 |

### 影響力

Backbone.js 在前端開發史上具有重要地位：

1. **結構化 JavaScript 應用**
   - 第一批將 MVC 模式引入前端的框架
   - 為 JavaScript 應用提供了清晰的架構

2. **影響後續框架**
   - Angular 的早期版本受到啟發
   - Ember.js 的部分設計理念
   - React 的部分思想（單向數據流）

3. **業界採用**
   - Airbnb、LinkedIn、Trello、SoundCloud 等知名公司使用
   - GitHub、Bitbucket 等平台的部分功能使用 Backbone.js

4. **教育價值**
   - 清晰展示了前端 MVC 模式
   - 是學習框架設計的優秀教材

---

## 為什麼要學習 Backbone.js

### 1. 理解現代框架的演進

Backbone.js 是連接 jQuery 時代和現代框架（React/Vue/Angular）的橋樑：

```
jQuery (DOM 操作)
    ↓
Backbone.js (MVC 結構)
    ↓
Angular/Ember (完整框架)
    ↓
React/Vue (組件化)
    ↓
Next.js/Nuxt.js (元框架)
```

#### 學習路徑

```javascript
// 第一階段：jQuery
$('#todo-list').append('<li>' + text + '</li>');

// 第二階段：Backbone.js
var todo = new Todo({ title: text });
todos.add(todo);

// 第三階段：React
setTodos([...todos, { title: text }]);

// 第四階段：理解演進
// - jQuery: 直接操作 DOM
// - Backbone: 資料與視圖分離
// - React: 聲明式 UI + 虛擬 DOM
```

### 2. 掌握 MVC/MVP 架構模式

Backbone.js 清晰地展示了 MVC 模式：

```
┌─────────────────────────────────────┐
│           MVC 架構圖                │
├─────────────────────────────────────┤
│                                     │
│  ┌──────┐      ┌──────┐            │
│  │ User │ ───> │ View │            │
│  └──────┘      └──────┘            │
│                   │                 │
│                   ↓                 │
│              ┌──────────┐           │
│              │Controller│           │
│              └──────────┘           │
│                   │                 │
│                   ↓                 │
│              ┌───────┐              │
│              │ Model │              │
│              └───────┘              │
│                   │                 │
│                   ↓                 │
│              ┌─────────┐            │
│              │LocalStorage│         │
│              └─────────┘            │
└─────────────────────────────────────┘
```

### 3. 學習事件驅動編程

Backbone.js 的事件系統非常優雅：

```javascript
// 發布-訂閱模式
var model = new Backbone.Model();

// 訂閱事件
model.on('change:title', function(model, value) {
    console.log('標題變更為:', value);
});

// 發布事件
model.set('title', '新標題'); // 自動觸發 change:title 事件

// 這種模式影響了：
// - Node.js EventEmitter
// - React 的生命週期
// - Vue 的事件系統
```

### 4. 理解前端數據持久化

```javascript
// Backbone.js 的 Sync 機制
var Todo = Backbone.Model.extend({
    urlRoot: '/api/todos'
});

var todo = new Todo({ title: '學習 Backbone' });

// 自動發送 POST 請求到 /api/todos
todo.save();

// 自動發送 GET 請求
todo.fetch();

// 自動發送 PUT 請求
todo.set('completed', true);
todo.save();

// 自動發送 DELETE 請求
todo.destroy();
```

### 5. 掌握模板引擎

Underscore.js 模板是模板引擎的基礎：

```javascript
// Underscore.js 模板
var template = _.template(`
    <div class="todo">
        <h3><%= title %></h3>
        <% if (completed) { %>
            <span class="done">✓</span>
        <% } %>
    </div>
`);

var html = template({
    title: '學習模板',
    completed: true
});

// 這影響了：
// - EJS (Node.js)
// - Lodash 模板
// - 早期的 Angular 模板
```

### 6. 維護遺留系統

現實中仍有大量使用 Backbone.js 的專案：

- **企業級應用**：許多大型企業的內部系統
- **成熟產品**：已運行多年的穩定產品
- **技術債務**：需要維護和升級的舊代碼

掌握 Backbone.js 可以：
- 維護現有專案
- 進行漸進式重構
- 理解技術決策的歷史背景

### 7. 提升框架無關的能力

學習 Backbone.js 培養的能力是通用的：

```javascript
// 1. 資料建模
class Todo extends Backbone.Model {
    defaults() {
        return {
            title: '',
            completed: false
        };
    }
}

// 2. 狀態管理
class Todos extends Backbone.Collection {
    model = Todo;

    completed() {
        return this.filter(todo => todo.get('completed'));
    }
}

// 3. 視圖邏輯
class TodoView extends Backbone.View {
    events = {
        'click .toggle': 'toggleCompleted',
        'dblclick label': 'edit'
    };
}

// 這些概念在任何框架中都適用
```

---

## 核心概念

### 1. Model（模型）

Model 是資料的容器，包含業務邏輯和驗證規則。

#### 基本用法

```javascript
var Todo = Backbone.Model.extend({
    // 預設屬性
    defaults: {
        title: '',
        completed: false,
        order: 0
    },

    // 初始化方法
    initialize: function() {
        console.log('Todo created:', this.get('title'));
    },

    // 驗證方法
    validate: function(attrs) {
        if (!attrs.title || attrs.title.trim() === '') {
            return '標題不能為空';
        }
    },

    // 自定義方法
    toggle: function() {
        this.save({ completed: !this.get('completed') });
    }
});

// 創建實例
var todo = new Todo({
    title: '學習 Backbone.js',
    completed: false
});

// 獲取屬性
console.log(todo.get('title')); // "學習 Backbone.js"

// 設定屬性
todo.set('completed', true);

// 監聽變更
todo.on('change:completed', function(model, value) {
    console.log('完成狀態:', value);
});
```

#### Model 的生命週期

```javascript
var Todo = Backbone.Model.extend({
    initialize: function() {
        console.log('1. Model 創建');

        this.on('change', function() {
            console.log('2. 屬性變更');
        });

        this.on('sync', function() {
            console.log('3. 與服務器同步');
        });

        this.on('destroy', function() {
            console.log('4. Model 銷毀');
        });

        this.on('invalid', function(model, error) {
            console.log('5. 驗證失敗:', error);
        });
    }
});
```

#### Model 的事件系統

```javascript
// 內建事件
var todo = new Todo();

todo.on('change', callback);           // 任何屬性變更
todo.on('change:title', callback);     // 特定屬性變更
todo.on('destroy', callback);          // Model 銷毀
todo.on('sync', callback);             // 與服務器同步
todo.on('error', callback);            // 發生錯誤
todo.on('invalid', callback);          // 驗證失敗

// 自定義事件
todo.on('completed', function() {
    console.log('Todo 完成了！');
});

todo.trigger('completed');
```

### 2. Collection（集合）

Collection 是 Model 的有序集合，提供豐富的操作方法。

#### 基本用法

```javascript
var TodoList = Backbone.Collection.extend({
    // 指定 Model 類型
    model: Todo,

    // LocalStorage 配置
    localStorage: new Backbone.LocalStorage('todos'),

    // 排序方法
    comparator: 'order',

    // 自定義方法
    completed: function() {
        return this.filter(function(todo) {
            return todo.get('completed');
        });
    },

    remaining: function() {
        return this.without.apply(this, this.completed());
    }
});

// 創建實例
var todos = new TodoList();

// 添加 Model
todos.add(new Todo({ title: '任務 1' }));
todos.add([
    { title: '任務 2' },
    { title: '任務 3' }
]);

// 移除 Model
todos.remove(todos.at(0));

// 查詢
var firstTodo = todos.at(0);
var todoById = todos.get('id');
var completed = todos.completed();
```

#### Collection 的 Underscore.js 方法

Collection 繼承了所有 Underscore.js 的陣列方法：

```javascript
// 迭代方法
todos.each(function(todo) {
    console.log(todo.get('title'));
});

todos.map(function(todo) {
    return todo.get('title');
});

// 過濾方法
var activeTodos = todos.filter(function(todo) {
    return !todo.get('completed');
});

var firstActive = todos.find(function(todo) {
    return !todo.get('completed');
});

// 檢查方法
var hasCompleted = todos.some(function(todo) {
    return todo.get('completed');
});

var allCompleted = todos.every(function(todo) {
    return todo.get('completed');
});

// 統計方法
var totalCompleted = todos.reduce(function(count, todo) {
    return count + (todo.get('completed') ? 1 : 0);
}, 0);

// 排序方法
var sorted = todos.sortBy(function(todo) {
    return todo.get('order');
});

// 分組方法
var grouped = todos.groupBy(function(todo) {
    return todo.get('completed') ? 'completed' : 'active';
});
```

### 3. View（視圖）

View 負責 DOM 操作和用戶交互。

#### 基本用法

```javascript
var TodoView = Backbone.View.extend({
    // 標籤名稱
    tagName: 'li',

    // CSS class
    className: 'todo-item',

    // 模板
    template: _.template($('#item-template').html()),

    // 事件綁定
    events: {
        'click .toggle': 'toggleCompleted',
        'dblclick label': 'edit',
        'click .destroy': 'clear'
    },

    // 初始化
    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);
    },

    // 渲染
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    // 事件處理
    toggleCompleted: function() {
        this.model.toggle();
    },

    edit: function() {
        this.$el.addClass('editing');
        this.$('.edit').focus();
    },

    clear: function() {
        this.model.destroy();
    }
});

// 使用
var todoView = new TodoView({
    model: new Todo({ title: '學習 View' })
});

$('#todo-list').append(todoView.render().el);
```

#### View 的 DOM 操作

```javascript
var AppView = Backbone.View.extend({
    el: '#app',

    initialize: function() {
        // this.el: 原生 DOM 元素
        // this.$el: jQuery 包裝的元素

        // 快取常用元素
        this.$input = this.$('#new-todo');
        this.$list = this.$('#todo-list');

        // 使用 $ 方法在元素內查找
        this.$('.filter').on('click', this.filter);
    },

    render: function() {
        // 設定 HTML
        this.$el.html(template(data));

        // 添加元素
        this.$list.append(view.el);

        // 修改屬性
        this.$el.toggleClass('active', true);

        return this;
    }
});
```

### 4. Events（事件）

Backbone.Events 提供了強大的事件系統。

#### 事件方法

```javascript
// on: 綁定事件
object.on('event', callback, context);

// off: 解綁事件
object.off('event', callback);

// trigger: 觸發事件
object.trigger('event', arg1, arg2);

// once: 只觸發一次
object.once('event', callback);

// listenTo: 監聽其他物件的事件
view.listenTo(model, 'change', callback);

// stopListening: 停止監聽
view.stopListening(model, 'change');
```

#### 自定義事件物件

```javascript
var eventBus = _.extend({}, Backbone.Events);

// 組件 A
eventBus.on('user:login', function(user) {
    console.log('用戶登入:', user);
});

// 組件 B
eventBus.trigger('user:login', { name: 'John' });

// 這就是簡單的事件總線（Event Bus）
```

### 5. Router（路由）

Router 管理應用的 URL 和狀態。

#### 基本用法

```javascript
var AppRouter = Backbone.Router.extend({
    routes: {
        '': 'index',
        'todos/:filter': 'filter',
        'todo/:id': 'show',
        '*notFound': 'notFound'
    },

    index: function() {
        console.log('首頁');
    },

    filter: function(filter) {
        console.log('過濾:', filter);
        app.filterTodos(filter);
    },

    show: function(id) {
        console.log('顯示 Todo:', id);
    },

    notFound: function(path) {
        console.log('404:', path);
    }
});

// 啟動路由
var router = new AppRouter();
Backbone.history.start();

// 導航
router.navigate('todos/active', { trigger: true });
```

### 6. Sync（同步）

Backbone.sync 負責與服務器通信。

#### RESTful 映射

```javascript
// Backbone.sync 自動將 CRUD 操作映射到 HTTP 方法

// Create → POST   /collection
model.save();  // POST /todos

// Read   → GET    /collection/:id
model.fetch(); // GET /todos/123

// Update → PUT    /collection/:id
model.save();  // PUT /todos/123

// Delete → DELETE /collection/:id
model.destroy(); // DELETE /todos/123

// Read   → GET    /collection
collection.fetch(); // GET /todos
```

#### 自定義 Sync

```javascript
// LocalStorage Sync
Backbone.sync = function(method, model, options) {
    switch (method) {
        case 'create':
            return localStorage.setItem(model.id, JSON.stringify(model));
        case 'read':
            return JSON.parse(localStorage.getItem(model.id));
        case 'update':
            return localStorage.setItem(model.id, JSON.stringify(model));
        case 'delete':
            return localStorage.removeItem(model.id);
    }
};
```

---

## MVC/MVP 模式

### Backbone.js 的架構模式

Backbone.js 實際上實現的是 **MVP (Model-View-Presenter)** 模式，而不是傳統的 MVC。

#### MVC vs MVP

```
傳統 MVC:
┌──────┐    ┌────────────┐    ┌───────┐
│ View │───>│ Controller │───>│ Model │
└──────┘    └────────────┘    └───────┘
    ↑                              │
    └──────────────────────────────┘

Backbone.js MVP:
┌──────┐    ┌───────┐    ┌───────┐
│ View │<──>│ Model │    │ Router│
└──────┘    └───────┘    └───────┘
    │                         │
    └─────────────────────────┘
```

### Backbone.js 的 MVP 實現

#### Model（模型層）

```javascript
// 負責：
// 1. 資料管理
// 2. 業務邏輯
// 3. 資料驗證
// 4. 與服務器同步

var Todo = Backbone.Model.extend({
    defaults: {
        title: '',
        completed: false
    },

    validate: function(attrs) {
        if (!attrs.title.trim()) {
            return '標題不能為空';
        }
    },

    toggle: function() {
        this.save({
            completed: !this.get('completed')
        });
    }
});
```

#### View（視圖層）

```javascript
// 負責：
// 1. DOM 渲染
// 2. 用戶交互
// 3. 事件處理
// 4. UI 邏輯

var TodoView = Backbone.View.extend({
    template: _.template('<li><%= title %></li>'),

    events: {
        'click .toggle': 'toggleCompleted'
    },

    initialize: function() {
        // 監聽 Model 變更
        this.listenTo(this.model, 'change', this.render);
    },

    render: function() {
        // 從 Model 獲取資料
        var data = this.model.toJSON();
        // 渲染到 DOM
        this.$el.html(this.template(data));
        return this;
    },

    toggleCompleted: function() {
        // 更新 Model
        this.model.toggle();
    }
});
```

#### Presenter（表示層）

在 Backbone.js 中，Presenter 的角色由 **View + Router** 共同承擔：

```javascript
// View 作為 Presenter
var AppView = Backbone.View.extend({
    initialize: function() {
        // 管理 Model 和 Collection
        this.collection = new Todos();

        // 監聽事件
        this.listenTo(this.collection, 'add', this.addOne);
        this.listenTo(this.collection, 'reset', this.addAll);
    },

    addOne: function(todo) {
        // 協調 Model 和子 View
        var view = new TodoView({ model: todo });
        this.$list.append(view.render().el);
    }
});

// Router 作為 Presenter
var AppRouter = Backbone.Router.extend({
    routes: {
        'todos/:filter': 'filter'
    },

    filter: function(filter) {
        // 協調應用狀態
        app.filter = filter;
        app.filterTodos();
    }
});
```

### 數據流

```
用戶操作 → View (事件處理)
              ↓
           Model (更新資料)
              ↓
         觸發 change 事件
              ↓
         View (重新渲染)
              ↓
           更新 DOM
```

#### 完整流程示例

```javascript
// 1. 用戶點擊 checkbox
// View 的事件處理
events: {
    'click .toggle': 'toggleCompleted'
}

// 2. 調用事件處理器
toggleCompleted: function() {
    this.model.toggle(); // 更新 Model
}

// 3. Model 更新資料
toggle: function() {
    this.save({
        completed: !this.get('completed')
    });
}

// 4. Model 觸發 change 事件
// (Backbone 自動觸發)

// 5. View 監聽 change 事件
initialize: function() {
    this.listenTo(this.model, 'change', this.render);
}

// 6. 重新渲染 View
render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
}

// 7. DOM 更新完成
```

### 關注點分離

Backbone.js 實現了清晰的關注點分離：

```javascript
// ✅ 好的做法：分離關注點

// Model: 只管理資料
var Todo = Backbone.Model.extend({
    defaults: { title: '', completed: false },
    toggle: function() {
        this.set('completed', !this.get('completed'));
    }
});

// View: 只管理 UI
var TodoView = Backbone.View.extend({
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
    toggleCompleted: function() {
        this.model.toggle(); // 委託給 Model
    }
});

// ❌ 壞的做法：混合關注點

var TodoView = Backbone.View.extend({
    toggleCompleted: function() {
        // 直接操作資料和 DOM
        var completed = this.model.get('completed');
        this.model.set('completed', !completed);
        this.$('.checkbox').prop('checked', !completed);
        localStorage.setItem('todos', JSON.stringify(this.model));
    }
});
```

---

## 專案結構

```
03-modern-frameworks/14-backbonejs/
├── index.html              # 主 HTML 文件
├── css/
│   └── style.css          # 樣式表
├── js/
│   ├── models/
│   │   └── Todo.js        # Todo Model
│   ├── collections/
│   │   └── Todos.js       # Todos Collection
│   ├── views/
│   │   ├── TodoView.js    # 單個 Todo 視圖
│   │   └── AppView.js     # 主應用視圖
│   └── app.js             # 應用入口
└── README.md              # 專案文檔
```

### 文件說明

#### index.html

主 HTML 文件，包含：
- 應用的 HTML 結構
- Underscore.js 模板
- CDN 引用（jQuery, Underscore.js, Backbone.js）
- 腳本引用

#### css/style.css

完整的 CSS 樣式，包含：
- 全域樣式
- 組件樣式
- 響應式設計
- 動畫效果

#### js/models/Todo.js

Todo Model 定義，包含：
- 資料模型
- 業務邏輯
- 驗證規則
- 自定義方法

#### js/collections/Todos.js

Todos Collection 定義，包含：
- Model 集合管理
- LocalStorage 配置
- 過濾方法
- 統計方法

#### js/views/TodoView.js

單個 Todo 視圖，包含：
- 渲染邏輯
- 事件處理
- 編輯功能
- DOM 操作

#### js/views/AppView.js

主應用視圖，包含：
- 全域 UI 管理
- Collection 監聽
- 過濾功能
- 統計更新

#### js/app.js

應用入口，包含：
- 應用初始化
- 全域事件監聽
- 鍵盤快捷鍵
- 除錯工具

---

## 功能特性

### 核心功能

- ✅ **新增待辦事項**：輸入文字後點擊新增或按 Enter
- ✅ **標記完成**：點擊 checkbox 切換完成狀態
- ✅ **編輯事項**：雙擊文字進入編輯模式
- ✅ **刪除事項**：點擊刪除按鈕（有確認對話框）
- ✅ **過濾顯示**：全部 / 進行中 / 已完成
- ✅ **清除已完成**：一鍵清除所有已完成的事項
- ✅ **統計資訊**：顯示待辦事項數量

### 技術特性

- ✅ **LocalStorage 持久化**：資料自動保存到瀏覽器
- ✅ **事件驅動**：Model-View 自動同步
- ✅ **模板渲染**：使用 Underscore.js 模板
- ✅ **MVC 架構**：清晰的代碼結構
- ✅ **響應式設計**：支持手機和平板
- ✅ **除錯工具**：內建開發者工具
- ✅ **鍵盤快捷鍵**：提升操作效率

### 進階功能

- ✅ **資料導出**：匯出為 JSON 檔案
- ✅ **資料導入**：從 JSON 導入
- ✅ **測試資料**：快速添加測試資料
- ✅ **狀態管理**：完整的應用狀態追蹤
- ✅ **錯誤處理**：驗證和錯誤提示
- ✅ **動畫效果**：流暢的 UI 動畫

---

## 技術棧

### 核心依賴

| 技術 | 版本 | 用途 |
|------|------|------|
| Backbone.js | 1.4.1 | MVC 框架 |
| Underscore.js | 1.13.6 | 工具庫和模板引擎 |
| jQuery | 3.6.0 | DOM 操作 |
| Backbone.LocalStorage | 1.1.16 | 本地儲存適配器 |

### 為什麼選擇這些技術？

#### Backbone.js 1.4.1

```javascript
// 優勢
- 輕量級（8KB gzipped）
- 靈活性高
- 學習曲線平緩
- RESTful 原生支持
- 豐富的事件系統

// 特性
Model.extend({
    defaults: {},      // 預設值
    validate: {},      // 驗證
    initialize: {},    // 初始化
    // 自動事件觸發
});
```

#### Underscore.js 1.13.6

```javascript
// 提供 100+ 個工具函數

// 集合操作
_.each(list, iterator);
_.map(list, iterator);
_.filter(list, predicate);
_.find(list, predicate);

// 陣列操作
_.first(array);
_.last(array);
_.flatten(array);

// 物件操作
_.extend(destination, sources);
_.pick(object, keys);
_.omit(object, keys);

// 函數操作
_.debounce(function, wait);
_.throttle(function, wait);

// 模板引擎
_.template(templateString);
```

#### jQuery 3.6.0

```javascript
// DOM 操作
$('#element').html('content');
$('.class').addClass('active');

// 事件處理
$('#button').on('click', handler);
$(document).ready(function() {});

// AJAX
$.ajax({
    url: '/api/todos',
    method: 'POST',
    data: { title: 'Todo' }
});

// 動畫
$('#element').fadeIn(300);
```

#### Backbone.LocalStorage 1.1.16

```javascript
// 替代 RESTful API，使用 localStorage

var Todos = Backbone.Collection.extend({
    localStorage: new Backbone.LocalStorage('todos')
});

// 自動保存到 localStorage
var todos = new Todos();
todos.fetch();  // 從 localStorage 讀取
todos.create({ title: 'Todo' }); // 保存到 localStorage
```

---

## 快速開始

### 1. 下載檔案

```bash
# 克隆專案
git clone <repository-url>
cd 03-modern-frameworks/14-backbonejs
```

### 2. 啟動應用

使用任何 HTTP 服務器：

```bash
# 使用 Python
python -m http.server 8000

# 使用 Node.js http-server
npx http-server -p 8000

# 使用 PHP
php -S localhost:8000
```

### 3. 打開瀏覽器

訪問 `http://localhost:8000`

### 4. 開始使用

1. 在輸入框中輸入待辦事項
2. 按 Enter 或點擊「新增」按鈕
3. 點擊 checkbox 標記完成
4. 雙擊文字編輯事項
5. 點擊 × 刪除事項

---

## 詳細代碼解析

### 1. Todo Model（js/models/Todo.js）

```javascript
app.Todo = Backbone.Model.extend({
    // 預設屬性
    defaults: {
        title: '',
        completed: false,
        order: 0,
        created: null
    },

    // 初始化
    initialize: function() {
        // 設定創建時間
        if (!this.get('created')) {
            this.set('created', new Date().getTime());
        }

        // 監聽變更
        this.on('change', function() {
            console.log('Todo changed:', this.toJSON());
        });
    },

    // 驗證
    validate: function(attrs) {
        if (attrs.title !== undefined && attrs.title.trim() === '') {
            return '待辦事項標題不能為空';
        }
    },

    // 切換完成狀態
    toggle: function() {
        this.save({
            completed: !this.get('completed')
        });
    }
});
```

#### 關鍵概念

**defaults**：預設屬性值

```javascript
var todo = new Todo(); // 使用預設值
console.log(todo.get('title')); // ""
console.log(todo.get('completed')); // false

var todo2 = new Todo({ title: '學習 Backbone' });
console.log(todo2.get('title')); // "學習 Backbone"
console.log(todo2.get('completed')); // false (使用預設值)
```

**initialize**：初始化方法

```javascript
// 在創建 Model 時自動調用
var todo = new Todo({ title: '學習' });
// 會自動執行 initialize 方法
// 設定 created 時間戳
```

**validate**：驗證方法

```javascript
// 在 save() 時自動調用
var todo = new Todo();

// 驗證成功
todo.save({ title: '學習 Backbone' }); // ✅

// 驗證失敗
todo.save({ title: '' }, { validate: true }); // ❌
// 觸發 'invalid' 事件
```

**自定義方法**：業務邏輯

```javascript
toggle: function() {
    // 封裝業務邏輯
    this.save({
        completed: !this.get('completed')
    });
}

// 使用
todo.toggle(); // 切換完成狀態
```

### 2. Todos Collection（js/collections/Todos.js）

```javascript
app.Todos = Backbone.Collection.extend({
    // 指定 Model 類型
    model: app.Todo,

    // LocalStorage 配置
    localStorage: new Backbone.LocalStorage('todos-backbone'),

    // 排序
    comparator: function(todo) {
        return todo.get('order') || todo.get('created');
    },

    // 獲取已完成
    completed: function() {
        return this.filter(function(todo) {
            return todo.get('completed');
        });
    },

    // 獲取進行中
    remaining: function() {
        return this.filter(function(todo) {
            return !todo.get('completed');
        });
    },

    // 下一個 order
    nextOrder: function() {
        if (!this.length) return 1;
        return this.last().get('order') + 1;
    },

    // 創建 Todo
    createTodo: function(attrs) {
        return this.create(_.extend({
            order: this.nextOrder(),
            created: new Date().getTime()
        }, attrs), {
            validate: true,
            wait: true
        });
    },

    // 清除已完成
    clearCompleted: function() {
        var completed = this.completed();
        _.each(completed, function(todo) {
            todo.destroy();
        });
        return completed.length;
    }
});
```

#### 關鍵概念

**model**：指定 Model 類型

```javascript
// Collection 會自動將資料轉換為 Todo Model
var todos = new Todos();

todos.add({ title: '學習' });
// 自動創建 Todo Model 實例

todos.add([
    { title: '任務 1' },
    { title: '任務 2' }
]);
// 批量創建
```

**localStorage**：本地儲存

```javascript
// 使用 Backbone.LocalStorage 插件
localStorage: new Backbone.LocalStorage('todos-backbone')

// 自動處理 CRUD 操作
todos.fetch();          // 從 localStorage 讀取
todos.create({...});    // 保存到 localStorage
todo.save();            // 更新 localStorage
todo.destroy();         // 從 localStorage 刪除
```

**comparator**：排序

```javascript
// 方法 1：屬性名稱
comparator: 'order'

// 方法 2：函數返回排序值
comparator: function(todo) {
    return todo.get('order');
}

// 方法 3：比較函數
comparator: function(a, b) {
    return a.get('order') - b.get('order');
}

// 自動排序
todos.add({ order: 5 });
todos.add({ order: 1 });
todos.add({ order: 3 });
// Collection 中的順序: [1, 3, 5]
```

**Underscore.js 方法**：集合操作

```javascript
// Collection 繼承了 Underscore.js 的所有方法

// filter
var completed = todos.filter(function(todo) {
    return todo.get('completed');
});

// map
var titles = todos.map(function(todo) {
    return todo.get('title');
});

// reduce
var total = todos.reduce(function(sum, todo) {
    return sum + 1;
}, 0);

// find
var firstActive = todos.find(function(todo) {
    return !todo.get('completed');
});

// sortBy, groupBy, countBy, etc.
```

### 3. TodoView（js/views/TodoView.js）

```javascript
app.TodoView = Backbone.View.extend({
    // HTML 標籤
    tagName: 'li',
    className: 'todo-item',

    // 模板
    template: _.template($('#item-template').html()),

    // 事件綁定
    events: {
        'click .toggle': 'toggleCompleted',
        'dblclick .todo-text': 'edit',
        'click .destroy': 'clear',
        'keypress .edit': 'updateOnEnter',
        'blur .edit': 'close',
        'keydown .edit': 'cancelOnEscape'
    },

    // 初始化
    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);
        this.listenTo(this.model, 'change:completed', this.updateCompleted);
    },

    // 渲染
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        this.$el.toggleClass('completed', this.model.get('completed'));
        this.$input = this.$('.edit');
        return this;
    },

    // 切換完成
    toggleCompleted: function() {
        this.model.toggle();
    },

    // 編輯
    edit: function() {
        this.$el.addClass('editing');
        this.$input.focus().select();
        this.originalValue = this.$input.val();
    },

    // 保存
    close: function() {
        var value = this.$input.val().trim();
        if (!value) {
            this.clear();
            return;
        }
        this.model.updateTitle(value);
        this.$el.removeClass('editing');
    },

    // 刪除
    clear: function() {
        if (confirm('確定要刪除嗎？')) {
            this.model.destroy();
        }
    }
});
```

#### 關鍵概念

**el 和 $el**

```javascript
// el: 原生 DOM 元素
this.el // <li class="todo-item"></li>

// $el: jQuery 包裝的元素
this.$el // jQuery 物件

// 使用
this.$el.html('content');
this.$el.addClass('active');
```

**events**：聲明式事件綁定

```javascript
events: {
    // 格式: 'event selector': 'handler'
    'click .toggle': 'toggleCompleted',
    'dblclick label': 'edit'
}

// 等同於
this.$('.toggle').on('click', this.toggleCompleted.bind(this));
this.$('label').on('dblclick', this.edit.bind(this));

// Backbone 會自動：
// 1. 委派事件
// 2. 綁定正確的 this
// 3. 在 remove 時清理
```

**template**：Underscore.js 模板

```javascript
// HTML 中的模板
<script type="text/template" id="item-template">
    <div class="view">
        <input type="checkbox" <%= completed ? 'checked' : '' %>>
        <label><%= title %></label>
        <button class="destroy">×</button>
    </div>
</script>

// 編譯模板
template: _.template($('#item-template').html())

// 渲染
var html = this.template(this.model.toJSON());
// toJSON() 將 Model 轉換為普通物件
```

**listenTo**：監聽事件

```javascript
initialize: function() {
    // listenTo 優於 on
    // 自動處理內存洩漏

    this.listenTo(this.model, 'change', this.render);
    // 當 Model 變更時，重新渲染

    this.listenTo(this.model, 'destroy', this.remove);
    // 當 Model 銷毀時，移除 View
}

// 在 remove 時會自動調用
// this.stopListening()
```

**render**：渲染方法

```javascript
render: function() {
    // 1. 獲取資料
    var data = this.model.toJSON();

    // 2. 渲染模板
    var html = this.template(data);

    // 3. 更新 DOM
    this.$el.html(html);

    // 4. 更新樣式
    this.$el.toggleClass('completed', this.model.get('completed'));

    // 5. 快取元素
    this.$input = this.$('.edit');

    // 6. 返回 this 以支持鏈式調用
    return this;
}

// 使用
var view = new TodoView({ model: todo });
$('#list').append(view.render().el);
```

### 4. AppView（js/views/AppView.js）

```javascript
app.AppView = Backbone.View.extend({
    // 綁定到已存在的元素
    el: '#todoapp',

    // 事件
    events: {
        'click #add-todo': 'createOnClick',
        'keypress #new-todo': 'createOnEnter',
        'click #clear-completed': 'clearCompleted',
        'click .filter-btn': 'filterTodos'
    },

    // 初始化
    initialize: function() {
        // 快取元素
        this.$input = this.$('#new-todo');
        this.$list = this.$('#todo-list');

        // 創建 Collection
        this.collection = new app.Todos();

        // 儲存 Views
        this.views = [];

        // 當前過濾條件
        this.currentFilter = 'all';

        // 監聽 Collection 事件
        this.listenTo(this.collection, 'add', this.addOne);
        this.listenTo(this.collection, 'reset', this.addAll);
        this.listenTo(this.collection, 'change:completed', this.updateStats);

        // 載入資料
        this.collection.fetch();
    },

    // 添加單個 Todo
    addOne: function(todo) {
        var view = new app.TodoView({ model: todo });
        this.$list.append(view.render().el);
        this.views.push(view);
        this.filterView(view);
    },

    // 添加所有 Todos
    addAll: function() {
        this.collection.each(this.addOne, this);
    },

    // 創建 Todo
    createTodo: function() {
        var title = this.$input.val().trim();
        if (!title) return;

        this.collection.createTodo({ title: title });
        this.$input.val('');
    },

    // 過濾
    filterTodos: function(e) {
        var filter = $(e.currentTarget).data('filter');
        this.currentFilter = filter;
        this.applyFilter();
    },

    applyFilter: function() {
        _.each(this.views, function(view) {
            this.filterView(view);
        }, this);
    },

    filterView: function(view) {
        var isCompleted = view.model.get('completed');
        var shouldShow = (
            this.currentFilter === 'all' ||
            (this.currentFilter === 'active' && !isCompleted) ||
            (this.currentFilter === 'completed' && isCompleted)
        );

        view.$el.toggle(shouldShow);
    }
});
```

#### 關鍵概念

**el：綁定已存在的元素**

```javascript
// 不創建新元素，而是綁定到已存在的元素
el: '#todoapp'

// 這個元素必須在 HTML 中存在
<div id="todoapp"></div>

// View 的 el 指向這個元素
this.el === document.getElementById('todoapp')
```

**快取元素**

```javascript
initialize: function() {
    // 快取常用的元素引用
    // 避免重複查詢 DOM

    this.$input = this.$('#new-todo');
    this.$list = this.$('#todo-list');
    this.$stats = this.$('#todo-stats');

    // 使用
    this.$input.val('');
    this.$list.append(view.el);
}
```

**管理子 Views**

```javascript
initialize: function() {
    // 儲存所有子 View
    this.views = [];
}

addOne: function(todo) {
    // 創建子 View
    var view = new TodoView({ model: todo });

    // 渲染並添加到 DOM
    this.$list.append(view.render().el);

    // 儲存引用
    this.views.push(view);
}

removeAllViews: function() {
    // 清理所有子 View
    _.each(this.views, function(view) {
        view.remove();
    });
    this.views = [];
}
```

**過濾功能**

```javascript
filterTodos: function(e) {
    // 1. 獲取過濾條件
    var filter = $(e.currentTarget).data('filter');

    // 2. 更新狀態
    this.currentFilter = filter;

    // 3. 更新 UI
    this.$('.filter-btn').removeClass('active');
    $(e.currentTarget).addClass('active');

    // 4. 應用過濾
    this.applyFilter();
}

applyFilter: function() {
    // 遍歷所有 View
    _.each(this.views, function(view) {
        var isCompleted = view.model.get('completed');
        var shouldShow = (
            this.currentFilter === 'all' ||
            (this.currentFilter === 'active' && !isCompleted) ||
            (this.currentFilter === 'completed' && isCompleted)
        );

        // 顯示或隱藏
        view.$el.toggle(shouldShow);
    }, this);
}
```

### 5. 應用入口（js/app.js）

```javascript
$(document).ready(function() {
    console.log('Todo List Application - Backbone.js');

    // 創建主應用視圖
    window.app.appView = new app.AppView();

    // 設定快捷鍵
    setupGlobalKeyboardShortcuts();

    // 設定除錯工具
    setupDebugTools();
});

// 除錯工具
window.app.debug = {
    stats: function() {
        return app.appView.collection.getStats();
    },

    list: function() {
        return app.appView.collection.toJSON();
    },

    export: function() {
        app.appView.exportData();
    },

    addTestData: function(count) {
        // 添加測試資料
    }
};
```

---

## 與現代框架的對比

### Backbone.js vs React

#### 相同的概念，不同的實現

**1. 組件化**

```javascript
// Backbone.js: View 是組件
var TodoView = Backbone.View.extend({
    tagName: 'li',
    template: _.template('<span><%= title %></span>'),
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

// React: 函數組件
function TodoView({ todo }) {
    return (
        <li>
            <span>{todo.title}</span>
        </li>
    );
}
```

**2. 狀態管理**

```javascript
// Backbone.js: Model 管理狀態
var todo = new Todo({ title: '學習', completed: false });

todo.on('change', function() {
    console.log('狀態變更');
});

todo.set('completed', true); // 觸發 change 事件

// React: useState Hook
const [todo, setTodo] = useState({
    title: '學習',
    completed: false
});

setTodo({ ...todo, completed: true }); // 觸發重新渲染
```

**3. 事件處理**

```javascript
// Backbone.js: events 哈希
events: {
    'click .toggle': 'toggleCompleted'
}

toggleCompleted: function() {
    this.model.toggle();
}

// React: 內聯事件處理
<button onClick={() => toggleCompleted()}>
    Toggle
</button>

function toggleCompleted() {
    setTodo({ ...todo, completed: !todo.completed });
}
```

**4. 資料綁定**

```javascript
// Backbone.js: 手動監聽變更
initialize: function() {
    this.listenTo(this.model, 'change', this.render);
}

render: function() {
    this.$el.html(this.template(this.model.toJSON()));
}

// React: 自動重新渲染
function TodoView({ todo }) {
    // todo 變更時自動重新渲染
    return <div>{todo.title}</div>;
}
```

#### 關鍵差異

| 特性 | Backbone.js | React |
|------|-------------|-------|
| **渲染方式** | 手動 DOM 操作 | 虛擬 DOM |
| **資料流** | 雙向綁定 | 單向數據流 |
| **更新機制** | 事件觸發 | 狀態變更 |
| **學習曲線** | 平緩 | 陡峭 |
| **性能** | 依賴手動優化 | 自動優化 |
| **生態系統** | 較小 | 龐大 |

### Backbone.js vs Vue

**1. 響應式系統**

```javascript
// Backbone.js: 明確的 get/set
var todo = new Todo({ title: '學習' });

console.log(todo.get('title')); // "學習"
todo.set('title', '新標題');

// Vue: 響應式屬性
const todo = ref({ title: '學習' });

console.log(todo.value.title); // "學習"
todo.value.title = '新標題'; // 自動觸發更新
```

**2. 模板語法**

```javascript
// Backbone.js: Underscore.js 模板
var template = _.template(`
    <div>
        <h3><%= title %></h3>
        <% if (completed) { %>
            <span>✓</span>
        <% } %>
    </div>
`);

// Vue: HTML 模板
<template>
    <div>
        <h3>{{ title }}</h3>
        <span v-if="completed">✓</span>
    </div>
</template>
```

**3. 雙向綁定**

```javascript
// Backbone.js: 手動綁定
events: {
    'input .title': 'updateTitle'
}

updateTitle: function(e) {
    this.model.set('title', e.target.value);
}

render: function() {
    this.$('.title').val(this.model.get('title'));
}

// Vue: v-model
<input v-model="todo.title" />
```

### Backbone.js vs Angular

**1. 依賴注入**

```javascript
// Backbone.js: 手動管理依賴
var AppView = Backbone.View.extend({
    initialize: function(options) {
        this.todoService = options.todoService;
        this.userService = options.userService;
    }
});

var app = new AppView({
    todoService: new TodoService(),
    userService: new UserService()
});

// Angular: 自動依賴注入
@Component({})
export class AppComponent {
    constructor(
        private todoService: TodoService,
        private userService: UserService
    ) {}
}
```

**2. 雙向綁定**

```javascript
// Backbone.js: 手動實現
var InputView = Backbone.View.extend({
    events: {
        'input': 'onInput'
    },

    initialize: function() {
        this.listenTo(this.model, 'change:value', this.render);
    },

    onInput: function(e) {
        this.model.set('value', e.target.value);
    },

    render: function() {
        this.$el.val(this.model.get('value'));
    }
});

// Angular: 自動雙向綁定
<input [(ngModel)]="value" />
```

### 演進路線圖

```
2010: Backbone.js
      ↓
      • MVC 結構
      • 事件驅動
      • RESTful

2013: Angular 1.x
      ↓
      • 依賴注入
      • 雙向綁定
      • 指令系統

2013: React
      ↓
      • 虛擬 DOM
      • 單向數據流
      • JSX

2014: Vue
      ↓
      • 響應式系統
      • 漸進式框架
      • 組件化

2016: Angular 2+
      ↓
      • TypeScript
      • RxJS
      • 完整框架

2020+: 現代框架
      ↓
      • Hooks
      • Composition API
      • Server Components
```

---

## Backbone.js 的遺產與影響

### 1. 奠定前端架構基礎

Backbone.js 是第一批成功將 MVC 模式引入前端的框架：

#### 之前：jQuery 意大利麵代碼

```javascript
// 2010 年之前的典型代碼
$(document).ready(function() {
    var todos = [];

    $('#add-button').click(function() {
        var title = $('#input').val();
        todos.push({ title: title, completed: false });

        var html = '<li>' + title +
                   '<button class="delete">×</button>' +
                   '</li>';
        $('#list').append(html);

        localStorage.setItem('todos', JSON.stringify(todos));
    });

    $(document).on('click', '.delete', function() {
        // 複雜的資料同步邏輯
        // 難以維護
    });
});
```

#### 之後：結構化的 Backbone.js

```javascript
// Backbone.js 帶來的改變
var Todo = Backbone.Model.extend({
    defaults: { title: '', completed: false }
});

var Todos = Backbone.Collection.extend({
    model: Todo,
    localStorage: new Backbone.LocalStorage('todos')
});

var TodoView = Backbone.View.extend({
    tagName: 'li',
    events: { 'click .delete': 'remove' },
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});
```

### 2. 影響後續框架的設計

#### Angular 1.x

```javascript
// Backbone.js 的 MVC 啟發了 Angular 的 MVVM

// Backbone.js
var Model = Backbone.Model.extend({});
var View = Backbone.View.extend({});

// Angular 1.x
function Controller($scope) {
    $scope.model = {};
}
```

#### Ember.js

```javascript
// Ember.js 的很多概念源自 Backbone.js

// Backbone.js
var Router = Backbone.Router.extend({
    routes: {
        'posts/:id': 'showPost'
    }
});

// Ember.js
Router.map(function() {
    this.route('post', { path: '/posts/:id' });
});
```

#### React

```javascript
// React 的部分思想受 Backbone.js 啟發

// Backbone.js: 單向數據流
model.set('title', 'New'); // 觸發 change 事件
view.render();             // 更新 UI

// React: 單向數據流
setState({ title: 'New' }); // 觸發重新渲染
```

### 3. 推廣了事件驅動編程

```javascript
// Backbone.Events 成為事件系統的典範

// Backbone.js
var eventBus = _.extend({}, Backbone.Events);

eventBus.on('user:login', function(user) {
    console.log('User logged in:', user);
});

eventBus.trigger('user:login', { name: 'John' });

// 這種模式影響了：
// - Node.js EventEmitter
// - Redux dispatch/subscribe
// - RxJS Observable
```

### 4. RESTful 最佳實踐

```javascript
// Backbone.js 推廣了 RESTful API 設計

// CRUD 操作自動映射到 HTTP 方法
model.save();    // POST /todos (create)
model.fetch();   // GET /todos/123 (read)
model.save();    // PUT /todos/123 (update)
model.destroy(); // DELETE /todos/123 (delete)

// 這成為 RESTful API 的標準實踐
```

### 5. 模組化和關注點分離

```javascript
// Backbone.js 強調關注點分離

// Model: 資料和業務邏輯
var Todo = Backbone.Model.extend({
    toggle: function() {
        this.set('completed', !this.get('completed'));
    }
});

// View: UI 和交互
var TodoView = Backbone.View.extend({
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
    }
});

// 這種分離成為現代框架的基礎
```

### 6. 開源社群和插件生態

Backbone.js 培育了豐富的插件生態：

- **Marionette.js**：複雜應用的框架
- **Chaplin**：應用架構
- **Backbone.Stickit**：雙向綁定
- **Backbone.Validation**：驗證插件
- **Backbone.LocalStorage**：本地儲存

這些插件展示了：
- 如何擴展框架
- 如何建立生態系統
- 如何解決常見問題

### 7. 影響的知名專案

使用 Backbone.js 的知名專案：

| 專案 | 說明 |
|------|------|
| **Trello** | 專案管理工具 |
| **Airbnb** | 早期版本使用 Backbone.js |
| **LinkedIn** | 部分功能使用 |
| **SoundCloud** | 音樂平台 |
| **Khan Academy** | 教育平台 |
| **WordPress.com** | 部分管理介面 |
| **Basecamp** | 專案管理 |

### 8. 教育價值

Backbone.js 是學習框架設計的優秀教材：

```javascript
// 源碼簡潔，易於閱讀
// backbone.js 核心只有 2000 行

// Model 的實現
var Model = function(attributes, options) {
    var attrs = attributes || {};
    this.attributes = {};
    this.set(attrs, options);
    this.initialize.apply(this, arguments);
};

// 可以學到：
// - 如何設計 API
// - 如何實現事件系統
// - 如何處理資料同步
// - 如何管理記憶體
```

### 9. 持久的影響力

即使在 2025 年，Backbone.js 的影響仍然存在：

**概念層面**：
- MVC/MVP 模式
- 事件驅動編程
- RESTful 設計
- 關注點分離

**實踐層面**：
- 輕量級框架的價值
- 漸進式採用
- 不過度抽象
- 保持靈活性

**哲學層面**：
- 提供結構，不強制規定
- 依賴少，核心小
- 擴展性強
- 向後兼容

---

## 最佳實踐

### 1. Model 設計

#### ✅ 好的做法

```javascript
// 將業務邏輯放在 Model 中
var Todo = Backbone.Model.extend({
    defaults: {
        title: '',
        completed: false
    },

    // 驗證規則
    validate: function(attrs) {
        if (!attrs.title || attrs.title.trim() === '') {
            return '標題不能為空';
        }
    },

    // 業務邏輯
    toggle: function() {
        this.save({
            completed: !this.get('completed')
        });
    },

    isCompleted: function() {
        return this.get('completed') === true;
    }
});
```

#### ❌ 壞的做法

```javascript
// 不要在 View 中放業務邏輯
var TodoView = Backbone.View.extend({
    toggleCompleted: function() {
        // ❌ 業務邏輯應該在 Model 中
        var completed = this.model.get('completed');
        this.model.set('completed', !completed);

        // ❌ 直接操作 localStorage
        localStorage.setItem('todos', JSON.stringify(this.model));
    }
});
```

### 2. Collection 使用

#### ✅ 好的做法

```javascript
// 提供語義化的方法
var Todos = Backbone.Collection.extend({
    model: Todo,

    // 清晰的查詢方法
    completed: function() {
        return this.filter(function(todo) {
            return todo.isCompleted();
        });
    },

    remaining: function() {
        return this.filter(function(todo) {
            return !todo.isCompleted();
        });
    },

    // 封裝複雜操作
    clearCompleted: function() {
        var completed = this.completed();
        _.each(completed, function(todo) {
            todo.destroy();
        });
        return completed.length;
    }
});
```

#### ❌ 壞的做法

```javascript
// 不要直接在外部操作 Collection
var todos = new Todos();

// ❌ 直接過濾和刪除
var completed = todos.filter(function(todo) {
    return todo.get('completed');
});

_.each(completed, function(todo) {
    todo.destroy();
});
```

### 3. View 組織

#### ✅ 好的做法

```javascript
// 職責單一的 View
var TodoView = Backbone.View.extend({
    tagName: 'li',
    className: 'todo-item',

    initialize: function() {
        // 監聽 Model 變更
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);
    },

    render: function() {
        // 只負責渲染
        this.$el.html(this.template(this.model.toJSON()));
        this.updateClasses();
        return this;
    },

    updateClasses: function() {
        // 更新 CSS class
        this.$el.toggleClass('completed', this.model.isCompleted());
    }
});
```

#### ❌ 壞的做法

```javascript
// 不要讓 View 做太多事
var TodoView = Backbone.View.extend({
    render: function() {
        // ❌ 混合太多邏輯
        this.$el.html(this.template(this.model.toJSON()));
        this.updateStats();
        this.saveToLocalStorage();
        this.syncWithServer();
        this.updateOtherViews();
    }
});
```

### 4. 事件管理

#### ✅ 好的做法

```javascript
// 使用 listenTo 而不是 on
var View = Backbone.View.extend({
    initialize: function() {
        // ✅ 自動清理
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.collection, 'add', this.addOne);
    }

    // 調用 remove() 時自動 stopListening
});
```

#### ❌ 壞的做法

```javascript
// 不要使用 on（除非有特殊原因）
var View = Backbone.View.extend({
    initialize: function() {
        // ❌ 可能造成內存洩漏
        this.model.on('change', this.render, this);
    },

    remove: function() {
        // ❌ 需要手動清理
        this.model.off('change', this.render);
        Backbone.View.prototype.remove.call(this);
    }
});
```

### 5. 記憶體管理

#### ✅ 好的做法

```javascript
// 正確清理 View
var AppView = Backbone.View.extend({
    initialize: function() {
        this.childViews = [];
    },

    addOne: function(model) {
        var view = new TodoView({ model: model });
        this.childViews.push(view);
        this.$list.append(view.render().el);
    },

    removeAll: function() {
        // ✅ 清理所有子 View
        _.each(this.childViews, function(view) {
            view.remove();
        });
        this.childViews = [];
    }
});
```

### 6. 模板組織

#### ✅ 好的做法

```javascript
// 將模板放在 HTML 中
<script type="text/template" id="todo-template">
    <div class="view">
        <input type="checkbox" <%= completed ? 'checked' : '' %>>
        <label><%= title %></label>
    </div>
</script>

// View 中引用
var TodoView = Backbone.View.extend({
    template: _.template($('#todo-template').html())
});
```

#### ❌ 壞的做法

```javascript
// 不要在 JavaScript 中嵌入大量 HTML
var TodoView = Backbone.View.extend({
    render: function() {
        // ❌ 難以維護
        var html = '<div class="view">' +
                   '<input type="checkbox" ' +
                   (this.model.get('completed') ? 'checked' : '') + '>' +
                   '<label>' + this.model.get('title') + '</label>' +
                   '</div>';
        this.$el.html(html);
    }
});
```

### 7. 錯誤處理

#### ✅ 好的做法

```javascript
var Todo = Backbone.Model.extend({
    save: function(attrs, options) {
        options = options || {};

        var success = options.success;
        var error = options.error;

        options.success = function(model, response) {
            console.log('Save successful');
            if (success) success(model, response);
        };

        options.error = function(model, response) {
            console.error('Save failed:', response);
            alert('保存失敗：' + response.statusText);
            if (error) error(model, response);
        };

        return Backbone.Model.prototype.save.call(this, attrs, options);
    }
});
```

### 8. 測試

#### ✅ 好的做法

```javascript
// Model 測試
describe('Todo Model', function() {
    it('should have default values', function() {
        var todo = new Todo();
        expect(todo.get('title')).toBe('');
        expect(todo.get('completed')).toBe(false);
    });

    it('should toggle completed', function() {
        var todo = new Todo({ completed: false });
        todo.toggle();
        expect(todo.get('completed')).toBe(true);
    });
});

// View 測試
describe('TodoView', function() {
    beforeEach(function() {
        this.model = new Todo({ title: 'Test' });
        this.view = new TodoView({ model: this.model });
        this.view.render();
    });

    it('should render', function() {
        expect(this.view.$el.text()).toContain('Test');
    });
});
```

---

## 常見問題

### 1. Backbone.js 還值得學習嗎？

**是的！** 理由：

1. **理解框架演進**：Backbone.js 是連接 jQuery 和現代框架的橋樑
2. **掌握核心概念**：MVC、事件驅動、資料綁定等概念是通用的
3. **維護遺留系統**：許多企業仍在使用 Backbone.js
4. **學習成本低**：相比現代框架，學習曲線更平緩
5. **源碼簡潔**：適合學習框架設計

### 2. Backbone.js vs 現代框架？

| 考量因素 | Backbone.js | React/Vue |
|----------|-------------|-----------|
| **新專案** | ❌ 不推薦 | ✅ 推薦 |
| **小型專案** | ✅ 可以 | ✅ 可以 |
| **大型專案** | ⚠️ 需要額外架構 | ✅ 更適合 |
| **團隊熟悉度** | ⚠️ 較少 | ✅ 更多 |
| **生態系統** | ⚠️ 較小 | ✅ 龐大 |
| **學習成本** | ✅ 低 | ⚠️ 高 |

### 3. 如何從 Backbone.js 遷移到 React？

```javascript
// 階段 1：理解對應關係
Backbone.Model → React State
Backbone.View → React Component
Backbone.Collection → React State (Array)
Backbone.Events → React Context/Redux

// 階段 2：逐步遷移
// 1. 先遷移葉子組件
// 2. 保留 Backbone.js 的資料層
// 3. 逐步替換 View
// 4. 最後遷移資料層

// 階段 3：混合使用
var BackboneWrapper = React.createClass({
    componentDidMount: function() {
        this.view = new BackboneView({
            model: this.props.model,
            el: this.refs.container
        });
        this.view.render();
    },

    render: function() {
        return <div ref="container"></div>;
    }
});
```

### 4. Backbone.js 的性能如何？

**優勢**：
- 輕量級，啟動快
- 沒有虛擬 DOM 的開銷
- 手動控制渲染

**劣勢**：
- 需要手動優化
- 大量 DOM 操作可能慢
- 沒有自動批次更新

**優化技巧**：

```javascript
// 1. 批次更新
model.set({
    title: 'New Title',
    completed: true
}, { silent: true });

model.trigger('change'); // 只觸發一次

// 2. 使用 DocumentFragment
var fragment = document.createDocumentFragment();
collection.each(function(model) {
    var view = new TodoView({ model: model });
    fragment.appendChild(view.render().el);
});
this.$list.append(fragment);

// 3. 虛擬化長列表
// 只渲染可見的項目
```

### 5. 如何組織大型 Backbone.js 應用？

```javascript
// 使用模組化結構

// app/
// ├── models/
// │   ├── Todo.js
// │   └── User.js
// ├── collections/
// │   ├── Todos.js
// │   └── Users.js
// ├── views/
// │   ├── todos/
// │   │   ├── TodoView.js
// │   │   └── TodoListView.js
// │   └── app/
// │       └── AppView.js
// ├── routers/
// │   └── AppRouter.js
// └── app.js

// 使用 Marionette.js 等框架
// 提供更多結構和工具
```

### 6. LocalStorage vs RESTful API？

```javascript
// LocalStorage: 適合小型應用
var Todos = Backbone.Collection.extend({
    localStorage: new Backbone.LocalStorage('todos')
});

// RESTful API: 適合正式應用
var Todos = Backbone.Collection.extend({
    url: '/api/todos'
});

// 混合使用: 離線優先
var Todos = Backbone.Collection.extend({
    url: '/api/todos',
    localStorage: new Backbone.LocalStorage('todos'),

    sync: function(method, model, options) {
        // 優先使用 API
        // 失敗時使用 localStorage
    }
});
```

---

## 延伸閱讀

### 官方資源

- **官方網站**：https://backbonejs.org/
- **GitHub**：https://github.com/jashkenas/backbone
- **更新日誌**：https://backbonejs.org/#changelog
- **帶註解的源碼**：https://backbonejs.org/docs/backbone.html

### 相關框架

- **Underscore.js**：https://underscorejs.org/
- **Marionette.js**：https://marionettejs.com/
- **Chaplin**：http://chaplinjs.org/
- **Thorax**：http://thoraxjs.org/

### 學習資源

- **Backbone.js Tutorials**：https://backbonetutorials.com/
- **Backbone Fundamentals**：https://addyosmani.com/backbone-fundamentals/
- **TodoMVC**：https://todomvc.com/examples/backbone/

### 書籍

- "Developing Backbone.js Applications" by Addy Osmani
- "Backbone.js Patterns and Best Practices" by Swarnendu De
- "Full Stack Web Development with Backbone.js" by Patrick Mulder

### 部落格文章

- [Backbone.js 入門指南](https://backbonejs.org/#Getting-started)
- [Why Backbone.js Still Matters](https://addyosmani.com/blog/)
- [Understanding Backbone.js](https://addyosmani.com/blog/understanding-mvc-and-mvp-for-javascript-and-backbone-developers/)

---

## 總結

Backbone.js 是前端開發史上的重要里程碑。雖然現代框架提供了更多功能和更好的開發體驗，但 Backbone.js 的核心理念 - **關注點分離**、**事件驅動**、**RESTful 設計** - 至今仍然影響著前端開發。

### 學習 Backbone.js 的價值

1. **理解歷史**：了解前端框架的演進
2. **掌握基礎**：MVC、事件系統、資料綁定
3. **提升能力**：框架無關的設計思維
4. **實際應用**：維護遺留系統

### 何時使用 Backbone.js

✅ **適合的場景**：
- 小型專案
- 原型開發
- 學習 MVC 架構
- 維護現有專案

❌ **不適合的場景**：
- 大型複雜應用
- 需要豐富生態系統
- 團隊不熟悉

### 下一步

1. **實踐**：修改這個 Todo List，添加新功能
2. **閱讀源碼**：Backbone.js 源碼非常清晰
3. **學習現代框架**：React、Vue、Angular
4. **比較差異**：理解框架演進的原因

---

## 授權

MIT License

## 作者

TodoListDemo Project

---

**Happy Coding! 🚀**
