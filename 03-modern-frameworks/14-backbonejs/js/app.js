/**
 * Todo List Application
 * =====================
 * 使用 Backbone.js 建構的 Todo List 應用程式
 *
 * 應用入口文件
 * 負責初始化應用並啟動
 */

(function() {
    'use strict';

    // 確保全域命名空間存在
    window.app = window.app || {};

    /**
     * 應用初始化
     * 當 DOM 載入完成後執行
     */
    $(document).ready(function() {
        console.log('='.repeat(50));
        console.log('Todo List Application - Backbone.js');
        console.log('='.repeat(50));

        // 創建主應用視圖
        // AppView 會自動創建 Collection 並從 localStorage 載入資料
        window.app.appView = new app.AppView();

        console.log('Application initialized successfully');
        console.log('='.repeat(50));

        // 顯示歡迎訊息（僅在首次使用時）
        showWelcomeMessage();

        // 添加全域快捷鍵
        setupGlobalKeyboardShortcuts();

        // 添加除錯工具
        setupDebugTools();

        // 監聽 window 事件
        setupWindowEvents();
    });

    /**
     * 顯示歡迎訊息
     */
    function showWelcomeMessage() {
        // 檢查是否是首次使用
        if (!localStorage.getItem('todos-backbone-visited')) {
            console.log('%c歡迎使用 Backbone.js Todo List！', 'color: #4a90e2; font-size: 16px; font-weight: bold;');
            console.log('%c這是一個使用 Backbone.js 建構的 Todo List 應用', 'color: #666;');
            console.log('%c特性：', 'color: #666; font-weight: bold;');
            console.log('  • Model-View-Collection 架構');
            console.log('  • LocalStorage 持久化');
            console.log('  • 事件驅動');
            console.log('  • Underscore.js 模板');
            console.log('%c快捷鍵：', 'color: #666; font-weight: bold;');
            console.log('  • Ctrl/Cmd + N: 聚焦到輸入框');
            console.log('  • Ctrl/Cmd + E: 導出資料');
            console.log('  • Ctrl/Cmd + Shift + R: 重置應用');
            console.log('%c除錯工具：', 'color: #666; font-weight: bold;');
            console.log('  • app.debug.stats() - 顯示統計資訊');
            console.log('  • app.debug.export() - 導出資料');
            console.log('  • app.debug.import(data) - 導入資料');
            console.log('  • app.debug.clear() - 清除所有資料');

            // 標記為已訪問
            localStorage.setItem('todos-backbone-visited', 'true');
        }
    }

    /**
     * 設定全域鍵盤快捷鍵
     */
    function setupGlobalKeyboardShortcuts() {
        $(document).on('keydown', function(e) {
            var isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            var cmdKey = isMac ? e.metaKey : e.ctrlKey;

            // Ctrl/Cmd + N: 聚焦到輸入框
            if (cmdKey && e.which === 78) {
                e.preventDefault();
                $('#new-todo').focus();
                console.log('快捷鍵: 聚焦到輸入框');
            }

            // Ctrl/Cmd + E: 導出資料
            if (cmdKey && e.which === 69) {
                e.preventDefault();
                app.appView.exportData();
                console.log('快捷鍵: 導出資料');
            }

            // Ctrl/Cmd + Shift + R: 重置應用
            if (cmdKey && e.shiftKey && e.which === 82) {
                e.preventDefault();
                app.appView.reset();
                console.log('快捷鍵: 重置應用');
            }
        });

        console.log('Global keyboard shortcuts enabled');
    }

    /**
     * 設定除錯工具
     * 提供全域的除錯方法
     */
    function setupDebugTools() {
        // 除錯工具命名空間
        window.app.debug = {
            /**
             * 顯示統計資訊
             */
            stats: function() {
                var state = app.appView.getState();
                console.table({
                    '總數': state.stats.total,
                    '已完成': state.stats.completed,
                    '進行中': state.stats.remaining,
                    '完成率': state.stats.completedPercentage + '%',
                    '當前過濾': state.filter
                });
                return state.stats;
            },

            /**
             * 列出所有 Todos
             */
            list: function() {
                var todos = app.appView.collection.toJSON();
                console.table(todos);
                return todos;
            },

            /**
             * 導出資料
             */
            export: function() {
                app.appView.exportData();
                return '資料已導出';
            },

            /**
             * 導入資料
             */
            import: function(jsonString) {
                app.appView.importData(jsonString);
                return '資料導入完成';
            },

            /**
             * 清除所有資料
             */
            clear: function() {
                app.appView.reset();
                return '資料已清除';
            },

            /**
             * 添加測試資料
             */
            addTestData: function(count) {
                count = count || 5;
                var tasks = [
                    '學習 Backbone.js',
                    '閱讀 Underscore.js 文檔',
                    '實作 Todo List',
                    '理解 MVC 模式',
                    '掌握事件系統',
                    '學習 Collection',
                    '使用 LocalStorage',
                    '優化應用性能',
                    '編寫單元測試',
                    '部署到生產環境'
                ];

                for (var i = 0; i < count && i < tasks.length; i++) {
                    app.appView.collection.createTodo({
                        title: tasks[i],
                        completed: Math.random() > 0.5
                    });
                }

                console.log('已添加', count, '個測試資料');
                return '測試資料添加完成';
            },

            /**
             * 獲取 Collection 實例
             */
            getCollection: function() {
                return app.appView.collection;
            },

            /**
             * 獲取 AppView 實例
             */
            getAppView: function() {
                return app.appView;
            },

            /**
             * 顯示幫助資訊
             */
            help: function() {
                console.log('%c除錯工具說明', 'color: #4a90e2; font-size: 16px; font-weight: bold;');
                console.log('%capp.debug.stats()', 'color: #2ecc71;', '- 顯示統計資訊');
                console.log('%capp.debug.list()', 'color: #2ecc71;', '- 列出所有 Todos');
                console.log('%capp.debug.export()', 'color: #2ecc71;', '- 導出資料');
                console.log('%capp.debug.import(json)', 'color: #2ecc71;', '- 導入資料');
                console.log('%capp.debug.clear()', 'color: #2ecc71;', '- 清除所有資料');
                console.log('%capp.debug.addTestData(count)', 'color: #2ecc71;', '- 添加測試資料');
                console.log('%capp.debug.getCollection()', 'color: #2ecc71;', '- 獲取 Collection 實例');
                console.log('%capp.debug.getAppView()', 'color: #2ecc71;', '- 獲取 AppView 實例');
            }
        };

        // 在控制台中顯示除錯工具提示
        console.log('%c除錯工具已啟用', 'color: #4a90e2; font-weight: bold;');
        console.log('輸入 %capp.debug.help()%c 查看可用命令', 'color: #2ecc71;', 'color: inherit;');
    }

    /**
     * 設定 Window 事件監聽
     */
    function setupWindowEvents() {
        // 監聽 beforeunload 事件（頁面關閉前）
        $(window).on('beforeunload', function() {
            // 資料已自動保存到 localStorage，不需要額外處理
            console.log('Application closing, data saved to localStorage');
        });

        // 監聽 storage 事件（其他標籤頁的資料變更）
        $(window).on('storage', function(e) {
            if (e.originalEvent.key === 'todos-backbone') {
                console.log('Data changed in another tab, reloading...');
                // 重新載入資料
                app.appView.collection.fetch();
            }
        });

        console.log('Window events listener enabled');
    }

    /**
     * 應用程式版本資訊
     */
    window.app.version = {
        app: '1.0.0',
        backbone: Backbone.VERSION,
        underscore: _.VERSION,
        jquery: $.fn.jquery
    };

    // 顯示版本資訊
    console.log('Versions:', {
        'App': window.app.version.app,
        'Backbone.js': window.app.version.backbone,
        'Underscore.js': window.app.version.underscore,
        'jQuery': window.app.version.jquery
    });

})();

