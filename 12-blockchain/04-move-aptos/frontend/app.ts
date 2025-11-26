import { AptosClient, Types } from 'aptos';

// Configuration
const NODE_URL = 'https://fullnode.testnet.aptoslabs.com/v1';
const MODULE_ADDRESS = '0xYOUR_MODULE_ADDRESS'; // Replace with deployed module address

// Initialize Aptos client
const client = new AptosClient(NODE_URL);

// Petra Wallet interface
interface PetraWallet {
    connect(): Promise<{ address: string; publicKey: string }>;
    disconnect(): Promise<void>;
    account(): Promise<{ address: string; publicKey: string }>;
    isConnected(): Promise<boolean>;
    signAndSubmitTransaction(transaction: any): Promise<{ hash: string }>;
    network(): Promise<string>;
}

declare global {
    interface Window {
        petra?: PetraWallet;
    }
}

// DOM Elements
const connectBtn = document.getElementById('connectBtn') as HTMLButtonElement;
const disconnectBtn = document.getElementById('disconnectBtn') as HTMLButtonElement;
const walletInfo = document.getElementById('walletInfo') as HTMLDivElement;
const walletAddress = document.getElementById('walletAddress') as HTMLSpanElement;
const contractSection = document.getElementById('contractSection') as HTMLDivElement;
const moduleAddress = document.getElementById('moduleAddress') as HTMLSpanElement;
const todoCount = document.getElementById('todoCount') as HTMLSpanElement;
const initBtn = document.getElementById('initBtn') as HTMLButtonElement;
const addTodoForm = document.getElementById('addTodoForm') as HTMLFormElement;
const todoInput = document.getElementById('todoInput') as HTMLInputElement;
const refreshBtn = document.getElementById('refreshBtn') as HTMLButtonElement;
const todosList = document.getElementById('todosList') as HTMLDivElement;
const loading = document.getElementById('loading') as HTMLDivElement;
const loadingText = document.getElementById('loadingText') as HTMLParagraphElement;

let currentAccount: string | null = null;

// Check if Petra is installed
function isPetraInstalled(): boolean {
    return !!(window as any).aptos;
}

// Show loading
function showLoading(message: string = 'Processing transaction...') {
    loadingText.textContent = message;
    loading.style.display = 'flex';
}

// Hide loading
function hideLoading() {
    loading.style.display = 'none';
}

// Connect Wallet
connectBtn.addEventListener('click', async () => {
    if (!isPetraInstalled()) {
        alert('Please install Petra Wallet extension!');
        window.open('https://petra.app/', '_blank');
        return;
    }

    try {
        showLoading('Connecting wallet...');
        const wallet = (window as any).aptos;
        const response = await wallet.connect();

        currentAccount = response.address;
        walletAddress.textContent = currentAccount.slice(0, 8) + '...' + currentAccount.slice(-6);

        connectBtn.style.display = 'none';
        walletInfo.style.display = 'block';
        contractSection.style.display = 'block';

        moduleAddress.textContent = MODULE_ADDRESS;

        await checkInitialization();
        await loadTodoList();

        hideLoading();
    } catch (error) {
        console.error('Failed to connect wallet:', error);
        alert('Failed to connect wallet');
        hideLoading();
    }
});

// Disconnect Wallet
disconnectBtn.addEventListener('click', async () => {
    try {
        const wallet = (window as any).aptos;
        await wallet.disconnect();

        currentAccount = null;

        connectBtn.style.display = 'block';
        walletInfo.style.display = 'none';
        contractSection.style.display = 'none';
    } catch (error) {
        console.error('Failed to disconnect wallet:', error);
    }
});

// Check if TodoList is initialized
async function checkInitialization() {
    if (!currentAccount) return;

    try {
        const resource = await client.getAccountResource(
            currentAccount,
            `${MODULE_ADDRESS}::TodoList::TodoList`
        );

        initBtn.style.display = 'none';
        return true;
    } catch (error) {
        // Not initialized
        initBtn.style.display = 'block';
        return false;
    }
}

