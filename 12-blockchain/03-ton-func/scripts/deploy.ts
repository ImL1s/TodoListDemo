import { toNano } from '@ton/core';
import { TodoList } from '../wrappers/TodoList';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const todoList = provider.open(await TodoList.fromInit());

    await todoList.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(todoList.address);

    console.log('TodoList deployed at:', todoList.address);
    console.log('Owner:', provider.sender().address);
}
