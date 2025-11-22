// 合约 ABI（从编译后的 artifacts 中获取）
const CONTRACT_ABI = [
  "function createTodo(string memory _text) public",
  "function toggleTodo(uint256 _id) public",
  "function deleteTodo(uint256 _id) public",
  "function getTodo(uint256 _id) public view returns (tuple(uint256 id, string text, bool completed, uint256 createdAt))",
  "function getAllTodos() public view returns (tuple(uint256 id, string text, bool completed, uint256 createdAt)[])",
  "function getActiveTodos() public view returns (tuple(uint256 id, string text, bool completed, uint256 createdAt)[])",
  "function getCompletedTodos() public view returns (tuple(uint256 id, string text, bool completed, uint256 createdAt)[])",
  "function todoCount() public view returns (uint256)",
  "function todoOwners(uint256) public view returns (address)",
  "event TodoCreated(uint256 indexed id, address indexed owner, string text, uint256 createdAt)",
  "event TodoToggled(uint256 indexed id, address indexed owner, bool completed)",
  "event TodoDeleted(uint256 indexed id, address indexed owner)",
];

// 全局变量
let provider;
let signer;
let contract;
let userAddress;
let currentFilter = "all";

// DOM 元素
const connectWalletBtn = document.getElementById("connectWallet");
const accountInfo = document.getElementById("accountInfo");
const accountAddress = document.getElementById("accountAddress");
const networkName = document.getElementById("networkName");
const contractAddressInput = document.getElementById("contractAddress");
const loadContractBtn = document.getElementById("loadContract");
const contractStatus = document.getElementById("contractStatus");
const mainContent = document.getElementById("mainContent");
const todoInput = document.getElementById("todoInput");
const addTodoBtn = document.getElementById("addTodo");
const todoList = document.getElementById("todoList");
const loadingEl = document.getElementById("loading");
const emptyState = document.getElementById("emptyState");
const notification = document.getElementById("notification");
const txStatus = document.getElementById("txStatus");
const filterBtns = document.querySelectorAll(".filter-btn");
const totalCount = document.getElementById("totalCount");
const activeCount = document.getElementById("activeCount");
const completedCount = document.getElementById("completedCount");

// 初始化
async function init() {
  // 检查 MetaMask
  if (typeof window.ethereum === "undefined") {
    showNotification("请安装 MetaMask!", "error");
    return;
  }

  // 设置事件监听
  connectWalletBtn.addEventListener("click", connectWallet);
  loadContractBtn.addEventListener("click", loadContract);
  addTodoBtn.addEventListener("click", addTodo);
  todoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTodo();
  });

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      loadTodos();
    });
  });

  // 监听账户和网络变化
  window.ethereum.on("accountsChanged", handleAccountsChanged);
  window.ethereum.on("chainChanged", () => window.location.reload());

  // 尝试从 localStorage 加载合约地址
  const savedAddress = localStorage.getItem("todoContractAddress");
  if (savedAddress) {
    contractAddressInput.value = savedAddress;
  }
}

