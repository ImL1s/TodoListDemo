#ifndef __TODO_SCENE_H__
#define __TODO_SCENE_H__

#include "cocos2d.h"
#include "ui/CocosGUI.h"
#include "TodoManager.h"

/**
 * @brief Main scene for the TodoList application
 *
 * Displays the todo list interface with input field, filter buttons,
 * todo items list, and statistics.
 */
class TodoScene : public cocos2d::Scene
{
public:
    /**
     * @brief Create the scene
     */
    static cocos2d::Scene* createScene();

    /**
     * @brief Initialize the scene
     */
    virtual bool init() override;

    /**
     * @brief Called when scene is about to exit
     */
    virtual void onExit() override;

    CREATE_FUNC(TodoScene);

private:
    /**
     * @brief Setup all UI elements
     */
    void setupUI();

    /**
     * @brief Setup the header (title and input)
     */
    void setupHeader();

    /**
     * @brief Setup the filter buttons
     */
    void setupFilterButtons();

    /**
     * @brief Setup the todo list view
     */
    void setupTodoList();

    /**
     * @brief Setup the footer (stats and clear button)
     */
    void setupFooter();

    /**
     * @brief Refresh the todo list display
     */
    void refreshList();

    /**
     * @brief Update statistics display
     */
    void updateStats();

    /**
     * @brief Callback when add button is clicked
     */
    void onAddButtonClicked(cocos2d::Ref* sender);

    /**
     * @brief Callback when a todo is toggled
     */
    void onTodoToggled(int todoId);

    /**
     * @brief Callback when a todo is deleted
     */
    void onTodoDeleted(int todoId);

    /**
     * @brief Callback when filter button is clicked
     */
    void onFilterButtonClicked(cocos2d::Ref* sender, TodoFilter filter);

    /**
     * @brief Callback when clear completed button is clicked
     */
    void onClearCompletedClicked(cocos2d::Ref* sender);

    // UI Components
    cocos2d::ui::EditBox* m_inputBox;
    cocos2d::ui::Button* m_addButton;
    cocos2d::ui::ListView* m_todoListView;
    cocos2d::Label* m_statsLabel;
    cocos2d::ui::Button* m_clearCompletedButton;

    // Filter buttons
    cocos2d::ui::Button* m_filterAllButton;
    cocos2d::ui::Button* m_filterActiveButton;
    cocos2d::ui::Button* m_filterCompletedButton;

    // Layout constants
    static const float HEADER_HEIGHT;
    static const float FILTER_HEIGHT;
    static const float FOOTER_HEIGHT;
    static const float PADDING;
};

#endif // __TODO_SCENE_H__
