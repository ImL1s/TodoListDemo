/**
 * TodoView
 * ========
 * Backbone View 負責渲染單個 Todo 項目
 *
 * 核心概念：
 * - View 負責 DOM 操作和用戶交互
 * - 使用 el 屬性代表 DOM 元素
 * - 使用 events 哈希聲明式綁定事件
 * - 監聽 Model 變更自動更新 UI
 * - 使用 Underscore.js 模板渲染
 */

(function() {
    'use strict';

    window.app = window.app || {};

    /**
     * TodoView
     *
     * 每個 TodoView 對應一個 Todo Model
     */
    app.TodoView = Backbone.View.extend({

        /**
         * 指定渲染的 HTML 標籤
         * 這個 View 會創建一個 <li> 元素
         */
        tagName: 'li',

        /**
         * 指定 CSS class
         */
        className: 'todo-item',

        /**
         * 編譯 Underscore.js 模板
         * 從 HTML 中的 <script type="text/template"> 獲取模板
         */
        template: _.template($('#item-template').html()),

        /**
         * 事件綁定
         * 使用 CSS 選擇器和事件名稱的組合
         * 格式：'event selector': 'handler'
         *
         * Backbone 會自動處理事件委派，確保事件綁定在正確的元素上
         */
        events: {
            'click .toggle': 'toggleCompleted',     // 點擊 checkbox 切換完成狀態
            'dblclick .todo-text': 'edit',          // 雙擊文字進入編輯模式
            'click .destroy': 'clear',              // 點擊刪除按鈕
            'keypress .edit': 'updateOnEnter',      // 編輯時按 Enter 保存
            'blur .edit': 'close',                  // 失去焦點時保存
            'keydown .edit': 'cancelOnEscape'       // 按 ESC 取消編輯
        },

        /**
         * 初始化方法
         * 設定事件監聽器，當 Model 變更時自動更新 View
         */
        initialize: function() {
            // 監聽 Model 的變更事件
            // listenTo 是 Backbone 提供的方法，會自動處理內存洩漏問題
            this.listenTo(this.model, 'change', this.render);

            // 監聽 Model 的銷毀事件
            this.listenTo(this.model, 'destroy', this.remove);

            // 監聽特定屬性的變更
            this.listenTo(this.model, 'change:completed', this.updateCompleted);

            console.log('TodoView initialized for:', this.model.get('title'));
        },

        /**
         * 渲染方法
         * 將 Model 的資料渲染到 DOM
         *
         * @returns {View} 返回 this 以支持鏈式調用
         */
        render: function() {
            // 使用模板渲染 HTML
            // this.model.toJSON() 將 Model 轉換為普通 JavaScript 物件
            var html = this.template(this.model.toJSON());

            // 設定元素的 HTML 內容
            this.$el.html(html);

            // 根據完成狀態添加 CSS class
            this.$el.toggleClass('completed', this.model.get('completed'));

            // 快取常用的 DOM 元素
            this.$input = this.$('.edit');

            // 返回 this 以支持鏈式調用
            return this;
        },

        /**
         * 切換完成狀態
         * 當用戶點擊 checkbox 時調用
         *
         * @param {Event} e - DOM 事件物件
         */
        toggleCompleted: function(e) {
            // 切換 Model 的完成狀態
            this.model.toggle();
        },

        /**
         * 更新完成狀態的 UI
         * 當 Model 的 completed 屬性變更時調用
         */
        updateCompleted: function() {
            // 添加或移除 completed class
            this.$el.toggleClass('completed', this.model.get('completed'));
        },

        /**
         * 進入編輯模式
         * 當用戶雙擊 Todo 文字時調用
         */
        edit: function() {
            // 添加 editing class
            this.$el.addClass('editing');

            // 聚焦到輸入框並選中所有文字
            this.$input.focus().select();

            // 儲存原始值，以便取消時恢復
            this.originalValue = this.$input.val();
        },

        /**
         * 關閉編輯模式並保存
         * 當輸入框失去焦點時調用
         */
        close: function() {
            var value = this.$input.val().trim();

            // 如果值為空，刪除這個 Todo
            if (!value) {
                this.clear();
                return;
            }

            // 更新 Model
            if (this.model.updateTitle(value)) {
                // 移除 editing class
                this.$el.removeClass('editing');
            } else {
                // 如果更新失敗（例如驗證失敗），恢復原始值
                this.$input.val(this.originalValue);
                this.$el.removeClass('editing');
            }
        },

        /**
         * 按 Enter 鍵時保存
         *
         * @param {Event} e - 鍵盤事件物件
         */
        updateOnEnter: function(e) {
            // Enter 鍵的 keyCode 是 13
            if (e.which === 13) {
                // 移除焦點，觸發 blur 事件，進而調用 close 方法
                this.$input.blur();
            }
        },

        /**
         * 按 ESC 鍵取消編輯
         *
         * @param {Event} e - 鍵盤事件物件
         */
        cancelOnEscape: function(e) {
            // ESC 鍵的 keyCode 是 27
            if (e.which === 27) {
                // 恢復原始值
                this.$input.val(this.originalValue);

                // 移除 editing class
                this.$el.removeClass('editing');

                // 移除焦點
                this.$input.blur();
            }
        },

        /**
         * 刪除 Todo
         * 當用戶點擊刪除按鈕時調用
         */
        clear: function() {
            // 確認是否刪除（可選）
            if (confirm('確定要刪除「' + this.model.get('title') + '」嗎？')) {
                // 銷毀 Model
                // 這會觸發 'destroy' 事件，進而調用 remove 方法
                this.model.destroy();
            }
        },

        /**
         * 移除 View
         * 從 DOM 中移除元素並清理事件監聽器
         *
         * Backbone 的 remove 方法會：
         * 1. 調用 this.$el.remove() 從 DOM 中移除元素
         * 2. 調用 this.stopListening() 移除所有事件監聽器
         */
        remove: function() {
            // 添加淡出動畫
            this.$el.fadeOut(300, function() {
                // 調用 Backbone 的 remove 方法
                Backbone.View.prototype.remove.call(this);
            }.bind(this));
        },

        /**
         * 顯示 View（用於過濾）
         */
        show: function() {
            this.$el.show();
        },

        /**
         * 隱藏 View（用於過濾）
         */
        hide: function() {
            this.$el.hide();
        }
    });

    /**
     * TodoView 使用範例：
     *
     * // 創建 Todo Model
     * var todo = new app.Todo({
     *     title: '學習 Backbone.js View'
     * });
     *
     * // 創建 TodoView
     * var view = new app.TodoView({
     *     model: todo
     * });
     *
     * // 渲染 View
     * view.render();
     *
     * // 將 View 的元素添加到 DOM
     * $('#todo-list').append(view.el);
     *
     * // View 會自動監聽 Model 的變更
     * todo.set('title', '新的標題'); // View 會自動更新
     *
     * // 銷毀 Model 時，View 也會自動移除
     * todo.destroy(); // View 會從 DOM 中移除
     */

})();
