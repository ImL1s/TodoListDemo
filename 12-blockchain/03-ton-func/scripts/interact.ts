import { Address, toNano } from '@ton/core';
import { TodoList } from '../wrappers/TodoList';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();
    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('TodoList address'));

    const todoList = provider.open(TodoList.fromAddress(address));

    const action = await ui.choose('Choose action', ['Create Todo', 'Toggle Todo', 'Delete Todo', 'Get Todo', 'Get Count'], (action) => action);

    if (action === 'Create Todo') {
        const text = await ui.input('Enter todo text');

        await todoList.send(
            provider.sender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'CreateTodo',
                text: text,
            }
        );

        ui.write('Todo created successfully!');

        const count = await todoList.getTodoCount();
        ui.write(`Total todos: ${count}`);
    } else if (action === 'Toggle Todo') {
        const id = BigInt(await ui.input('Enter todo ID'));

        await todoList.send(
            provider.sender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'ToggleTodo',
                id: id,
            }
        );

        ui.write('Todo toggled successfully!');

        const todo = await todoList.getTodo(id);
        if (todo) {
            ui.write(`Todo: ${todo.text}`);
            ui.write(`Completed: ${todo.completed}`);
        }
    } else if (action === 'Delete Todo') {
        const id = BigInt(await ui.input('Enter todo ID'));

        await todoList.send(
            provider.sender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'DeleteTodo',
                id: id,
            }
        );

        ui.write('Todo deleted successfully!');
    } else if (action === 'Get Todo') {
        const id = BigInt(await ui.input('Enter todo ID'));

        const todo = await todoList.getTodo(id);
        if (todo) {
            ui.write(`ID: ${todo.id}`);
            ui.write(`Text: ${todo.text}`);
            ui.write(`Completed: ${todo.completed}`);
            ui.write(`Created at: ${todo.createdAt}`);
        } else {
            ui.write('Todo not found');
        }
    } else if (action === 'Get Count') {
        const count = await todoList.getTodoCount();
        ui.write(`Total todos: ${count}`);
    }
}
