# 安装与构建指南

## 系统要求

### 最低要求

- **操作系统**: Windows 10+, macOS 10.13+, 或 Ubuntu 18.04+
- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **磁盘空间**: 至少 500 MB

### 推荐配置

- **操作系统**: Windows 11, macOS 13+, 或 Ubuntu 22.04+
- **Node.js**: 20.x LTS
- **包管理器**: pnpm >= 8.0.0
- **内存**: >= 8 GB RAM
- **磁盘空间**: 2 GB（包括开发工具）

## 安装步骤

### 1. 安装 Node.js

#### Windows

```bash
# 使用 Chocolatey
choco install nodejs-lts

# 或下载安装包
# https://nodejs.org/
```

#### macOS

```bash
# 使用 Homebrew
brew install node@20

# 或使用 nvm
nvm install 20
nvm use 20
```

#### Linux

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Fedora
sudo dnf install nodejs

# 使用 nvm（推荐）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

### 2. 验证安装

```bash
node --version  # 应该显示 v20.x.x 或更高
npm --version   # 应该显示 9.x.x 或更高
```

### 3. 克隆项目

```bash
git clone https://github.com/yourusername/electron-vue-todo.git
cd electron-vue-todo
```

### 4. 安装依赖

#### 使用 npm（默认）

```bash
npm install
```

#### 使用 pnpm（推荐，更快）

```bash
# 首先安装 pnpm
npm install -g pnpm

# 安装项目依赖
pnpm install
```

#### 使用 yarn

```bash
# 首先安装 yarn
npm install -g yarn

# 安装项目依赖
yarn install
```

### 5. 启动开发环境

```bash
npm run electron:dev
```

如果一切正常，你会看到：
1. 终端输出 Vite 开发服务器启动信息
2. Electron 窗口自动打开
3. 开发者工具自动打开

## 故障排除

### 问题 1: 依赖安装失败

**症状**:
```
npm ERR! code ECONNREFUSED
npm ERR! errno ECONNREFUSED
```

**解决方案**:
```bash
# 清除 npm 缓存
npm cache clean --force

# 删除 node_modules 和锁文件
rm -rf node_modules package-lock.json

# 重新安装
npm install

# 或使用淘宝镜像
npm install --registry=https://registry.npmmirror.com
```

### 问题 2: Electron 下载失败

**症状**:
```
RequestError: connect ETIMEDOUT
```

**解决方案**:

```bash
# 设置 Electron 镜像（中国大陆用户）
export ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/

# Windows PowerShell
$env:ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"

# 然后重新安装
npm install electron
```

### 问题 3: 权限错误（Linux/macOS）

**症状**:
```
EACCES: permission denied
```

**解决方案**:

```bash
# 不要使用 sudo npm install
# 修改 npm 全局目录
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'

# 添加到 PATH (添加到 ~/.bashrc 或 ~/.zshrc)
export PATH=~/.npm-global/bin:$PATH

# 重新加载配置
source ~/.bashrc  # 或 source ~/.zshrc
```

### 问题 4: 端口被占用

**症状**:
```
Port 5173 is already in use
```

**解决方案**:

```bash
# 查找占用端口的进程
# macOS/Linux
lsof -i :5173

# Windows
netstat -ano | findstr :5173

# 杀死进程或修改端口
# 编辑 vite.config.ts
server: {
  port: 5174,  // 改成其他端口
}
```

### 问题 5: TypeScript 错误

**症状**:
```
Cannot find module 'vue' or its corresponding type declarations
```

**解决方案**:

```bash
# 重新安装 TypeScript 和类型定义
npm install --save-dev typescript @types/node

# 或删除并重新安装
rm -rf node_modules package-lock.json
npm install
```

## 构建生产版本

### Windows 构建

#### 准备工作

1. **安装必要工具**
   ```bash
   # 安装 Windows Build Tools（需要管理员权限）
   npm install --global windows-build-tools
   ```

2. **构建**
   ```bash
   npm run build:win
   ```

#### 输出文件

```
release/1.0.0/
├── Electron Vue Todo Setup 1.0.0.exe  (约 100 MB) - NSIS 安装程序
├── Electron Vue Todo 1.0.0.exe        (约 150 MB) - 便携版
└── electron-vue-todo-1.0.0-win.zip   (约 100 MB) - ZIP 压缩包
```

### macOS 构建

#### 准备工作

1. **Xcode Command Line Tools**
   ```bash
   xcode-select --install
   ```

