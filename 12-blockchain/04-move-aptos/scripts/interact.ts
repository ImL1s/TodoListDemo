import { AptosAccount, AptosClient, TxnBuilderTypes } from 'aptos';
import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';

const NODE_URL = process.env.APTOS_NODE_URL || 'https://fullnode.testnet.aptoslabs.com/v1';
const client = new AptosClient(NODE_URL);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query: string): Promise<string> {
    return new Promise((resolve) => rl.question(query, resolve));
}

async function loadAccount(): Promise<AptosAccount> {
    const accountPath = path.join(__dirname, '../.aptos/config.yaml');
    if (!fs.existsSync(accountPath)) {
        console.error('Account not found! Please run deploy first.');
        process.exit(1);
    }

    const privateKeyHex = fs.readFileSync(accountPath, 'utf-8').trim();
    return new AptosAccount(new Uint8Array(Buffer.from(privateKeyHex, 'hex')));
}

async function loadDeployment(): Promise<any> {
    const deploymentPath = path.join(__dirname, '../deployment.json');
    if (!fs.existsSync(deploymentPath)) {
        console.error('Deployment info not found! Please run deploy first.');
        process.exit(1);
    }

    return JSON.parse(fs.readFileSync(deploymentPath, 'utf-8'));
}

async function getTodos(account: AptosAccount, moduleAddress: string) {
    try {
        const resource = await client.getAccountResource(
            account.address(),
            `${moduleAddress}::TodoList::TodoList`
        );

        const todos = (resource.data as any).todos;
        console.log('\n=== Your Todos ===');
        if (todos.length === 0) {
            console.log('No todos yet!');
        } else {
            todos.forEach((todo: any) => {
                const status = todo.completed ? '✓' : '○';
                const date = new Date(todo.created_at * 1000).toLocaleString();
                console.log(`${status} [${todo.id}] ${todo.text} (${date})`);
            });
        }
        console.log('');
    } catch (error) {
        console.log('TodoList not initialized or no todos found.\n');
    }
}

async function createTodo(account: AptosAccount, moduleAddress: string, text: string) {
    console.log('Creating todo...');

    const payload: TxnBuilderTypes.TransactionPayloadEntryFunction = {
        function: `${moduleAddress}::TodoList::create_todo`,
        type_arguments: [],
        arguments: [Buffer.from(text).toString('hex')],
    };

    const rawTxn = await client.generateTransaction(account.address(), payload);
    const bcsTxn = AptosClient.generateBCSTransaction(account, rawTxn);
    const txnResult = await client.submitSignedBCSTransaction(bcsTxn);

    await client.waitForTransaction(txnResult.hash);
    console.log('Todo created successfully!');
    console.log(`Transaction: ${txnResult.hash}\n`);
}

async function toggleTodo(account: AptosAccount, moduleAddress: string, todoId: number) {
    console.log('Toggling todo...');

    const payload: TxnBuilderTypes.TransactionPayloadEntryFunction = {
        function: `${moduleAddress}::TodoList::toggle_todo`,
        type_arguments: [],
        arguments: [todoId],
    };

    const rawTxn = await client.generateTransaction(account.address(), payload);
    const bcsTxn = AptosClient.generateBCSTransaction(account, rawTxn);
    const txnResult = await client.submitSignedBCSTransaction(bcsTxn);

    await client.waitForTransaction(txnResult.hash);
    console.log('Todo toggled successfully!');
    console.log(`Transaction: ${txnResult.hash}\n`);
}

async function deleteTodo(account: AptosAccount, moduleAddress: string, todoId: number) {
    console.log('Deleting todo...');

    const payload: TxnBuilderTypes.TransactionPayloadEntryFunction = {
        function: `${moduleAddress}::TodoList::delete_todo`,
        type_arguments: [],
        arguments: [todoId],
    };

    const rawTxn = await client.generateTransaction(account.address(), payload);
    const bcsTxn = AptosClient.generateBCSTransaction(account, rawTxn);
    const txnResult = await client.submitSignedBCSTransaction(bcsTxn);

    await client.waitForTransaction(txnResult.hash);
    console.log('Todo deleted successfully!');
    console.log(`Transaction: ${txnResult.hash}\n`);
}

async function main() {
    console.log('=== TodoList Aptos Interaction ===\n');

    const account = await loadAccount();
    const deployment = await loadDeployment();
    const moduleAddress = deployment.moduleAddress;

    console.log(`Account: ${account.address().hex()}`);
    console.log(`Module: ${moduleAddress}\n`);

    while (true) {
        console.log('Choose an action:');
        console.log('1. View todos');
        console.log('2. Create todo');
        console.log('3. Toggle todo');
        console.log('4. Delete todo');
        console.log('5. Get todo count');
        console.log('6. Exit');

        const choice = await question('\nEnter choice (1-6): ');

        try {
            switch (choice.trim()) {
                case '1':
                    await getTodos(account, moduleAddress);
                    break;

                case '2':
                    const text = await question('Enter todo text: ');
                    if (text.trim()) {
                        await createTodo(account, moduleAddress, text.trim());
                        await getTodos(account, moduleAddress);
                    }
                    break;

                case '3':
                    const toggleId = await question('Enter todo ID to toggle: ');
                    await toggleTodo(account, moduleAddress, parseInt(toggleId));
                    await getTodos(account, moduleAddress);
                    break;

                case '4':
                    const deleteId = await question('Enter todo ID to delete: ');
                    await deleteTodo(account, moduleAddress, parseInt(deleteId));
                    await getTodos(account, moduleAddress);
                    break;

                case '5':
                    try {
                        const resource = await client.getAccountResource(
                            account.address(),
                            `${moduleAddress}::TodoList::TodoList`
                        );
                        const count = (resource.data as any).todo_counter;
                        console.log(`\nTotal todos created: ${count}\n`);
                    } catch (error) {
                        console.log('TodoList not initialized.\n');
                    }
                    break;

                case '6':
                    console.log('Goodbye!');
                    rl.close();
                    process.exit(0);

                default:
                    console.log('Invalid choice!\n');
            }
        } catch (error) {
            console.error('Error:', (error as Error).message, '\n');
        }
    }
}

main().catch((error) => {
    console.error('Error:', error);
    rl.close();
    process.exit(1);
});
