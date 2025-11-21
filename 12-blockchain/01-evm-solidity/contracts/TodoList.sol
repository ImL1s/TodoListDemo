// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TodoList
 * @dev 一个简单的去中心化待办事项列表智能合约
 * @notice 支持创建、切换完成状态和删除待办事项
 */
contract TodoList {
    struct Todo {
        uint256 id;
        string text;
        bool completed;
        uint256 createdAt;
    }

    mapping(uint256 => Todo) public todos;
    uint256 public todoCount;

    event TodoCreated(uint256 indexed id, string text, uint256 createdAt);
    event TodoToggled(uint256 indexed id, bool completed);
    event TodoDeleted(uint256 indexed id);

    modifier todoExists(uint256 _id) {
        require(_id > 0 && _id <= todoCount, "Todo does not exist");
        require(bytes(todos[_id].text).length > 0, "Todo has been deleted");
        _;
    }

    /**
     * @dev 创建新的待办事项
     * @param _text 待办事项文本内容
     */
    function createTodo(string memory _text) public {
        require(bytes(_text).length > 0, "Text cannot be empty");
        require(bytes(_text).length <= 500, "Text too long");

        todoCount++;
        todos[todoCount] = Todo(todoCount, _text, false, block.timestamp);

        emit TodoCreated(todoCount, _text, block.timestamp);
    }

    /**
     * @dev 切换待办事项的完成状态
     * @param _id 待办事项 ID
     */
    function toggleTodo(uint256 _id) public todoExists(_id) {
        todos[_id].completed = !todos[_id].completed;
        emit TodoToggled(_id, todos[_id].completed);
    }

    /**
     * @dev 删除待办事项
     * @param _id 待办事项 ID
     */
    function deleteTodo(uint256 _id) public todoExists(_id) {
        delete todos[_id];
        emit TodoDeleted(_id);
    }

    /**
     * @dev 获取单个待办事项
     * @param _id 待办事项 ID
     * @return Todo 结构体
     */
    function getTodo(uint256 _id) public view todoExists(_id) returns (Todo memory) {
        return todos[_id];
    }

    /**
     * @dev 获取所有有效的待办事项
     * @return Todo 数组，包含所有未删除的待办事项
     */
    function getAllTodos() public view returns (Todo[] memory) {
        // 首先计算有效的 todo 数量
        uint256 validCount = 0;
        for (uint256 i = 1; i <= todoCount; i++) {
            if (bytes(todos[i].text).length > 0) {
                validCount++;
            }
        }

        // 创建数组并填充
        Todo[] memory allTodos = new Todo[](validCount);
        uint256 index = 0;

        for (uint256 i = 1; i <= todoCount; i++) {
            if (bytes(todos[i].text).length > 0) {
                allTodos[index] = todos[i];
                index++;
            }
        }

        return allTodos;
    }

    /**
     * @dev 获取活跃（未完成）的待办事项
     * @return Todo 数组，只包含未完成的待办事项
     */
    function getActiveTodos() public view returns (Todo[] memory) {
        uint256 activeCount = 0;
        for (uint256 i = 1; i <= todoCount; i++) {
            if (bytes(todos[i].text).length > 0 && !todos[i].completed) {
                activeCount++;
            }
        }

        Todo[] memory activeTodos = new Todo[](activeCount);
        uint256 index = 0;

        for (uint256 i = 1; i <= todoCount; i++) {
            if (bytes(todos[i].text).length > 0 && !todos[i].completed) {
                activeTodos[index] = todos[i];
                index++;
            }
        }

        return activeTodos;
    }

    /**
     * @dev 获取已完成的待办事项
     * @return Todo 数组，只包含已完成的待办事项
     */
    function getCompletedTodos() public view returns (Todo[] memory) {
        uint256 completedCount = 0;
        for (uint256 i = 1; i <= todoCount; i++) {
            if (bytes(todos[i].text).length > 0 && todos[i].completed) {
                completedCount++;
            }
        }

        Todo[] memory completedTodos = new Todo[](completedCount);
        uint256 index = 0;

        for (uint256 i = 1; i <= todoCount; i++) {
            if (bytes(todos[i].text).length > 0 && todos[i].completed) {
                completedTodos[index] = todos[i];
                index++;
            }
        }

        return completedTodos;
    }
}
