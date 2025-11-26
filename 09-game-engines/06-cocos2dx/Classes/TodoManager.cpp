#include "TodoManager.h"
#include "StorageManager.h"
#include <algorithm>
#include <chrono>

TodoManager::TodoManager()
    : m_currentFilter(TodoFilter::ALL)
    , m_nextId(1)
    , m_onTodosChanged(nullptr)
{
    loadTodos();
}

TodoManager::~TodoManager()
{
}

TodoManager* TodoManager::getInstance()
{
    // Meyer's Singleton - C++11 guarantees thread-safe initialization
    // Static local variable is initialized only once, thread-safely
    // Automatic lifetime management - no need for manual cleanup
    static TodoManager instance;
    return &instance;
}

TodoItem TodoManager::addTodo(const std::string& text)
{
    // Enhanced input validation
    if (text.empty())
    {
        CCLOG("Cannot add todo: text is empty");
        return TodoItem();
    }

    if (text.length() > 500)
    {
        CCLOG("Cannot add todo: text too long (max 500 characters)");
        return TodoItem();
    }

    // Get current timestamp
    auto now = std::chrono::system_clock::now();
    auto timestamp = std::chrono::duration_cast<std::chrono::seconds>(
        now.time_since_epoch()
    ).count();

    TodoItem item(m_nextId++, text, false, timestamp);
    m_todos.push_back(item);

    auto result = saveTodos();
    if (result != SaveResult::SUCCESS)
    {
        CCLOG("Warning: Failed to save todos after adding item");
    }

    notifyChanges();

    return item;
}

bool TodoManager::deleteTodo(int id)
{
    auto it = std::find_if(m_todos.begin(), m_todos.end(),
        [id](const TodoItem& item) { return item.id == id; });

    if (it != m_todos.end())
    {
        m_todos.erase(it);
        saveTodos();
        notifyChanges();
        return true;
    }

    return false;
}

bool TodoManager::toggleTodo(int id)
{
    auto it = std::find_if(m_todos.begin(), m_todos.end(),
        [id](const TodoItem& item) { return item.id == id; });

    if (it != m_todos.end())
    {
        it->completed = !it->completed;
        saveTodos();
        notifyChanges();
        return true;
    }

    return false;
}

std::vector<TodoItem> TodoManager::getTodos() const
{
    std::vector<TodoItem> filtered;

    switch (m_currentFilter)
    {
        case TodoFilter::ALL:
            return m_todos;

        case TodoFilter::ACTIVE:
            std::copy_if(m_todos.begin(), m_todos.end(), std::back_inserter(filtered),
                [](const TodoItem& item) { return !item.completed; });
            break;

        case TodoFilter::COMPLETED:
            std::copy_if(m_todos.begin(), m_todos.end(), std::back_inserter(filtered),
                [](const TodoItem& item) { return item.completed; });
            break;
    }

    return filtered;
}

std::vector<TodoItem> TodoManager::getAllTodos() const
{
    return m_todos;
}

void TodoManager::setFilter(TodoFilter filter)
{
    if (m_currentFilter != filter)
    {
        m_currentFilter = filter;
        notifyChanges();
    }
}

TodoFilter TodoManager::getFilter() const
{
    return m_currentFilter;
}

int TodoManager::getTotalCount() const
{
    return static_cast<int>(m_todos.size());
}

int TodoManager::getActiveCount() const
{
    return static_cast<int>(std::count_if(m_todos.begin(), m_todos.end(),
        [](const TodoItem& item) { return !item.completed; }));
}

int TodoManager::getCompletedCount() const
{
    return static_cast<int>(std::count_if(m_todos.begin(), m_todos.end(),
        [](const TodoItem& item) { return item.completed; }));
}

int TodoManager::clearCompleted()
{
    int count = 0;
    auto it = m_todos.begin();

    while (it != m_todos.end())
    {
        if (it->completed)
        {
            it = m_todos.erase(it);
            count++;
        }
        else
        {
            ++it;
        }
    }

    if (count > 0)
    {
        saveTodos();
        notifyChanges();
    }

    return count;
}

void TodoManager::loadTodos()
{
    m_todos = StorageManager::getInstance()->loadTodos();

    // Update nextId to be higher than any existing ID
    m_nextId = 1;
    for (const auto& item : m_todos)
    {
        if (item.id >= m_nextId)
        {
            m_nextId = item.id + 1;
        }
    }
}

SaveResult TodoManager::saveTodos()
{
    bool success = StorageManager::getInstance()->saveTodos(m_todos);
    return success ? SaveResult::SUCCESS : SaveResult::WRITE_FAILED;
}

void TodoManager::setOnTodosChangedCallback(std::function<void()> callback)
{
    m_onTodosChanged = callback;
}

void TodoManager::notifyChanges()
{
    if (m_onTodosChanged)
    {
        m_onTodosChanged();
    }
}
