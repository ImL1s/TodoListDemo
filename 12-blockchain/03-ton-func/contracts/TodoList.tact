import "@stdlib/deploy";

message CreateTodo {
    text: String;
}

message ToggleTodo {
    id: Int as uint32;
}

message DeleteTodo {
    id: Int as uint32;
}

struct Todo {
    id: Int as uint32;
    text: String;
    completed: Bool;
    createdAt: Int as uint64;
}

contract TodoList with Deployable {
    owner: Address;
    todoCount: Int as uint32 = 0;
    todos: map<Int as uint32, Todo>;

    init() {
        self.owner = sender();
    }

    receive(msg: CreateTodo) {
        require(sender() == self.owner, "Only owner can create todos");
        let textLen: Int = msg.text.asSlice().bits() / 8;
        require(textLen > 0 && textLen <= 500, "Invalid text length");

        self.todoCount = self.todoCount + 1;
        self.todos.set(self.todoCount, Todo{
            id: self.todoCount,
            text: msg.text,
            completed: false,
            createdAt: now()
        });
    }

    receive(msg: ToggleTodo) {
        require(sender() == self.owner, "Only owner can toggle todos");
        let todo: Todo? = self.todos.get(msg.id);
        require(todo != null, "Todo does not exist");

        let updatedTodo: Todo = todo!!;
        updatedTodo.completed = !updatedTodo.completed;
        self.todos.set(msg.id, updatedTodo);
    }

    receive(msg: DeleteTodo) {
        require(sender() == self.owner, "Only owner can delete todos");
        require(self.todos.get(msg.id) != null, "Todo does not exist");
        self.todos.set(msg.id, null);
    }

    get fun getTodo(id: Int): Todo? {
        return self.todos.get(id);
    }

    get fun getTodoCount(): Int {
        return self.todoCount;
    }

    get fun getOwner(): Address {
        return self.owner;
    }
}