2. **代码签名（可选）**
   ```bash
   # 如果需要分发到 Mac App Store 或启用自动更新
   export CSC_LINK=/path/to/certificate.p12
   export CSC_KEY_PASSWORD=your-password
   ```

3. **构建**
   ```bash
   npm run build:mac
   ```

#### 输出文件

```
release/1.0.0/
├── Electron Vue Todo-1.0.0-arm64.dmg  (约 90 MB)  - Apple Silicon
├── Electron Vue Todo-1.0.0-x64.dmg    (约 90 MB)  - Intel Mac
└── Electron Vue Todo-1.0.0-mac.zip    (约 85 MB)  - 通用 ZIP
```

### Linux 构建

#### 准备工作

1. **安装依赖（Ubuntu/Debian）**
   ```bash
   sudo apt-get update
   sudo apt-get install -y \
     build-essential \
     libnss3 \
     libatk-bridge2.0-0 \
     libgtk-3-0 \
     libgbm1
   ```

2. **安装依赖（Fedora）**
   ```bash
   sudo dnf install -y \
     @development-tools \
     nss \
     atk \
     gtk3
   ```

3. **构建**
   ```bash
   npm run build:linux
   ```

#### 输出文件

```
release/1.0.0/
├── Electron Vue Todo-1.0.0.AppImage           (约 110 MB)
├── electron-vue-todo_1.0.0_amd64.deb         (约 85 MB)
├── electron-vue-todo-1.0.0.x86_64.rpm        (约 90 MB)
└── electron-vue-todo-1.0.0.tar.gz            (约 80 MB)
```

## 跨平台构建

### 在 macOS 上构建所有平台

```bash
# 需要安装 wine（用于构建 Windows）
brew install wine-stable

# 构建所有平台
npm run build:win
npm run build:mac
npm run build:linux
```

### 在 Windows 上构建（仅限 Windows 和 Linux）

```bash
# Windows 无法构建 macOS 版本（需要 macOS）
npm run build:win
npm run build:linux  # 需要 WSL
```

### 使用 CI/CD 构建

推荐使用 GitHub Actions 进行自动化构建：

```yaml
# .github/workflows/build.yml
name: Build

on: [push, pull_request]

jobs:
  build-windows:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm install
      - run: npm run build:win

  build-macos:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm install
      - run: npm run build:mac

  build-linux:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm install
      - run: npm run build:linux
```

## 性能优化

### 减少构建时间

```bash
# 使用 pnpm（比 npm 快 2-3 倍）
pnpm install
pnpm run build

# 启用并行构建
npm run build -- --parallel

# 使用缓存
npm run build -- --cache
```

### 减少包体积

1. **启用压缩**
   ```json
   // electron-builder.json
   {
     "compression": "maximum"
   }
   ```

2. **排除不必要文件**
   ```json
   {
     "files": [
       "dist/**/*",
       "dist-electron/**/*",
       "!**/*.map",
       "!**/*.ts"
     ]
   }
   ```

3. **使用 ASAR**
   ```json
   {
     "asar": true
   }
   ```

## 开发环境配置

### VS Code

1. **安装推荐扩展**
   - Vue Language Features (Volar)
   - TypeScript Vue Plugin (Volar)
   - ESLint
   - Prettier

2. **配置文件已包含**
   - `.vscode/settings.json`
   - `.vscode/extensions.json`

### 调试配置

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Electron: Main",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}",
      "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron",
      "windows": {
        "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron.cmd"
      },
      "args": ["."],
      "outputCapture": "std"
    }
  ]
}
```

## 测试

### 运行类型检查

```bash
npm run type-check
```

### 预览构建结果

```bash
npm run preview
```

## 更新依赖

### 检查过期依赖

```bash
npm outdated
```

### 更新依赖

```bash
# 更新所有依赖到最新兼容版本
npm update

# 更新到最新版本（可能包含破坏性更新）
npx npm-check-updates -u
npm install
```

### 安全审计

```bash
npm audit
npm audit fix
```

## 下一步

1. 阅读 [快速开始](QUICKSTART.md)
2. 查看 [完整文档](README.md)
3. 了解 [项目总结](PROJECT_SUMMARY.md)

---

**需要帮助？**

- 📖 [文档](README.md)
- 🐛 [问题反馈](https://github.com/yourusername/electron-vue-todo/issues)
- 💬 [讨论区](https://github.com/yourusername/electron-vue-todo/discussions)
