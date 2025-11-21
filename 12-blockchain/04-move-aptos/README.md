# Aptos TodoList DApp

A decentralized TodoList application built on the Aptos blockchain using the Move programming language.

## 🌟 Features

- **Create Todos**: Add new todo items with text (1-500 characters)
- **Toggle Completion**: Mark todos as complete or incomplete
- **Delete Todos**: Remove todos from your list
- **View Todos**: Query all todos or specific ones by ID
- **Event Emission**: Track all operations via blockchain events
- **Timestamp Tracking**: Each todo records its creation time
- **On-chain Storage**: All data stored permanently on Aptos blockchain

## 📋 Technology Stack

- **Smart Contract**: Move (Aptos)
- **Blockchain**: Aptos
- **Development**: Aptos CLI, TypeScript SDK
- **Testing**: Move Unit Tests
- **Frontend**: Petra Wallet Integration
- **Build Tool**: Move Compiler

## 🏗️ Project Structure

```
04-move-aptos/
├── sources/
│   └── TodoList.move              # Main Move module
├── tests/
│   └── TodoList_test.move         # Comprehensive test suite
├── scripts/
│   ├── deploy.ts                  # Deployment script
│   └── interact.ts                # CLI interaction script
├── frontend/
│   ├── index.html                 # Web interface
│   ├── app.ts                     # Frontend logic with Petra Wallet
│   └── style.css                  # Styling
├── Move.toml                      # Move package configuration
├── package.json                   # Node.js dependencies
├── tsconfig.json                  # TypeScript configuration
└── README.md                      # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- Aptos CLI >= 2.0.0
- npm or yarn
- Petra Wallet (for frontend)

### Install Aptos CLI

```bash
# macOS/Linux
curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3

# Verify installation
aptos --version
```

### Installation

```bash
# Install Node.js dependencies
npm install

# Or with yarn
yarn install
```

### Compile Contract

```bash
# Compile Move module
npm run compile

# Or directly with Aptos CLI
aptos move compile
```

### Run Tests

```bash
# Run all Move tests
npm test

# Or directly with Aptos CLI
aptos move test

# Run tests with coverage
aptos move test --coverage
```

## 📝 Smart Contract Interface

### Entry Functions

**initialize**
```move
public entry fun initialize(account: &signer)
```
Initialize TodoList for your account (must be called once before using).

**create_todo**
```move
public entry fun create_todo(
    account: &signer,
    text: String,  // 1-500 characters
)
```
Create a new todo item.

**toggle_todo**
```move
public entry fun toggle_todo(
    account: &signer,
    todo_id: u64,
)
```
Toggle a todo's completion status.

**delete_todo**
```move
public entry fun delete_todo(
    account: &signer,
    todo_id: u64,
)
```
Delete a todo by ID.

### View Functions

**get_todos**
```move
#[view]
public fun get_todos(account_addr: address): vector<Todo>
```
Get all todos for an account.

**get_todo**
```move
#[view]
public fun get_todo(account_addr: address, todo_id: u64): Todo
```
Get a specific todo by ID.

**get_todo_count**
```move
#[view]
public fun get_todo_count(account_addr: address): u64
```
Get total number of todos created.

**is_initialized**
```move
#[view]
public fun is_initialized(account_addr: address): bool
```
Check if TodoList is initialized for an account.

### Data Structures

```move
struct Todo has store, drop, copy {
    id: u64,
    text: String,
    completed: bool,
    created_at: u64,
}

struct TodoList has key {
    todos: vector<Todo>,
    todo_counter: u64,
    create_todo_events: EventHandle<TodoCreatedEvent>,
    toggle_todo_events: EventHandle<TodoToggledEvent>,
    delete_todo_events: EventHandle<TodoDeletedEvent>,
}
```

### Events

- **TodoCreatedEvent**: Emitted when a todo is created
- **TodoToggledEvent**: Emitted when a todo is toggled
- **TodoDeletedEvent**: Emitted when a todo is deleted

## 🔧 Deployment

### Configure Account

```bash
# Initialize Aptos CLI (first time only)
aptos init

# This will:
# - Create a new account or import existing one
# - Configure network (testnet/mainnet)
# - Fund account from faucet (testnet only)
```

### Deploy to Testnet

```bash
# Publish module
npm run publish

# Or with Aptos CLI
aptos move publish --named-addresses todo_list_addr=YOUR_ADDRESS
```

### Using Deploy Script

```bash
# Automated deployment (compile + publish + initialize)
npm run deploy
```

This will:
1. Create/load your account
2. Fund it from faucet (testnet)
3. Compile the Move module
4. Publish to blockchain
5. Initialize TodoList
6. Save deployment info

### Interact with Deployed Contract

```bash
# Run interactive CLI
npm run interact

# Choose from options:
# 1. View todos
# 2. Create todo
# 3. Toggle todo
# 4. Delete todo
# 5. Get todo count
# 6. Exit
```

## 🌐 Frontend Integration

### Setup Petra Wallet

1. Install [Petra Wallet](https://petra.app/) extension
2. Create/import wallet and switch to Testnet
3. Update `MODULE_ADDRESS` in `frontend/app.ts` with your deployed module address
4. Serve the frontend:

```bash
# Simple HTTP server
npx http-server frontend -p 8080