// Initialize TodoList
initBtn.addEventListener('click', async () => {
    if (!currentAccount) return;

    try {
        showLoading('Initializing TodoList...');

        const wallet = (window as any).aptos;
        const payload = {
            type: 'entry_function_payload',
            function: `${MODULE_ADDRESS}::TodoList::initialize`,
            type_arguments: [],
            arguments: []
        };

        const response = await wallet.signAndSubmitTransaction(payload);
        await client.waitForTransaction(response.hash);

        console.log('Initialized:', response.hash);

        initBtn.style.display = 'none';
        await loadTodoList();

        hideLoading();
        alert('TodoList initialized successfully!');
    } catch (error) {
        console.error('Failed to initialize:', error);
        alert('Failed to initialize TodoList');
        hideLoading();
    }
});

// Load TodoList
async function loadTodoList() {
    if (!currentAccount) return;

    try {
        const resource = await client.getAccountResource(
            currentAccount,
            `${MODULE_ADDRESS}::TodoList::TodoList`
        );

        const data = resource.data as any;
        const todos = data.todos;
        const counter = data.todo_counter;

        todoCount.textContent = counter;

        if (todos.length === 0) {
            todosList.innerHTML = '<p class="empty-state">No todos yet. Create one to get started!</p>';
        } else {
            todosList.innerHTML = '';
            todos.forEach((todo: any) => {
                const todoItem = createTodoElement(todo);
                todosList.appendChild(todoItem);
            });
        }
    } catch (error) {
        console.error('Failed to load todos:', error);
        todosList.innerHTML = '<p class="empty-state">Failed to load todos. Please refresh.</p>';
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
    date.textContent = new Date(Number(todo.created_at) * 1000).toLocaleString();

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
    if (!text || !currentAccount) return;

    try {
        showLoading('Creating todo...');

        const wallet = (window as any).aptos;
        const payload = {
            type: 'entry_function_payload',
            function: `${MODULE_ADDRESS}::TodoList::create_todo`,
            type_arguments: [],
            arguments: [text]
        };

        const response = await wallet.signAndSubmitTransaction(payload);
        await client.waitForTransaction(response.hash);

        console.log('Todo created:', response.hash);

        todoInput.value = '';
        await loadTodoList();

        hideLoading();
    } catch (error) {
        console.error('Failed to create todo:', error);
        alert('Failed to create todo');
        hideLoading();
    }
});

// Toggle Todo
async function toggleTodo(id: number) {
    if (!currentAccount) return;

    try {
        showLoading('Toggling todo...');

        const wallet = (window as any).aptos;
        const payload = {
            type: 'entry_function_payload',
            function: `${MODULE_ADDRESS}::TodoList::toggle_todo`,
            type_arguments: [],
            arguments: [id.toString()]
        };

        const response = await wallet.signAndSubmitTransaction(payload);
        await client.waitForTransaction(response.hash);

        console.log('Todo toggled:', response.hash);

        await loadTodoList();
        hideLoading();
    } catch (error) {
        console.error('Failed to toggle todo:', error);
        alert('Failed to toggle todo');
        hideLoading();
    }
}

// Delete Todo
async function deleteTodo(id: number) {
    if (!confirm('Are you sure you want to delete this todo?')) return;
    if (!currentAccount) return;

    try {
        showLoading('Deleting todo...');

        const wallet = (window as any).aptos;
        const payload = {
            type: 'entry_function_payload',
            function: `${MODULE_ADDRESS}::TodoList::delete_todo`,
            type_arguments: [],
            arguments: [id.toString()]
        };

        const response = await wallet.signAndSubmitTransaction(payload);
        await client.waitForTransaction(response.hash);

        console.log('Todo deleted:', response.hash);

        await loadTodoList();
        hideLoading();
    } catch (error) {
        console.error('Failed to delete todo:', error);
        alert('Failed to delete todo');
        hideLoading();
    }
}

// Refresh Button
refreshBtn.addEventListener('click', async () => {
    await loadTodoList();
});

// Auto-connect if already connected
window.addEventListener('load', async () => {
    if (!isPetraInstalled()) {
        console.log('Petra wallet not installed');
        return;
    }

    try {
        const wallet = (window as any).aptos;
        const account = await wallet.account();

        if (account) {
            currentAccount = account.address;
            walletAddress.textContent = currentAccount.slice(0, 8) + '...' + currentAccount.slice(-6);

            connectBtn.style.display = 'none';
            walletInfo.style.display = 'block';
            contractSection.style.display = 'block';

            moduleAddress.textContent = MODULE_ADDRESS;

            await checkInitialization();
            await loadTodoList();
        }
    } catch (error) {
        console.log('Wallet not connected');
    }
});
