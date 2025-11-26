# 📋 Todo List - 原生 HTML/CSS/JavaScript 版本

## 📖 簡介

這是最基礎、最純粹的 Todo List 實現，使用原生的 HTML、CSS 和 JavaScript，不依賴任何框架或庫。

這是整個學習路線的**起點**，理解這個版本的實現對於掌握所有後續框架至關重要。

## ✨ 功能特色

- ✅ 新增待辦事項
- ✅ 標記完成/未完成（點擊切換）
- ✅ 刪除待辦事項（關閉按鈕）
- ✅ 輸入驗證（空值檢查）
- ✅ 回車鍵快捷添加
- ✅ 響應式設計
- ✅ 動畫過渡效果

## 🛠️ 技術棧

- **HTML5**: 語義化標籤
- **CSS3**:
  - Flexbox 佈局
  - CSS transitions
  - 偽元素 (::before)
  - 響應式設計
- **JavaScript (ES6+)**:
  - DOM 操作
  - 事件處理
  - 函數式編程

## 📁 文件結構

```
01-html-css-js/
├── index.html          # 主 HTML 文件
├── todo_list.css       # 樣式文件
├── todo_list.js        # JavaScript 邏輯
└── README.md           # 本文檔
```

## 🚀 快速開始

### 運行方式

1. **直接打開**:
   ```bash
   # 方式 1: 直接用瀏覽器打開
   open index.html  # macOS
   start index.html # Windows
   xdg-open index.html # Linux
   ```

2. **本地服務器** (推薦):
   ```bash
   # 使用 Python
   python -m http.server 8000

   # 或使用 Node.js (需要安裝 http-server)
   npx http-server

   # 然後訪問 http://localhost:8000
   ```

### 無需安裝

✅ 不需要 Node.js
✅ 不需要 npm
✅ 不需要構建工具
✅ 只需要瀏覽器！

## 📝 代碼解析

### HTML 結構 (index.html)

```html
<!-- 輸入框區域 -->
<div id="myDIV" class="header">
    <h2>任務清單</h2>
    <input type="text" id="myInput" placeholder="請輸入任務">
    <span id="addButton" class="addBtn">添加</span>
</div>

<!-- 任務列表 -->
<ul id="myUL">
    <li>七點半起床</li>
    <li class="checked">洗漱</li>
    <!-- 更多任務... -->
</ul>
```

**關鍵點**:
- 使用語義化標籤 `<ul>` 和 `<li>`
- 使用 `id` 選擇器方便 JavaScript 操作
- `class="checked"` 標記已完成項目

### CSS 樣式 (todo_list.css)

```css
/* 重點 1: Box-sizing 統一計算 */
* {
    box-sizing: border-box;
}

/* 重點 2: 完成狀態的樣式 */
ul li.checked {
    background: #888;
    color: #fff;
    text-decoration: line-through;
}

/* 重點 3: 使用偽元素添加對勾 */
ul li.checked::before {
    content: '';
    /* ... 對勾樣式 ... */
}

/* 重點 4: 過渡動畫 */
ul li {
    transition: 0.2s;
}
```

**CSS 技巧**:
- `box-sizing: border-box` - 包含 padding 和 border 的寬度計算
- `nth-child(odd)` - 選擇奇數項改變背景色
- `::before` 偽元素 - 創建對勾圖標
- `transition` - 平滑的 hover 效果

### JavaScript 邏輯 (todo_list.js)

```javascript
window.onload = function() {
    // 初始化流程
    function init() {
        initList();      // 初始化列表
        bindEvents();    // 綁定事件
    }

    init();
}
```

**核心函數**:

1. **closeBtn()** - 為每個 li 添加關閉按鈕
   ```javascript
   function closeBtn() {
       var myNodelist = document.getElementsByTagName("li");
       for (i = 0; i < myNodelist.length; i++) {
           var span = document.createElement("span");
           var txt = document.createTextNode("\u00D7");
           span.className = "close";
           myNodelist[i].appendChild(span);
       }
   }
   ```

2. **closeElement()** - 處理刪除功能
   ```javascript
   function closeElement() {
       var close = document.getElementsByClassName("close");
       for (i = 0; i < close.length; i++) {
           close[i].onclick = function() {
               var div = this.parentElement;
               div.style.display = "none";
           }
       }
   }
   ```

3. **ifChecked()** - 切換完成狀態
   ```javascript
   function ifChecked() {
       var list = document.querySelector('ul');
       list.onclick = function(ev) {
           if (ev.target.tagName === 'LI') {
               ev.target.classList.toggle('checked');
           }
       }
   }
   ```