# Or use any static file server
```

5. Open http://localhost:8080 in your browser
6. Connect Petra Wallet
7. Initialize TodoList (if not already done)
8. Start managing your todos!

## 🧪 Testing

The project includes comprehensive Move unit tests covering:

- ✅ Initialization
- ✅ Create single and multiple todos
- ✅ Toggle todo completion
- ✅ Delete todos (including middle elements)
- ✅ Todo counter behavior
- ✅ Error cases (not initialized, not found, invalid input)
- ✅ Complete workflow scenarios
- ✅ Timestamp recording

```bash
# Run all tests
npm test

# Output example:
# Running Move unit tests
# [ PASS    ] 0xcafe::TodoList_test::test_initialize
# [ PASS    ] 0xcafe::TodoList_test::test_create_todo
# [ PASS    ] 0xcafe::TodoList_test::test_toggle_todo
# [ PASS    ] 0xcafe::TodoList_test::test_delete_todo
# Test result: OK. Total tests: 15; passed: 15; failed: 0
```

## 💡 Usage Examples

### Initialize TodoList

```bash
aptos move run \
  --function-id 'YOUR_ADDRESS::TodoList::initialize'
```

### Create a Todo

```bash
aptos move run \
  --function-id 'YOUR_ADDRESS::TodoList::create_todo' \
  --args string:"Learn Move programming"
```

### Toggle Todo

```bash
aptos move run \
  --function-id 'YOUR_ADDRESS::TodoList::toggle_todo' \
  --args u64:1
```

### Delete Todo

```bash
aptos move run \
  --function-id 'YOUR_ADDRESS::TodoList::delete_todo' \
  --args u64:1
```

### View Todos

```bash
aptos move view \
  --function-id 'YOUR_ADDRESS::TodoList::get_todos' \
  --args address:YOUR_ADDRESS
```

## 🔐 Security Features

- **Resource-based Security**: TodoList resource stored under user's account
- **Owner-only Access**: Only account owner can modify their todos
- **Input Validation**: Text length validation (1-500 characters)
- **Existence Checks**: Validates todo exists before operations
- **Error Codes**: Clear error messages for all failure cases
- **Event Logging**: All operations emit events for transparency

## 📊 Gas Costs (Approximate)

- Initialize: ~0.002 APT
- Create Todo: ~0.001 APT
- Toggle Todo: ~0.0008 APT
- Delete Todo: ~0.0008 APT

*Note: Gas costs vary based on network conditions and transaction complexity*

## 🛠️ Development

### Project Commands

```bash
# Compile Move module
npm run compile

# Run Move tests
npm test

# Deploy to testnet
npm run deploy

# Interact with contract
npm run interact

# Publish module
npm run publish

# Type checking (TypeScript)
npx tsc --noEmit
```

### Aptos CLI Commands

```bash
# Initialize Aptos CLI
aptos init

# Check account info
aptos account list

# Fund account (testnet)
aptos account fund-with-faucet --account YOUR_ADDRESS

# Compile module
aptos move compile

# Run tests
aptos move test

# Publish module
aptos move publish

# View account resources
aptos account list --query resources --account YOUR_ADDRESS
```

## 📚 Resources

- [Aptos Documentation](https://aptos.dev)
- [Move Language](https://move-language.github.io/move/)
- [Aptos CLI Reference](https://aptos.dev/cli-tools/aptos-cli-tool/use-aptos-cli)
- [Petra Wallet](https://petra.app)
- [Aptos TypeScript SDK](https://aptos.dev/sdks/ts-sdk)
- [Move Tutorial](https://aptos.dev/tutorials/your-first-move-module)

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this code for your own projects!

## 🎯 Next Steps

- [ ] Add todo editing functionality
- [ ] Implement todo categories/tags
- [ ] Add shared todo lists (multi-user)
- [ ] Implement todo priorities
- [ ] Add pagination for large lists
- [ ] Create mobile app with Petra Mobile SDK
- [ ] Add todo search functionality
- [ ] Implement todo reminders/deadlines
- [ ] Add todo attachments (IPFS links)
- [ ] Create todo statistics dashboard

## ⚠️ Important Notes

- **Testnet vs Mainnet**: This example is configured for testnet. For mainnet:
  - Change network in Aptos CLI: `aptos init --network mainnet`
  - Update `NODE_URL` in frontend to mainnet endpoint
  - Be aware of real APT costs on mainnet

- **Account Security**:
  - Keep your private keys secure
  - Never commit `.aptos/` directory to version control
  - Use environment variables for sensitive data

- **Resource Limitations**:
  - Each account has a storage limit
  - Very large todo lists may hit gas limits
  - Consider implementing pagination for production use

- **Gas Optimization**:
  - Batch operations when possible
  - Delete unused todos to reclaim storage
  - Monitor gas costs in production

## 🐛 Troubleshooting

### "Module not found"
- Make sure you've published the module
- Check that `MODULE_ADDRESS` matches your deployed address
- Verify you're on the correct network (testnet/mainnet)

### "TodoList not initialized"
- Call `initialize()` function first
- Check if you're using the correct account
- Verify the transaction was successful

### "Insufficient balance"
- Fund your account from faucet (testnet)
- Check account balance: `aptos account list`
- Ensure you have enough APT for gas

### Compilation errors
- Update Aptos CLI: `aptos update`
- Clean and recompile: `rm -rf build && aptos move compile`
- Check Move.toml dependencies

---

Built with ❤️ on Aptos Blockchain
