# TodoList DApp - EVM Solidity

一个基于以太坊虚拟机（EVM）的去中心化待办事项列表应用，使用 Solidity 智能合约实现。

## 🌟 特性

- ✅ 创建、切换、删除待办事项
- 🔍 按状态过滤（全部/进行中/已完成）
- 📊 实时统计数据
- 🔐 基于区块链的数据存储，永久保存
- 👤 多用户隔离 - 每个地址拥有独立的待办列表
- 🛡️ 完整的访问控制 - 只能管理自己的待办事项
- 🦊 MetaMask 钱包集成
- 🎨 现代化响应式 UI
- ⛽ Gas 优化的智能合约

## 🛠️ 技术栈

- **智能合约**: Solidity ^0.8.20
- **开发框架**: Hardhat
- **测试**: Chai, Mocha, Hardhat Network Helpers
- **前端**: Vanilla JavaScript, Ethers.js v5
- **区块链网络**: Ethereum, Polygon, BSC (兼容所有 EVM 链)

## 📋 前置要求

- Node.js >= 16.x
- npm 或 yarn
- MetaMask 浏览器扩展

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 编译合约

```bash
npm run compile
```

### 3. 运行测试

```bash
npm test
```

查看 Gas 报告：

```bash
npm run test:gas
```

### 4. 部署合约

#### 本地网络

启动 Hardhat 本地节点：

```bash
npm run node
```

在新终端中部署：

```bash
npm run deploy:local
```

#### 测试网

1. 复制环境变量文件：

```bash
cp .env.example .env
```

2. 编辑 `.env` 文件，填入：
   - `PRIVATE_KEY`: 你的钱包私钥
   - `SEPOLIA_RPC_URL`: Infura 或 Alchemy RPC URL
   - `ETHERSCAN_API_KEY`: (可选) 用于合约验证

3. 部署到 Sepolia 测试网：

```bash
npm run deploy:sepolia
```

其他测试网：

```bash
npm run deploy:mumbai      # Polygon Mumbai
npm run deploy:bsc-testnet # BSC Testnet
```

### 5. 与合约交互

运行交互脚本：

```bash
npm run interact:local     # 本地网络
npm run interact:sepolia   # Sepolia 测试网
```

### 6. 使用前端

1. 打开 `frontend/index.html` 在浏览器中
2. 连接 MetaMask 钱包
3. 输入已部署的合约地址（从部署输出或 `deployments/` 目录获取）
4. 点击"加载合约"
5. 开始添加和管理待办事项！

**提示**: 对于本地开发，需要在 MetaMask 中添加 Hardhat 网络：
- 网络名称: Hardhat Local
- RPC URL: http://127.0.0.1:8545
- Chain ID: 31337
- 货币符号: ETH

## 📝 合约功能

### 核心函数

```solidity
// 创建待办事项
function createTodo(string memory _text) public

// 切换完成状态
function toggleTodo(uint256 _id) public

// 删除待办事项
function deleteTodo(uint256 _id) public

// 获取单个待办事项
function getTodo(uint256 _id) public view returns (Todo memory)

// 获取所有待办事项
function getAllTodos() public view returns (Todo[] memory)

// 获取活跃（未完成）的待办事项
function getActiveTodos() public view returns (Todo[] memory)

// 获取已完成的待办事项
function getCompletedTodos() public view returns (Todo[] memory)
```

### 事件

```solidity
event TodoCreated(uint256 indexed id, address indexed owner, string text, uint256 createdAt)
event TodoToggled(uint256 indexed id, address indexed owner, bool completed)
event TodoDeleted(uint256 indexed id, address indexed owner)
```

## 🧪 测试

测试套件包含 **28 个测试用例**，全部通过：

- ✅ 部署测试
- ✅ 创建待办事项（正常和边界情况）
- ✅ 切换状态
- ✅ 删除功能
- ✅ 过滤功能
- ✅ 复杂场景测试
- ✅ **访问控制测试** - 防止用户操作他人的待办事项
- ✅ **多用户隔离测试** - 确保用户只能看到自己的数据

运行测试：

```bash
npm test
```

查看覆盖率：

```bash
npm run coverage
```

## ⛽ Gas 优化

合约经过以下优化：

1. 使用 `mapping` 而不是数组存储
2. 事件索引优化，降低日志成本
3. 删除操作使用 `delete` 关键字回收 gas
4. 批量查询函数避免多次调用
5. 编译器优化设置启用（runs: 200）

平均 Gas 消耗（Hardhat 网络）：

- `createTodo`: ~80,000 gas
- `toggleTodo`: ~30,000 gas
- `deleteTodo`: ~25,000 gas

## 🔒 安全特性

- ✅ **访问控制**: 用户只能修改/删除自己的待办事项
- ✅ **数据隔离**: 每个用户只能查看自己的待办列表
- ✅ **所有权追踪**: 每个待办事项记录其创建者地址
- ✅ **输入验证**: 文本长度限制（1-500 字符）
- ✅ **边界检查**: ID 存在性和所有权验证
- ✅ **溢出保护**: Solidity 0.8.x 内置算术溢出保护
- ✅ **修饰符保护**: `onlyTodoOwner` 确保操作权限
- ✅ **事件审计**: 记录所有状态变更及操作者地址

## 📂 项目结构

```
01-evm-solidity/
├── contracts/
│   └── TodoList.sol           # 主智能合约
├── scripts/
│   ├── deploy.js              # 部署脚本
│   └── interact.js            # 交互示例脚本
├── test/
│   └── TodoList.test.js       # 测试套件
├── frontend/
│   ├── index.html             # 前端页面
│   ├── app.js                 # Web3 交互逻辑
│   └── style.css              # 样式
├── deployments/               # 部署信息 (自动生成)
├── hardhat.config.js          # Hardhat 配置
├── package.json               # 依赖配置
├── .env.example               # 环境变量模板
├── .gitignore
└── README.md
```

## 🌐 支持的网络

### 测试网
- Sepolia (Ethereum)
- Goerli (Ethereum)
- Mumbai (Polygon)
- BSC Testnet

### 主网
- Ethereum Mainnet
- Polygon Mainnet
- BSC Mainnet

## 🔗 有用的资源

- [Hardhat 文档](https://hardhat.org/docs)
- [Solidity 文档](https://docs.soliditylang.org/)
- [Ethers.js 文档](https://docs.ethers.org/v5/)
- [OpenZeppelin 合约](https://docs.openzeppelin.com/contracts/)
- [MetaMask 文档](https://docs.metamask.io/)

## 📄 许可证

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## ⚠️ 免责声明

这是一个教育项目，用于学习 Solidity 和 DApp 开发。在生产环境中使用前请进行完整的安全审计。

## 🎯 已实现功能

- ✅ **用户账户系统** - 每个地址拥有独立的待办列表
- ✅ **完整访问控制** - 用户只能管理自己的待办事项
- ✅ **多用户隔离** - 数据完全隔离，保护隐私

## 🎯 后续改进

- [ ] 实现待办事项编辑功能
- [ ] 添加优先级和标签系统
- [ ] 实现待办事项分享功能（授权其他地址查看）
- [ ] 集成 IPFS 存储长文本内容
- [ ] 添加移动端支持
- [ ] 实现 ENS 域名支持
- [ ] 添加批量操作功能
