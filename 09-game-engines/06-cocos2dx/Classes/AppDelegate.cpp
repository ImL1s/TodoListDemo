#include "AppDelegate.h"
#include "TodoScene.h"

USING_NS_CC;

AppDelegate::AppDelegate()
{
}

AppDelegate::~AppDelegate()
{
}

void AppDelegate::initGLContextAttrs()
{
    // Set OpenGL context attributes: red, green, blue, alpha, depth, stencil, multisample
    GLContextAttrs glContextAttrs = {8, 8, 8, 8, 24, 8, 0};
    GLView::setGLContextAttrs(glContextAttrs);
}

bool AppDelegate::applicationDidFinishLaunching()
{
    // Initialize director
    auto director = Director::getInstance();
    auto glview = director->getOpenGLView();

    if (!glview)
    {
#if (CC_TARGET_PLATFORM == CC_PLATFORM_WIN32) || (CC_TARGET_PLATFORM == CC_PLATFORM_MAC) || (CC_TARGET_PLATFORM == CC_PLATFORM_LINUX)
        glview = GLViewImpl::createWithRect("TodoList", Rect(0, 0, 960, 640));
#else
        glview = GLViewImpl::create("TodoList");
#endif
        director->setOpenGLView(glview);
    }

    // Turn on display FPS
    director->setDisplayStats(false);

    // Set FPS. Default is 1.0/60
    director->setAnimationInterval(1.0f / 60);

    // Set the design resolution
    glview->setDesignResolutionSize(720, 1280, ResolutionPolicy::SHOW_ALL);

    // Create a scene
    auto scene = TodoScene::createScene();

    // Run the scene
    director->runWithScene(scene);

    return true;
}

void AppDelegate::applicationDidEnterBackground()
{
    Director::getInstance()->stopAnimation();
}

void AppDelegate::applicationWillEnterForeground()
{
    Director::getInstance()->startAnimation();
}
