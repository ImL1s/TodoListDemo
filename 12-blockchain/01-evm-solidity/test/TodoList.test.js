const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("TodoList Contract", function () {
  // 部署合约的 fixture
  async function deployTodoListFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const TodoList = await ethers.getContractFactory("TodoList");
    const todoList = await TodoList.deploy();
    await todoList.waitForDeployment();

    return { todoList, owner, addr1, addr2 };
  }

  describe("Deployment", function () {
    it("Should deploy with zero todos", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);
      expect(await todoList.todoCount()).to.equal(0);
    });
  });

  describe("Creating Todos", function () {
    it("Should create a todo successfully", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      await expect(todoList.createTodo("Test todo"))
        .to.emit(todoList, "TodoCreated")
        .withArgs(1, "Test todo", await ethers.provider.getBlock('latest').then(b => b.timestamp + 1));

      expect(await todoList.todoCount()).to.equal(1);

      const todo = await todoList.getTodo(1);
      expect(todo.id).to.equal(1);
      expect(todo.text).to.equal("Test todo");
      expect(todo.completed).to.equal(false);
      expect(todo.createdAt).to.be.greaterThan(0);
    });

    it("Should create multiple todos", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      await todoList.createTodo("First todo");
      await todoList.createTodo("Second todo");
      await todoList.createTodo("Third todo");

      expect(await todoList.todoCount()).to.equal(3);

      const allTodos = await todoList.getAllTodos();
      expect(allTodos.length).to.equal(3);
      expect(allTodos[0].text).to.equal("First todo");
      expect(allTodos[1].text).to.equal("Second todo");
      expect(allTodos[2].text).to.equal("Third todo");
    });

    it("Should reject empty text", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      await expect(todoList.createTodo(""))
        .to.be.revertedWith("Text cannot be empty");
    });

    it("Should reject text longer than 500 characters", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);
      const longText = "a".repeat(501);

      await expect(todoList.createTodo(longText))
        .to.be.revertedWith("Text too long");
    });

    it("Should accept text with exactly 500 characters", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);
      const maxText = "a".repeat(500);

      await todoList.createTodo(maxText);
      const todo = await todoList.getTodo(1);
      expect(todo.text).to.equal(maxText);
    });
  });

  describe("Toggling Todos", function () {
    it("Should toggle todo completion status", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      await todoList.createTodo("Test todo");

      // Toggle to completed
      await expect(todoList.toggleTodo(1))
        .to.emit(todoList, "TodoToggled")
        .withArgs(1, true);

      let todo = await todoList.getTodo(1);
      expect(todo.completed).to.equal(true);

      // Toggle back to incomplete
      await expect(todoList.toggleTodo(1))
        .to.emit(todoList, "TodoToggled")
        .withArgs(1, false);

      todo = await todoList.getTodo(1);
      expect(todo.completed).to.equal(false);
    });

    it("Should fail to toggle non-existent todo", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      await expect(todoList.toggleTodo(1))
        .to.be.revertedWith("Todo does not exist");
    });

    it("Should fail to toggle deleted todo", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      await todoList.createTodo("Test todo");
      await todoList.deleteTodo(1);

      await expect(todoList.toggleTodo(1))
        .to.be.revertedWith("Todo has been deleted");
    });
  });

  describe("Deleting Todos", function () {
    it("Should delete a todo", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      await todoList.createTodo("Test todo");

      await expect(todoList.deleteTodo(1))
        .to.emit(todoList, "TodoDeleted")
        .withArgs(1);

      await expect(todoList.getTodo(1))
        .to.be.revertedWith("Todo has been deleted");
    });

    it("Should fail to delete non-existent todo", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      await expect(todoList.deleteTodo(1))
        .to.be.revertedWith("Todo does not exist");
    });

    it("Should fail to delete already deleted todo", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      await todoList.createTodo("Test todo");
      await todoList.deleteTodo(1);

      await expect(todoList.deleteTodo(1))
        .to.be.revertedWith("Todo has been deleted");
    });

    it("Should not include deleted todos in getAllTodos", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      await todoList.createTodo("First todo");
      await todoList.createTodo("Second todo");
      await todoList.createTodo("Third todo");

      await todoList.deleteTodo(2);

      const allTodos = await todoList.getAllTodos();
      expect(allTodos.length).to.equal(2);
      expect(allTodos[0].text).to.equal("First todo");
      expect(allTodos[1].text).to.equal("Third todo");
    });
  });

  describe("Getting Todos by Status", function () {
    it("Should get active (incomplete) todos", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      await todoList.createTodo("Todo 1");
      await todoList.createTodo("Todo 2");
      await todoList.createTodo("Todo 3");

      await todoList.toggleTodo(2); // Mark second as completed

      const activeTodos = await todoList.getActiveTodos();
      expect(activeTodos.length).to.equal(2);
      expect(activeTodos[0].text).to.equal("Todo 1");
      expect(activeTodos[1].text).to.equal("Todo 3");
    });

    it("Should get completed todos", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      await todoList.createTodo("Todo 1");
      await todoList.createTodo("Todo 2");
      await todoList.createTodo("Todo 3");

      await todoList.toggleTodo(1);
      await todoList.toggleTodo(3);

      const completedTodos = await todoList.getCompletedTodos();
      expect(completedTodos.length).to.equal(2);
      expect(completedTodos[0].text).to.equal("Todo 1");
      expect(completedTodos[1].text).to.equal("Todo 3");
    });

    it("Should handle empty lists correctly", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      const allTodos = await todoList.getAllTodos();
      const activeTodos = await todoList.getActiveTodos();
      const completedTodos = await todoList.getCompletedTodos();

      expect(allTodos.length).to.equal(0);
      expect(activeTodos.length).to.equal(0);
      expect(completedTodos.length).to.equal(0);
    });

    it("Should not include deleted todos in filtered lists", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      await todoList.createTodo("Active 1");
      await todoList.createTodo("Completed 1");
      await todoList.createTodo("Active 2");

      await todoList.toggleTodo(2);
      await todoList.deleteTodo(3);

      const activeTodos = await todoList.getActiveTodos();
      const completedTodos = await todoList.getCompletedTodos();

      expect(activeTodos.length).to.equal(1);
      expect(completedTodos.length).to.equal(1);
    });
  });

  describe("Complex Scenarios", function () {
    it("Should handle mixed operations correctly", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      // Create
      await todoList.createTodo("Buy milk");
      await todoList.createTodo("Walk dog");
      await todoList.createTodo("Read book");
      await todoList.createTodo("Write code");

      // Toggle some
      await todoList.toggleTodo(1);
      await todoList.toggleTodo(3);

      // Delete one
      await todoList.deleteTodo(2);

      // Verify state
      expect(await todoList.todoCount()).to.equal(4);

      const allTodos = await todoList.getAllTodos();
      expect(allTodos.length).to.equal(3);

      const activeTodos = await todoList.getActiveTodos();
      expect(activeTodos.length).to.equal(1);
      expect(activeTodos[0].text).to.equal("Write code");

      const completedTodos = await todoList.getCompletedTodos();
      expect(completedTodos.length).to.equal(2);
    });

    it("Should maintain correct IDs after deletions", async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);

      await todoList.createTodo("First");
      await todoList.createTodo("Second");
      await todoList.createTodo("Third");

      await todoList.deleteTodo(1);

      const todo2 = await todoList.getTodo(2);
      const todo3 = await todoList.getTodo(3);

      expect(todo2.id).to.equal(2);
      expect(todo3.id).to.equal(3);
    });
  });
});
