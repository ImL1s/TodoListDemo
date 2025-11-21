import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TodoList } from "../target/types/todo_list";
import { expect } from "chai";
import { PublicKey, SystemProgram } from "@solana/web3.js";

describe("todo-list", () => {
  // 配置客户端使用本地集群
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.TodoList as Program<TodoList>;
  const user = provider.wallet as anchor.Wallet;

  // Helper 函数：获取待办事项 PDA
  const getTodoPDA = async (owner: PublicKey, todoId: number) => {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from("todo"),
        owner.toBuffer(),
        Buffer.from([todoId]),
      ],
      program.programId
    );
  };

  // Helper 函数：获取计数器 PDA
  const getCounterPDA = async (owner: PublicKey) => {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("counter"), owner.toBuffer()],
      program.programId
    );
  };

  describe("创建待办事项", () => {
    it("应该成功创建一个待办事项", async () => {
      const [counterPDA] = await getCounterPDA(user.publicKey);
      const [todoPDA] = await getTodoPDA(user.publicKey, 0);

      await program.methods
        .createTodo("学习 Solana 开发")
        .accounts({
          todo: todoPDA,
          todoCounter: counterPDA,
          user: user.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      const todoAccount = await program.account.todo.fetch(todoPDA);
      const counterAccount = await program.account.todoCounter.fetch(counterPDA);

      expect(todoAccount.text).to.equal("学习 Solana 开发");
      expect(todoAccount.completed).to.equal(false);
      expect(todoAccount.owner.toString()).to.equal(user.publicKey.toString());
      expect(todoAccount.todoId.toNumber()).to.equal(0);
      expect(counterAccount.count.toNumber()).to.equal(1);
    });

    it("应该创建多个待办事项", async () => {
      const [counterPDA] = await getCounterPDA(user.publicKey);

      // 创建第二个待办事项
      const [todo1PDA] = await getTodoPDA(user.publicKey, 1);
      await program.methods
        .createTodo("部署到 Devnet")
        .accounts({
          todo: todo1PDA,
          todoCounter: counterPDA,
          user: user.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      // 创建第三个待办事项
      const [todo2PDA] = await getTodoPDA(user.publicKey, 2);
      await program.methods
        .createTodo("完成前端集成")
        .accounts({
          todo: todo2PDA,
          todoCounter: counterPDA,
          user: user.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      const counterAccount = await program.account.todoCounter.fetch(counterPDA);
      expect(counterAccount.count.toNumber()).to.equal(3);

      const todo1 = await program.account.todo.fetch(todo1PDA);
      const todo2 = await program.account.todo.fetch(todo2PDA);

      expect(todo1.text).to.equal("部署到 Devnet");
      expect(todo2.text).to.equal("完成前端集成");
    });

    it("应该拒绝空文本", async () => {
      const [counterPDA] = await getCounterPDA(user.publicKey);
      const [todoPDA] = await getTodoPDA(user.publicKey, 3);

      try {
        await program.methods
          .createTodo("")
          .accounts({
            todo: todoPDA,
            todoCounter: counterPDA,
            user: user.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
        expect.fail("应该抛出错误");
      } catch (error) {
        expect(error.message).to.include("InvalidText");
      }
    });

    it("应该拒绝超过 500 字符的文本", async () => {
      const [counterPDA] = await getCounterPDA(user.publicKey);
      const [todoPDA] = await getTodoPDA(user.publicKey, 3);
      const longText = "a".repeat(501);

      try {
        await program.methods
          .createTodo(longText)
          .accounts({
            todo: todoPDA,
            todoCounter: counterPDA,
            user: user.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
        expect.fail("应该抛出错误");
      } catch (error) {
        expect(error.message).to.include("InvalidText");
      }
    });
  });

  describe("切换待办事项状态", () => {
    it("应该切换待办事项的完成状态", async () => {
      const [todoPDA] = await getTodoPDA(user.publicKey, 0);

      // 切换为完成
      await program.methods
        .toggleTodo()
        .accounts({
          todo: todoPDA,
          owner: user.publicKey,
        })
        .rpc();

      let todoAccount = await program.account.todo.fetch(todoPDA);
      expect(todoAccount.completed).to.equal(true);

      // 再次切换回未完成
      await program.methods
        .toggleTodo()
        .accounts({
          todo: todoPDA,
          owner: user.publicKey,
        })
        .rpc();

      todoAccount = await program.account.todo.fetch(todoPDA);
      expect(todoAccount.completed).to.equal(false);
    });

    it("应该拒绝非所有者切换待办事项", async () => {
      const otherUser = anchor.web3.Keypair.generate();
      const [todoPDA] = await getTodoPDA(user.publicKey, 0);

      try {
        await program.methods
          .toggleTodo()
          .accounts({
            todo: todoPDA,
            owner: otherUser.publicKey,
          })
          .signers([otherUser])
          .rpc();
        expect.fail("应该抛出错误");
      } catch (error) {
        expect(error).to.exist;
      }
    });
  });

  describe("更新待办事项", () => {
    it("应该更新待办事项文本", async () => {
      const [todoPDA] = await getTodoPDA(user.publicKey, 0);

      await program.methods
        .updateTodo("学习 Solana 和 Anchor 框架")
        .accounts({
          todo: todoPDA,
          owner: user.publicKey,
        })
        .rpc();

      const todoAccount = await program.account.todo.fetch(todoPDA);
      expect(todoAccount.text).to.equal("学习 Solana 和 Anchor 框架");
    });

    it("应该拒绝空文本更新", async () => {
      const [todoPDA] = await getTodoPDA(user.publicKey, 0);

      try {
        await program.methods
          .updateTodo("")
          .accounts({
            todo: todoPDA,
            owner: user.publicKey,
          })
          .rpc();
        expect.fail("应该抛出错误");
      } catch (error) {
        expect(error.message).to.include("InvalidText");
      }
    });
  });

  describe("删除待办事项", () => {
    it("应该删除待办事项", async () => {
      const [todoPDA] = await getTodoPDA(user.publicKey, 1);

      // 确认待办事项存在
      let todoAccount = await program.account.todo.fetch(todoPDA);
      expect(todoAccount.text).to.equal("部署到 Devnet");

      // 删除待办事项
      await program.methods
        .deleteTodo()
        .accounts({
          todo: todoPDA,
          owner: user.publicKey,
        })
        .rpc();

      // 确认账户已关闭
      try {
        await program.account.todo.fetch(todoPDA);
        expect.fail("账户应该已被关闭");
      } catch (error) {
        expect(error.message).to.include("Account does not exist");
      }
    });

    it("应该拒绝非所有者删除待办事项", async () => {
      const otherUser = anchor.web3.Keypair.generate();
      const [todoPDA] = await getTodoPDA(user.publicKey, 0);

      try {
        await program.methods
          .deleteTodo()
          .accounts({
            todo: todoPDA,
            owner: otherUser.publicKey,
          })
          .signers([otherUser])
          .rpc();
        expect.fail("应该抛出错误");
      } catch (error) {
        expect(error).to.exist;
      }
    });
  });

  describe("复杂场景", () => {
    it("应该处理完整的工作流", async () => {
      const newUser = anchor.web3.Keypair.generate();

      // 为新用户空投 SOL
      const airdropSignature = await provider.connection.requestAirdrop(
        newUser.publicKey,
        2 * anchor.web3.LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction(airdropSignature);

      const [counterPDA] = await getCounterPDA(newUser.publicKey);
      const [todo0PDA] = await getTodoPDA(newUser.publicKey, 0);
      const [todo1PDA] = await getTodoPDA(newUser.publicKey, 1);

      // 创建两个待办事项
      await program.methods
        .createTodo("任务 1")
        .accounts({
          todo: todo0PDA,
          todoCounter: counterPDA,
          user: newUser.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([newUser])
        .rpc();

      await program.methods
        .createTodo("任务 2")
        .accounts({
          todo: todo1PDA,
          todoCounter: counterPDA,
          user: newUser.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([newUser])
        .rpc();

      // 标记第一个为完成
      await program.methods
        .toggleTodo()
        .accounts({
          todo: todo0PDA,
          owner: newUser.publicKey,
        })
        .signers([newUser])
        .rpc();

      // 更新第二个
      await program.methods
        .updateTodo("任务 2 - 已更新")
        .accounts({
          todo: todo1PDA,
          owner: newUser.publicKey,
        })
        .signers([newUser])
        .rpc();

      // 验证最终状态
      const todo0 = await program.account.todo.fetch(todo0PDA);
      const todo1 = await program.account.todo.fetch(todo1PDA);
      const counter = await program.account.todoCounter.fetch(counterPDA);

      expect(todo0.completed).to.equal(true);
      expect(todo1.text).to.equal("任务 2 - 已更新");
      expect(counter.count.toNumber()).to.equal(2);
    });
  });
});
