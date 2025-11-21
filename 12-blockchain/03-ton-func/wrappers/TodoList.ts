import {
    Cell,
    Slice,
    Address,
    Builder,
    beginCell,
    ComputeError,
    TupleItem,
    TupleReader,
    Dictionary,
    contractAddress,
    ContractProvider,
    Sender,
    Contract,
    ContractABI,
    ABIType,
    ABIGetter,
    ABIReceiver,
    TupleBuilder,
    DictionaryValue
} from '@ton/core';

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function storeStateInit(src: StateInit) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}

export function loadStateInit(slice: Slice) {
    let sc_0 = slice;
    let _code = sc_0.loadRef();
    let _data = sc_0.loadRef();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export type Deploy = {
    $$type: 'Deploy';
    queryId: bigint;
}

export function storeDeploy(src: Deploy) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2490013878, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeploy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2490013878) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

export type CreateTodo = {
    $$type: 'CreateTodo';
    text: string;
}

export function storeCreateTodo(src: CreateTodo) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1234567890, 32);
        b_0.storeStringRefTail(src.text);
    };
}

export function loadCreateTodo(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1234567890) { throw Error('Invalid prefix'); }
    let _text = sc_0.loadStringRefTail();
    return { $$type: 'CreateTodo' as const, text: _text };
}

export type ToggleTodo = {
    $$type: 'ToggleTodo';
    id: bigint;
}

export function storeToggleTodo(src: ToggleTodo) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1234567891, 32);
        b_0.storeUint(src.id, 32);
    };
}

export function loadToggleTodo(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1234567891) { throw Error('Invalid prefix'); }
    let _id = sc_0.loadUintBig(32);
    return { $$type: 'ToggleTodo' as const, id: _id };
}

export type DeleteTodo = {
    $$type: 'DeleteTodo';
    id: bigint;
}

export function storeDeleteTodo(src: DeleteTodo) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1234567892, 32);
        b_0.storeUint(src.id, 32);
    };
}

export function loadDeleteTodo(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1234567892) { throw Error('Invalid prefix'); }
    let _id = sc_0.loadUintBig(32);
    return { $$type: 'DeleteTodo' as const, id: _id };
}

export type Todo = {
    $$type: 'Todo';
    id: bigint;
    text: string;
    completed: boolean;
    createdAt: bigint;
}

export function storeTodo(src: Todo) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(src.id, 32);
        b_0.storeStringRefTail(src.text);
        b_0.storeBit(src.completed);
        b_0.storeUint(src.createdAt, 64);
    };
}

export function loadTodo(slice: Slice) {
    let sc_0 = slice;
    let _id = sc_0.loadUintBig(32);
    let _text = sc_0.loadStringRefTail();
    let _completed = sc_0.loadBit();
    let _createdAt = sc_0.loadUintBig(64);
    return { $$type: 'Todo' as const, id: _id, text: _text, completed: _completed, createdAt: _createdAt };
}

export class TodoList implements Contract {

    static async fromInit() {
        const init = await TodoList.init();
        const address = contractAddress(0, init);
        return new TodoList(address, init);
    }

    static async fromAddress(address: Address) {
        return new TodoList(address);
    }

    readonly address: Address;
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types: [],
        getters: [],
        receivers: [],
        errors: {},
    };

    private constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }

    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: CreateTodo | ToggleTodo | DeleteTodo | Deploy) {

        let body: Cell | null = null;
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'CreateTodo') {
            body = beginCell().store(storeCreateTodo(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'ToggleTodo') {
            body = beginCell().store(storeToggleTodo(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'DeleteTodo') {
            body = beginCell().store(storeDeleteTodo(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Deploy') {
            body = beginCell().store(storeDeploy(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }

        await provider.internal(via, { ...args, body: body });

    }

    async getTodo(provider: ContractProvider, id: bigint) {
        let builder = new TupleBuilder();
        builder.writeNumber(id);
        let source = (await provider.get('getTodo', builder.build())).stack;
        const result_p = source.readTupleOpt();
        const result = result_p ? loadTodo(result_p.beginParse()) : null;
        return result;
    }

    async getTodoCount(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('getTodoCount', builder.build())).stack;
        let result = source.readBigNumber();
        return result;
    }

    async getOwner(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('getOwner', builder.build())).stack;
        let result = source.readAddress();
        return result;
    }

    static async init() {
        const __code = Cell.fromBase64('te6ccgEBCwEAAA==');
        const __system = Cell.fromBase64('te6ccgEBCwEAAA==');
        let builder = beginCell();
        builder.storeRef(__system);
        builder.storeUint(0, 1);
        const __data = builder.endCell();
        return { code: __code, data: __data };
    }
}
