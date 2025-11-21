#include "TodoScene.h"
#include "TodoItem.h"
#include "TodoManager.h"

USING_NS_CC;

const float TodoScene::HEADER_HEIGHT = 150.0f;
const float TodoScene::FILTER_HEIGHT = 60.0f;
const float TodoScene::FOOTER_HEIGHT = 80.0f;
const float TodoScene::PADDING = 20.0f;

Scene* TodoScene::createScene()
{
    return TodoScene::create();
}

bool TodoScene::init()
{
    if (!Scene::init())
    {
        return false;
    }

    // Background
    auto bg = LayerColor::create(Color4B(30, 30, 32, 255));
    addChild(bg, -10);

    setupUI();

    // Register callback for todo changes
    TodoManager::getInstance()->setOnTodosChangedCallback([this]() {
        refreshList();
        updateStats();
    });

    // Initial refresh
    refreshList();
    updateStats();

    return true;
}

void TodoScene::onExit()
{
    // Clean up callback
    TodoManager::getInstance()->setOnTodosChangedCallback(nullptr);
    Scene::onExit();
}

void TodoScene::setupUI()
{
    setupHeader();
    setupFilterButtons();
    setupTodoList();
    setupFooter();
}

void TodoScene::setupHeader()
{
    auto visibleSize = Director::getInstance()->getVisibleSize();
    Vec2 origin = Director::getInstance()->getVisibleOrigin();

    // Title
    auto titleLabel = Label::createWithSystemFont("Todo List", "Arial", 48);
    titleLabel->setColor(Color3B(255, 255, 255));
    titleLabel->setPosition(Vec2(
        origin.x + visibleSize.width / 2,
        origin.y + visibleSize.height - 50
    ));
    addChild(titleLabel);

    // Input Box
    m_inputBox = ui::EditBox::create(
        Size(visibleSize.width - 120 - PADDING * 3, 50),
        ui::Scale9Sprite::create()
    );
    m_inputBox->setPosition(Vec2(
        origin.x + (visibleSize.width - 120 - PADDING * 3) / 2 + PADDING,
        origin.y + visibleSize.height - HEADER_HEIGHT + 25
    ));
    m_inputBox->setPlaceHolder("What needs to be done?");
    m_inputBox->setPlaceholderFontColor(Color3B(128, 128, 128));
    m_inputBox->setFontColor(Color3B(255, 255, 255));
    m_inputBox->setFontSize(24);
    m_inputBox->setMaxLength(100);
    m_inputBox->setReturnType(ui::EditBox::KeyboardReturnType::DONE);
    m_inputBox->setInputMode(ui::EditBox::InputMode::SINGLE_LINE);

    // Background for input box
    auto inputBg = LayerColor::create(
        Color4B(60, 60, 64, 255),
        visibleSize.width - 120 - PADDING * 3,
        50
    );
    inputBg->setPosition(Vec2(
        origin.x + PADDING,
        origin.y + visibleSize.height - HEADER_HEIGHT
    ));
    addChild(inputBg, 0);
    addChild(m_inputBox, 1);

    // Add Button
    m_addButton = ui::Button::create();
    m_addButton->setTitleText("Add");
    m_addButton->setTitleFontSize(24);
    m_addButton->setTitleColor(Color3B(255, 255, 255));
    m_addButton->setContentSize(Size(100, 50));
    m_addButton->setPosition(Vec2(
        origin.x + visibleSize.width - 60 - PADDING,
        origin.y + visibleSize.height - HEADER_HEIGHT + 25
    ));
    m_addButton->addClickEventListener(CC_CALLBACK_1(TodoScene::onAddButtonClicked, this));
    m_addButton->setColor(Color3B(40, 167, 69));
    addChild(m_addButton);
}

void TodoScene::setupFilterButtons()
{
    auto visibleSize = Director::getInstance()->getVisibleSize();
    Vec2 origin = Director::getInstance()->getVisibleOrigin();

    float buttonWidth = (visibleSize.width - PADDING * 4) / 3;
    float yPos = origin.y + visibleSize.height - HEADER_HEIGHT - FILTER_HEIGHT / 2;

    // All Button
    m_filterAllButton = ui::Button::create();
    m_filterAllButton->setTitleText("All");
    m_filterAllButton->setTitleFontSize(22);
    m_filterAllButton->setTitleColor(Color3B(255, 255, 255));
    m_filterAllButton->setContentSize(Size(buttonWidth, 45));
    m_filterAllButton->setPosition(Vec2(origin.x + PADDING + buttonWidth / 2, yPos));
    m_filterAllButton->addClickEventListener([this](Ref* sender) {
        onFilterButtonClicked(sender, TodoFilter::ALL);
    });
    m_filterAllButton->setColor(Color3B(0, 123, 255));
    addChild(m_filterAllButton);

    // Active Button
    m_filterActiveButton = ui::Button::create();
    m_filterActiveButton->setTitleText("Active");
    m_filterActiveButton->setTitleFontSize(22);
    m_filterActiveButton->setTitleColor(Color3B(255, 255, 255));
    m_filterActiveButton->setContentSize(Size(buttonWidth, 45));
    m_filterActiveButton->setPosition(Vec2(
        origin.x + PADDING * 2 + buttonWidth * 1.5f,
        yPos
    ));
    m_filterActiveButton->addClickEventListener([this](Ref* sender) {
        onFilterButtonClicked(sender, TodoFilter::ACTIVE);
    });
    m_filterActiveButton->setColor(Color3B(108, 117, 125));
    addChild(m_filterActiveButton);

    // Completed Button
    m_filterCompletedButton = ui::Button::create();
    m_filterCompletedButton->setTitleText("Completed");
    m_filterCompletedButton->setTitleFontSize(22);
    m_filterCompletedButton->setTitleColor(Color3B(255, 255, 255));
    m_filterCompletedButton->setContentSize(Size(buttonWidth, 45));
    m_filterCompletedButton->setPosition(Vec2(
        origin.x + PADDING * 3 + buttonWidth * 2.5f,
        yPos
    ));
    m_filterCompletedButton->addClickEventListener([this](Ref* sender) {
        onFilterButtonClicked(sender, TodoFilter::COMPLETED);
    });
    m_filterCompletedButton->setColor(Color3B(108, 117, 125));
    addChild(m_filterCompletedButton);
}

