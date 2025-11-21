import { TonConnectUI, CHAIN } from '@tonconnect/ui';
import { Address, toNano, beginCell } from '@ton/core';
import { TodoList } from '../wrappers/TodoList';

// Initialize TON Connect
const tonConnectUI = new TonConnectUI({
    manifestUrl: 'https://your-domain.com/tonconnect-manifest.json',
    buttonRootId: 'connectBtn'
});

// Contract address (replace with your deployed contract)
const CONTRACT_ADDRESS = 'EQD...'; // Your contract address

let todoListContract: TodoList | null = null;

// DOM Elements
const connectBtn = document.getElementById('connectBtn') as HTMLButtonElement;
const disconnectBtn = document.getElementById('disconnectBtn') as HTMLButtonElement;
const walletInfo = document.getElementById('walletInfo') as HTMLDivElement;
const walletAddress = document.getElementById('walletAddress') as HTMLSpanElement;
const contractSection = document.getElementById('contractSection') as HTMLDivElement;
const contractAddress = document.getElementById('contractAddress') as HTMLSpanElement;
const ownerAddress = document.getElementById('ownerAddress') as HTMLSpanElement;
const todoCount = document.getElementById('todoCount') as HTMLSpanElement;
const addTodoForm = document.getElementById('addTodoForm') as HTMLFormElement;
const todoInput = document.getElementById('todoInput') as HTMLInputElement;
const refreshBtn = document.getElementById('refreshBtn') as HTMLButtonElement;
const todosList = document.getElementById('todosList') as HTMLDivElement;
const loading = document.getElementById('loading') as HTMLDivElement;

// Connect Wallet
connectBtn.addEventListener('click', async () => {
    try {
        await tonConnectUI.connectWallet();
    } catch (error) {
        console.error('Failed to connect wallet:', error);
        alert('Failed to connect wallet');
    }
});

// Disconnect Wallet
disconnectBtn.addEventListener('click', async () => {
    try {
        await tonConnectUI.disconnect();
    } catch (error) {
        console.error('Failed to disconnect wallet:', error);
    }
});

// Handle wallet status changes
tonConnectUI.onStatusChange(async (wallet) => {
    if (wallet) {
        // Wallet connected
        connectBtn.style.display = 'none';
        walletInfo.style.display = 'block';
        contractSection.style.display = 'block';

        const address = Address.parse(wallet.account.address);
        walletAddress.textContent = address.toString().slice(0, 8) + '...' + address.toString().slice(-6);

        // Initialize contract
        await initContract();
        await loadContractData();
    } else {
        // Wallet disconnected
        connectBtn.style.display = 'block';
        walletInfo.style.display = 'none';
        contractSection.style.display = 'none';
        todoListContract = null;
    }
});

// Initialize Contract
async function initContract() {
    try {
        const address = Address.parse(CONTRACT_ADDRESS);
        todoListContract = TodoList.fromAddress(address);
        contractAddress.textContent = address.toString().slice(0, 8) + '...' + address.toString().slice(-6);
    } catch (error) {
        console.error('Failed to initialize contract:', error);
        alert('Failed to initialize contract');
    }
}

// Load Contract Data
async function loadContractData() {
    if (!todoListContract) return;

    try {
        // Note: You would need to implement a proper TON provider here
        // This is a simplified example

        // Get owner
        // const owner = await todoListContract.getOwner();
        // ownerAddress.textContent = owner.toString().slice(0, 8) + '...' + owner.toString().slice(-6);

        // Get todo count
        // const count = await todoListContract.getTodoCount();
        // todoCount.textContent = count.toString();

        // Load todos
        await loadTodos();
    } catch (error) {
        console.error('Failed to load contract data:', error);
    }
}