4. **newElement()** - 添加新項目
   ```javascript
   function newElement() {
       var li = document.createElement("li");
       var inputValue = document.getElementById("myInput").value;
       var t = document.createTextNode(inputValue);
       li.appendChild(t);
       if (inputValue === '') {
           alert("請先輸入一個具體任務。");
       } else {
           document.getElementById("myUL").appendChild(li);
       }
       document.getElementById("myInput").value = "";
   }
   ```

## 🎯 學習重點

### JavaScript 基礎概念

1. **DOM 操作**:
   - `document.getElementById()` - 獲取元素
   - `document.createElement()` - 創建元素
   - `element.appendChild()` - 添加子元素
   - `element.style.display` - 修改樣式

2. **事件處理**:
   - `onclick` - 點擊事件
   - `onkeydown` - 鍵盤事件
   - 事件委託 (event delegation)
   - `event.target` - 事件目標

3. **classList API**:
   - `classList.toggle()` - 切換 class
   - `classList.add()` - 添加 class
   - `classList.remove()` - 移除 class

4. **節點遍歷**:
   - `getElementsByTagName()`
   - `getElementsByClassName()`
   - `querySelector()` / `querySelectorAll()`
   - `parentElement` - 獲取父元素

### 設計模式

- **模組化**: 功能拆分成獨立函數
- **初始化模式**: `window.onload` 確保 DOM 載入完成
- **事件委託**: 在父元素監聽子元素事件

## 🔄 可改進之處

這個原生版本還有很多可以改進的地方：

### 功能增強
- [ ] 本地存儲 (LocalStorage)
- [ ] 編輯功能
- [ ] 篩選功能 (全部/進行中/已完成)
- [ ] 拖拽排序
- [ ] 到期日期
- [ ] 優先級

### 代碼優化
- [ ] 使用現代 ES6+ 語法 (const/let, 箭頭函數)
- [ ] 分離關注點 (MVC 架構)
- [ ] 添加 TypeScript 類型
- [ ] 模組化 (ES Modules)
- [ ] 錯誤處理

### 用戶體驗
- [ ] 更好的動畫
- [ ] 深色模式
- [ ] 多語言支援
- [ ] 鍵盤快捷鍵
- [ ] 無障礙訪問 (ARIA)

## 📚 延伸學習

完成這個版本後，建議：

1. **添加本地存儲**:
   ```javascript
   // 保存到 LocalStorage
   localStorage.setItem('todos', JSON.stringify(todos));

   // 讀取
   const todos = JSON.parse(localStorage.getItem('todos')) || [];
   ```

2. **使用 ES6+ 重寫**:
   - 用 `const`/`let` 替代 `var`
   - 用箭頭函數簡化語法
   - 用模板字符串
   - 使用解構賦值

3. **添加 TypeScript**:
   - 定義 Todo 接口
   - 添加類型註解
   - 使用類 (Class)

4. **學習現代框架**:
   - 體會框架如何簡化這些操作
   - 理解響應式數據綁定
   - 了解組件化思想

## 🎓 下一步

完成原生 JavaScript 版本後，推薦的學習路線：

1. **TypeScript 版本** → `01-vanilla/03-typescript/`
2. **React 版本** → `03-modern-frameworks/01-react/`
3. **Vue 版本** → `03-modern-frameworks/03-vue3/`

## 💡 常見問題

**Q: 為什麼使用 `var` 而不是 `const`/`let`？**
A: 這是為了展示經典的 JavaScript 寫法。實際開發中應該使用 `const`/`let`。

**Q: 為什麼不使用 LocalStorage？**
A: 為了保持代碼簡單，專注於核心 DOM 操作。你可以自己添加這個功能作為練習。

**Q: 這個實現有什麼問題嗎？**
A: 主要問題是：
- 缺少數據持久化
- 每次添加都要重新綁定事件
- 沒有數據和視圖的分離
- 這些問題正是框架要解決的！

## 📖 相關資源

- [MDN - JavaScript](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)
- [MDN - DOM](https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model)
- [JavaScript.info](https://javascript.info/)
- [You Don't Know JS](https://github.com/getify/You-Dont-Know-JS)

---

**上一個**: 無
**下一個**: [jQuery 版本](../02-jquery/) | [TypeScript 版本](../03-typescript/)
**返回**: [專案首頁](../../README.md)

---

最後更新: 2025-11-17
