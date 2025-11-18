/**
 * PWA Todo List - 主應用邏輯
 * 處理 UI 交互、數據管理、PWA 功能等
 */

class TodoApp {
  constructor() {
    // 應用狀態
    this.todos = [];
    this.currentFilter = 'all';
    this.currentSort = 'newest';
    this.searchQuery = '';

    // PWA 相關
    this.deferredPrompt = null;
    this.isOnline = navigator.onLine;

    // DOM 元素
    this.elements = {};

    // 初始化
    this.init();
  }

  /**
   * 初始化應用
   */
  async init() {
    console.log('[App] Initializing...');

    // 等待數據庫初始化
    await todoDB.init();

    // 綁定 DOM 元素
    this.bindElements();

    // 綁定事件
    this.bindEvents();

    // 註冊 Service Worker
    this.registerServiceWorker();

    // 設置 PWA 安裝提示
    this.setupInstallPrompt();

    // 設置網絡狀態監聽
    this.setupNetworkListeners();

    // 載入待辦事項
    await this.loadTodos();

    // 檢查 PWA 狀態
    this.checkPWAStatus();

    console.log('[App] Initialized successfully');
  }

  /**
   * 綁定 DOM 元素
   */
  bindElements() {
    // 表單和輸入
    this.elements.addTodoForm = document.getElementById('addTodoForm');
    this.elements.todoInput = document.getElementById('todoInput');
    this.elements.searchInput = document.getElementById('searchInput');
    this.elements.sortSelect = document.getElementById('sortSelect');

    // 列表和狀態
    this.elements.todoList = document.getElementById('todoList');
    this.elements.emptyState = document.getElementById('emptyState');

    // 統計
    this.elements.totalCount = document.getElementById('totalCount');
    this.elements.activeCount = document.getElementById('activeCount');
    this.elements.completedCount = document.getElementById('completedCount');

    // 過濾器標籤
    this.elements.filterTabs = document.querySelectorAll('.filter-tab');
    this.elements.allTabCount = document.getElementById('allTabCount');
    this.elements.activeTabCount = document.getElementById('activeTabCount');
    this.elements.completedTabCount = document.getElementById('completedTabCount');

    // 批量操作
    this.elements.bulkActions = document.getElementById('bulkActions');
    this.elements.clearCompleted = document.getElementById('clearCompleted');

    // PWA 安裝
    this.elements.installBanner = document.getElementById('installBanner');
    this.elements.installButton = document.getElementById('installButton');
    this.elements.dismissInstall = document.getElementById('dismissInstall');

    // 網絡狀態
    this.elements.offlineIndicator = document.getElementById('offlineIndicator');
    this.elements.onlineIndicator = document.getElementById('onlineIndicator');

    // 按鈕
    this.elements.syncButton = document.getElementById('syncButton');
    this.elements.notificationButton = document.getElementById('notificationButton');
    this.elements.settingsButton = document.getElementById('settingsButton');

    // 模態框
    this.elements.settingsModal = document.getElementById('settingsModal');
    this.elements.closeModals = document.querySelectorAll('.close-modal');

    // 設定選項
    this.elements.enableNotifications = document.getElementById('enableNotifications');
    this.elements.exportData = document.getElementById('exportData');
    this.elements.importData = document.getElementById('importData');
    this.elements.importFile = document.getElementById('importFile');
    this.elements.clearCache = document.getElementById('clearCache');
    this.elements.clearAllData = document.getElementById('clearAllData');

    // Toast
    this.elements.toast = document.getElementById('toast');
    this.elements.toastMessage = this.elements.toast.querySelector('.toast-message');

    // 其他
    this.elements.cacheVersion = document.getElementById('cacheVersion');
    this.elements.lastSync = document.getElementById('lastSync');
    this.elements.pwaStatus = document.getElementById('pwaStatus');
  }

