# TodoList DApp - Solana Rust

一个基于 Solana 区块链的去中心化待办事项列表应用，使用 Rust 和 Anchor 框架实现。

## 🌟 特性

- ✅ 创建、切换、更新、删除待办事项
- 🔍 按状态过滤（全部/进行中/已完成）
- 📊 实时统计数据
- 🔐 基于 Solana 区块链的数据存储
- 👻 Phantom 钱包集成
- 🎨 现代化响应式 UI
- 💰 低交易费用（相比以太坊）
- ⚡ 高性能和快速确认

## 🛠️ 技术栈

- **智能合约**: Rust, Anchor Framework 0.29.0
- **区块链**: Solana
- **测试**: TypeScript, Mocha, Chai
- **前端**: TypeScript, Solana Web3.js, Anchor Client
- **钱包**: Phantom

## 📋 前置要求

### 开发环境

- Rust >= 1.70.0
- Solana CLI >= 1.17.0
- Anchor CLI >= 0.29.0
- Node.js >= 16.x
- Phantom 钱包浏览器扩展

### 安装工具

#### 1. 安装 Rust

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

#### 2. 安装 Solana CLI

```bash
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
```

验证安装：

```bash
solana --version
```

#### 3. 安装 Anchor CLI

```bash
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest
```

验证安装：

```bash
anchor --version
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
# 或
yarn install
```

### 2. 配置 Solana CLI

#### 生成密钥对（如果还没有）

```bash
solana-keygen new
```

#### 设置网络为 Devnet

```bash
solana config set --url devnet
```

#### 查看配置

```bash
solana config get
```

#### 获取测试 SOL

```bash
solana airdrop 2
```

### 3. 构建程序

```bash
npm run build
# 或
anchor build
```

### 4. 运行测试

#### 启动本地验证器

在新终端中运行：

```bash
solana-test-validator
```

#### 运行测试

```bash
npm test
# 或
anchor test
```

跳过本地验证器（使用已运行的验证器）：

```bash
npm run test:localnet
```

### 5. 部署程序

#### 本地网络（测试）

```bash
npm run deploy:localnet
```

#### Devnet（开发测试网）

```bash
npm run deploy:devnet
```

部署后，记录输出的程序 ID，你需要在前端中使用它。

#### Mainnet（主网 - 生产环境）

⚠️ **警告**: 主网部署需要真实的 SOL，并且是不可逆的操作。

```bash
npm run deploy:mainnet
```

### 6. 更新程序 ID

部署后，你需要更新以下文件中的程序 ID：

1. `Anchor.toml` - 更新 `[programs.localnet]`, `[programs.devnet]` 等部分
2. `programs/todo-list/src/lib.rs` - 更新 `declare_id!` 宏
3. `app/index.html` - 更新默认程序 ID（可选）

然后重新构建：

```bash
anchor build
```

### 7. 使用前端

1. 打开 `app/index.html` 在浏览器中
2. 连接 Phantom 钱包
3. 输入已部署的程序 ID（或使用默认值）
4. 点击"加载程序"
5. 开始添加和管理待办事项！

**提示**: 确保 Phantom 钱包连接到正确的网络（Devnet 或 Mainnet）。

## 📝 程序架构

### 账户结构

#### Todo 账户

```rust
pub struct Todo {
    pub owner: Pubkey,          // 32 bytes - 所有者公钥
    pub text: String,           // 4 + 500 bytes - 待办事项文本
    pub completed: bool,        // 1 byte - 是否完成
    pub created_at: i64,        // 8 bytes - 创建时间戳
    pub todo_id: u64,           // 8 bytes - 待办事项 ID
    pub bump: u8,               // 1 byte - PDA bump
}
```

#### TodoCounter 账户

```rust
pub struct TodoCounter {
    pub owner: Pubkey,          // 32 bytes - 所有者公钥
    pub count: u64,             // 8 bytes - 待办事项总数
    pub bump: u8,               // 1 byte - PDA bump
}
```

### 核心指令

```rust
// 创建待办事项
pub fn create_todo(ctx: Context<CreateTodo>, text: String) -> Result<()>

// 切换完成状态
pub fn toggle_todo(ctx: Context<ToggleTodo>) -> Result<()>

// 更新文本
pub fn update_todo(ctx: Context<UpdateTodo>, new_text: String) -> Result<()>

// 删除待办事项
pub fn delete_todo(ctx: Context<DeleteTodo>) -> Result<()>
```

### PDA（程序派生地址）

程序使用 PDA 来确定性地派生账户地址：

- **Todo PDA**: `["todo", user_pubkey, todo_id]`
- **Counter PDA**: `["counter", user_pubkey]`

这确保了每个用户都有独立的待办事项列表和计数器。

## 🧪 测试

测试套件包含：

