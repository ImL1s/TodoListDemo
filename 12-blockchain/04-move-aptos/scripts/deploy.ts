import { AptosAccount, AptosClient, FaucetClient, TxnBuilderTypes, BCS } from 'aptos';
import * as fs from 'fs';
import * as path from 'path';

// Network configuration
const NODE_URL = process.env.APTOS_NODE_URL || 'https://fullnode.testnet.aptoslabs.com/v1';
const FAUCET_URL = process.env.APTOS_FAUCET_URL || 'https://faucet.testnet.aptoslabs.com';

// Initialize clients
const client = new AptosClient(NODE_URL);
const faucetClient = new FaucetClient(NODE_URL, FAUCET_URL);

async function main() {
    console.log('=== TodoList Aptos Deployment ===\n');

    // Load or create account
    let account: AptosAccount;
    const accountPath = path.join(__dirname, '../.aptos/config.yaml');

    if (fs.existsSync(accountPath)) {
        console.log('Loading existing account...');
        const privateKeyHex = fs.readFileSync(accountPath, 'utf-8').trim();
        account = new AptosAccount(new Uint8Array(Buffer.from(privateKeyHex, 'hex')));
    } else {
        console.log('Creating new account...');
        account = new AptosAccount();

        // Save account
        const dir = path.dirname(accountPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(accountPath, Buffer.from(account.signingKey.secretKey).toString('hex'));
    }

    console.log(`Account Address: ${account.address().hex()}`);
    console.log(`Account PublicKey: ${account.pubKey().hex()}\n`);

    // Fund account from faucet (testnet only)
    console.log('Funding account from faucet...');
    try {
        await faucetClient.fundAccount(account.address(), 100_000_000);
        console.log('Account funded successfully!\n');
    } catch (error) {
        console.log('Account already funded or faucet unavailable.\n');
    }

    // Check balance
    const resources = await client.getAccountResources(account.address());
    const coinResource = resources.find((r) => r.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>');
    if (coinResource) {
        const balance = (coinResource.data as any).coin.value;
        console.log(`Account Balance: ${balance / 100_000_000} APT\n`);
    }

    // Compile module (assumes aptos CLI is installed)
    console.log('Compiling Move module...');
    const { execSync } = require('child_process');
    try {
        execSync('aptos move compile', {
            cwd: path.join(__dirname, '..'),
            stdio: 'inherit'
        });
        console.log('Compilation successful!\n');
    } catch (error) {
        console.error('Compilation failed!');
        process.exit(1);
    }

    // Read compiled module
    const modulePath = path.join(__dirname, '../build/TodoList/bytecode_modules/TodoList.mv');
    if (!fs.existsSync(modulePath)) {
        console.error('Compiled module not found!');
        process.exit(1);
    }

    const moduleHex = fs.readFileSync(modulePath).toString('hex');

    // Publish module
    console.log('Publishing module...');
    const txnHash = await client.publishPackage(
        account,
        new Uint8Array(Buffer.from(moduleHex, 'hex')),
        []
    );

    console.log(`Transaction hash: ${txnHash}`);

    // Wait for transaction
    await client.waitForTransaction(txnHash);
    console.log('Module published successfully!\n');

    // Initialize TodoList
    console.log('Initializing TodoList...');
    const payload: TxnBuilderTypes.TransactionPayloadEntryFunction = {
        function: `${account.address().hex()}::TodoList::initialize`,
        type_arguments: [],
        arguments: [],
    };

    const rawTxn = await client.generateTransaction(account.address(), payload);
    const bcsTxn = AptosClient.generateBCSTransaction(account, rawTxn);
    const txnResult = await client.submitSignedBCSTransaction(bcsTxn);

    await client.waitForTransaction(txnResult.hash);
    console.log('TodoList initialized!\n');

    console.log('=== Deployment Complete ===');
    console.log(`Module Address: ${account.address().hex()}`);
    console.log(`\nTo interact with the contract:`);
    console.log(`npm run interact\n`);

    // Save deployment info
    const deploymentInfo = {
        network: 'testnet',
        moduleAddress: account.address().hex(),
        deployedAt: new Date().toISOString(),
    };

    fs.writeFileSync(
        path.join(__dirname, '../deployment.json'),
        JSON.stringify(deploymentInfo, null, 2)
    );
}

main().catch((error) => {
    console.error('Deployment failed:', error);
    process.exit(1);
});
