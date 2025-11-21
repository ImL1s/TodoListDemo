#include "TodoItem.h"

USING_NS_CC;

TodoItemNode* TodoItemNode::create(
    const TodoItem& item,
    float width,
    std::function<void(int)> onToggle,
    std::function<void(int)> onDelete)
{
    TodoItemNode* node = new (std::nothrow) TodoItemNode();
    if (node && node->init(item, width, onToggle, onDelete))
    {
        node->autorelease();
        return node;
    }
    CC_SAFE_DELETE(node);
    return nullptr;
}

bool TodoItemNode::init(
    const TodoItem& item,
    float width,
    std::function<void(int)> onToggle,
    std::function<void(int)> onDelete)
{
    if (!Node::init())
    {
        return false;
    }

    m_todoId = item.id;
    m_onToggle = onToggle;
    m_onDelete = onDelete;

    setupUI(item, width);

    return true;
}

void TodoItemNode::setupUI(const TodoItem& item, float width)
{
    const float HEIGHT = 60.0f;
    const float PADDING = 10.0f;
    const float CHECKBOX_SIZE = 40.0f;
    const float DELETE_BTN_WIDTH = 80.0f;

    setContentSize(Size(width, HEIGHT));

    // Background
    auto bg = LayerColor::create(Color4B(45, 45, 48, 255), width, HEIGHT);
    addChild(bg, -1);

    // Checkbox
    m_checkbox = ui::CheckBox::create(
        "ui/checkbox_normal.png",
        "ui/checkbox_selected.png",
        "ui/checkbox_disabled.png",
        "ui/checkbox_normal.png",
        "ui/checkbox_disabled.png",
        ui::Widget::TextureResType::LOCAL
    );

    // Fallback: create simple checkbox using sprites if image not found
    if (!m_checkbox)
    {
        m_checkbox = ui::CheckBox::create();
        m_checkbox->setZoomScale(0.1f);
    }

    m_checkbox->setSelected(item.completed);
    m_checkbox->setPosition(Vec2(PADDING + CHECKBOX_SIZE / 2, HEIGHT / 2));
    m_checkbox->addEventListener(CC_CALLBACK_2(TodoItemNode::onCheckboxClicked, this));
    addChild(m_checkbox);

    // Text Label
    float textWidth = width - CHECKBOX_SIZE - DELETE_BTN_WIDTH - PADDING * 4;
    m_textLabel = Label::createWithSystemFont(item.text, "Arial", 24);
    m_textLabel->setAnchorPoint(Vec2(0, 0.5f));
    m_textLabel->setPosition(Vec2(PADDING * 2 + CHECKBOX_SIZE, HEIGHT / 2));
    m_textLabel->setDimensions(textWidth, 0);
    m_textLabel->setColor(item.completed ? Color3B(128, 128, 128) : Color3B(255, 255, 255));
    addChild(m_textLabel);

    // Delete Button
    m_deleteButton = ui::Button::create();
    m_deleteButton->setTitleText("Delete");
    m_deleteButton->setTitleFontSize(20);
    m_deleteButton->setTitleColor(Color3B(255, 255, 255));
    m_deleteButton->setScale9Enabled(true);
    m_deleteButton->setContentSize(Size(DELETE_BTN_WIDTH, 40));
    m_deleteButton->setPosition(Vec2(width - DELETE_BTN_WIDTH / 2 - PADDING, HEIGHT / 2));
    m_deleteButton->addClickEventListener(CC_CALLBACK_1(TodoItemNode::onDeleteClicked, this));

    // Button background color
    m_deleteButton->loadTextureNormal("ui/button_normal.png", ui::Widget::TextureResType::LOCAL);
    m_deleteButton->loadTexturePressed("ui/button_pressed.png", ui::Widget::TextureResType::LOCAL);

    // Fallback styling if textures not found
    m_deleteButton->setColor(Color3B(220, 53, 69));

    addChild(m_deleteButton);
}

void TodoItemNode::updateDisplay(const TodoItem& item)
{
    m_checkbox->setSelected(item.completed);
    m_textLabel->setString(item.text);
    m_textLabel->setColor(item.completed ? Color3B(128, 128, 128) : Color3B(255, 255, 255));
}

void TodoItemNode::onCheckboxClicked(Ref* sender, ui::CheckBox::EventType type)
{
    if (type == ui::CheckBox::EventType::SELECTED ||
        type == ui::CheckBox::EventType::UNSELECTED)
    {
        if (m_onToggle)
        {
            m_onToggle(m_todoId);
        }
    }
}

void TodoItemNode::onDeleteClicked(Ref* sender)
{
    if (m_onDelete)
    {
        m_onDelete(m_todoId);
    }
}
