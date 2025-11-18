<template>
  <div class="title-bar">
    <div class="title">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 11 12 14 22 4"></polyline>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
      </svg>
      <span>Vue Todo List</span>
    </div>
    <div class="window-controls">
      <button @click="minimize" title="Minimize">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
          <rect y="5" width="12" height="2"/>
        </svg>
      </button>
      <button @click="maximize" title="Maximize">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
          <rect x="1" y="1" width="10" height="10" fill="none" stroke="currentColor" stroke-width="1.5"/>
        </svg>
      </button>
      <button @click="close" class="close" title="Close">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
          <path d="M1 1 L11 11 M11 1 L1 11" stroke="currentColor" stroke-width="1.5"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const minimize = () => {
  window.electronAPI.minimizeWindow()
}

const maximize = () => {
  window.electronAPI.maximizeWindow()
}

const close = () => {
  window.electronAPI.closeWindow()
}
</script>

<style scoped>
.title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0 16px;
  -webkit-app-region: drag;
  user-select: none;
}

.title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
}

.window-controls {
  display: flex;
  gap: 8px;
  -webkit-app-region: no-drag;
}

.window-controls button {
  width: 32px;
  height: 28px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.window-controls button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.window-controls button.close:hover {
  background: #ff5252;
}
</style>