  /**
   * 綁定事件
   */
  bindEvents() {
    // 新增待辦事項
    this.elements.addTodoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.addTodo();
    });

    // 搜尋
    this.elements.searchInput.addEventListener('input', (e) => {
      this.searchQuery = e.target.value;
      this.renderTodos();
    });

    // 排序
    this.elements.sortSelect.addEventListener('change', (e) => {
      this.currentSort = e.target.value;
      this.renderTodos();
    });

    // 過濾器
    this.elements.filterTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        this.setFilter(e.target.dataset.filter);
      });
    });

    // 批量操作
    this.elements.clearCompleted.addEventListener('click', () => {
      this.clearCompleted();
    });

    // PWA 安裝
    this.elements.installButton.addEventListener('click', () => {
      this.installPWA();
    });

    this.elements.dismissInstall.addEventListener('click', () => {
      this.dismissInstallBanner();
    });

    // 工具按鈕
    this.elements.syncButton.addEventListener('click', () => {
      this.syncData();
    });

    this.elements.notificationButton.addEventListener('click', () => {
      this.requestNotificationPermission();
    });

    this.elements.settingsButton.addEventListener('click', () => {
      this.openModal('settingsModal');
    });

    // 關閉模態框
    this.elements.closeModals.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.closeModal(e.target.dataset.modal);
      });
    });

    // 點擊模態框外部關閉
    this.elements.settingsModal.addEventListener('click', (e) => {
      if (e.target === this.elements.settingsModal) {
        this.closeModal('settingsModal');
      }
    });

    // 設定選項
    this.elements.enableNotifications.addEventListener('change', (e) => {
      if (e.target.checked) {
        this.requestNotificationPermission();
      }
    });

    this.elements.exportData.addEventListener('click', () => {
      this.exportData();
    });

    this.elements.importData.addEventListener('click', () => {
      this.elements.importFile.click();
    });

    this.elements.importFile.addEventListener('change', (e) => {
      this.importData(e.target.files[0]);
    });

    this.elements.clearCache.addEventListener('click', () => {
      this.clearCache();
    });

    this.elements.clearAllData.addEventListener('click', () => {
      this.clearAllData();
    });

    // 鍵盤快捷鍵
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + K: 聚焦搜尋
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.elements.searchInput.focus();
      }
    });
  }

  /**
   * 註冊 Service Worker
   */
  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        console.log('[App] Service Worker registered:', registration.scope);

        // 監聽更新
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('[App] Service Worker update found');

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // 有新版本可用
              this.showToast('有新版本可用，請重新整理頁面', 'info');
            }
          });
        });

        // 獲取版本號
        this.getCacheVersion();
      } catch (error) {
        console.error('[App] Service Worker registration failed:', error);
      }
    }
  }

  /**
   * 設置 PWA 安裝提示
   */
  setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallBanner();
      console.log('[App] Install prompt ready');
    });

    window.addEventListener('appinstalled', () => {
      console.log('[App] PWA installed');
      this.deferredPrompt = null;
      this.hideInstallBanner();
      this.showToast('應用已成功安裝！', 'success');
    });
  }

  /**
   * 設置網絡狀態監聽
   */
  setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.showOnlineIndicator();
      this.syncData();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.showOfflineIndicator();
    });

    // 初始狀態
    if (!this.isOnline) {
      this.showOfflineIndicator();
    }
  }

  /**
   * 載入待辦事項
   */
  async loadTodos() {
    try {
      this.todos = await todoDB.getAll();
      this.renderTodos();
      this.updateStats();
      this.updateLastSync();
    } catch (error) {
      console.error('[App] Load todos error:', error);
      this.showToast('載入數據失敗', 'error');
    }
  }

  /**
   * 新增待辦事項
   */
  async addTodo() {
    const text = this.elements.todoInput.value.trim();

    if (!text) {
      return;
    }

    try {
      const id = await todoDB.add({ text });
      await this.loadTodos();

      this.elements.todoInput.value = '';
      this.showToast('已新增待辦事項', 'success');

      // 觸發後台同步（如果支援）
      this.requestBackgroundSync();
    } catch (error) {
      console.error('[App] Add todo error:', error);
      this.showToast('新增失敗', 'error');
    }
  }

  /**
   * 切換待辦事項完成狀態
   */
  async toggleTodo(id) {
    try {
      await todoDB.toggleComplete(id);
      await this.loadTodos();
      this.requestBackgroundSync();
    } catch (error) {
      console.error('[App] Toggle todo error:', error);
      this.showToast('更新失敗', 'error');
    }
  }

  /**
   * 刪除待辦事項
   */
  async deleteTodo(id) {
    try {
      await todoDB.delete(id);
      await this.loadTodos();
      this.showToast('已刪除待辦事項', 'success');
      this.requestBackgroundSync();
    } catch (error) {
      console.error('[App] Delete todo error:', error);
      this.showToast('刪除失敗', 'error');
    }
  }

  /**
   * 清除已完成的待辦事項
   */
  async clearCompleted() {
    if (!confirm('確定要清除所有已完成的待辦事項嗎？')) {
      return;
    }

    try {
      const count = await todoDB.clearCompleted();
      await this.loadTodos();
      this.showToast(`已清除 ${count} 個已完成項目`, 'success');
    } catch (error) {
      console.error('[App] Clear completed error:', error);
      this.showToast('清除失敗', 'error');
    }
  }

  /**
   * 設置過濾器
   */
  setFilter(filter) {
    this.currentFilter = filter;

    // 更新標籤樣式
    this.elements.filterTabs.forEach(tab => {
      if (tab.dataset.filter === filter) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    this.renderTodos();
  }

  /**
   * 過濾待辦事項
   */
  filterTodos(todos) {
    let filtered = [...todos];

    // 按過濾器過濾
    if (this.currentFilter === 'active') {
      filtered = filtered.filter(todo => !todo.completed);
    } else if (this.currentFilter === 'completed') {
      filtered = filtered.filter(todo => todo.completed);
    }

    // 按搜尋關鍵字過濾
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(todo =>
        todo.text.toLowerCase().includes(query)
      );
    }

    return filtered;
  }

  /**
   * 排序待辦事項
   */
  sortTodos(todos) {
    const sorted = [...todos];

    switch (this.currentSort) {
      case 'newest':
        sorted.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case 'oldest':
        sorted.sort((a, b) => a.createdAt - b.createdAt);
        break;
      case 'alphabetical':
        sorted.sort((a, b) => a.text.localeCompare(b.text));
        break;
    }

    return sorted;
  }

  /**
   * 渲染待辦事項列表
   */
  renderTodos() {
    const filtered = this.filterTodos(this.todos);
    const sorted = this.sortTodos(filtered);

    this.elements.todoList.innerHTML = '';

    if (sorted.length === 0) {
      this.elements.emptyState.classList.remove('hidden');
      this.elements.todoList.classList.add('hidden');
    } else {
      this.elements.emptyState.classList.add('hidden');
      this.elements.todoList.classList.remove('hidden');

      sorted.forEach(todo => {
        const todoElement = this.createTodoElement(todo);
        this.elements.todoList.appendChild(todoElement);
      });
    }

    this.updateStats();
  }

  /**
   * 創建待辦事項元素
   */
  createTodoElement(todo) {
    const div = document.createElement('div');
    div.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    div.dataset.id = todo.id;

    div.innerHTML = `
      <div class="todo-checkbox">
        <input type="checkbox" ${todo.completed ? 'checked' : ''} id="todo-${todo.id}">
        <label for="todo-${todo.id}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="20 6 9 17 4 12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </label>
      </div>
      <div class="todo-content">
        <span class="todo-text">${this.escapeHtml(todo.text)}</span>
        <span class="todo-date">${this.formatDate(todo.createdAt)}</span>
      </div>
      <button class="todo-delete" title="刪除">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="3 6 5 6 21 6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    `;

    // 綁定事件
    const checkbox = div.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => {
      this.toggleTodo(todo.id);
    });

    const deleteBtn = div.querySelector('.todo-delete');
    deleteBtn.addEventListener('click', () => {
      this.deleteTodo(todo.id);
    });

    return div;
  }

  /**
   * 更新統計資訊
   */
  async updateStats() {
    const stats = await todoDB.getStats();

    this.elements.totalCount.textContent = stats.total;
    this.elements.activeCount.textContent = stats.active;
    this.elements.completedCount.textContent = stats.completed;

    this.elements.allTabCount.textContent = stats.total;
    this.elements.activeTabCount.textContent = stats.active;
    this.elements.completedTabCount.textContent = stats.completed;

    // 顯示/隱藏批量操作按鈕
    if (stats.completed > 0) {
      this.elements.bulkActions.classList.remove('hidden');
    } else {
      this.elements.bulkActions.classList.add('hidden');
    }
  }

  /**
   * 安裝 PWA
   */
  async installPWA() {
    if (!this.deferredPrompt) {
      this.showToast('此應用已安裝或無法安裝', 'info');
      return;
    }

    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;

    console.log('[App] Install outcome:', outcome);

    if (outcome === 'accepted') {
      this.hideInstallBanner();
    }

    this.deferredPrompt = null;
  }

  /**
   * 顯示/隱藏安裝橫幅
   */
  showInstallBanner() {
    // 檢查是否曾經關閉過
    const dismissed = localStorage.getItem('installBannerDismissed');
    if (!dismissed) {
      this.elements.installBanner.classList.remove('hidden');
    }
  }

  hideInstallBanner() {
    this.elements.installBanner.classList.add('hidden');
  }

  dismissInstallBanner() {
    this.hideInstallBanner();
    localStorage.setItem('installBannerDismissed', 'true');
  }

  /**
   * 顯示/隱藏網絡狀態指示器
   */
  showOfflineIndicator() {
    this.elements.offlineIndicator.classList.remove('hidden');
    setTimeout(() => {
      this.elements.offlineIndicator.classList.add('hidden');
    }, 3000);
  }

  showOnlineIndicator() {
    this.elements.onlineIndicator.classList.remove('hidden');
    setTimeout(() => {
      this.elements.onlineIndicator.classList.add('hidden');
    }, 3000);
  }

  /**
   * 同步數據
   */
  async syncData() {
    this.showToast('正在同步數據...', 'info');

    try {
      // 這裡可以實現與後端 API 的同步邏輯
      // 目前只是重新載入本地數據
      await this.loadTodos();
      this.updateLastSync();
      this.showToast('同步完成', 'success');
    } catch (error) {
      console.error('[App] Sync error:', error);
      this.showToast('同步失敗', 'error');
    }
  }

  /**
   * 請求後台同步
   */
  async requestBackgroundSync() {
    if ('serviceWorker' in navigator && 'sync' in navigator.serviceWorker.registration) {
      try {
        await navigator.serviceWorker.ready;
        await navigator.serviceWorker.registration.sync.register('sync-todos');
        console.log('[App] Background sync registered');
      } catch (error) {
        console.error('[App] Background sync error:', error);
      }
    }
  }

  /**
   * 請求通知權限
   */
  async requestNotificationPermission() {
    if (!('Notification' in window)) {
      this.showToast('此瀏覽器不支援通知', 'error');
      return;
    }

    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      this.showToast('通知已啟用', 'success');
      this.elements.enableNotifications.checked = true;

      // 發送測試通知
      this.showNotification('PWA Todo List', '通知功能已啟用！');
    } else {
      this.showToast('通知權限被拒絕', 'error');
      this.elements.enableNotifications.checked = false;
    }
  }

  /**
   * 顯示通知
   */
  showNotification(title, body) {
    if (Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
          body,
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-72x72.png',
          vibrate: [200, 100, 200],
          tag: 'todo-notification'
        });
      });
    }
  }

  /**
   * 匯出數據
   */
  async exportData() {
    try {
      const jsonData = await todoDB.exportToJSON();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pwa-todo-backup-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);

      this.showToast('數據已匯出', 'success');
    } catch (error) {
      console.error('[App] Export error:', error);
      this.showToast('匯出失敗', 'error');
    }
  }

  /**
   * 匯入數據
   */
  async importData(file) {
    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const count = await todoDB.importFromJSON(text);
      await this.loadTodos();

      this.showToast(`已匯入 ${count} 個待辦事項`, 'success');
    } catch (error) {
      console.error('[App] Import error:', error);
      this.showToast('匯入失敗，請檢查檔案格式', 'error');
    }
  }

  /**
   * 清除緩存
   */
  async clearCache() {
    if (!confirm('確定要清除所有緩存嗎？數據不會受影響。')) {
      return;
    }

    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));

      this.showToast('緩存已清除，請重新整理頁面', 'success');
    } catch (error) {
      console.error('[App] Clear cache error:', error);
      this.showToast('清除緩存失敗', 'error');
    }
  }

  /**
   * 清除所有數據
   */
  async clearAllData() {
    if (!confirm('確定要清除所有數據嗎？此操作無法復原！')) {
      return;
    }

    if (!confirm('請再次確認：這將刪除所有待辦事項和緩存！')) {
      return;
    }

    try {
      await todoDB.clearAll();
      await this.clearCache();
      await this.loadTodos();

      this.showToast('所有數據已清除', 'success');
    } catch (error) {
      console.error('[App] Clear all error:', error);
      this.showToast('清除失敗', 'error');
    }
  }

  /**
   * 獲取緩存版本
   */
  async getCacheVersion() {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      const messageChannel = new MessageChannel();

      messageChannel.port1.onmessage = (event) => {
        if (event.data.type === 'VERSION') {
          this.elements.cacheVersion.textContent = event.data.version;
        }
      };

      navigator.serviceWorker.controller.postMessage(
        { type: 'GET_VERSION' },
        [messageChannel.port2]
      );
    }
  }

  /**
   * 更新最後同步時間
   */
  updateLastSync() {
    const now = new Date();
    this.elements.lastSync.textContent = now.toLocaleTimeString('zh-TW');
  }

  /**
   * 檢查 PWA 狀態
   */
  checkPWAStatus() {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                         window.navigator.standalone ||
                         document.referrer.includes('android-app://');

    if (isStandalone) {
      this.elements.pwaStatus.textContent = '已安裝（獨立模式）';
      this.elements.pwaStatus.style.color = '#4CAF50';
    } else {
      this.elements.pwaStatus.textContent = '瀏覽器模式';
      this.elements.pwaStatus.style.color = '#FF9800';
    }
  }

  /**
   * 打開模態框
   */
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('hidden');
    }
  }

  /**
   * 關閉模態框
   */
  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('hidden');
    }
  }

  /**
   * 顯示 Toast 通知
   */
  showToast(message, type = 'info') {
    this.elements.toastMessage.textContent = message;
    this.elements.toast.className = `toast ${type}`;
    this.elements.toast.classList.remove('hidden');

    setTimeout(() => {
      this.elements.toast.classList.add('hidden');
    }, 3000);
  }

  /**
   * 工具方法：轉義 HTML
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * 工具方法：格式化日期
   */
  formatDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;

    if (diff < minute) {
      return '剛剛';
    } else if (diff < hour) {
      return `${Math.floor(diff / minute)} 分鐘前`;
    } else if (diff < day) {
      return `${Math.floor(diff / hour)} 小時前`;
    } else if (diff < 7 * day) {
      return `${Math.floor(diff / day)} 天前`;
    } else {
      return date.toLocaleDateString('zh-TW');
    }
  }
}

// 啟動應用
let app;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    app = new TodoApp();
  });
} else {
  app = new TodoApp();
}
