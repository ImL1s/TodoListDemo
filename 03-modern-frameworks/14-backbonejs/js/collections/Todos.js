/**
 * Todos Collection
 * ================
 * Backbone Collection 代表 Todo 項目的集合
 *
 * 核心概念：
 * - Collection 是 Model 的有序集合
 * - 提供豐富的 Underscore.js 方法（filter, map, reduce 等）
 * - 可以與 RESTful API 同步
 * - 使用 localStorage 作為持久化儲存
 */

(function() {
    'use strict';

    window.app = window.app || {};

    /**
     * Todos Collection
     *
     * 管理所有的 Todo Model
     */
    app.Todos = Backbone.Collection.extend({

        /**
         * 指定 Collection 中 Model 的類型
         * 當添加資料到 Collection 時，會自動轉換為 Todo Model
         */
        model: app.Todo,

        /**
         * LocalStorage 配置
         * 使用 Backbone.localStorage 插件來實現本地持久化
         * 資料會儲存在瀏覽器的 localStorage 中
         */
        localStorage: new Backbone.LocalStorage('todos-backbone'),

        /**
         * 初始化方法
         */
        initialize: function() {
            console.log('Todos Collection initialized');

            // 監聽集合事件
            this.on('add', function(model) {
                console.log('Todo added:', model.get('title'));
            });

            this.on('remove', function(model) {
                console.log('Todo removed:', model.get('title'));
            });

            this.on('reset', function() {
                console.log('Todos reset');
            });

            // 監聽所有 Model 的變更
            this.on('change:completed', function(model) {
                console.log('Todo completed status changed:', model.get('title'), model.get('completed'));
            });
        },

        /**
         * 比較器函數
         * 定義 Collection 中 Model 的排序方式
         * 返回用於排序的值
         */
        comparator: function(todo) {
            // 按照 order 屬性升序排序
            // 如果沒有 order，則按照創建時間排序
            return todo.get('order') || todo.get('created');
        },

        /**
         * 獲取所有已完成的 Todos
         * 使用 Underscore.js 的 filter 方法
         *
         * @returns {Array} 已完成的 Todo Models
         */
        completed: function() {
            return this.filter(function(todo) {
                return todo.get('completed');
            });
        },

        /**
         * 獲取所有進行中的 Todos
         *
         * @returns {Array} 進行中的 Todo Models
         */
        remaining: function() {
            return this.filter(function(todo) {
                return !todo.get('completed');
            });
        },

        /**
         * 獲取下一個 order 值
         * 用於新增 Todo 時設定排序順序
         *
         * @returns {Number} 下一個 order 值
         */
        nextOrder: function() {
            if (!this.length) {
                return 1;
            }
            // 返回最後一個 Model 的 order + 1
            return this.last().get('order') + 1;
        },

        /**
         * 創建新的 Todo
         * 這是一個便利方法，會自動設定 order
         *
         * @param {Object} attrs - Todo 屬性
         * @returns {Model} 新創建的 Todo Model
         */
        createTodo: function(attrs) {
            // 合併預設屬性
            var todoAttrs = _.extend({
                order: this.nextOrder(),
                created: new Date().getTime()
            }, attrs);

            // 創建並保存 Todo
            return this.create(todoAttrs, {
                validate: true, // 啟用驗證
                wait: true      // 等待服務器回應（localStorage 是同步的，但這是好習慣）
            });
        },

        /**
         * 清除所有已完成的 Todos
         *
         * @returns {Number} 清除的數量
         */
        clearCompleted: function() {
            var completed = this.completed();
            var count = completed.length;

            // 銷毀所有已完成的 Todos
            _.each(completed, function(todo) {
                todo.destroy();
            });

            return count;
        },

        /**
         * 切換所有 Todos 的完成狀態
         *
         * @param {Boolean} completed - 目標完成狀態
         */
        toggleAll: function(completed) {
            this.each(function(todo) {
                todo.save({
                    completed: completed
                });
            });
        },

        /**
         * 獲取統計資訊
         *
         * @returns {Object} 統計資訊
         */
        getStats: function() {
            var total = this.length;
            var completed = this.completed().length;
            var remaining = this.remaining().length;

            return {
                total: total,
                completed: completed,
                remaining: remaining,
                completedPercentage: total > 0 ? Math.round((completed / total) * 100) : 0
            };
        },

        /**
         * 根據過濾條件獲取 Todos
         *
         * @param {String} filter - 過濾條件 ('all', 'active', 'completed')
         * @returns {Array} 過濾後的 Todos
         */
        getFiltered: function(filter) {
            switch (filter) {
                case 'active':
                    return this.remaining();
                case 'completed':
                    return this.completed();
                default:
                    return this.models;
            }
        },

        /**
         * 批量導入 Todos
         *
         * @param {Array} todos - Todo 資料陣列
         */
        importTodos: function(todos) {
            if (!Array.isArray(todos)) {
                console.error('Invalid todos data');
                return;
            }

            // 重置 Collection 並添加新資料
            this.reset(todos);

            // 保存所有 Models
            this.each(function(todo) {
                todo.save();
            });
        },

        /**
         * 導出所有 Todos 為 JSON
         *
         * @returns {String} JSON 字串
         */
        exportToJSON: function() {
            return JSON.stringify(this.toJSON(), null, 2);
        },

        /**
         * 搜尋 Todos
         *
         * @param {String} query - 搜尋關鍵字
         * @returns {Array} 符合的 Todos
         */
        search: function(query) {
            if (!query || query.trim() === '') {
                return this.models;
            }

            var lowerQuery = query.toLowerCase();

            return this.filter(function(todo) {
                var title = todo.get('title').toLowerCase();
                return title.indexOf(lowerQuery) !== -1;
            });
        },

        /**
         * 檢查是否全部完成
         *
         * @returns {Boolean}
         */
        allCompleted: function() {
            return this.length > 0 && this.remaining().length === 0;
        },

        /**
         * 重新排序
         * 根據當前的 comparator 重新排序
         */
        reorder: function() {
            this.sort();
        }
    });

    /**
     * Collection 使用範例：
     *
     * // 創建 Collection 實例
     * var todos = new app.Todos();
     *
     * // 從 localStorage 載入資料
     * todos.fetch();
     *
     * // 添加新的 Todo
     * todos.createTodo({
     *     title: '學習 Backbone.js Collection'
     * });
     *
     * // 獲取統計資訊
     * var stats = todos.getStats();
     * console.log('總共:', stats.total);
     * console.log('已完成:', stats.completed);
     * console.log('進行中:', stats.remaining);
     *
     * // 過濾 Todos
     * var activeTodos = todos.remaining();
     * var completedTodos = todos.completed();
     *
     * // 清除已完成
     * todos.clearCompleted();
     *
     * // 使用 Underscore.js 方法
     * todos.each(function(todo) {
     *     console.log(todo.get('title'));
     * });
     *
     * var titles = todos.map(function(todo) {
     *     return todo.get('title');
     * });
     *
     * // 監聽事件
     * todos.on('add', function(model) {
     *     console.log('新增了 Todo:', model.get('title'));
     * });
     */

})();
