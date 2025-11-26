#ifndef __APP_DELEGATE_H__
#define __APP_DELEGATE_H__

#include "cocos2d.h"

/**
 * @brief Cocos2d-x TodoList Application Delegate
 *
 * The entry point for the application. Manages application lifecycle
 * and initializes the game engine.
 */
class AppDelegate : private cocos2d::Application
{
public:
    AppDelegate();
    virtual ~AppDelegate();

    virtual void initGLContextAttrs() override;

    /**
     * @brief Implement Director and Scene init code here.
     * @return true if initialization is successful, false otherwise
     */
    virtual bool applicationDidFinishLaunching() override;

    /**
     * @brief Called when the application enters background
     * @param  application - The Application object
     */
    virtual void applicationDidEnterBackground() override;

    /**
     * @brief Called when the application enters foreground
     * @param  application - The Application object
     */
    virtual void applicationWillEnterForeground() override;
};

#endif // __APP_DELEGATE_H__
