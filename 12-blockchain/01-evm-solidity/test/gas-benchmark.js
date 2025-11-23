const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TodoList Gas Benchmarks", function () {
  let todoList;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const TodoList = await ethers.getContractFactory("TodoList");
    todoList = await TodoList.deploy();
    await todoList.waitForDeployment();
  });

  describe("Single Operation Gas Measurements", function () {
    it("Should measure gas for createTodo", async function () {
      const tx = await todoList.createTodo("First todo");
      const receipt = await tx.wait();
      console.log(`\n  createTodo gas used: ${receipt.gasUsed.toString()}`);

      // Actual: ~139,000 gas
      expect(receipt.gasUsed).to.be.lessThan(150000);
    });

    it("Should measure gas for toggleTodo", async function () {
      await todoList.createTodo("Todo to toggle");

      const tx = await todoList.toggleTodo(1);
      const receipt = await tx.wait();
      console.log(`  toggleTodo gas used: ${receipt.gasUsed.toString()}`);

      // Actual: ~52,000 gas
      expect(receipt.gasUsed).to.be.lessThan(60000);
    });

    it("Should measure gas for deleteTodo", async function () {
      await todoList.createTodo("Todo to delete");

      const tx = await todoList.deleteTodo(1);
      const receipt = await tx.wait();
      console.log(`  deleteTodo gas used: ${receipt.gasUsed.toString()}`);

      // Expected: ~20,000-30,000 gas (with gas refund)
      expect(receipt.gasUsed).to.be.lessThan(50000);
    });
  });

  describe("Batch Operations Gas Analysis", function () {
    it("Should measure gas for creating 10 todos", async function () {
      let totalGas = BigInt(0);

      for (let i = 1; i <= 10; i++) {
        const tx = await todoList.createTodo(`Todo ${i}`);
        const receipt = await tx.wait();
        totalGas += receipt.gasUsed;
      }

      const avgGas = totalGas / BigInt(10);
      console.log(`\n  Total gas for 10 todos: ${totalGas.toString()}`);
      console.log(`  Average gas per todo: ${avgGas.toString()}`);
    });

    it("Should measure gas for creating 50 todos", async function () {
      let totalGas = BigInt(0);

      for (let i = 1; i <= 50; i++) {
        const tx = await todoList.createTodo(`Todo ${i}`);
        const receipt = await tx.wait();
        totalGas += receipt.gasUsed;
      }

      const avgGas = totalGas / BigInt(50);
      console.log(`\n  Total gas for 50 todos: ${totalGas.toString()}`);
      console.log(`  Average gas per todo: ${avgGas.toString()}`);
    });

    it("Should measure gas for creating 100 todos", async function () {
      let totalGas = BigInt(0);

      for (let i = 1; i <= 100; i++) {
        const tx = await todoList.createTodo(`Todo ${i}`);
        const receipt = await tx.wait();
        totalGas += receipt.gasUsed;
      }

      const avgGas = totalGas / BigInt(100);
      console.log(`\n  Total gas for 100 todos: ${totalGas.toString()}`);
      console.log(`  Average gas per todo: ${avgGas.toString()}`);
    });
  });

  describe("Query Operations Gas Analysis (View Functions)", function () {
    it("Should measure gas for getAllTodos with 10 items", async function () {
      // Create 10 todos
      for (let i = 1; i <= 10; i++) {
        await todoList.createTodo(`Todo ${i}`);
      }

      // Estimate gas for view function
      const gasEstimate = await todoList.getAllTodos.estimateGas();
      console.log(`\n  getAllTodos (10 items) gas estimate: ${gasEstimate.toString()}`);
    });

    it("Should measure gas for getAllTodos with 50 items", async function () {
      // Create 50 todos
      for (let i = 1; i <= 50; i++) {
        await todoList.createTodo(`Todo ${i}`);
      }

      const gasEstimate = await todoList.getAllTodos.estimateGas();
      console.log(`  getAllTodos (50 items) gas estimate: ${gasEstimate.toString()}`);
    });

    it("Should measure gas for getAllTodos with 100 items", async function () {
      // Create 100 todos
      for (let i = 1; i <= 100; i++) {
        await todoList.createTodo(`Todo ${i}`);
      }

      const gasEstimate = await todoList.getAllTodos.estimateGas();
      console.log(`  getAllTodos (100 items) gas estimate: ${gasEstimate.toString()}`);
    });

    it("Should measure gas for getActiveTodos with 50 items (25 completed)", async function () {
      // Create 50 todos
      for (let i = 1; i <= 50; i++) {
        await todoList.createTodo(`Todo ${i}`);
      }

      // Complete half of them
      for (let i = 1; i <= 25; i++) {
        await todoList.toggleTodo(i);
      }

      const gasEstimate = await todoList.getActiveTodos.estimateGas();
      console.log(`  getActiveTodos (25 active out of 50) gas estimate: ${gasEstimate.toString()}`);
    });

    it("Should measure gas for getCompletedTodos with 50 items (25 completed)", async function () {
      // Create 50 todos
      for (let i = 1; i <= 50; i++) {
        await todoList.createTodo(`Todo ${i}`);
      }

      // Complete half of them
      for (let i = 1; i <= 25; i++) {
        await todoList.toggleTodo(i);
      }

      const gasEstimate = await todoList.getCompletedTodos.estimateGas();
      console.log(`  getCompletedTodos (25 completed out of 50) gas estimate: ${gasEstimate.toString()}`);
    });
  });

  describe("Multi-User Scenario Gas Analysis", function () {
    it("Should measure gas for multiple users creating todos", async function () {
      const users = [owner, addr1, addr2];
      let totalGas = BigInt(0);

      for (const user of users) {
        for (let i = 1; i <= 10; i++) {
          const tx = await todoList.connect(user).createTodo(`User todo ${i}`);
          const receipt = await tx.wait();
          totalGas += receipt.gasUsed;
        }
      }

      console.log(`\n  Total gas for 3 users creating 10 todos each: ${totalGas.toString()}`);
      console.log(`  Average gas per todo: ${(totalGas / BigInt(30)).toString()}`);
    });
  });

  describe("Edge Cases Gas Analysis", function () {
    it("Should measure gas for maximum length text (500 chars)", async function () {
      const maxText = "a".repeat(500);
      const tx = await todoList.createTodo(maxText);
      const receipt = await tx.wait();
      console.log(`\n  createTodo with 500 chars gas used: ${receipt.gasUsed.toString()}`);
    });

    it("Should measure gas for minimum length text (1 char)", async function () {
      const tx = await todoList.createTodo("a");
      const receipt = await tx.wait();
      console.log(`  createTodo with 1 char gas used: ${receipt.gasUsed.toString()}`);
    });

    it("Should measure gas for deleting and recreating", async function () {
      // Create
      const createTx = await todoList.createTodo("Todo to delete");
      const createReceipt = await createTx.wait();

      // Delete
      const deleteTx = await todoList.deleteTodo(1);
      const deleteReceipt = await deleteTx.wait();

      // Create again
      const recreateTx = await todoList.createTodo("New todo");
      const recreateReceipt = await recreateTx.wait();

      console.log(`\n  Create gas: ${createReceipt.gasUsed.toString()}`);
      console.log(`  Delete gas: ${deleteReceipt.gasUsed.toString()}`);
      console.log(`  Recreate gas: ${recreateReceipt.gasUsed.toString()}`);
    });
  });

  describe("Performance Degradation Analysis", function () {
    it("Should compare getAllTodos performance with different data sizes", async function () {
      const sizes = [10, 20, 30, 40, 50];
      const results = [];

      for (const size of sizes) {
        // Deploy fresh contract
        const TodoList = await ethers.getContractFactory("TodoList");
        const freshTodoList = await TodoList.deploy();
        await freshTodoList.waitForDeployment();

        // Create todos
        for (let i = 1; i <= size; i++) {
          await freshTodoList.createTodo(`Todo ${i}`);
        }

        // Measure gas
        const gasEstimate = await freshTodoList.getAllTodos.estimateGas();
        results.push({ size, gas: gasEstimate.toString() });
      }

      console.log("\n  getAllTodos gas scaling:");
      results.forEach(r => {
        console.log(`    ${r.size} todos: ${r.gas} gas`);
      });

      // Calculate growth rate
      const firstGas = BigInt(results[0].gas);
      const lastGas = BigInt(results[results.length - 1].gas);
      const growthRate = Number((lastGas - firstGas) * BigInt(100) / firstGas);
      console.log(`  Growth rate (10 to 50 todos): ${growthRate.toFixed(2)}%`);
    });
  });

  describe("Gas Refund Analysis", function () {
    it("Should measure gas refund for deleting todos", async function () {
      // Create multiple todos
      for (let i = 1; i <= 5; i++) {
        await todoList.createTodo(`Todo ${i}`);
      }

      // Delete them and measure gas
      const deleteGas = [];
      for (let i = 1; i <= 5; i++) {
        const tx = await todoList.deleteTodo(i);
        const receipt = await tx.wait();
        deleteGas.push(receipt.gasUsed);
      }

      console.log("\n  Delete gas for each todo:");
      deleteGas.forEach((gas, idx) => {
        console.log(`    Todo ${idx + 1}: ${gas.toString()} gas`);
      });

      const avgDeleteGas = deleteGas.reduce((sum, gas) => sum + gas, BigInt(0)) / BigInt(deleteGas.length);
      console.log(`  Average delete gas: ${avgDeleteGas.toString()}`);
    });
  });
});
