# TON TodoList DApp

A decentralized TodoList application built on the TON (The Open Network) blockchain using Tact smart contract language.

## 🌟 Features

- **Create Todos**: Add new todo items to your personal list
- **Toggle Completion**: Mark todos as complete or incomplete
- **Delete Todos**: Remove todos from your list
- **Owner-only Access**: Only the contract owner can modify todos
- **Timestamp Tracking**: Each todo records its creation time
- **On-chain Storage**: All data stored permanently on TON blockchain

## 📋 Technology Stack

- **Smart Contract**: Tact (TON's high-level language)
- **Blockchain**: TON (The Open Network)
- **Development**: Blueprint, TypeScript
- **Testing**: @ton/sandbox, Jest
- **Frontend**: TON Connect UI
- **Build Tool**: Tact Compiler

## 🏗️ Project Structure

```
03-ton-func/
├── contracts/
│   └── TodoList.tact              # Main smart contract
├── wrappers/
│   └── TodoList.ts                # TypeScript wrapper for contract interaction
├── tests/
│   └── TodoList.spec.ts           # Comprehensive test suite
├── scripts/
│   ├── deploy.ts                  # Deployment script
│   └── interact.ts                # CLI interaction script
├── frontend/
│   ├── index.html                 # Web interface
│   ├── app.ts                     # Frontend logic with TON Connect
│   └── style.css                  # Styling
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript configuration
├── tact.config.json              # Tact compiler configuration
└── README.md                      # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- TON wallet (for testnet/mainnet deployment)

### Installation

```bash
# Install dependencies
npm install

# Or with yarn
yarn install
```

### Compile Contract

```bash
# Compile Tact contract
npm run build
```

### Run Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## 📝 Smart Contract Interface

### Messages

**CreateTodo**
```tact
message CreateTodo {
    text: String;  // Todo text (1-500 chars)
}
```

**ToggleTodo**
```tact
message ToggleTodo {
    id: Int as uint32;  // Todo ID to toggle
}
```

**DeleteTodo**
```tact
message DeleteTodo {
    id: Int as uint32;  // Todo ID to delete
}
```

### Getters

- `getTodo(id: Int): Todo?` - Get todo by ID
- `getTodoCount(): Int` - Get total number of todos created
- `getOwner(): Address` - Get contract owner address

### Data Structure

```tact
struct Todo {
    id: Int as uint32;
    text: String;
    completed: Bool;
    createdAt: Int as uint64;
}
```

## 🔧 Deployment

### Deploy to Testnet

```bash
# Deploy contract
npm run deploy

# Follow the prompts to:
# 1. Connect your wallet
# 2. Confirm deployment transaction
# 3. Wait for confirmation
```

### Interact with Deployed Contract

```bash
# Run interaction script
npm run interact

# Choose from actions:
# - Create Todo
# - Toggle Todo
# - Delete Todo
# - Get Todo
# - Get Count
```

## 🌐 Frontend Integration

### Setup TON Connect

1. Update `CONTRACT_ADDRESS` in `frontend/app.ts`
2. Create `tonconnect-manifest.json` for your domain
3. Serve the frontend:

```bash
# Simple HTTP server
npx http-server frontend -p 8080
```

### Frontend Best Practices

The frontend uses the **type-safe wrapper** generated from the Tact contract:

```typescript
// ✅ CORRECT: Use wrapper functions (no hardcoded opcodes)
import { storeCreateTodo, storeToggleTodo, storeDeleteTodo } from '../wrappers/TodoList';

const body = beginCell()
    .store(storeCreateTodo({ $$type: 'CreateTodo', text }))
    .endCell();

// ❌ WRONG: Hardcoded opcodes (anti-pattern)
const body = beginCell()
    .storeUint(1234567890, 32)  // Don't do this!
    .storeStringRefTail(text)
    .endCell();
```

**Why use wrappers?**
- Type-safe message construction
- Automatically synchronized with contract changes
- No risk of opcode mismatches
- Better maintainability and refactoring

### TON Connect Manifest

Create `tonconnect-manifest.json`:

```json
{
  "url": "https://your-domain.com",
  "name": "TON TodoList DApp",
  "iconUrl": "https://your-domain.com/icon.png",
  "termsOfUseUrl": "https://your-domain.com/terms",
  "privacyPolicyUrl": "https://your-domain.com/privacy"
}
```

### Reading Contract Data

To read contract data, set up a TON provider:

```typescript
import { TonClient } from '@ton/core';

// Initialize client
const client = new TonClient({
    endpoint: 'https://toncenter.com/api/v2/jsonRPC'
});

// Create provider
const provider = client.provider(todoListContract.address);

// Read contract state
const owner = await todoListContract.getOwner(provider);
const count = await todoListContract.getTodoCount(provider);
const todo = await todoListContract.getTodo(provider, 1n);
```

## 🧪 Testing

The project includes comprehensive tests covering:

- ✅ Deployment
- ✅ Todo creation
- ✅ Multiple todos
- ✅ Toggle completion
- ✅ Delete todos
- ✅ Owner-only access control
- ✅ Input validation
- ✅ Timestamp tracking

```bash
# Run tests
npm test

# Test output example:
# PASS  tests/TodoList.spec.ts
#   TodoList
#     ✓ should deploy successfully (XXms)
#     ✓ should create a todo (XXms)
#     ✓ should toggle todo completion (XXms)
#     ✓ should delete a todo (XXms)
#     ✓ should reject create from non-owner (XXms)
```

## 💡 Usage Examples

### Create a Todo

```typescript
await todoList.send(
    sender,
    { value: toNano('0.05') },
    { $$type: 'CreateTodo', text: 'Learn Tact programming' }
);
```

### Toggle Todo

```typescript
await todoList.send(
    sender,
    { value: toNano('0.05') },
    { $$type: 'ToggleTodo', id: 1n }
);
```

### Delete Todo

```typescript
await todoList.send(
    sender,
    { value: toNano('0.05') },
    { $$type: 'DeleteTodo', id: 1n }
);
```

### Get Todo

```typescript
const todo = await todoList.getTodo(1n);
console.log(todo?.text);
console.log(todo?.completed);
```

## 🔐 Security Features

- **Owner-only Access**: All write operations restricted to contract owner
- **Input Validation**: Text length validation (1-500 characters)
- **Existence Checks**: Validates todo exists before toggle/delete
- **Gas Optimization**: Efficient storage and operations

## 📊 Gas Costs (Approximate)

- Deploy: ~0.05 TON
- Create Todo: ~0.05 TON
- Toggle Todo: ~0.03 TON
- Delete Todo: ~0.03 TON

## 🛠️ Development

### Project Commands

```bash
# Build contract
npm run build

# Run tests
npm test

# Deploy to testnet
npm run deploy

# Interact with contract
npm run interact

# Type checking
npx tsc --noEmit
```

## 📚 Resources

- [TON Documentation](https://ton.org/docs)
- [Tact Language](https://tact-lang.org)
- [TON Blueprint](https://github.com/ton-org/blueprint)
- [TON Connect](https://github.com/ton-connect)
- [TON Sandbox](https://github.com/ton-org/sandbox)

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this code for your own projects!

## 🎯 Next Steps

- [ ] Add todo editing functionality
- [ ] Implement todo categories/tags
- [ ] Add shared todo lists
- [ ] Implement todo priorities
- [ ] Add pagination for large lists
- [ ] Create mobile app with TON Connect

## ⚠️ Notes

- This is a testnet example. Use caution when deploying to mainnet.
- Keep your mnemonic/keys secure and never commit them to version control.
- Gas costs may vary based on network conditions.
- Always test thoroughly on testnet before mainnet deployment.

---

Built with ❤️ on TON Blockchain
