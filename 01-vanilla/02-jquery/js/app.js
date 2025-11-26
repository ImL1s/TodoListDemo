/**
 * jQuery Todo List Application
 * 經典 jQuery 框架實現的任務管理應用
 *
 * 特性：
 * - jQuery 選擇器和 DOM 操作
 * - 事件委託處理
 * - 鏈式調用
 * - 動畫效果
 * - LocalStorage 持久化
 * - 完整的 CRUD 操作
 */

// =====================================
// jQuery Document Ready
// =====================================
$(document).ready(function() {
    'use strict';

    // =====================================
    // 狀態管理
    // =====================================
    let todos = [];
    let currentFilter = 'all';
    let editingId = null;

    // =====================================
    // DOM 元素快取（使用 jQuery 選擇器）
    // =====================================
    const $todoInput = $('#todoInput');
    const $addBtn = $('#addBtn');
    const $todoList = $('#todoList');
    const $emptyState = $('#emptyState');
    const $inputHint = $('#inputHint');
    const $clearCompleted = $('#clearCompleted');
    const $filterBtns = $('.filter-btn');

    // =====================================
    // 初始化應用
    // =====================================
    function init() {
        loadTodos();
        renderTodos();
        updateCounts();
        bindEvents();
        console.log('jQuery Todo List 初始化完成！');
    }

    // =====================================
    // LocalStorage 操作
    // =====================================

    /**
     * 從 LocalStorage 載入資料
     */
    function loadTodos() {
        try {
            const stored = localStorage.getItem('jquery-todos');
            if (stored) {
                todos = JSON.parse(stored);
                console.log(`已載入 ${todos.length} 個任務`);
            }
        } catch (error) {
            console.error('載入資料失敗:', error);
            todos = [];
        }
    }

    /**
     * 保存資料到 LocalStorage
     */
    function saveTodos() {
        try {
            localStorage.setItem('jquery-todos', JSON.stringify(todos));
            console.log('資料已保存');
        } catch (error) {
            console.error('保存資料失敗:', error);
            showHint('保存失敗，請檢查瀏覽器設置', 'error');
        }
    }

    // =====================================
    // 事件綁定（jQuery 方式）
    // =====================================
    function bindEvents() {
        // 添加按鈕點擊事件
        $addBtn.on('click', handleAddTodo);

        // Enter 鍵添加任務
        $todoInput.on('keypress', function(e) {
            if (e.which === 13) { // Enter key
                handleAddTodo();
            }
        });

        // 清除輸入提示
        $todoInput.on('input', function() {
            $inputHint.text('').removeClass('error success');
        });

        // 篩選按鈕（使用事件委託）
        $filterBtns.on('click', function() {
            const filter = $(this).data('filter');
            setFilter(filter);
        });

        // 清除已完成按鈕
        $clearCompleted.on('click', handleClearCompleted);

        // Todo 項目事件委託（jQuery 的優勢）
        $todoList
            // 切換完成狀態
            .on('click', '.todo-item', function(e) {
                // 避免點擊按鈕時觸發
                if (!$(e.target).closest('.todo-actions, .action-btn').length) {
                    const id = $(this).data('id');
                    toggleTodo(id);
                }
            })
            // 刪除按鈕
            .on('click', '.delete-btn', function(e) {
                e.stopPropagation();
                const id = $(this).closest('.todo-item').data('id');
                deleteTodo(id);
            })
            // 編輯按鈕
            .on('click', '.edit-btn', function(e) {
                e.stopPropagation();
                const id = $(this).closest('.todo-item').data('id');
                startEdit(id);
            })
            // 保存編輯
            .on('click', '.save-btn', function(e) {
                e.stopPropagation();
                const id = $(this).closest('.todo-item').data('id');
                saveEdit(id);
            })
            // 取消編輯
            .on('click', '.cancel-btn', function(e) {
                e.stopPropagation();
                cancelEdit();
            })
            // Enter 保存編輯
            .on('keypress', '.todo-edit-input', function(e) {
                if (e.which === 13) {
                    const id = $(this).closest('.todo-item').data('id');
                    saveEdit(id);
                }
            })
            // Esc 取消編輯
            .on('keydown', '.todo-edit-input', function(e) {
                if (e.which === 27) { // Esc key
                    cancelEdit();
                }
            });

        console.log('所有事件已綁定');
    }

    // =====================================
    // Todo CRUD 操作
    // =====================================

    /**
     * 添加新任務
     */
    function handleAddTodo() {
        const text = $todoInput.val().trim();

        // 驗證輸入
        if (!text) {
            showHint('請輸入任務內容', 'error');
            // jQuery 添加動畫 class
            $todoInput.addClass('shake');
            setTimeout(() => $todoInput.removeClass('shake'), 400);
            return;
        }

        if (text.length < 2) {
            showHint('任務內容至少需要 2 個字符', 'error');
            return;
        }

        if (text.length > 200) {
            showHint('任務內容不能超過 200 個字符', 'error');
            return;
        }

        // 創建新任務
        const newTodo = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            text: text,
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        todos.unshift(newTodo); // 添加到開頭
        saveTodos();

        // 清空輸入框（jQuery 鏈式調用）
        $todoInput
            .val('')
            .focus();

        showHint('任務添加成功！', 'success');

        // 重新渲染
        renderTodos();
        updateCounts();

        console.log('新增任務:', newTodo);
    }

    /**
     * 切換任務完成狀態
     */
    function toggleTodo(id) {
        const todo = todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            todo.updatedAt = new Date().toISOString();
            saveTodos();
            renderTodos();
            updateCounts();
            console.log('切換狀態:', id, todo.completed);
        }
    }

    /**
     * 刪除任務（帶動畫效果）
     */
    function deleteTodo(id) {
        const $item = $(`.todo-item[data-id="${id}"]`);

        // 先更新數據，避免 race condition
        todos = todos.filter(t => t.id !== id);
        saveTodos();
        
        // jQuery 動畫：淡出並向上滑動
        $item.fadeOut(300, function() {
            // 動畫完成後重新渲染
            renderTodos();
            updateCounts();
            console.log('刪除任務:', id);
        });
    }

    /**
     * 開始編輯任務
     */
    function startEdit(id) {
        if (editingId !== null) {
            cancelEdit();
        }

        editingId = id;
        const todo = todos.find(t => t.id === id);
        const $item = $(`.todo-item[data-id="${id}"]`);

        if (todo && $item.length) {
            // 替換文本為輸入框
            $item.find('.todo-text').replaceWith(
                `<input type="text" class="todo-edit-input" value="${escapeHtml(todo.text)}">`
            );

            // 替換按鈕
            $item.find('.todo-actions').html(`
                <button class="action-btn save-btn">💾</button>
                <button class="action-btn cancel-btn">✖️</button>
            `);

            // 聚焦並選中文本
            $item.find('.todo-edit-input').focus().select();

            console.log('開始編輯:', id);
        }
    }

    /**
     * 保存編輯
     */
    function saveEdit(id) {
        const $item = $(`.todo-item[data-id="${id}"]`);
        const newText = $item.find('.todo-edit-input').val().trim();

        if (!newText) {
            showHint('任務內容不能為空', 'error');
            return;
        }

        if (newText.length < 2) {
            showHint('任務內容至少需要 2 個字符', 'error');
            return;
        }

        const todo = todos.find(t => t.id === id);
        if (todo) {
            todo.text = newText;
            todo.updatedAt = new Date().toISOString();
            saveTodos();
            editingId = null;
            renderTodos();
            showHint('任務已更新', 'success');
            console.log('保存編輯:', id, newText);
        }
    }

    /**
     * 取消編輯
     */
    function cancelEdit() {
        if (editingId !== null) {
            editingId = null;
            renderTodos();
            console.log('取消編輯');
        }
    }

    /**
     * 清除所有已完成的任務
     */
    function handleClearCompleted() {
        const completedCount = todos.filter(t => t.completed).length;

        if (completedCount === 0) {
            showHint('沒有已完成的任務', 'error');
            return;
        }

        // 確認對話框
        if (confirm(`確定要清除 ${completedCount} 個已完成的任務嗎？`)) {
            todos = todos.filter(t => !t.completed);
            saveTodos();
            renderTodos();
            updateCounts();
            showHint(`已清除 ${completedCount} 個任務`, 'success');
            console.log('清除已完成任務:', completedCount);
        }
    }

    // =====================================
    // 篩選功能
    // =====================================
    function setFilter(filter) {
        currentFilter = filter;

        // 更新按鈕狀態（jQuery 鏈式調用）
        $filterBtns
            .removeClass('active')
            .filter(`[data-filter="${filter}"]`)
            .addClass('active');

        renderTodos();
        console.log('切換篩選:', filter);
    }

    /**
     * 根據篩選條件過濾任務
     */
    function getFilteredTodos() {
        switch (currentFilter) {
            case 'active':
                return todos.filter(t => !t.completed);
            case 'completed':
                return todos.filter(t => t.completed);
            default:
                return todos;
        }
    }

    // =====================================
    // 渲染函數
    // =====================================

    /**
     * 渲染所有任務
     */
    function renderTodos() {
        const filteredTodos = getFilteredTodos();

        // 清空列表
        $todoList.empty();

        // 顯示/隱藏空狀態
        if (filteredTodos.length === 0) {
            $emptyState.removeClass('hidden');
            return;
        } else {
            $emptyState.addClass('hidden');
        }

        // 渲染每個任務
        filteredTodos.forEach((todo, index) => {
            const $item = createTodoElement(todo);

            // jQuery 動畫：延遲顯示每個項目
            $item
                .hide()
                .appendTo($todoList)
                .delay(index * 50)
                .fadeIn(300);
        });

        console.log(`渲染了 ${filteredTodos.length} 個任務`);
    }

    /**
     * 創建單個任務元素（jQuery 方式）
     */
    function createTodoElement(todo) {
        const isEditing = todo.id === editingId;
        const completedClass = todo.completed ? 'completed' : '';
        const timeStr = formatTime(todo.createdAt);

        // 使用 jQuery 創建元素
        const $item = $('<li>')
            .addClass('todo-item')
            .addClass(completedClass)
            .attr('data-id', todo.id);

        // 複選框
        const $checkbox = $('<div>').addClass('todo-checkbox');

        // 內容區域
        let $content;
        if (isEditing) {
            $content = $('<input>')
                .attr('type', 'text')
                .addClass('todo-edit-input')
                .val(todo.text);
        } else {
            $content = $('<span>')
                .addClass('todo-text')
                .text(todo.text);
        }

        // 時間戳記
        const $time = $('<span>')
            .addClass('todo-time')
            .text(timeStr);

        // 操作按鈕
        const $actions = $('<div>').addClass('todo-actions');
        if (isEditing) {
            $actions.html(`
                <button class="action-btn save-btn">💾</button>
                <button class="action-btn cancel-btn">✖️</button>
            `);
        } else {
            $actions.html(`
                <button class="action-btn edit-btn">✏️</button>
                <button class="action-btn delete-btn">🗑️</button>
            `);
        }

        // 組合元素（jQuery 鏈式調用）
        $item
            .append($checkbox)
            .append($content)
            .append($time)
            .append($actions);

        return $item;
    }

    /**
     * 更新計數器
     */
    function updateCounts() {
        const all = todos.length;
        const active = todos.filter(t => !t.completed).length;
        const completed = todos.filter(t => t.completed).length;

        // jQuery 更新文本
        $('#countAll').text(all);
        $('#countActive').text(active);
        $('#countCompleted').text(completed);

        // 更新清除按鈕狀態
        $clearCompleted.prop('disabled', completed === 0);
    }

    // =====================================
    // 工具函數
    // =====================================

    /**
     * 顯示輸入提示
     */
    function showHint(message, type = 'error') {
        $inputHint
            .text(message)
            .removeClass('error success')
            .addClass(type);

        // 3 秒後清除（jQuery 延遲）
        setTimeout(() => {
            $inputHint.text('').removeClass('error success');
        }, 3000);
    }

    /**
     * 格式化時間
     */
    function formatTime(isoString) {
        const date = new Date(isoString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return '剛剛';
        if (diffMins < 60) return `${diffMins} 分鐘前`;
        if (diffHours < 24) return `${diffHours} 小時前`;
        if (diffDays < 7) return `${diffDays} 天前`;

        return date.toLocaleDateString('zh-TW', {
            month: 'short',
            day: 'numeric'
        });
    }

    /**
     * HTML 轉義（防止 XSS）
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // =====================================
    // 啟動應用
    // =====================================
    init();

    // =====================================
    // 開發工具（僅在開發環境使用）
    // =====================================
    window.todoApp = {
        getTodos: () => todos,
        addDemo: () => {
            const demoTodos = [
                '完成 jQuery 教程',
                '學習事件委託',
                '理解鏈式調用',
                '練習 DOM 操作',
                '閱讀 jQuery 文檔'
            ];

            demoTodos.forEach((text, index) => {
                setTimeout(() => {
                    $todoInput.val(text);
                    handleAddTodo();
                }, index * 500);
            });
        },
        clear: () => {
            if (confirm('確定要清除所有資料嗎？')) {
                todos = [];
                saveTodos();
                renderTodos();
                updateCounts();
                console.log('所有資料已清除');
            }
        },
        version: '1.0.0'
    };

    console.log('%c jQuery Todo List 已就緒！', 'color: #667eea; font-size: 16px; font-weight: bold;');
    console.log('%c 在控制台輸入 todoApp.addDemo() 來添加示範資料', 'color: #48bb78; font-size: 12px;');
});