void TodoScene::setupTodoList()
{
    auto visibleSize = Director::getInstance()->getVisibleSize();
    Vec2 origin = Director::getInstance()->getVisibleOrigin();

    float listHeight = visibleSize.height - HEADER_HEIGHT - FILTER_HEIGHT - FOOTER_HEIGHT - PADDING * 2;

    m_todoListView = ui::ListView::create();
    m_todoListView->setDirection(ui::ScrollView::Direction::VERTICAL);
    m_todoListView->setContentSize(Size(visibleSize.width - PADDING * 2, listHeight));
    m_todoListView->setPosition(Vec2(
        origin.x + PADDING,
        origin.y + FOOTER_HEIGHT + PADDING
    ));
    m_todoListView->setItemsMargin(5.0f);
    m_todoListView->setScrollBarEnabled(true);
    m_todoListView->setScrollBarAutoHideEnabled(true);
    m_todoListView->setScrollBarWidth(8.0f);
    m_todoListView->setScrollBarColor(Color3B(128, 128, 128));

    addChild(m_todoListView);
}

void TodoScene::setupFooter()
{
    auto visibleSize = Director::getInstance()->getVisibleSize();
    Vec2 origin = Director::getInstance()->getVisibleOrigin();

    // Stats Label
    m_statsLabel = Label::createWithSystemFont("0 items", "Arial", 24);
    m_statsLabel->setColor(Color3B(200, 200, 200));
    m_statsLabel->setAnchorPoint(Vec2(0, 0.5f));
    m_statsLabel->setPosition(Vec2(
        origin.x + PADDING,
        origin.y + FOOTER_HEIGHT / 2
    ));
    addChild(m_statsLabel);

    // Clear Completed Button
    m_clearCompletedButton = ui::Button::create();
    m_clearCompletedButton->setTitleText("Clear Completed");
    m_clearCompletedButton->setTitleFontSize(20);
    m_clearCompletedButton->setTitleColor(Color3B(255, 255, 255));
    m_clearCompletedButton->setContentSize(Size(180, 45));
    m_clearCompletedButton->setPosition(Vec2(
        origin.x + visibleSize.width - 100 - PADDING,
        origin.y + FOOTER_HEIGHT / 2
    ));
    m_clearCompletedButton->addClickEventListener(
        CC_CALLBACK_1(TodoScene::onClearCompletedClicked, this)
    );
    m_clearCompletedButton->setColor(Color3B(220, 53, 69));
    addChild(m_clearCompletedButton);
}

void TodoScene::refreshList()
{
    m_todoListView->removeAllItems();

    auto todos = TodoManager::getInstance()->getTodos();
    auto visibleSize = Director::getInstance()->getVisibleSize();
    float itemWidth = visibleSize.width - PADDING * 2 - 10; // -10 for scrollbar

    for (const auto& todo : todos)
    {
        auto itemNode = TodoItemNode::create(
            todo,
            itemWidth,
            CC_CALLBACK_1(TodoScene::onTodoToggled, this),
            CC_CALLBACK_1(TodoScene::onTodoDeleted, this)
        );

        m_todoListView->pushBackCustomItem(itemNode);
    }
}

void TodoScene::updateStats()
{
    auto manager = TodoManager::getInstance();
    int total = manager->getTotalCount();
    int active = manager->getActiveCount();
    int completed = manager->getCompletedCount();

    std::string statsText = StringUtils::format(
        "%d items | %d active | %d completed",
        total, active, completed
    );

    m_statsLabel->setString(statsText);

    // Update filter button colors
    auto currentFilter = manager->getFilter();

    m_filterAllButton->setColor(
        currentFilter == TodoFilter::ALL ? Color3B(0, 123, 255) : Color3B(108, 117, 125)
    );
    m_filterActiveButton->setColor(
        currentFilter == TodoFilter::ACTIVE ? Color3B(0, 123, 255) : Color3B(108, 117, 125)
    );
    m_filterCompletedButton->setColor(
        currentFilter == TodoFilter::COMPLETED ? Color3B(0, 123, 255) : Color3B(108, 117, 125)
    );
}

void TodoScene::onAddButtonClicked(Ref* sender)
{
    std::string text = m_inputBox->getText();

    if (text.empty())
    {
        return;
    }

    TodoManager::getInstance()->addTodo(text);
    m_inputBox->setText("");
}

void TodoScene::onTodoToggled(int todoId)
{
    TodoManager::getInstance()->toggleTodo(todoId);
}

void TodoScene::onTodoDeleted(int todoId)
{
    TodoManager::getInstance()->deleteTodo(todoId);
}

void TodoScene::onFilterButtonClicked(Ref* sender, TodoFilter filter)
{
    TodoManager::getInstance()->setFilter(filter);
}

void TodoScene::onClearCompletedClicked(Ref* sender)
{
    TodoManager::getInstance()->clearCompleted();
}
