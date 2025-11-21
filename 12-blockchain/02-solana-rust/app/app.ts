import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  clusterApiUrl,
} from "@solana/web3.js";
import { Program, AnchorProvider, web3, BN } from "@coral-xyz/anchor";
import { TodoList } from "../target/types/todo_list";
import idl from "../target/idl/todo_list.json";

// 类型定义
interface Todo {
  publicKey: PublicKey;
  account: {
    owner: PublicKey;
    text: string;
    completed: boolean;
    createdAt: BN;
    todoId: BN;
    bump: number;
  };
}

// 全局变量
let connection: Connection;
let provider: AnchorProvider;
let program: Program<TodoList>;
let wallet: any;
let userPublicKey: PublicKey;
let currentFilter = "all";
let todos: Todo[] = [];

// DOM 元素
const connectWalletBtn = document.getElementById("connectWallet") as HTMLButtonElement;
const disconnectWalletBtn = document.getElementById("disconnectWallet") as HTMLButtonElement;
const accountInfo = document.getElementById("accountInfo") as HTMLDivElement;
const accountAddress = document.getElementById("accountAddress") as HTMLSpanElement;
const networkName = document.getElementById("networkName") as HTMLSpanElement;
const balanceEl = document.getElementById("balance") as HTMLSpanElement;
const programIdInput = document.getElementById("programId") as HTMLInputElement;
const loadProgramBtn = document.getElementById("loadProgram") as HTMLButtonElement;
const programStatus = document.getElementById("programStatus") as HTMLDivElement;
const mainContent = document.getElementById("mainContent") as HTMLDivElement;
const todoInput = document.getElementById("todoInput") as HTMLInputElement;
const addTodoBtn = document.getElementById("addTodo") as HTMLButtonElement;
const todoList = document.getElementById("todoList") as HTMLUListElement;
const loadingEl = document.getElementById("loading") as HTMLDivElement;
const emptyState = document.getElementById("emptyState") as HTMLDivElement;
const notification = document.getElementById("notification") as HTMLDivElement;
const txStatus = document.getElementById("txStatus") as HTMLDivElement;
const filterBtns = document.querySelectorAll(".filter-btn");
const totalCount = document.getElementById("totalCount") as HTMLDivElement;
const activeCount = document.getElementById("activeCount") as HTMLDivElement;
const completedCount = document.getElementById("completedCount") as HTMLDivElement;

// 初始化
async function init() {
  // 检查 Phantom 钱包
  if (!window.solana || !window.solana.isPhantom) {
    showNotification("请安装 Phantom 钱包!", "error");
    return;
  }

  wallet = window.solana;

  // 设置事件监听
  connectWalletBtn.addEventListener("click", connectWallet);
  disconnectWalletBtn.addEventListener("click", disconnectWallet);
  loadProgramBtn.addEventListener("click", loadProgram);
  addTodoBtn.addEventListener("click", addTodo);
  todoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTodo();
  });

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = (btn as HTMLButtonElement).dataset.filter || "all";
      renderFilteredTodos();
    });
  });

  // 监听钱包断开连接
  wallet.on("disconnect", () => {
    showNotification("钱包已断开连接", "info");
    location.reload();
  });

  wallet.on("accountChanged", (publicKey: PublicKey | null) => {
    if (publicKey) {
      location.reload();
    }
  });

  // 尝试从 localStorage 加载程序 ID
  const savedProgramId = localStorage.getItem("todoProgramId");
  if (savedProgramId) {
    programIdInput.value = savedProgramId;
  }
}

// 连接钱包
async function connectWallet() {
  try {
    const response = await wallet.connect();
    userPublicKey = response.publicKey;

    // 设置连接和提供者
    connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    provider = new AnchorProvider(connection, wallet, {
      preflightCommitment: "confirmed",
    });

    // 更新 UI
    connectWalletBtn.style.display = "none";
    disconnectWalletBtn.style.display = "inline-block";
    accountInfo.style.display = "flex";
    accountAddress.textContent = `${userPublicKey.toString().slice(0, 4)}...${userPublicKey.toString().slice(-4)}`;
    networkName.textContent = "Devnet";

    // 获取余额
    const balance = await connection.getBalance(userPublicKey);
    balanceEl.textContent = `${(balance / web3.LAMPORTS_PER_SOL).toFixed(4)} SOL`;

    showNotification("钱包连接成功!", "success");
  } catch (error) {
    console.error(error);
    showNotification("连接钱包失败: " + error.message, "error");
  }
}

// 断开钱包
async function disconnectWallet() {
  await wallet.disconnect();
  location.reload();
}

// 加载程序
async function loadProgram() {
  const programIdStr = programIdInput.value.trim();

  if (!programIdStr) {
    showNotification("请输入程序 ID", "error");
    return;
  }

  if (!userPublicKey) {
    showNotification("请先连接钱包", "error");
    return;
  }

  try {
    const programId = new PublicKey(programIdStr);

    // 创建程序实例
    program = new Program(idl as any, programId, provider);

    // 保存程序 ID 到 localStorage
    localStorage.setItem("todoProgramId", programIdStr);

    // 显示主内容
    mainContent.style.display = "block";
    programStatus.innerHTML = '<span style="color: #10b981;">✓ 程序加载成功</span>';

    // 加载待办事项
    await loadTodos();

    showNotification("程序加载成功!", "success");
  } catch (error) {
    console.error(error);
    programStatus.innerHTML = '<span style="color: #ef4444;">✗ 程序加载失败</span>';
    showNotification("加载程序失败: " + error.message, "error");
  }
}

