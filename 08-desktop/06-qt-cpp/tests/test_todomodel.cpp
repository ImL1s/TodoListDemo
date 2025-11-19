/**
 * @file test_todomodel.cpp
 * @brief Unit tests for TodoModel class using Qt Test Framework
 */

#include <QtTest>
#include "../src/TodoModel.h"
#include "../src/TodoItem.h"

/**
 * @class TestTodoModel
 * @brief Test suite for TodoModel
 *
 * This class contains unit tests for the TodoModel class,
 * testing CRUD operations, filtering, and persistence.
 */
class TestTodoModel : public QObject
{
    Q_OBJECT

private slots:
    // Setup and teardown
    void initTestCase();
    void cleanupTestCase();
    void init();
    void cleanup();

    // TodoItem tests
    void testTodoItemCreation();
    void testTodoItemToggle();
    void testTodoItemSerialization();

    // TodoModel tests
    void testModelInitialization();
    void testAddTodo();
    void testRemoveTodo();
    void testToggleTodo();
    void testUpdateTodo();
    void testClearCompleted();
    void testFilterAll();
    void testFilterActive();
    void testFilterCompleted();
    void testCounts();
    void testSignals();

private:
    TodoModel *model;
};

/**
 * @brief Initialize test suite
 */
void TestTodoModel::initTestCase()
{
    qDebug() << "Starting TodoModel tests";
}

/**
 * @brief Cleanup test suite
 */
void TestTodoModel::cleanupTestCase()
{
    qDebug() << "Finished TodoModel tests";
}

/**
 * @brief Setup before each test
 */
void TestTodoModel::init()
{
    model = new TodoModel();
}

/**
 * @brief Cleanup after each test
 */
void TestTodoModel::cleanup()
{
    delete model;
    model = nullptr;
}

/**
 * @brief Test TodoItem creation
 */
void TestTodoModel::testTodoItemCreation()
{
    TodoItem item("Test Todo");

    QVERIFY(!item.getId().isEmpty());
    QCOMPARE(item.getTitle(), QString("Test Todo"));
    QCOMPARE(item.isCompleted(), false);
    QCOMPARE(item.getPriority(), TodoItem::Priority::Normal);
}

/**
 * @brief Test TodoItem toggle
 */
void TestTodoModel::testTodoItemToggle()
{
    TodoItem item("Test Todo");

    QCOMPARE(item.isCompleted(), false);

    bool result = item.toggleCompleted();
    QCOMPARE(result, true);
    QCOMPARE(item.isCompleted(), true);

    result = item.toggleCompleted();
    QCOMPARE(result, false);
    QCOMPARE(item.isCompleted(), false);
}

/**
 * @brief Test TodoItem serialization
 */
void TestTodoModel::testTodoItemSerialization()
{
    TodoItem original("Test Todo", false, TodoItem::Priority::High);
    original.setCategory("Work");

    QJsonObject json = original.toJson();
    TodoItem deserialized = TodoItem::fromJson(json);

    QCOMPARE(deserialized.getTitle(), original.getTitle());
    QCOMPARE(deserialized.isCompleted(), original.isCompleted());
    QCOMPARE(deserialized.getPriority(), original.getPriority());
    QCOMPARE(deserialized.getCategory(), original.getCategory());
}

/**
 * @brief Test model initialization
 */
void TestTodoModel::testModelInitialization()
{
    QVERIFY(model != nullptr);
    QCOMPARE(model->rowCount(), 0);
    QCOMPARE(model->totalCount(), 0);
    QCOMPARE(model->activeCount(), 0);
    QCOMPARE(model->completedCount(), 0);
}

/**
 * @brief Test adding todos
 */
void TestTodoModel::testAddTodo()
{
    QVERIFY(model->addTodo("First Todo"));
    QCOMPARE(model->totalCount(), 1);
    QCOMPARE(model->rowCount(), 1);

    QVERIFY(model->addTodo("Second Todo", TodoItem::Priority::High));
    QCOMPARE(model->totalCount(), 2);
    QCOMPARE(model->rowCount(), 2);

    // Test empty todo
    QVERIFY(!model->addTodo(""));
    QVERIFY(!model->addTodo("   "));
    QCOMPARE(model->totalCount(), 2);
}

/**
 * @brief Test removing todos
 */
void TestTodoModel::testRemoveTodo()
{
    model->addTodo("Todo 1");
    model->addTodo("Todo 2");
    model->addTodo("Todo 3");

    QCOMPARE(model->totalCount(), 3);

    QVERIFY(model->removeTodo(1)); // Remove second todo
    QCOMPARE(model->totalCount(), 2);

    QVERIFY(model->removeTodo(0)); // Remove first todo
    QCOMPARE(model->totalCount(), 1);

    // Test invalid removal
    QVERIFY(!model->removeTodo(-1));
    QVERIFY(!model->removeTodo(999));
}