/**
 * ============================================
 * Backbone.js 核心概念總結
 * ============================================
 *
 * 1. Model (模型)
 *    - 代表單個資料實體
 *    - 包含業務邏輯和驗證
 *    - 可以與服務器同步
 *    - 觸發 change 事件
 *
 * 2. Collection (集合)
 *    - Model 的有序集合
 *    - 提供 Underscore.js 方法
 *    - 管理資料的增刪改查
 *    - 可以排序和過濾
 *
 * 3. View (視圖)
 *    - 負責 DOM 操作和渲染
 *    - 監聽 Model/Collection 事件
 *    - 處理用戶交互
 *    - 使用模板渲染 HTML
 *
 * 4. Events (事件)
 *    - 發布-訂閱模式
 *    - 解耦組件之間的依賴
 *    - on/off/trigger 方法
 *    - listenTo/stopListening
 *
 * 5. Router (路由)
 *    - 管理應用程式狀態
 *    - 處理 URL 變化
 *    - 支持歷史記錄
 *    - 單頁應用導航
 *
 * ============================================
 * Backbone.js 的優勢
 * ============================================
 *
 * 1. 輕量級
 *    - 核心只有 8KB (gzipped)
 *    - 依賴少（只需要 Underscore.js）
 *    - 學習曲線平緩
 *
 * 2. 靈活性
 *    - 不強制特定結構
 *    - 可以與其他庫整合
 *    - 漸進式採用
 *
 * 3. RESTful
 *    - 原生支持 RESTful API
 *    - 自動同步機制
 *    - 可擴展的 Sync 方法
 *
 * 4. 事件驅動
 *    - 優雅的事件系統
 *    - 自動內存管理
 *    - 鬆散耦合
 *
 * ============================================
 * 學習資源
 * ============================================
 *
 * 官方文檔：https://backbonejs.org/
 * GitHub：https://github.com/jashkenas/backbone
 * Underscore.js：https://underscorejs.org/
 */
