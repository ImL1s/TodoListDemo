/**
 * AppView
 * =======
 * 主應用視圖，管理整個應用的 UI
 *
 * 核心概念：
 * - AppView 是整個應用的容器
 * - 管理 TodoView 的創建和銷毀
 * - 處理全域的用戶交互
 * - 監聽 Collection 的事件
 * - 實現過濾功能
 */

(function() {
    'use strict';

    window.app = window.app || {};

    /**
     * AppView
     *
     * 管理整個 Todo 應用的主視圖
     */
    app.AppView = Backbone.View.extend({

        /**
         * 綁定到已存在的 DOM 元素
         * el 屬性指定 View 綁定的元素
         */
        el: '#todoapp',

        /**
         * 事件綁定
         * 處理用戶交互
         */
        events: {
            'click #add-todo': 'createOnClick',           // 點擊新增按鈕
            'keypress #new-todo': 'createOnEnter',        // 按 Enter 新增
            'click #clear-completed': 'clearCompleted',   // 清除已完成
            'click .filter-btn': 'filterTodos'            // 過濾 Todos
        },

        /**
         * 初始化方法
         * 設定 Collection 和事件監聽器
         */
        initialize: function() {
            console.log('AppView initialized');

            // 快取 DOM 元素
            this.$input = this.$('#new-todo');
            this.$list = this.$('#todo-list');
            this.$stats = this.$('#todo-stats');
            this.$filters = this.$('.filter-btn');
            this.$clearCompleted = this.$('#clear-completed');

            // 創建 Todos Collection
            this.collection = new app.Todos();

            // 儲存所有的 TodoView 實例
            this.views = [];

            // 當前的過濾條件
            this.currentFilter = 'all';

            // 監聽 Collection 事件
            this.listenTo(this.collection, 'add', this.addOne);
            this.listenTo(this.collection, 'reset', this.addAll);
            this.listenTo(this.collection, 'change:completed', this.updateStats);
            this.listenTo(this.collection, 'destroy', this.updateStats);
            this.listenTo(this.collection, 'all', this.render);

            // 從 localStorage 載入資料
            this.collection.fetch({
                success: function(collection) {
                    console.log('Loaded', collection.length, 'todos from localStorage');
                },
                error: function(collection, response) {
                    console.error('Failed to load todos:', response);
                }
            });

            // 初始渲染
            this.render();
        },

        /**
         * 渲染方法
         * 更新統計資訊和 UI 狀態
         */
        render: function() {
            this.updateStats();
            this.updateClearButton();
            return this;
        },

        /**
         * 添加單個 Todo
         * 創建 TodoView 並添加到 DOM
         *
         * @param {Model} todo - Todo Model
         */
        addOne: function(todo) {
            // 創建 TodoView
            var view = new app.TodoView({
                model: todo
            });

            // 渲染 View
            view.render();

            // 添加到 DOM
            this.$list.append(view.el);

            // 儲存 View 實例
            this.views.push(view);

            // 根據當前過濾條件顯示/隱藏
            this.filterView(view);

            // 更新統計
            this.updateStats();

            console.log('Added todo view:', todo.get('title'));
        },

        /**
         * 添加所有 Todos
         * 當 Collection reset 時調用
         */
        addAll: function() {
            // 清除所有現有的 Views
            this.removeAllViews();

            // 添加所有 Todos
            this.collection.each(this.addOne, this);

            console.log('Added all todos');
        },

        /**
         * 移除所有 TodoViews
         */
        removeAllViews: function() {
            // 移除所有 View
            _.each(this.views, function(view) {
                view.remove();
            });

            // 清空 views 陣列
            this.views = [];
        },

        /**
         * 創建新的 Todo（點擊按鈕）
         *
         * @param {Event} e - DOM 事件
         */
        createOnClick: function(e) {
            e.preventDefault();
            this.createTodo();
        },

        /**
         * 創建新的 Todo（按 Enter）
         *
         * @param {Event} e - 鍵盤事件
         */
        createOnEnter: function(e) {
            if (e.which === 13) { // Enter 鍵
                this.createTodo();
            }
        },

        /**
         * 創建 Todo 的核心邏輯
         */
        createTodo: function() {
            var title = this.$input.val().trim();

            // 檢查輸入是否為空
            if (!title) {
                alert('請輸入待辦事項');
                return;
            }

            // 創建新的 Todo
            var todo = this.collection.createTodo({
                title: title
            });

            // 檢查是否創建成功
            if (todo) {
                // 清空輸入框
                this.$input.val('');

                // 聚焦到輸入框
                this.$input.focus();

                console.log('Created todo:', title);
            } else {
                alert('創建失敗，請檢查輸入');
            }
        },

        /**
         * 清除所有已完成的 Todos
         */
        clearCompleted: function() {
            var count = this.collection.completed().length;

            if (count === 0) {
                alert('沒有已完成的待辦事項');
                return;
            }

            if (confirm('確定要清除 ' + count + ' 個已完成的待辦事項嗎？')) {
                // 清除已完成的 Todos
                this.collection.clearCompleted();

                console.log('Cleared', count, 'completed todos');
            }
        },

        /**
         * 更新統計資訊
         */
        updateStats: function() {
            var stats = this.collection.getStats();

            // 更新計數器
            var countText = stats.remaining === 1 ? '項待辦事項' : '項待辦事項';
            this.$stats.find('.todo-count').html(
                '<strong>' + stats.remaining + '</strong> ' + countText
            );

            console.log('Stats:', stats);
        },

        /**
         * 更新"清除已完成"按鈕的狀態
         */
        updateClearButton: function() {
            var completedCount = this.collection.completed().length;

            if (completedCount > 0) {
                this.$clearCompleted
                    .show()
                    .text('清除已完成 (' + completedCount + ')');
            } else {
                this.$clearCompleted.hide();
            }
        },

        /**
         * 過濾 Todos
         *
         * @param {Event} e - DOM 事件
         */
        filterTodos: function(e) {
            e.preventDefault();

            var $btn = $(e.currentTarget);
            var filter = $btn.data('filter');

            // 更新當前過濾條件
            this.currentFilter = filter;

            // 更新按鈕狀態
            this.$filters.removeClass('active');
            $btn.addClass('active');

            // 過濾所有 Views
            this.applyFilter();

            console.log('Filter changed to:', filter);
        },

        /**
         * 應用過濾條件到所有 Views
         */
        applyFilter: function() {
            _.each(this.views, function(view) {
                this.filterView(view);
            }, this);
        },

        /**
         * 根據當前過濾條件顯示/隱藏單個 View
         *
         * @param {View} view - TodoView 實例
         */
        filterView: function(view) {
            var isCompleted = view.model.get('completed');
            var shouldShow = false;

            switch (this.currentFilter) {
                case 'active':
                    shouldShow = !isCompleted;
                    break;
                case 'completed':
                    shouldShow = isCompleted;
                    break;
                default: // 'all'
                    shouldShow = true;
            }

            if (shouldShow) {
                view.show();
            } else {
                view.hide();
            }
        },

        /**
         * 導出資料
         */
        exportData: function() {
            var json = this.collection.exportToJSON();
            console.log('Export data:', json);

            // 創建下載連結
            var blob = new Blob([json], { type: 'application/json' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = 'todos-backup-' + new Date().getTime() + '.json';
            a.click();
            URL.revokeObjectURL(url);
        },

        /**
         * 導入資料
         *
         * @param {String} jsonString - JSON 字串
         */
        importData: function(jsonString) {
            try {
                var data = JSON.parse(jsonString);
                this.collection.importTodos(data);
                alert('導入成功！');
            } catch (error) {
                console.error('Import error:', error);
                alert('導入失敗：' + error.message);
            }
        },

        /**
         * 獲取應用狀態
         */
        getState: function() {
            return {
                filter: this.currentFilter,
                stats: this.collection.getStats(),
                todos: this.collection.toJSON()
            };
        },

        /**
         * 重置應用
         */
        reset: function() {
            if (confirm('確定要清除所有資料嗎？此操作無法復原！')) {
                // 銷毀所有 Todos
                while (this.collection.length > 0) {
                    this.collection.at(0).destroy();
                }

                // 重置過濾條件
                this.currentFilter = 'all';
                this.$filters.removeClass('active').first().addClass('active');

                console.log('Application reset');
            }
        }
    });

    /**
     * AppView 使用範例：
     *
     * // 創建並啟動應用
     * var app = new app.AppView();
     *
     * // 獲取應用狀態
     * var state = app.getState();
     * console.log(state);
     *
     * // 導出資料
     * app.exportData();
     *
     * // 導入資料
     * var jsonData = '...'; // JSON 字串
     * app.importData(jsonData);
     *
     * // 重置應用
     * app.reset();
     */

})();