/**
 * @brief Test toggling todos
 */
void TestTodoModel::testToggleTodo()
{
    model->addTodo("Test Todo");

    TodoItem item = model->getTodoItem(0);
    QCOMPARE(item.isCompleted(), false);

    QVERIFY(model->toggleTodo(0));
    item = model->getTodoItem(0);
    QCOMPARE(item.isCompleted(), true);

    QVERIFY(model->toggleTodo(0));
    item = model->getTodoItem(0);
    QCOMPARE(item.isCompleted(), false);
}

/**
 * @brief Test updating todos
 */
void TestTodoModel::testUpdateTodo()
{
    model->addTodo("Original Title");

    QModelIndex index = model->index(0, 0);
    QVERIFY(model->updateTodoTitle(index, "Updated Title"));

    TodoItem item = model->getTodoItem(index);
    QCOMPARE(item.getTitle(), QString("Updated Title"));

    // Test empty update
    QVERIFY(!model->updateTodoTitle(index, ""));
    QVERIFY(!model->updateTodoTitle(index, "   "));
}

/**
 * @brief Test clearing completed todos
 */
void TestTodoModel::testClearCompleted()
{
    model->addTodo("Todo 1");
    model->addTodo("Todo 2");
    model->addTodo("Todo 3");

    model->toggleTodo(0);
    model->toggleTodo(2);

    QCOMPARE(model->totalCount(), 3);
    QCOMPARE(model->completedCount(), 2);

    int removed = model->clearCompleted();
    QCOMPARE(removed, 2);
    QCOMPARE(model->totalCount(), 1);
    QCOMPARE(model->completedCount(), 0);
}

/**
 * @brief Test filter: All
 */
void TestTodoModel::testFilterAll()
{
    model->addTodo("Todo 1");
    model->addTodo("Todo 2");
    model->toggleTodo(0);

    model->setFilterMode(TodoModel::FilterMode::All);
    QCOMPARE(model->rowCount(), 2);
}

/**
 * @brief Test filter: Active
 */
void TestTodoModel::testFilterActive()
{
    model->addTodo("Todo 1");
    model->addTodo("Todo 2");
    model->addTodo("Todo 3");
    model->toggleTodo(0);
    model->toggleTodo(2);

    model->setFilterMode(TodoModel::FilterMode::Active);
    QCOMPARE(model->rowCount(), 1); // Only Todo 2 is active
}

/**
 * @brief Test filter: Completed
 */
void TestTodoModel::testFilterCompleted()
{
    model->addTodo("Todo 1");
    model->addTodo("Todo 2");
    model->addTodo("Todo 3");
    model->toggleTodo(0);
    model->toggleTodo(2);

    model->setFilterMode(TodoModel::FilterMode::Completed);
    QCOMPARE(model->rowCount(), 2); // Todo 1 and Todo 3 are completed
}

/**
 * @brief Test counts
 */
void TestTodoModel::testCounts()
{
    QCOMPARE(model->totalCount(), 0);
    QCOMPARE(model->activeCount(), 0);
    QCOMPARE(model->completedCount(), 0);

    model->addTodo("Todo 1");
    model->addTodo("Todo 2");
    model->addTodo("Todo 3");

    QCOMPARE(model->totalCount(), 3);
    QCOMPARE(model->activeCount(), 3);
    QCOMPARE(model->completedCount(), 0);

    model->toggleTodo(0);
    model->toggleTodo(1);

    QCOMPARE(model->totalCount(), 3);
    QCOMPARE(model->activeCount(), 1);
    QCOMPARE(model->completedCount(), 2);
}

/**
 * @brief Test signals
 */
void TestTodoModel::testSignals()
{
    QSignalSpy addedSpy(model, &TodoModel::todoAdded);
    QSignalSpy removedSpy(model, &TodoModel::todoRemoved);
    QSignalSpy updatedSpy(model, &TodoModel::todoUpdated);
    QSignalSpy countsChangedSpy(model, &TodoModel::countsChanged);

    model->addTodo("Test Todo");

    QCOMPARE(addedSpy.count(), 1);
    QVERIFY(countsChangedSpy.count() >= 1);

    model->removeTodo(0);

    QCOMPARE(removedSpy.count(), 1);
    QVERIFY(countsChangedSpy.count() >= 2);
}

// Run tests
QTEST_MAIN(TestTodoModel)
#include "test_todomodel.moc"
