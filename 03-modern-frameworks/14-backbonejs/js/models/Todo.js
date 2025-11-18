/**
 * Todo Model
 * ==========
 * Backbone Model 代表單個 Todo 項目
 *
 * 核心概念：
 * - Model 是資料的容器，包含業務邏輯
 * - 使用 attributes 儲存資料
 * - 可以監聽 change 事件
 * - 可以驗證資料
 */

(function() {
    'use strict';

    // 定義在全域命名空間
    window.app = window.app || {};

    /**
     * Todo Model
     *
     * 屬性：
     * - title: 待辦事項標題
     * - completed: 是否完成
     * - order: 排序順序
     * - created: 建立時間
     */
    app.Todo = Backbone.Model.extend({

        /**
         * 預設屬性值
         * 當創建新的 Model 實例時，如果沒有提供這些屬性，將使用這些預設值
         */
        defaults: {
            title: '',
            completed: false,
            order: 0,
            created: null
        },

        /**
         * 初始化方法
         * 在 Model 創建時自動調用
         */
        initialize: function() {
            // 如果沒有設定創建時間，自動設定為當前時間
            if (!this.get('created')) {
                this.set('created', new Date().getTime());
            }

            // 監聽變更事件（用於除錯）
            this.on('change', function() {
                console.log('Todo changed:', this.toJSON());
            });

            // 監聽銷毀事件
            this.on('destroy', function() {
                console.log('Todo destroyed:', this.get('title'));
            });
        },

        /**
         * 切換完成狀態
         * 這是自定義的業務邏輯方法
         */
        toggle: function() {
            this.save({
                completed: !this.get('completed')
            });
        },

        /**
         * 驗證方法
         * 在 save() 時自動調用（如果有提供）
         *
         * @param {Object} attrs - 要驗證的屬性
         * @returns {String|undefined} - 如果驗證失敗，返回錯誤訊息
         */
        validate: function(attrs) {
            // 確保 title 不為空
            if (attrs.title !== undefined && attrs.title.trim() === '') {
                return '待辦事項標題不能為空';
            }

            // 確保 completed 是布林值
            if (attrs.completed !== undefined && typeof attrs.completed !== 'boolean') {
                return 'completed 必須是布林值';
            }

            // 確保 order 是數字
            if (attrs.order !== undefined && typeof attrs.order !== 'number') {
                return 'order 必須是數字';
            }
        },

        /**
         * 自定義的 JSON 序列化方法
         * 可以控制哪些屬性要被序列化
         */
        toJSON: function() {
            // 調用原始的 toJSON 方法
            var json = Backbone.Model.prototype.toJSON.call(this);

            // 可以在這裡添加額外的處理
            // 例如：格式化日期、添加計算屬性等

            return json;
        },

        /**
         * 檢查是否為有效的 Todo
         */
        isValid: function() {
            return this.get('title').trim() !== '';
        },

        /**
         * 檢查是否已完成
         */
        isCompleted: function() {
            return this.get('completed') === true;
        },

        /**
         * 檢查是否進行中
         */
        isActive: function() {
            return !this.isCompleted();
        },

        /**
         * 更新標題
         * @param {String} title - 新的標題
         */
        updateTitle: function(title) {
            if (title.trim() === '') {
                return false;
            }

            this.save({
                title: title.trim()
            });

            return true;
        }
    });

    /**
     * Model 使用範例：
     *
     * // 創建新的 Todo
     * var todo = new app.Todo({
     *     title: '學習 Backbone.js',
     *     completed: false
     * });
     *
     * // 獲取屬性
     * console.log(todo.get('title')); // "學習 Backbone.js"
     *
     * // 設定屬性
     * todo.set('completed', true);
     *
     * // 切換完成狀態
     * todo.toggle();
     *
     * // 監聽變更事件
     * todo.on('change:completed', function(model, value) {
     *     console.log('完成狀態變更為:', value);
     * });
     *
     * // 驗證
     * todo.set({ title: '' }, { validate: true }); // 會觸發驗證失敗
     *
     * // 轉換為 JSON
     * var json = todo.toJSON();
     */

})();