- ✅ 创建单个和多个待办事项
- ✅ 输入验证（空文本、超长文本）
- ✅ 切换完成状态
- ✅ 更新待办事项文本
- ✅ 删除待办事项
- ✅ 权限检查（非所有者操作）
- ✅ 完整工作流测试

运行测试：

```bash
anchor test
```

查看详细日志：

```bash
anchor test -- --nocapture
```

## 💰 成本分析

Solana 交易成本（Devnet/Mainnet）：

- **创建待办事项**: ~0.002 SOL（包含账户租金）
- **切换状态**: ~0.000005 SOL
- **更新文本**: ~0.000005 SOL
- **删除待办事项**: ~0.000005 SOL（退还租金）

账户租金：

- **Todo 账户**: ~0.0015 SOL（删除时退还）
- **Counter 账户**: ~0.0007 SOL（永久）

相比以太坊，Solana 的交易费用低得多（约为 1/1000）。

## 🔒 安全考虑

- ✅ 输入验证（文本长度限制）
- ✅ 所有者检查（`has_one = owner`）
- ✅ PDA 验证（使用 seeds 和 bump）
- ✅ 账户关闭时的租金退还
- ✅ 防止重入攻击（Anchor 自动处理）
- ✅ 边界检查（Rust 类型系统）

## 📂 项目结构

```
02-solana-rust/
├── programs/
│   └── todo-list/
│       ├── src/
│       │   └── lib.rs              # 主程序代码
│       ├── Cargo.toml              # Rust 依赖
│       └── Xargo.toml              # Xargo 配置
├── tests/
│   └── todo-list.ts                # 测试套件
├── app/
│   ├── index.html                  # 前端页面
│   ├── app.ts                      # Solana Web3 交互
│   └── style.css                   # 样式
├── target/                         # 构建输出 (自动生成)
│   ├── deploy/                     # 部署的程序
│   ├── idl/                        # IDL 文件
│   └── types/                      # TypeScript 类型
├── Anchor.toml                     # Anchor 配置
├── Cargo.toml                      # 工作区配置
├── package.json                    # Node.js 依赖
├── tsconfig.json                   # TypeScript 配置
├── .gitignore
└── README.md
```

## 🌐 支持的网络

- **Localnet**: 本地开发和测试
- **Devnet**: 开发测试网（免费测试 SOL）
- **Testnet**: 测试网（较少使用）
- **Mainnet-Beta**: 主网（生产环境）

## 🔗 有用的资源

- [Solana 文档](https://docs.solana.com/)
- [Anchor 框架文档](https://www.anchor-lang.com/)
- [Solana Cookbook](https://solanacookbook.com/)
- [Solana Web3.js 文档](https://solana-labs.github.io/solana-web3.js/)
- [Phantom 钱包文档](https://docs.phantom.app/)
- [Solana Explorer](https://explorer.solana.com/)

## 📄 许可证

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## ⚠️ 免责声明

这是一个教育项目，用于学习 Solana 和 Anchor 开发。在生产环境中使用前请进行完整的安全审计。

## 🎯 后续改进

- [ ] 添加待办事项分类和标签
- [ ] 实现待办事项优先级
- [ ] 添加待办事项共享功能
- [ ] 集成 Arweave 存储长文本内容
- [ ] 实现待办事项提醒功能
- [ ] 添加 NFT 徽章奖励系统
- [ ] 支持多语言
- [ ] 移动端 PWA 支持

## 🐛 已知问题

- 前端使用 CDN 加载依赖，建议在生产环境中使用打包工具
- 程序 ID 需要在部署后手动更新
- Phantom 钱包需要手动切换网络

## 💡 开发技巧

### 查看程序日志

```bash
solana logs
```

### 查看账户信息

```bash
solana account <ACCOUNT_ADDRESS>
```

### 查看余额

```bash
solana balance
```

### 重置本地验证器

```bash
solana-test-validator --reset
```

### 生成新的程序 ID

```bash
anchor keys list
```

### 升级程序

```bash
anchor upgrade <PROGRAM_PATH> --program-id <PROGRAM_ID>
```

## 📊 性能指标

- **交易确认时间**: ~400ms（Solana 平均）
- **TPS**: 理论可达 65,000 TPS
- **账户创建**: ~0.5 秒
- **账户读取**: ~100ms

## 🎓 学习资源

如果你是 Solana 开发新手，推荐以下学习路径：

1. [Solana 入门教程](https://docs.solana.com/introduction)
2. [Anchor 框架教程](https://www.anchor-lang.com/docs/intro)
3. [Solana Bootcamp](https://www.youtube.com/playlist?list=PLilwLeBwGuK5ZqFDHnWI-GVJrPPg5lU5Y)
4. [Buildspace Solana 课程](https://buildspace.so/solana)
