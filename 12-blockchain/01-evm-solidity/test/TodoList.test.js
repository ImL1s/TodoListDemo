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
      const { todoList, owner } = await loadFixture(deployTodoListFixture);

      await expect(todoList.createTodo("Test todo"))
        .to.emit(todoList, "TodoCreated");

      expect(await todoList.todoCount()).to.equal(1);

      const todo = await todoList.getTodo(1);
      expect(todo.id).to.equal(1);
      expect(todo.text).to.equal("Test todo");
      expect(todo.completed).to.equal(false);
      expect(todo.createdAt).to.be.greaterThan(0);

      // 验证所有者
      expect(await todoList.todoOwners(1)).to.equal(owner.address);
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
      const { todoList, owner } = await loadFixture(deployTodoListFixture);

      await todoList.createTodo("Test todo");

      // Toggle to completed
      await expect(todoList.toggleTodo(1))
        .to.emit(todoList, "TodoToggled")
        .withArgs(1, owner.address, true);

      let todo = await todoList.getTodo(1);
      expect(todo.completed).to.equal(true);

      // Toggle back to incomplete
      await expect(todoList.toggleTodo(1))
        .to.emit(todoList, "TodoToggled")
        .withArgs(1, owner.address, false);

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
      const { todoList, owner } = await loadFixture(deployTodoListFixture);

      await todoList.createTodo("Test todo");

      await expect(todoList.deleteTodo(1))
        .to.emit(todoList, "TodoDeleted")
        .withArgs(1, owner.address);

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

  describe("Access Control", function () {
    it("Should prevent users from toggling other users' todos", async function () {
      const { todoList, owner, addr1 } = await loadFixture(deployTodoListFixture);

      // Owner creates a todo
      await todoList.connect(owner).createTodo("Owner's todo");

      // Addr1 tries to toggle owner's todo
      await expect(todoList.connect(addr1).toggleTodo(1))
        .to.be.revertedWith("Not the owner of this todo");
    });

    it("Should prevent users from deleting other users' todos", async function () {
      const { todoList, owner, addr1 } = await loadFixture(deployTodoListFixture);

      // Owner creates a todo
      await todoList.connect(owner).createTodo("Owner's todo");

      // Addr1 tries to delete owner's todo
      await expect(todoList.connect(addr1).deleteTodo(1))
        .to.be.revertedWith("Not the owner of this todo");
    });

    it("Should prevent users from viewing other users' todos", async function () {
      const { todoList, owner, addr1 } = await loadFixture(deployTodoListFixture);

      // Owner creates a todo
      await todoList.connect(owner).createTodo("Owner's todo");

      // Addr1 tries to view owner's todo
      await expect(todoList.connect(addr1).getTodo(1))
        .to.be.revertedWith("Not the owner of this todo");
    });

    it("Should allow users to manage their own todos", async function () {
      const { todoList, owner, addr1 } = await loadFixture(deployTodoListFixture);

      // Each user creates their own todos
      await todoList.connect(owner).createTodo("Owner's todo");
      await todoList.connect(addr1).createTodo("Addr1's todo");

      // Each user can toggle their own todo
      await expect(todoList.connect(owner).toggleTodo(1))
        .to.emit(todoList, "TodoToggled")
        .withArgs(1, owner.address, true);

      await expect(todoList.connect(addr1).toggleTodo(2))
        .to.emit(todoList, "TodoToggled")
        .withArgs(2, addr1.address, true);

      // Each user can delete their own todo
      await expect(todoList.connect(owner).deleteTodo(1))
        .to.emit(todoList, "TodoDeleted")
        .withArgs(1, owner.address);

      await expect(todoList.connect(addr1).deleteTodo(2))
        .to.emit(todoList, "TodoDeleted")
        .withArgs(2, addr1.address);
    });
  });

  describe("Multi-User Isolation", function () {
    it("Should only return user's own todos in getAllTodos", async function () {
      const { todoList, owner, addr1, addr2 } = await loadFixture(deployTodoListFixture);

      // Each user creates todos
      await todoList.connect(owner).createTodo("Owner todo 1");
      await todoList.connect(owner).createTodo("Owner todo 2");
      await todoList.connect(addr1).createTodo("Addr1 todo 1");
      await todoList.connect(addr2).createTodo("Addr2 todo 1");

      // Each user should only see their own todos
      const ownerTodos = await todoList.connect(owner).getAllTodos();
      expect(ownerTodos.length).to.equal(2);
      expect(ownerTodos[0].text).to.equal("Owner todo 1");
      expect(ownerTodos[1].text).to.equal("Owner todo 2");

      const addr1Todos = await todoList.connect(addr1).getAllTodos();
      expect(addr1Todos.length).to.equal(1);
      expect(addr1Todos[0].text).to.equal("Addr1 todo 1");

      const addr2Todos = await todoList.connect(addr2).getAllTodos();
      expect(addr2Todos.length).to.equal(1);
      expect(addr2Todos[0].text).to.equal("Addr2 todo 1");
    });

    it("Should only return user's own todos in getActiveTodos", async function () {
      const { todoList, owner, addr1 } = await loadFixture(deployTodoListFixture);

      // Owner creates and completes one todo
      await todoList.connect(owner).createTodo("Owner active");
      await todoList.connect(owner).createTodo("Owner completed");
      await todoList.connect(owner).toggleTodo(2);

      // Addr1 creates active todo
      await todoList.connect(addr1).createTodo("Addr1 active");

      // Check active todos
      const ownerActive = await todoList.connect(owner).getActiveTodos();
      expect(ownerActive.length).to.equal(1);
      expect(ownerActive[0].text).to.equal("Owner active");

      const addr1Active = await todoList.connect(addr1).getActiveTodos();
      expect(addr1Active.length).to.equal(1);
      expect(addr1Active[0].text).to.equal("Addr1 active");
    });

    it("Should only return user's own todos in getCompletedTodos", async function () {
      const { todoList, owner, addr1 } = await loadFixture(deployTodoListFixture);

      // Owner creates and completes todos
      await todoList.connect(owner).createTodo("Owner todo 1");
      await todoList.connect(owner).createTodo("Owner todo 2");
      await todoList.connect(owner).toggleTodo(1);
      await todoList.connect(owner).toggleTodo(2);

      // Addr1 creates and completes one todo
      await todoList.connect(addr1).createTodo("Addr1 todo 1");
      await todoList.connect(addr1).toggleTodo(3);

      // Check completed todos
      const ownerCompleted = await todoList.connect(owner).getCompletedTodos();
      expect(ownerCompleted.length).to.equal(2);

      const addr1Completed = await todoList.connect(addr1).getCompletedTodos();
      expect(addr1Completed.length).to.equal(1);
      expect(addr1Completed[0].text).to.equal("Addr1 todo 1");
    });

    it("Should handle deletions correctly in multi-user scenario", async function () {
      const { todoList, owner, addr1 } = await loadFixture(deployTodoListFixture);

      // Both users create todos
      await todoList.connect(owner).createTodo("Owner todo 1");
      await todoList.connect(addr1).createTodo("Addr1 todo 1");
      await todoList.connect(owner).createTodo("Owner todo 2");

      // Owner deletes their first todo
      await todoList.connect(owner).deleteTodo(1);

      // Check results
      const ownerTodos = await todoList.connect(owner).getAllTodos();
      expect(ownerTodos.length).to.equal(1);
      expect(ownerTodos[0].text).to.equal("Owner todo 2");

      const addr1Todos = await todoList.connect(addr1).getAllTodos();
      expect(addr1Todos.length).to.equal(1);
      expect(addr1Todos[0].text).to.equal("Addr1 todo 1");
    });

    it("Should emit events with correct owner address", async function () {
      const { todoList, owner, addr1 } = await loadFixture(deployTodoListFixture);

      // Test TodoCreated event - 不检查时间戳，因为它可能有微小差异
      const tx1 = await todoList.connect(owner).createTodo("Test");
      await expect(tx1)
        .to.emit(todoList, "TodoCreated");

      // 验证事件参数
      const receipt1 = await tx1.wait();
      const event1 = receipt1.logs.find(log => {
        try {
          return todoList.interface.parseLog(log).name === "TodoCreated";
        } catch {
          return false;
        }
      });
      const parsedEvent1 = todoList.interface.parseLog(event1);
      expect(parsedEvent1.args[0]).to.equal(1n); // id
      expect(parsedEvent1.args[1]).to.equal(owner.address); // owner
      expect(parsedEvent1.args[2]).to.equal("Test"); // text

      // Test TodoToggled event
      await expect(todoList.connect(owner).toggleTodo(1))
        .to.emit(todoList, "TodoToggled")
        .withArgs(1, owner.address, true);

      // Test TodoDeleted event
      await expect(todoList.connect(owner).deleteTodo(1))
        .to.emit(todoList, "TodoDeleted")
        .withArgs(1, owner.address);
    });
  });
});
