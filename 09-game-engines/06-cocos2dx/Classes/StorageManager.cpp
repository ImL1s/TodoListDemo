#include "StorageManager.h"
#include "json/document.h"
#include "json/writer.h"
#include "json/stringbuffer.h"

USING_NS_CC;

const std::string StorageManager::STORAGE_FILENAME = "todos.json";

StorageManager::StorageManager()
{
}

StorageManager::~StorageManager()
{
}

StorageManager* StorageManager::getInstance()
{
    // Meyer's Singleton - C++11 guarantees thread-safe initialization
    // Static local variable is initialized only once, thread-safely
    // Automatic lifetime management - no need for manual cleanup
    static StorageManager instance;
    return &instance;
}

std::string StorageManager::getStoragePath() const
{
    return FileUtils::getInstance()->getWritablePath() + STORAGE_FILENAME;
}

bool StorageManager::saveTodos(const std::vector<TodoItem>& todos)
{
    std::string jsonStr = todosToJson(todos);
    std::string path = getStoragePath();

    return FileUtils::getInstance()->writeStringToFile(jsonStr, path);
}

std::vector<TodoItem> StorageManager::loadTodos()
{
    std::string path = getStoragePath();

    if (!FileUtils::getInstance()->isFileExist(path))
    {
        return std::vector<TodoItem>();
    }

    std::string jsonStr = FileUtils::getInstance()->getStringFromFile(path);

    if (jsonStr.empty())
    {
        return std::vector<TodoItem>();
    }

    return jsonToTodos(jsonStr);
}

bool StorageManager::clearStorage()
{
    std::string path = getStoragePath();

    if (FileUtils::getInstance()->isFileExist(path))
    {
        return FileUtils::getInstance()->removeFile(path);
    }

    return true;
}

std::string StorageManager::todosToJson(const std::vector<TodoItem>& todos) const
{
    rapidjson::Document document;
    document.SetObject();
    auto& allocator = document.GetAllocator();

    rapidjson::Value todosArray(rapidjson::kArrayType);

    for (const auto& todo : todos)
    {
        rapidjson::Value todoObj(rapidjson::kObjectType);

        todoObj.AddMember("id", todo.id, allocator);

        rapidjson::Value textValue;
        textValue.SetString(todo.text.c_str(), static_cast<rapidjson::SizeType>(todo.text.length()), allocator);
        todoObj.AddMember("text", textValue, allocator);

        todoObj.AddMember("completed", todo.completed, allocator);
        todoObj.AddMember("createdAt", todo.createdAt, allocator);

        todosArray.PushBack(todoObj, allocator);
    }

    document.AddMember("todos", todosArray, allocator);

    rapidjson::StringBuffer buffer;
    rapidjson::Writer<rapidjson::StringBuffer> writer(buffer);
    document.Accept(writer);

    return buffer.GetString();
}

std::vector<TodoItem> StorageManager::jsonToTodos(const std::string& json) const
{
    std::vector<TodoItem> todos;

    rapidjson::Document document;
    document.Parse(json.c_str());

    if (document.HasParseError() || !document.IsObject())
    {
        CCLOG("Failed to parse JSON");
        return todos;
    }

    if (!document.HasMember("todos") || !document["todos"].IsArray())
    {
        CCLOG("Invalid JSON structure");
        return todos;
    }

    const rapidjson::Value& todosArray = document["todos"];

    for (rapidjson::SizeType i = 0; i < todosArray.Size(); i++)
    {
        const rapidjson::Value& todoObj = todosArray[i];

        if (!todoObj.IsObject())
            continue;

        TodoItem item;

        if (todoObj.HasMember("id") && todoObj["id"].IsInt())
            item.id = todoObj["id"].GetInt();

        if (todoObj.HasMember("text") && todoObj["text"].IsString())
            item.text = todoObj["text"].GetString();

        if (todoObj.HasMember("completed") && todoObj["completed"].IsBool())
            item.completed = todoObj["completed"].GetBool();

        if (todoObj.HasMember("createdAt") && todoObj["createdAt"].IsInt64())
            item.createdAt = todoObj["createdAt"].GetInt64();

        todos.push_back(item);
    }

    return todos;
}
