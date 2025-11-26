Cocos2d-x TodoList Resources Directory
======================================

This directory contains all game resources including fonts, images, and data files.

Directory Structure:
--------------------
- fonts/       : Font files for text rendering
- images/      : UI images and sprites
- data/        : Game data files (JSON, XML, etc.)

Note:
-----
This is a placeholder directory structure. In a production application, you would:

1. Add actual font files (.ttf, .otf) to the fonts/ directory
2. Add UI images (buttons, checkboxes, backgrounds) to the images/ directory
3. The data/ directory is used for storing persistent game data

For UI images, you can use simple colored rectangles or find free UI assets online.
The application will work with fallback rendering even without custom images.

Recommended Images:
-------------------
- ui/checkbox_normal.png       : Normal checkbox state
- ui/checkbox_selected.png     : Selected checkbox state
- ui/checkbox_disabled.png     : Disabled checkbox state
- ui/button_normal.png          : Normal button texture
- ui/button_pressed.png         : Pressed button texture

Image Sizes:
------------
- Checkbox: 40x40 pixels
- Button: 9-patch scalable images (e.g., 50x50 with 10px borders)

You can create these images using any image editor or use Cocos2d-x's
built-in UI rendering with solid colors as a fallback.
