import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { TodoList } from '../wrappers/TodoList';
import '@ton/test-utils';

describe('TodoList', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let todoList: SandboxContract<TodoList>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');

        todoList = blockchain.openContract(await TodoList.fromInit());

        const deployResult = await todoList.send(
            deployer.getSender(),
            { value: toNano('0.05') },
            { $$type: 'Deploy', queryId: 0n }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: todoList.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy successfully', async () => {
        const owner = await todoList.getOwner();
        expect(owner).toEqualAddress(deployer.address);
    });

    it('should create a todo', async () => {
        const result = await todoList.send(
            deployer.getSender(),
            { value: toNano('0.05') },
            { $$type: 'CreateTodo', text: 'Test todo' }
        );

        expect(result.transactions).toHaveTransaction({
            from: deployer.address,
            to: todoList.address,
            success: true,
        });

        const count = await todoList.getTodoCount();
        expect(count).toBe(1n);

        const todo = await todoList.getTodo(1n);
        expect(todo).not.toBeNull();
        expect(todo?.text).toBe('Test todo');
        expect(todo?.completed).toBe(false);
    });

    it('should create multiple todos', async () => {
        await todoList.send(
            deployer.getSender(),
            { value: toNano('0.05') },
            { $$type: 'CreateTodo', text: 'First todo' }
        );

        await todoList.send(
            deployer.getSender(),
            { value: toNano('0.05') },
            { $$type: 'CreateTodo', text: 'Second todo' }
        );

        const count = await todoList.getTodoCount();
        expect(count).toBe(2n);

        const todo1 = await todoList.getTodo(1n);
        expect(todo1?.text).toBe('First todo');

        const todo2 = await todoList.getTodo(2n);
        expect(todo2?.text).toBe('Second todo');
    });

    it('should toggle todo completion', async () => {
        await todoList.send(
            deployer.getSender(),
            { value: toNano('0.05') },
            { $$type: 'CreateTodo', text: 'Test todo' }
        );

        const result = await todoList.send(
            deployer.getSender(),
            { value: toNano('0.05') },
            { $$type: 'ToggleTodo', id: 1n }
        );

        expect(result.transactions).toHaveTransaction({
            from: deployer.address,
            to: todoList.address,
            success: true,
        });

        const todo = await todoList.getTodo(1n);
        expect(todo?.completed).toBe(true);

        // Toggle again
        await todoList.send(
            deployer.getSender(),
            { value: toNano('0.05') },
            { $$type: 'ToggleTodo', id: 1n }
        );

        const todoAfter = await todoList.getTodo(1n);
        expect(todoAfter?.completed).toBe(false);
    });

    it('should delete a todo', async () => {
        await todoList.send(
            deployer.getSender(),
            { value: toNano('0.05') },
            { $$type: 'CreateTodo', text: 'Test todo' }
        );

        const result = await todoList.send(
            deployer.getSender(),
            { value: toNano('0.05') },
            { $$type: 'DeleteTodo', id: 1n }
        );

        expect(result.transactions).toHaveTransaction({
            from: deployer.address,
            to: todoList.address,
            success: true,
        });

        const todo = await todoList.getTodo(1n);
        expect(todo).toBeNull();
    });

    it('should reject create from non-owner', async () => {
        const nonOwner = await blockchain.treasury('nonOwner');

        const result = await todoList.send(
            nonOwner.getSender(),
            { value: toNano('0.05') },
            { $$type: 'CreateTodo', text: 'Test todo' }
        );

        expect(result.transactions).toHaveTransaction({
            from: nonOwner.address,
            to: todoList.address,
            success: false,
        });
    });

    it('should reject toggle from non-owner', async () => {
        await todoList.send(
            deployer.getSender(),
            { value: toNano('0.05') },
            { $$type: 'CreateTodo', text: 'Test todo' }
        );

        const nonOwner = await blockchain.treasury('nonOwner');

        const result = await todoList.send(
            nonOwner.getSender(),
            { value: toNano('0.05') },
            { $$type: 'ToggleTodo', id: 1n }
        );

        expect(result.transactions).toHaveTransaction({
            from: nonOwner.address,
            to: todoList.address,
            success: false,
        });
    });

    it('should reject delete from non-owner', async () => {
        await todoList.send(
            deployer.getSender(),
            { value: toNano('0.05') },
            { $$type: 'CreateTodo', text: 'Test todo' }
        );

        const nonOwner = await blockchain.treasury('nonOwner');

        const result = await todoList.send(
            nonOwner.getSender(),
            { value: toNano('0.05') },
            { $$type: 'DeleteTodo', id: 1n }
        );

        expect(result.transactions).toHaveTransaction({
            from: nonOwner.address,
            to: todoList.address,
            success: false,
        });
    });

    it('should handle todo with timestamp', async () => {
        await todoList.send(
            deployer.getSender(),
            { value: toNano('0.05') },
            { $$type: 'CreateTodo', text: 'Test todo' }
        );

        const todo = await todoList.getTodo(1n);
        expect(todo?.createdAt).toBeGreaterThan(0n);
    });
});
