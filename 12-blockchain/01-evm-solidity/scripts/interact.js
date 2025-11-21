const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("开始与 TodoList 合约交互...\n");

  // 读取部署信息
  const network = hre.network.name;
  const deploymentPath = `./deployments/${network}.json`;

  if (!fs.existsSync(deploymentPath)) {
    console.error(`错误: 找不到 ${network} 网络的部署信息`);
    console.error("请先运行 deploy.js 脚本");
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  console.log("合约地址:", deployment.address);

  // 获取合约实例
  const TodoList = await hre.ethers.getContractFactory("TodoList");
  const todoList = TodoList.attach(deployment.address);

  // 获取签名者
  const [signer] = await hre.ethers.getSigners();
  console.log("使用账户:", signer.address);
  console.log();

  try {
    // 1. 创建待办事项
    console.log("📝 创建待办事项...");
    let tx = await todoList.createTodo("学习 Solidity 智能合约");
    await tx.wait();
    console.log("✅ 创建成功 - Todo #1");

    tx = await todoList.createTodo("部署到测试网");
    await tx.wait();
    console.log("✅ 创建成功 - Todo #2");

    tx = await todoList.createTodo("完成前端集成");
    await tx.wait();
    console.log("✅ 创建成功 - Todo #3");
    console.log();

    // 2. 获取待办事项总数
    const count = await todoList.todoCount();
    console.log(`📊 总共有 ${count} 个待办事项\n`);

    // 3. 获取所有待办事项
    console.log("📋 所有待办事项:");
    const allTodos = await todoList.getAllTodos();
    allTodos.forEach((todo) => {
      console.log(
        `  [${todo.id}] ${todo.completed ? "✓" : "○"} ${todo.text}`
      );
    });
    console.log();

    // 4. 标记第一个为完成
    console.log("✓ 标记 Todo #1 为完成...");
    tx = await todoList.toggleTodo(1);
    await tx.wait();
    console.log("✅ 状态已更新\n");

    // 5. 获取活跃的待办事项
    console.log("📋 未完成的待办事项:");
    const activeTodos = await todoList.getActiveTodos();
    activeTodos.forEach((todo) => {
      console.log(`  [${todo.id}] ${todo.text}`);
    });
    console.log();

    // 6. 获取已完成的待办事项
    console.log("✓ 已完成的待办事项:");
    const completedTodos = await todoList.getCompletedTodos();
    completedTodos.forEach((todo) => {
      console.log(`  [${todo.id}] ${todo.text}`);
    });
    console.log();

    // 7. 删除一个待办事项
    console.log("🗑️  删除 Todo #2...");
    tx = await todoList.deleteTodo(2);
    await tx.wait();
    console.log("✅ 删除成功\n");

    // 8. 再次显示所有待办事项
    console.log("📋 剩余的待办事项:");
    const remainingTodos = await todoList.getAllTodos();
    remainingTodos.forEach((todo) => {
      console.log(
        `  [${todo.id}] ${todo.completed ? "✓" : "○"} ${todo.text}`
      );
    });
    console.log();

    console.log("✅ 交互演示完成!");
  } catch (error) {
    console.error("❌ 错误:", error.message);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
