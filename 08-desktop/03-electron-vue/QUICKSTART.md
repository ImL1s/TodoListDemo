# Electron Vue Todo - 快速开始

## 一分钟快速启动

```bash
# 安装依赖
npm install

# 启动开发环境
npm run electron:dev
```

就这么简单！应用会自动打开。

## 五分钟完整体验

### 1. 安装依赖 (2分钟)

```bash
npm install
```

### 2. 启动开发模式 (1分钟)

```bash
npm run electron:dev
```

你会看到：
- ✅ Vite 开发服务器启动
- ✅ Electron 窗口打开
- ✅ 开发者工具自动打开

### 3. 体验功能 (2分钟)

#### 添加待办事项
- 在输入框中输入任务
- 按 Enter 或点击加号按钮

#### 管理待办事项
- 点击复选框标记完成
- 双击文本编辑内容
- 点击删除按钮移除任务

#### 使用过滤器
- 点击"全部"、"活动"、"已完成"切换视图

#### 尝试快捷键
- `Cmd/Ctrl + N`: 聚焦输入框
- `Cmd/Ctrl + Q`: 退出应用

#### 导入导出
- 点击"导出"按钮保存数据
- 点击"导入"按钮恢复数据

## 开发工作流

### 修改代码并查看实时更新

1. **修改 Vue 组件**
   ```bash
   # 编辑 src/components/TodoItem.vue
   # 保存后立即看到变化（HMR）
   ```

2. **修改主进程代码**
   ```bash
   # 编辑 electron/main.ts
   # 保存后 Electron 自动重启
   ```

3. **修改样式**
   ```bash
   # 编辑组件的 <style> 部分
   # 立即看到样式更新
   ```

## 构建生产版本

### Windows

```bash
npm run build:win
```

输出：
- `release/1.0.0/Electron Vue Todo Setup 1.0.0.exe` - 安装程序
- `release/1.0.0/Electron Vue Todo 1.0.0.exe` - 便携版

### macOS

```bash
npm run build:mac
```

输出：
- `release/1.0.0/Electron Vue Todo-1.0.0-arm64.dmg` - Apple Silicon
- `release/1.0.0/Electron Vue Todo-1.0.0-x64.dmg` - Intel

### Linux

```bash
npm run build:linux
```

输出：
- `release/1.0.0/Electron Vue Todo-1.0.0.AppImage`
- `release/1.0.0/electron-vue-todo_1.0.0_amd64.deb`

## 常用命令

```bash
# 开发
npm run dev              # 仅启动 Vite 开发服务器
npm run electron:dev     # 启动 Electron + Vite

# 构建
npm run build           # 构建当前平台
npm run build:win       # 构建 Windows
npm run build:mac       # 构建 macOS
npm run build:linux     # 构建 Linux

# 工具
npm run type-check      # TypeScript 类型检查
npm run preview         # 预览构建结果
```

## 项目结构速览

```
electron-vue-todo/
├── electron/           # Electron 主进程
│   ├── main.ts        # 主进程入口（窗口、菜单、IPC）
│   └── preload.ts     # Preload 脚本（安全通信）
├── src/               # Vue 3 应用
│   ├── components/    # Vue 组件
│   ├── App.vue        # 根组件
│   └── main.ts        # Vue 入口
├── package.json       # 依赖和脚本
└── vite.config.ts     # Vite 配置
```

## 下一步

- 📖 阅读 [完整文档](README.md)
- 🔧 查看 [IPC 通信模式](README.md#ipc-通信模式)
- 🔒 了解 [安全最佳实践](README.md#安全最佳实践)
- 📦 学习 [打包发布](README.md#打包发布)

## 遇到问题？

1. 检查 [常见问题](README.md#常见问题)
2. 查看 [故障排除](README.md#故障排除)
3. [提交 Issue](https://github.com/yourusername/electron-vue-todo/issues)

---

**祝你开发愉快！** 🎉
