#ifndef __TODO_ITEM_NODE_H__
#define __TODO_ITEM_NODE_H__

#include "cocos2d.h"
#include "ui/CocosGUI.h"
#include "TodoManager.h"
#include <functional>

/**
 * @brief Visual representation of a todo item
 *
 * Custom UI node that displays a single todo item with
 * checkbox, text label, and delete button.
 */
class TodoItemNode : public cocos2d::Node
{
public:
    /**
     * @brief Create a TodoItemNode
     * @param item The TodoItem data
     * @param width The width of the item node
     * @param onToggle Callback when checkbox is clicked
     * @param onDelete Callback when delete button is clicked
     * @return Initialized TodoItemNode
     */
    static TodoItemNode* create(
        const TodoItem& item,
        float width,
        std::function<void(int)> onToggle,
        std::function<void(int)> onDelete
    );

    /**
     * @brief Initialize the node
     */
    virtual bool init(
        const TodoItem& item,
        float width,
        std::function<void(int)> onToggle,
        std::function<void(int)> onDelete
    );

    /**
     * @brief Get the todo item ID
     */
    int getTodoId() const { return m_todoId; }

    /**
     * @brief Update the item display
     */
    void updateDisplay(const TodoItem& item);

private:
    void setupUI(const TodoItem& item, float width);
    void onCheckboxClicked(cocos2d::Ref* sender, cocos2d::ui::CheckBox::EventType type);
    void onDeleteClicked(cocos2d::Ref* sender);

    int m_todoId;
    cocos2d::ui::CheckBox* m_checkbox;
    cocos2d::Label* m_textLabel;
    cocos2d::ui::Button* m_deleteButton;

    std::function<void(int)> m_onToggle;
    std::function<void(int)> m_onDelete;
};

#endif // __TODO_ITEM_NODE_H__
