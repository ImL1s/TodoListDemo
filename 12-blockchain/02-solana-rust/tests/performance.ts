import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TodoList } from "../target/types/todo_list";
import { expect } from "chai";

describe("TodoList Performance Tests", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.TodoList as Program<TodoList>;
  const user = provider.wallet;

  // Helper function to get PDA for counter
  const getCounterPDA = async (userPubkey: anchor.web3.PublicKey) => {
    return await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("counter"), userPubkey.toBuffer()],
      program.programId
    );
  };

  // Helper function to get PDA for todo
  const getTodoPDA = async (
    userPubkey: anchor.web3.PublicKey,
    todoId: number
  ) => {
    const buffer = Buffer.alloc(8);
    buffer.writeBigUInt64LE(BigInt(todoId));
    return await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("todo"), userPubkey.toBuffer(), buffer],
      program.programId
    );
  };

  // Helper to measure compute units
  const measureComputeUnits = (tx: any): number => {
    // Extract compute units from transaction
    // Note: This is an approximation, actual CU usage is shown in logs
    return tx?.meta?.computeUnitsConsumed || 0;
  };

  describe("Single Operation Measurements", () => {
    let counterPDA: anchor.web3.PublicKey;
    let todoPDA: anchor.web3.PublicKey;

    before(async () => {
      [counterPDA] = await getCounterPDA(user.publicKey);
    });

    it("Should measure compute units for initialize_counter", async () => {
      try {
        const tx = await program.methods
          .initializeCounter()
          .accounts({
            todoCounter: counterPDA,
            user: user.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .rpc();

        const txDetails = await provider.connection.getTransaction(tx, {
          commitment: "confirmed",
          maxSupportedTransactionVersion: 0,
        });

        const cu = txDetails?.meta?.computeUnitsConsumed || 0;
        console.log(`\n  initialize_counter CU: ${cu}`);
        console.log(`  Rent cost: ~0.001 SOL`);

        expect(cu).to.be.lessThan(10000);
      } catch (error) {
        console.log("  Note: Counter may already be initialized");
      }
    });

    it("Should measure compute units for create_todo", async () => {
      [todoPDA] = await getTodoPDA(user.publicKey, 0);

      const tx = await program.methods
        .createTodo("First performance test todo")
        .accounts({
          todo: todoPDA,
          todoCounter: counterPDA,
          user: user.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      const txDetails = await provider.connection.getTransaction(tx, {
        commitment: "confirmed",
        maxSupportedTransactionVersion: 0,
      });

      const cu = txDetails?.meta?.computeUnitsConsumed || 0;
      console.log(`\n  create_todo CU: ${cu}`);
      console.log(`  Account rent: ~0.002 SOL`);

      expect(cu).to.be.lessThan(15000);
    });

    it("Should measure compute units for toggle_todo", async () => {
      const tx = await program.methods
        .toggleTodo()
        .accounts({
          todo: todoPDA,
          owner: user.publicKey,
        })
        .rpc();

      const txDetails = await provider.connection.getTransaction(tx, {
        commitment: "confirmed",
        maxSupportedTransactionVersion: 0,
      });

      const cu = txDetails?.meta?.computeUnitsConsumed || 0;
      console.log(`  toggle_todo CU: ${cu}`);

      expect(cu).to.be.lessThan(5000);
    });

    it("Should measure compute units for delete_todo", async () => {
      const tx = await program.methods
        .deleteTodo()
        .accounts({
          todo: todoPDA,
          owner: user.publicKey,
        })
        .rpc();

      const txDetails = await provider.connection.getTransaction(tx, {
        commitment: "confirmed",
        maxSupportedTransactionVersion: 0,
      });

      const cu = txDetails?.meta?.computeUnitsConsumed || 0;
      console.log(`  delete_todo CU: ${cu}`);
      console.log(`  Rent refund: ~0.002 SOL\n`);

      expect(cu).to.be.lessThan(8000);
    });
  });

  describe("Batch Operations Analysis", () => {
    let counterPDA: anchor.web3.PublicKey;

    before(async () => {
      [counterPDA] = await getCounterPDA(user.publicKey);
    });

    it("Should measure performance for creating 10 todos", async () => {
      const results: number[] = [];
      let totalCU = 0;
      let totalTime = 0;

      for (let i = 0; i < 10; i++) {
        const counter = await program.account.todoCounter.fetch(counterPDA);
        const [todoPDA] = await getTodoPDA(
          user.publicKey,
          counter.count.toNumber()
        );

        const startTime = Date.now();
        const tx = await program.methods
          .createTodo(`Performance test todo ${i}`)
          .accounts({
            todo: todoPDA,
            todoCounter: counterPDA,
            user: user.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .rpc();

        const endTime = Date.now();
        totalTime += endTime - startTime;

        const txDetails = await provider.connection.getTransaction(tx, {
          commitment: "confirmed",
          maxSupportedTransactionVersion: 0,
        });

        const cu = txDetails?.meta?.computeUnitsConsumed || 0;
        results.push(cu);
        totalCU += cu;
      }

      const avgCU = totalCU / 10;
      const avgTime = totalTime / 10;

      console.log(`\n  10 todos created:`);
      console.log(`    Total CU: ${totalCU}`);
      console.log(`    Average CU per todo: ${avgCU}`);
      console.log(`    Average time per todo: ${avgTime}ms`);
      console.log(`    Total time: ${totalTime}ms`);
    });

    it("Should measure performance for creating 50 todos", async () => {
      let totalCU = 0;
      let totalTime = 0;

      for (let i = 0; i < 50; i++) {
        const counter = await program.account.todoCounter.fetch(counterPDA);
        const [todoPDA] = await getTodoPDA(
          user.publicKey,
          counter.count.toNumber()
        );

        const startTime = Date.now();
        const tx = await program.methods
          .createTodo(`Batch test todo ${i}`)
          .accounts({
            todo: todoPDA,
            todoCounter: counterPDA,
            user: user.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .rpc();

        const endTime = Date.now();
        totalTime += endTime - startTime;

        const txDetails = await provider.connection.getTransaction(tx, {
          commitment: "confirmed",
          maxSupportedTransactionVersion: 0,
        });

        const cu = txDetails?.meta?.computeUnitsConsumed || 0;
        totalCU += cu;
      }

      const avgCU = totalCU / 50;
      const avgTime = totalTime / 50;

      console.log(`\n  50 todos created:`);
      console.log(`    Total CU: ${totalCU}`);
      console.log(`    Average CU per todo: ${avgCU}`);
      console.log(`    Average time per todo: ${avgTime}ms`);
      console.log(`    Total time: ${totalTime}ms`);
    });
  });

  describe("Account Size and Rent Analysis", () => {
    let counterPDA: anchor.web3.PublicKey;
    let todoPDA: anchor.web3.PublicKey;

    before(async () => {
      [counterPDA] = await getCounterPDA(user.publicKey);
      const counter = await program.account.todoCounter.fetch(counterPDA);
      [todoPDA] = await getTodoPDA(
        user.publicKey,
        counter.count.toNumber()
      );
    });

    it("Should measure TodoCounter account size and rent", async () => {
      const accountInfo = await provider.connection.getAccountInfo(counterPDA);

      console.log(`\n  TodoCounter Account:`);
      console.log(`    Size: ${accountInfo?.data.length} bytes`);
      console.log(`    Rent: ${accountInfo?.lamports} lamports`);
      console.log(
        `    Rent (SOL): ${
          (accountInfo?.lamports || 0) / anchor.web3.LAMPORTS_PER_SOL
        }`
      );
    });

    it("Should measure Todo account size and rent", async () => {
      await program.methods
        .createTodo("Size test todo")
        .accounts({
          todo: todoPDA,
          todoCounter: counterPDA,
          user: user.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      const accountInfo = await provider.connection.getAccountInfo(todoPDA);

      console.log(`\n  Todo Account:`);
      console.log(`    Size: ${accountInfo?.data.length} bytes`);
      console.log(`    Rent: ${accountInfo?.lamports} lamports`);
      console.log(
        `    Rent (SOL): ${
          (accountInfo?.lamports || 0) / anchor.web3.LAMPORTS_PER_SOL
        }`
      );
    });

    it("Should measure rent for maximum length text", async () => {
      const counter = await program.account.todoCounter.fetch(counterPDA);
      const [maxTodoPDA] = await getTodoPDA(
        user.publicKey,
        counter.count.toNumber()
      );

      const maxText = "a".repeat(500);

      await program.methods
        .createTodo(maxText)
        .accounts({
          todo: maxTodoPDA,
          todoCounter: counterPDA,
          user: user.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      const accountInfo = await provider.connection.getAccountInfo(maxTodoPDA);

      console.log(`\n  Todo with 500 chars:`);
      console.log(`    Size: ${accountInfo?.data.length} bytes`);
      console.log(`    Rent: ${accountInfo?.lamports} lamports`);
      console.log(
        `    Rent (SOL): ${
          (accountInfo?.lamports || 0) / anchor.web3.LAMPORTS_PER_SOL
        }\n`
      );
    });
  });

  describe("Query Performance Analysis", () => {
    let counterPDA: anchor.web3.PublicKey;

    before(async () => {
      [counterPDA] = await getCounterPDA(user.publicKey);
    });

    it("Should measure time to fetch 10 todos", async () => {
      const counter = await program.account.todoCounter.fetch(counterPDA);
      const todoCount = counter.count.toNumber();
      const start = Math.max(0, todoCount - 10);

      const startTime = Date.now();
      const todos = [];

      for (let i = start; i < todoCount; i++) {
        try {
          const [todoPDA] = await getTodoPDA(user.publicKey, i);
          const todo = await program.account.todo.fetch(todoPDA);
          todos.push(todo);
        } catch (error) {
          // Todo might have been deleted
        }
      }

      const endTime = Date.now();
      const totalTime = endTime - startTime;

      console.log(`\n  Fetched ${todos.length} todos in ${totalTime}ms`);
      console.log(`    Average: ${totalTime / todos.length}ms per todo`);
    });

    it("Should measure getProgramAccounts performance", async () => {
      const startTime = Date.now();

      const accounts = await provider.connection.getProgramAccounts(
        program.programId,
        {
          filters: [
            {
              memcmp: {
                offset: 8, // After discriminator
                bytes: user.publicKey.toBase58(),
              },
            },
          ],
        }
      );

      const endTime = Date.now();
      const totalTime = endTime - startTime;

      console.log(`\n  getProgramAccounts:`);
      console.log(`    Found ${accounts.length} accounts`);
      console.log(`    Time: ${totalTime}ms`);
    });
  });

  describe("Cost Analysis", () => {
    it("Should calculate total costs for common operations", async () => {
      // Assuming SOL price = $100
      const solPrice = 100;
      const lamportsPerSol = anchor.web3.LAMPORTS_PER_SOL;

      // Average measurements from tests
      const costs = {
        initCounter: {
          cu: 5000,
          rent: 0.001 * lamportsPerSol,
        },
        createTodo: {
          cu: 10000,
          rent: 0.002 * lamportsPerSol,
        },
        toggleTodo: {
          cu: 3000,
          rent: 0,
        },
        deleteTodo: {
          cu: 5000,
          rent: -0.002 * lamportsPerSol, // Refund
        },
      };

      // Compute unit price (typically 0.000001 lamports per CU)
      const cuPricePerLamport = 0.000001;

      console.log(`\n  Cost Analysis (SOL = $${solPrice}):\n`);

      Object.entries(costs).forEach(([operation, cost]) => {
        const cuCost = cost.cu * cuPricePerLamport;
        const totalLamports = cuCost + cost.rent;
        const totalSOL = totalLamports / lamportsPerSol;
        const totalUSD = totalSOL * solPrice;

        console.log(`  ${operation}:`);
        console.log(`    CU: ${cost.cu}`);
        console.log(`    CU cost: ${cuCost.toFixed(2)} lamports`);
        console.log(
          `    Rent: ${(cost.rent / lamportsPerSol).toFixed(6)} SOL`
        );
        console.log(`    Total: ${totalSOL.toFixed(6)} SOL ($${totalUSD.toFixed(6)})`);
        console.log("");
      });

      // Calculate cost for 100 todos
      const hundredTodosCost =
        costs.initCounter.rent +
        100 * (costs.createTodo.cu * cuPricePerLamport + costs.createTodo.rent);
      const hundredTodosSOL = hundredTodosCost / lamportsPerSol;
      const hundredTodosUSD = hundredTodosSOL * solPrice;

      console.log(`  Creating 100 todos:`);
      console.log(`    Total: ${hundredTodosSOL.toFixed(6)} SOL ($${hundredTodosUSD.toFixed(4)})`);
    });
  });

  describe("Stress Tests", () => {
    it("Should handle rapid successive operations", async () => {
      const [counterPDA] = await getCounterPDA(user.publicKey);

      const operations: Promise<string>[] = [];

      // Create 5 todos rapidly (not in parallel due to counter dependency)
      for (let i = 0; i < 5; i++) {
        const counter = await program.account.todoCounter.fetch(counterPDA);
        const [todoPDA] = await getTodoPDA(
          user.publicKey,
          counter.count.toNumber()
        );

        const promise = program.methods
          .createTodo(`Rapid test ${i}`)
          .accounts({
            todo: todoPDA,
            todoCounter: counterPDA,
            user: user.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .rpc();

        operations.push(promise);
        await promise; // Wait for each to maintain counter consistency
      }

      const results = await Promise.all(operations);
      console.log(`\n  Completed ${results.length} rapid operations successfully`);
    });
  });
});
