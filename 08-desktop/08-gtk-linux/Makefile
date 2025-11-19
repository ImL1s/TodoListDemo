# Makefile for GTK Todo List Application
# Simple build system alternative to Meson

# Compiler and flags
CC = gcc
CFLAGS = `pkg-config --cflags gtk4 json-glib-1.0` -Wall -Wextra -std=c11 -I./src
CFLAGS += -DGETTEXT_PACKAGE=\"todolist-gtk\" -DLOCALEDIR=\"/usr/local/share/locale\"
LIBS = `pkg-config --libs gtk4 json-glib-1.0`

# Directories
SRC_DIR = src
BUILD_DIR = build
BIN_DIR = bin

# Source files
SOURCES = $(SRC_DIR)/main.c \
          $(SRC_DIR)/todo_item.c \
          $(SRC_DIR)/todo_model.c \
          $(SRC_DIR)/todo_row.c \
          $(SRC_DIR)/todo_window.c \
          $(SRC_DIR)/storage.c

# Object files
OBJECTS = $(patsubst $(SRC_DIR)/%.c,$(BUILD_DIR)/%.o,$(SOURCES))

# Target executable
TARGET = $(BIN_DIR)/todolist-gtk

# Default target
all: directories $(TARGET)

# Create necessary directories
directories:
	@mkdir -p $(BUILD_DIR)
	@mkdir -p $(BIN_DIR)

# Link
$(TARGET): $(OBJECTS)
	@echo "Linking $@..."
	@$(CC) -o $@ $^ $(LIBS)
	@echo "Build complete: $@"

# Compile
$(BUILD_DIR)/%.o: $(SRC_DIR)/%.c
	@echo "Compiling $<..."
	@$(CC) $(CFLAGS) -c $< -o $@

# Run
run: all
	@./$(TARGET)

# Clean
clean:
	@echo "Cleaning build files..."
	@rm -rf $(BUILD_DIR) $(BIN_DIR)
	@echo "Clean complete."

# Install
install: all
	@echo "Installing to /usr/local/bin..."
	@install -m 755 $(TARGET) /usr/local/bin/
	@echo "Installation complete."

# Uninstall
uninstall:
	@echo "Uninstalling..."
	@rm -f /usr/local/bin/todolist-gtk
	@echo "Uninstall complete."

# Check dependencies
check-deps:
	@echo "Checking dependencies..."
	@pkg-config --exists gtk4 || (echo "Error: GTK4 not found" && exit 1)
	@pkg-config --exists json-glib-1.0 || (echo "Error: json-glib not found" && exit 1)
	@echo "All dependencies found."

# Debug build
debug: CFLAGS += -g -O0 -DDEBUG
debug: clean all

# Release build
release: CFLAGS += -O2 -DNDEBUG
release: clean all

# Help
help:
	@echo "GTK Todo List Makefile"
	@echo ""
	@echo "Targets:"
	@echo "  all          - Build the application (default)"
	@echo "  run          - Build and run the application"
	@echo "  clean        - Remove build files"
	@echo "  install      - Install to /usr/local/bin"
	@echo "  uninstall    - Remove from /usr/local/bin"
	@echo "  check-deps   - Check for required dependencies"
	@echo "  debug        - Build with debug symbols"
	@echo "  release      - Build optimized release version"
	@echo "  help         - Show this help message"

.PHONY: all directories run clean install uninstall check-deps debug release help