// Helper 函数：获取待办事项 PDA
function getTodoPDA(owner: PublicKey, todoId: number): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("todo"), owner.toBuffer(), Buffer.from([todoId])],
    program.programId
  );
}

// Helper 函数：获取计数器 PDA
function getCounterPDA(owner: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("counter"), owner.toBuffer()],
    program.programId
  );
}

// 添加待办事项
async function addTodo() {
  const text = todoInput.value.trim();

  if (!text) {
    showNotification("请输入待办事项内容", "error");
    return;
  }

  if (text.length > 500) {
    showNotification("待办事项内容不能超过 500 个字符", "error");
    return;
  }

  try {
    showTxStatus("正在创建待办事项...", "pending");

    const [counterPDA] = getCounterPDA(userPublicKey);

    // 获取当前计数
    let count = 0;
    try {
      const counterAccount = await program.account.todoCounter.fetch(counterPDA);
      count = counterAccount.count.toNumber();
    } catch {
      // 计数器还不存在，这是第一个待办事项
    }

    const [todoPDA] = getTodoPDA(userPublicKey, count);

    const tx = await program.methods
      .createTodo(text)
      .accounts({
        todo: todoPDA,
        todoCounter: counterPDA,
        user: userPublicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    showTxStatus(`交易已确认: ${tx.slice(0, 10)}...`, "success");

    todoInput.value = "";
    await loadTodos();
  } catch (error) {
    console.error(error);
    showTxStatus("", "");
    showNotification("创建失败: " + error.message, "error");
  }
}

// 加载待办事项
async function loadTodos() {
  if (!program) return;

  loadingEl.style.display = "block";
  emptyState.style.display = "none";

  try {
    // 获取所有待办事项账户
    const allTodoAccounts = await program.account.todo.all([
      {
        memcmp: {
          offset: 8, // 跳过判别器
          bytes: userPublicKey.toBase58(),
        },
      },
    ]);

    todos = allTodoAccounts as Todo[];

    // 更新统计
    const activeTodos = todos.filter((t) => !t.account.completed);
    const completedTodos = todos.filter((t) => t.account.completed);

    totalCount.textContent = todos.length.toString();
    activeCount.textContent = activeTodos.length.toString();
    completedCount.textContent = completedTodos.length.toString();

    // 渲染列表
    renderFilteredTodos();
  } catch (error) {
    console.error(error);
    showNotification("加载待办事项失败: " + error.message, "error");
  } finally {
    loadingEl.style.display = "none";
  }
}

// 渲染过滤后的待办事项
function renderFilteredTodos() {
  let filteredTodos = todos;

  if (currentFilter === "active") {
    filteredTodos = todos.filter((t) => !t.account.completed);
  } else if (currentFilter === "completed") {
    filteredTodos = todos.filter((t) => t.account.completed);
  }

  renderTodos(filteredTodos);
}

// 渲染待办事项列表
function renderTodos(todosToRender: Todo[]) {
  todoList.innerHTML = "";

  if (todosToRender.length === 0) {
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";

  // 按 ID 排序
  todosToRender.sort((a, b) => a.account.todoId.toNumber() - b.account.todoId.toNumber());

  todosToRender.forEach((todo) => {
    const li = document.createElement("li");
    li.className = `todo-item ${todo.account.completed ? "completed" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.account.completed;
    checkbox.className = "todo-checkbox";
    checkbox.addEventListener("change", () => toggleTodo(todo.publicKey));

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.account.text;

    const date = document.createElement("span");
    date.className = "todo-date";
    date.textContent = new Date(
      todo.account.createdAt.toNumber() * 1000
    ).toLocaleDateString("zh-CN");

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn-delete";
    deleteBtn.textContent = "删除";
    deleteBtn.addEventListener("click", () => deleteTodo(todo.publicKey));

    li.appendChild(checkbox);
    li.appendChild(text);
    li.appendChild(date);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);
  });
}

// 切换待办事项状态
async function toggleTodo(todoPDA: PublicKey) {
  try {
    showTxStatus("正在更新状态...", "pending");

    const tx = await program.methods
      .toggleTodo()
      .accounts({
        todo: todoPDA,
        owner: userPublicKey,
      })
      .rpc();

    showTxStatus("状态更新成功!", "success");
    await loadTodos();
  } catch (error) {
    console.error(error);
    showTxStatus("", "");
    showNotification("更新失败: " + error.message, "error");
    await loadTodos();
  }
}

// 删除待办事项
async function deleteTodo(todoPDA: PublicKey) {
  if (!confirm("确定要删除这个待办事项吗？")) return;

  try {
    showTxStatus("正在删除...", "pending");

    const tx = await program.methods
      .deleteTodo()
      .accounts({
        todo: todoPDA,
        owner: userPublicKey,
      })
      .rpc();

    showTxStatus("删除成功!", "success");
    await loadTodos();
  } catch (error) {
    console.error(error);
    showTxStatus("", "");
    showNotification("删除失败: " + error.message, "error");
  }
}

// 显示通知
function showNotification(message: string, type: string = "info") {
  notification.textContent = message;
  notification.className = `notification ${type} show`;

  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

// 显示交易状态
function showTxStatus(message: string, status: string) {
  if (!message) {
    txStatus.style.display = "none";
    return;
  }

  txStatus.textContent = message;
  txStatus.className = `tx-status ${status}`;
  txStatus.style.display = "block";

  if (status === "success" || status === "error") {
    setTimeout(() => {
      txStatus.style.display = "none";
    }, 3000);
  }
}

// 页面加载时初始化
window.addEventListener("DOMContentLoaded", init);