// 连接钱包
async function connectWallet() {
  try {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    userAddress = accounts[0];
    signer = provider.getSigner();

    // 获取网络信息
    const network = await provider.getNetwork();

    // 更新 UI
    connectWalletBtn.style.display = "none";
    accountInfo.style.display = "flex";
    accountAddress.textContent = `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
    networkName.textContent = getNetworkName(network.chainId);

    showNotification("钱包连接成功!", "success");
  } catch (error) {
    console.error(error);
    showNotification("连接钱包失败: " + error.message, "error");
  }
}

// 加载合约
async function loadContract() {
  const address = contractAddressInput.value.trim();

  if (!address) {
    showNotification("请输入合约地址", "error");
    return;
  }

  if (!ethers.utils.isAddress(address)) {
    showNotification("无效的合约地址", "error");
    return;
  }

  if (!signer) {
    showNotification("请先连接钱包", "error");
    return;
  }

  try {
    contract = new ethers.Contract(address, CONTRACT_ABI, signer);

    // 测试合约是否可用
    await contract.todoCount();

    // 保存地址到 localStorage
    localStorage.setItem("todoContractAddress", address);

    // 显示主内容
    mainContent.style.display = "block";
    contractStatus.innerHTML = '<span style="color: #10b981;">✓ 合约加载成功</span>';

    // 设置事件监听
    setupEventListeners();

    // 加载待办事项
    await loadTodos();

    showNotification("合约加载成功!", "success");
  } catch (error) {
    console.error(error);
    contractStatus.innerHTML = '<span style="color: #ef4444;">✗ 合约加载失败</span>';
    showNotification("加载合约失败: " + error.message, "error");
  }
}

// 设置合约事件监听
function setupEventListeners() {
  contract.on("TodoCreated", (id, owner, text, createdAt) => {
    console.log("Todo created:", id.toString(), "by", owner, "-", text);
    // 只在是当前用户的 todo 时才重新加载
    if (owner.toLowerCase() === userAddress.toLowerCase()) {
      loadTodos();
    }
  });

  contract.on("TodoToggled", (id, owner, completed) => {
    console.log("Todo toggled:", id.toString(), "by", owner, "-", completed);
    // 只在是当前用户的 todo 时才重新加载
    if (owner.toLowerCase() === userAddress.toLowerCase()) {
      loadTodos();
    }
  });

  contract.on("TodoDeleted", (id, owner) => {
    console.log("Todo deleted:", id.toString(), "by", owner);
    // 只在是当前用户的 todo 时才重新加载
    if (owner.toLowerCase() === userAddress.toLowerCase()) {
      loadTodos();
    }
  });
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

    const tx = await contract.createTodo(text);
    showTxStatus(`交易已提交: ${tx.hash.slice(0, 10)}...`, "pending");

    await tx.wait();
    showTxStatus("待办事项创建成功!", "success");

    todoInput.value = "";
    await loadTodos();
  } catch (error) {
    console.error(error);
    showTxStatus("", "");
    showNotification("创建失败: " + (error.reason || error.message), "error");
  }
}

// 加载待办事项
async function loadTodos() {
  if (!contract) return;

  loadingEl.style.display = "block";
  emptyState.style.display = "none";

  try {
    let todos;

    // 根据过滤器获取不同的待办事项
    if (currentFilter === "active") {
      todos = await contract.getActiveTodos();
    } else if (currentFilter === "completed") {
      todos = await contract.getCompletedTodos();
    } else {
      todos = await contract.getAllTodos();
    }

    // 更新统计
    const allTodos = await contract.getAllTodos();
    const activeTodos = allTodos.filter((t) => !t.completed);
    const completedTodos = allTodos.filter((t) => t.completed);

    totalCount.textContent = allTodos.length;
    activeCount.textContent = activeTodos.length;
    completedCount.textContent = completedTodos.length;

    // 渲染列表
    renderTodos(todos);
  } catch (error) {
    console.error(error);
    showNotification("加载待办事项失败: " + error.message, "error");
  } finally {
    loadingEl.style.display = "none";
  }
}

// 渲染待办事项列表
function renderTodos(todos) {
  todoList.innerHTML = "";

  if (todos.length === 0) {
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";

  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = `todo-item ${todo.completed ? "completed" : ""}`;
    li.dataset.id = todo.id.toString();

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.className = "todo-checkbox";
    checkbox.addEventListener("change", () => toggleTodo(todo.id));

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text;

    const date = document.createElement("span");
    date.className = "todo-date";
    date.textContent = new Date(todo.createdAt * 1000).toLocaleDateString("zh-CN");

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn-delete";
    deleteBtn.textContent = "删除";
    deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

    li.appendChild(checkbox);
    li.appendChild(text);
    li.appendChild(date);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);
  });
}

// 切换待办事项状态
async function toggleTodo(id) {
  try {
    showTxStatus("正在更新状态...", "pending");

    const tx = await contract.toggleTodo(id);
    await tx.wait();

    showTxStatus("状态更新成功!", "success");
    await loadTodos();
  } catch (error) {
    console.error(error);
    showTxStatus("", "");
    showNotification("更新失败: " + (error.reason || error.message), "error");
    await loadTodos(); // 恢复原状态
  }
}

// 删除待办事项
async function deleteTodo(id) {
  if (!confirm("确定要删除这个待办事项吗？")) return;

  try {
    showTxStatus("正在删除...", "pending");

    const tx = await contract.deleteTodo(id);
    await tx.wait();

    showTxStatus("删除成功!", "success");
    await loadTodos();
  } catch (error) {
    console.error(error);
    showTxStatus("", "");
    showNotification("删除失败: " + (error.reason || error.message), "error");
  }
}

// 处理账户变化
function handleAccountsChanged(accounts) {
  if (accounts.length === 0) {
    showNotification("请连接 MetaMask", "error");
    location.reload();
  } else if (accounts[0] !== userAddress) {
    location.reload();
  }
}

// 显示通知
function showNotification(message, type = "info") {
  notification.textContent = message;
  notification.className = `notification ${type} show`;

  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

// 显示交易状态
function showTxStatus(message, status) {
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

// 获取网络名称
function getNetworkName(chainId) {
  const networks = {
    1: "Ethereum 主网",
    5: "Goerli 测试网",
    11155111: "Sepolia 测试网",
    137: "Polygon 主网",
    80001: "Mumbai 测试网",
    56: "BSC 主网",
    97: "BSC 测试网",
    31337: "Hardhat 本地网络",
  };

  return networks[chainId] || `未知网络 (${chainId})`;
}

// 页面加载时初始化
window.addEventListener("DOMContentLoaded", init);