// Load Todos
async function loadTodos() {
    if (!todoListContract) return;

    try {
        const count = parseInt(todoCount.textContent || '0');

        if (count === 0) {
            todosList.innerHTML = '<p class="empty-state">No todos yet. Create one to get started!</p>';
            return;
        }

        todosList.innerHTML = '';

        for (let i = 1; i <= count; i++) {
            // Note: You would need to implement proper contract calls here
            // const todo = await todoListContract.getTodo(BigInt(i));

            // Placeholder todo for demonstration
            const todo = {
                id: BigInt(i),
                text: `Todo ${i}`,
                completed: false,
                createdAt: BigInt(Date.now() / 1000)
            };

            if (todo) {
                const todoItem = createTodoElement(todo);
                todosList.appendChild(todoItem);
            }
        }
    } catch (error) {
        console.error('Failed to load todos:', error);
    }
}

// Create Todo Element
function createTodoElement(todo: any): HTMLElement {
    const div = document.createElement('div');
    div.className = 'todo-item' + (todo.completed ? ' completed' : '');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => toggleTodo(todo.id));

    const text = document.createElement('span');
    text.className = 'todo-text';
    text.textContent = todo.text;

    const date = document.createElement('span');
    date.className = 'todo-date';
    date.textContent = new Date(Number(todo.createdAt) * 1000).toLocaleString();

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-danger btn-sm';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

    div.appendChild(checkbox);
    div.appendChild(text);
    div.appendChild(date);
    div.appendChild(deleteBtn);

    return div;
}

// Add Todo
addTodoForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const text = todoInput.value.trim();
    if (!text) return;

    try {
        loading.style.display = 'flex';

        // Create message body
        const body = beginCell()
            .storeUint(1234567890, 32) // CreateTodo opcode
            .storeStringRefTail(text)
            .endCell();

        // Send transaction
        const transaction = {
            validUntil: Math.floor(Date.now() / 1000) + 60,
            messages: [
                {
                    address: CONTRACT_ADDRESS,
                    amount: toNano('0.05').toString(),
                    payload: body.toBoc().toString('base64')
                }
            ]
        };

        await tonConnectUI.sendTransaction(transaction);

        todoInput.value = '';

        // Wait a bit for transaction to be processed
        setTimeout(async () => {
            await loadContractData();
            loading.style.display = 'none';
        }, 3000);

    } catch (error) {
        console.error('Failed to add todo:', error);
        alert('Failed to add todo');
        loading.style.display = 'none';
    }
});

// Toggle Todo
async function toggleTodo(id: bigint) {
    try {
        loading.style.display = 'flex';

        const body = beginCell()
            .storeUint(1234567891, 32) // ToggleTodo opcode
            .storeUint(Number(id), 32)
            .endCell();

        const transaction = {
            validUntil: Math.floor(Date.now() / 1000) + 60,
            messages: [
                {
                    address: CONTRACT_ADDRESS,
                    amount: toNano('0.05').toString(),
                    payload: body.toBoc().toString('base64')
                }
            ]
        };

        await tonConnectUI.sendTransaction(transaction);

        setTimeout(async () => {
            await loadTodos();
            loading.style.display = 'none';
        }, 3000);

    } catch (error) {
        console.error('Failed to toggle todo:', error);
        alert('Failed to toggle todo');
        loading.style.display = 'none';
    }
}

// Delete Todo
async function deleteTodo(id: bigint) {
    if (!confirm('Are you sure you want to delete this todo?')) return;

    try {
        loading.style.display = 'flex';

        const body = beginCell()
            .storeUint(1234567892, 32) // DeleteTodo opcode
            .storeUint(Number(id), 32)
            .endCell();

        const transaction = {
            validUntil: Math.floor(Date.now() / 1000) + 60,
            messages: [
                {
                    address: CONTRACT_ADDRESS,
                    amount: toNano('0.05').toString(),
                    payload: body.toBoc().toString('base64')
                }
            ]
        };

        await tonConnectUI.sendTransaction(transaction);

        setTimeout(async () => {
            await loadTodos();
            loading.style.display = 'none';
        }, 3000);

    } catch (error) {
        console.error('Failed to delete todo:', error);
        alert('Failed to delete todo');
        loading.style.display = 'none';
    }
}

// Refresh Button
refreshBtn.addEventListener('click', async () => {
    await loadContractData();
});

// Initialize on load
if (tonConnectUI.wallet) {
    initContract();
    loadContractData();
}
