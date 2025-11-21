const hre = require("hardhat");

async function main() {
  console.log("开始部署 TodoList 合约...");

  // 获取部署者账户
  const [deployer] = await hre.ethers.getSigners();
  console.log("部署账户:", deployer.address);

  // 获取账户余额
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("账户余额:", hre.ethers.formatEther(balance), "ETH");

  // 部署合约
  const TodoList = await hre.ethers.getContractFactory("TodoList");
  console.log("正在部署 TodoList 合约...");

  const todoList = await TodoList.deploy();
  await todoList.waitForDeployment();

  const address = await todoList.getAddress();
  console.log("✅ TodoList 合约部署成功!");
  console.log("合约地址:", address);

  // 等待几个区块确认（如果是测试网）
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("等待区块确认...");
    await todoList.deploymentTransaction().wait(6);
    console.log("已确认 6 个区块");

    // 验证合约（如果配置了 Etherscan API）
    if (process.env.ETHERSCAN_API_KEY) {
      console.log("正在验证合约...");
      try {
        await hre.run("verify:verify", {
          address: address,
          constructorArguments: [],
        });
        console.log("✅ 合约验证成功");
      } catch (error) {
        console.log("⚠️ 合约验证失败:", error.message);
      }
    }
  }

  // 保存部署信息
  const fs = require("fs");
  const deploymentInfo = {
    network: hre.network.name,
    address: address,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    blockNumber: await hre.ethers.provider.getBlockNumber(),
  };

  const deploymentsDir = "./deployments";
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  fs.writeFileSync(
    `${deploymentsDir}/${hre.network.name}.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log(`\n部署信息已保存到: ${deploymentsDir}/${hre.network.name}.json`);
  console.log("\n在前端中使用此地址与合约交互!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
