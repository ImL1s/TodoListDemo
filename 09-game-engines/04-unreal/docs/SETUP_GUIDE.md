# Unreal Engine 5 Setup Guide

A comprehensive guide to setting up your development environment for the Todo List UE5 project.

## Table of Contents

1. [Installing Unreal Engine 5](#installing-unreal-engine-5)
2. [Installing Visual Studio](#installing-visual-studio)
3. [Alternative IDEs](#alternative-ides)
4. [Project Setup](#project-setup)
5. [Generating Project Files](#generating-project-files)
6. [Compiling C++ Code](#compiling-c-code)
7. [Editor Basics](#editor-basics)
8. [First-Time Configuration](#first-time-configuration)
9. [Platform-Specific Setup](#platform-specific-setup)
10. [Troubleshooting Setup Issues](#troubleshooting-setup-issues)

---

## Installing Unreal Engine 5

### Via Epic Games Launcher (Recommended)

This is the easiest method for most users.

#### Step 1: Create Epic Games Account

1. Go to [Epic Games](https://www.epicgames.com/)
2. Click "Sign In" → "Sign Up"
3. Create account with email or social login
4. Verify your email address

#### Step 2: Download Epic Games Launcher

1. Visit [Epic Games Store](https://store.epicgames.com/en-US/download)
2. Download launcher for your OS:
   - Windows: `EpicInstaller.msi`
   - macOS: `EpicInstaller.dmg`
3. Run the installer
4. Sign in with your Epic Games account

#### Step 3: Install Unreal Engine 5

1. **Open Epic Games Launcher**
2. **Navigate to "Unreal Engine" tab** (left sidebar)
3. **Click "Library"** (top navigation)
4. **Click the "+" icon** next to "Engine Versions"
5. **Select version**:
   - Recommended: **5.3.x** (latest stable)
   - Minimum: **5.1.0**
6. **Click "Install"**
7. **Choose installation location**:
   - Windows: `C:\Program Files\Epic Games\UE_5.3\`
   - macOS: `/Users/Shared/Epic Games/UE_5.3/`
   - Requires: ~100-150 GB free space
8. **Select components** (optional):
   - ✅ Core Components (required)
   - ✅ Starter Content (optional, ~1 GB)
   - ✅ Templates and Feature Packs (optional)
   - ❌ Engine Source Code (optional, +20 GB, for advanced users)
9. **Click "Install"**
10. **Wait for installation**: 1-3 hours depending on internet speed

#### Step 4: Verify Installation

1. Installation complete when status shows "Launch"
2. Click "Launch" to test
3. Unreal Project Browser should open
4. Close it for now

### Via GitHub Source Code (Advanced)

For developers who need engine source access or custom modifications.

#### Prerequisites
- Git (with Git LFS)
- Visual Studio 2022 (Windows)
- Xcode 14+ (macOS)
- 150+ GB free space
- Epic Games account linked to GitHub

#### Steps

1. **Link Accounts**:
   - Visit [Epic Games Account](https://www.epicgames.com/account/connections)
   - Connect your GitHub account
   - You'll be added to Epic Games org on GitHub

2. **Clone Repository**:
   ```bash
   git clone -b 5.3 https://github.com/EpicGames/UnrealEngine.git
   cd UnrealEngine
   ```

3. **Setup Dependencies** (Windows):
   ```bash
   Setup.bat
   ```

4. **Generate Project Files** (Windows):
   ```bash
   GenerateProjectFiles.bat
   ```

5. **Build Engine**:
   - Open `UE5.sln` in Visual Studio
   - Set configuration to "Development Editor"
   - Build solution (2-6 hours)

6. **Run Editor**:
   ```bash
   Engine\Binaries\Win64\UnrealEditor.exe
   ```

---

## Installing Visual Studio

### Windows Setup

Visual Studio is the primary IDE for UE5 C++ development on Windows.

#### Step 1: Download Visual Studio

1. Go to [Visual Studio Downloads](https://visualstudio.microsoft.com/downloads/)
2. Choose:
   - **Visual Studio 2022 Community** (Free for individuals/small teams)
   - **Professional/Enterprise** (If you have a license)
3. Download the installer (`vs_community.exe`)

#### Step 2: Install Required Workloads

1. **Run installer**
2. **Select Workloads**:
   - ✅ **Game development with C++** (Primary workload)
     - Includes: MSVC compiler, Windows SDK, C++ tools
   - ✅ **.NET desktop development** (Optional, for tools)
3. **Click "Individual components" tab**
4. **Verify these are selected**:
   - ✅ MSVC v143 - VS 2022 C++ x64/x86 build tools (latest)
   - ✅ C++ profiling tools
   - ✅ C++ AddressSanitizer
   - ✅ Windows 10 SDK (10.0.19041.0 or later)
   - ✅ .NET 6.0 Runtime
   - ✅ NuGet package manager
5. **Installation location**:
   - Default: `C:\Program Files\Microsoft Visual Studio\2022\Community`
   - Requires: ~20-30 GB
6. **Click "Install"**
7. **Wait**: 30-60 minutes

#### Step 3: Configure Visual Studio for UE5

1. **Launch Visual Studio**
2. **Tools → Options → Text Editor → C/C++ → Formatting**
   - Set formatting to match UE coding standards (optional)
3. **Tools → Options → Projects and Solutions → Build and Run**
   - Set "maximum number of parallel project builds" to number of CPU cores
4. **Install Extensions** (Optional but recommended):
   - UnrealVS Extension (for UE-specific features)
   - Visual Assist (Paid, for better IntelliSense)

### macOS Setup

Xcode is the primary IDE for macOS UE5 development.

#### Step 1: Install Xcode

1. **Open App Store**
2. **Search for "Xcode"**
3. **Click "Get" then "Install"**
   - Free download
   - Requires: ~15 GB
4. **Wait for installation**: 30-60 minutes

#### Step 2: Install Command Line Tools

```bash
xcode-select --install
```

#### Step 3: Accept License Agreement

1. Open Xcode
2. Accept license agreement
3. Close Xcode

### Linux Setup

Linux requires building UE5 from source (no binary distribution).

#### Prerequisites

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install build-essential clang mono-mcs mono-devel mono-xbuild \
  mono-dmcs mono-reference-assemblies-4.0 libqt4-dev git-lfs

# Fedora
sudo dnf install gcc gcc-c++ make clang mono-devel qt-devel git-lfs
```

#### Recommended IDEs
- **Visual Studio Code** (with C++ extensions)
- **CLion** (Commercial, JetBrains)
- **Qt Creator**

---

## Alternative IDEs

### Rider for Unreal Engine

JetBrains Rider is a powerful cross-platform IDE with excellent Unreal support.

#### Installation

1. Download from [JetBrains Rider](https://www.jetbrains.com/rider/)
2. Install for your platform
3. Install "Unreal Engine Support" plugin
4. Configure Rider as default editor:
   - Edit → Editor Preferences → General → Source Code
   - Select "Rider" from dropdown

#### Advantages
- ✅ Superior code navigation and refactoring
- ✅ Better IntelliSense than Visual Studio
- ✅ Cross-platform
- ✅ Built-in Blueprint viewer

#### Disadvantages
- ❌ Commercial license required ($149/year for individuals)
- ❌ Slightly slower than Visual Studio on Windows

### Visual Studio Code

Free, lightweight, cross-platform alternative.

#### Setup

1. **Install VS Code**: [Download here](https://code.visualstudio.com/)

2. **Install Extensions**:
   - C/C++ (Microsoft)
   - C/C++ Extension Pack
   - Unreal Engine 4 Snippets
   - Unreal.js (for enhanced support)

3. **Configure Workspace**:
   ```json
   // .vscode/c_cpp_properties.json
   {
     "configurations": [
       {
         "name": "Win32",
         "includePath": [
           "${workspaceFolder}/**",
           "C:/Program Files/Epic Games/UE_5.3/Engine/Source/**"
         ],
         "defines": ["_DEBUG", "UNICODE", "_UNICODE"],
         "compilerPath": "C:/Program Files/Microsoft Visual Studio/2022/Community/VC/Tools/MSVC/14.XX/bin/Hostx64/x64/cl.exe",
         "cStandard": "c17",
         "cppStandard": "c++17",
         "intelliSenseMode": "windows-msvc-x64"
       }
     ]
   }
   ```

4. **Build Tasks**:
   ```json
   // .vscode/tasks.json
   {
     "version": "2.0.0",
     "tasks": [
       {
         "label": "Build TodoListUE",
         "type": "shell",
         "command": "\"C:/Program Files/Epic Games/UE_5.3/Engine/Build/BatchFiles/Build.bat\"",
         "args": [
           "TodoListUEEditor",
           "Win64",
           "Development",
           "-Project=\"${workspaceFolder}/TodoListUE.uproject\"",
           "-WaitMutex"
         ],
         "group": {
           "kind": "build",
           "isDefault": true
         }
       }
     ]
   }
   ```

#### Advantages
- ✅ Free and open source
- ✅ Cross-platform
- ✅ Lightweight and fast
- ✅ Excellent Git integration

#### Disadvantages
- ❌ IntelliSense not as robust as Visual Studio
- ❌ No native debugging of UE projects (requires workarounds)
- ❌ Less integrated with UE workflow

---

## Project Setup

### Cloning the Repository

#### Using Git

```bash
# HTTPS
git clone https://github.com/your-username/TodoListDemo.git

# SSH
git clone git@github.com:your-username/TodoListDemo.git

# Navigate to project
cd TodoListDemo/09-game-engines/04-unreal
```

#### Using GitHub Desktop

1. Open GitHub Desktop
2. File → Clone Repository
3. Enter repository URL
4. Choose local path
5. Click "Clone"

### Download ZIP (No Git)

1. Go to repository on GitHub
2. Click "Code" → "Download ZIP"
3. Extract to desired location
4. Navigate to `09-game-engines/04-unreal`

---

## Generating Project Files

Project files (.sln, .vcxproj, .xcworkspace) are platform-specific and not stored in Git. You must generate them.

### Windows

#### Method 1: Right-Click (Easiest)

1. Navigate to project folder
2. Right-click `TodoListUE.uproject`
3. Select **"Generate Visual Studio project files"**
4. Wait 10-30 seconds
5. `TodoListUE.sln` will appear in the folder

#### Method 2: Command Line

```bash
cd /path/to/TodoListDemo/09-game-engines/04-unreal

# Using UBT (Unreal Build Tool)
"C:\Program Files\Epic Games\UE_5.3\Engine\Build\BatchFiles\GenerateProjectFiles.bat" -project="TodoListUE.uproject" -game -engine
```

#### Method 3: Via Epic Launcher

1. Open Epic Games Launcher
2. Library → My Projects
3. Add existing project (browse to .uproject)
4. Right-click project → Generate Visual Studio files

### macOS

#### Method 1: Right-Click

1. Navigate to project folder in Finder
2. Right-click `TodoListUE.uproject`
3. Select **"Services" → "Generate Xcode Project"**
4. `TodoListUE.xcworkspace` will appear

#### Method 2: Command Line

```bash
cd /path/to/TodoListDemo/09-game-engines/04-unreal

# Using UBT
/Users/Shared/Epic\ Games/UE_5.3/Engine/Build/BatchFiles/Mac/GenerateProjectFiles.sh -project="$(pwd)/TodoListUE.uproject" -game -engine
```

### Linux

```bash
cd /path/to/TodoListDemo/09-game-engines/04-unreal

# Using UBT
~/UnrealEngine/Engine/Build/BatchFiles/Linux/GenerateProjectFiles.sh -project="$(pwd)/TodoListUE.uproject" -game -engine
```

### Troubleshooting Generation

**Error: "Project file is out of date"**
- Delete `.sln`, `.vcxproj`, and `Intermediate` folder
- Regenerate

**Error: "Unable to generate files"**
- Verify UE5 installation
- Check .uproject syntax (JSON validation)
- Ensure write permissions in project folder

---

## Compiling C++ Code

### First-Time Compilation

The first compile will take longer (5-15 minutes) as it builds all modules.

#### Windows - Visual Studio

1. **Open** `TodoListUE.sln`
2. **Set Configuration**:
   - Configuration: **Development Editor**
   - Platform: **Win64**
3. **Set Startup Project**:
   - Right-click "TodoListUE" in Solution Explorer
   - "Set as Startup Project"
4. **Build**:
   - Build → Build Solution (Ctrl+Shift+B)
   - Or right-click project → Build
5. **Monitor Output**:
   - View → Output (Ctrl+Alt+O)
   - Watch for errors/warnings
6. **Success Indicator**:
   - Output: "Build succeeded" with 0 errors

#### macOS - Xcode

1. **Open** `TodoListUE.xcworkspace`
2. **Select Scheme**:
   - Scheme dropdown → "TodoListUEEditor - Mac"
3. **Build**:
   - Product → Build (Cmd+B)
4. **Monitor Progress**:
   - View → Navigators → Report Navigator
   - Check for errors
5. **Success Indicator**:
   - "Build Succeeded" notification

#### From Unreal Editor

1. **Open Unreal Editor**
2. **Open Project** (TodoListUE.uproject)
3. **Compile**:
   - File → Refresh Visual Studio Project (if needed)
   - File → Compile C++ Code
   - Or click "Compile" button in toolbar
4. **Wait for Compilation**:
   - Progress bar appears
   - Output Log shows compilation status
5. **Hot Reload**:
   - Changes apply without restarting editor (usually)

### Iterative Compilation

After initial build, recompiling is much faster (10-60 seconds).

#### Live Coding (UE5 Feature)

1. Enable: Editor Preferences → General → Live Coding
2. Make C++ code changes
3. Save files
4. Click "Live Coding" button in editor
5. Changes compile and hot-reload automatically

**Note**: Live Coding has limitations with major structural changes.

### Build Configurations

| Configuration | Use Case | Optimization | Debug Info |
|--------------|----------|--------------|------------|
| **Development Editor** | Day-to-day development | Moderate | Yes |
| **Debug Editor** | Deep debugging | None | Full |
| **Shipping** | Final packaged build | Maximum | Minimal |
| **DebugGame** | Packaged debug build | Low | Yes |

### Clean Build

When things go wrong, perform a clean build:

1. **Close Unreal Editor**
2. **Delete Folders**:
   - `Binaries/`
   - `Intermediate/`
   - `Saved/`
   - `.vs/` (Windows)
   - `DerivedDataCache/`
3. **Regenerate Project Files**
4. **Rebuild** in Visual Studio/Xcode

---

## Editor Basics

### First Launch

1. **Open TodoListUE.uproject**
   - Double-click the file
   - Or: Epic Launcher → Library → Browse → Open project
2. **Wait for Shader Compilation**:
   - First launch: 5-20 minutes
   - Progress shown in bottom-right
   - You can work while shaders compile, but performance may suffer
3. **Editor Opens**:
   - Main viewport in center
   - Content Browser at bottom
   - Details panel on right
   - World Outliner on right

### Editor Layout

```
┌─────────────────────────────────────────────────────────┐
│  Menu Bar: File, Edit, Window, Tools, Help              │
├─────────────────────────────────────────────────────────┤
│  Toolbar: Play, Compile, Build, etc.                    │
├────────────┬─────────────────────────────┬──────────────┤
│            │                             │  World       │
│  Modes     │    Viewport (3D View)       │  Outliner    │
│  Panel     │                             │              │
│            │                             ├──────────────┤
│            │                             │  Details     │
│            │                             │  Panel       │
├────────────┴─────────────────────────────┴──────────────┤
│  Content Browser                                        │
│  (Shows all assets)                                     │
├─────────────────────────────────────────────────────────┤
│  Output Log                                             │
└─────────────────────────────────────────────────────────┘
```

### Key Editor Windows

#### Content Browser
- **Location**: Bottom panel
- **Purpose**: Browse and manage all project assets
- **Navigation**:
  - Folders on left
  - Assets on right
  - Search box at top
- **Creating Assets**:
  - Right-click → New → [Asset Type]
  - Drag and drop to organize

#### Details Panel
- **Location**: Right side
- **Purpose**: Edit properties of selected asset/actor
- **Features**:
  - All UPROPERTY fields appear here
  - Editable in real-time
  - Search/filter properties

#### World Outliner
- **Location**: Top-right
- **Purpose**: Hierarchical list of all actors in level
- **Usage**:
  - Click to select actors
  - Drag to re-parent
  - Eye icon to toggle visibility

#### Output Log
- **Location**: Bottom (Window → Developer Tools → Output Log)
- **Purpose**: Shows all log messages
- **Features**:
  - Filter by category (LogTemp, LogTodo, etc.)
  - Filter by verbosity (Log, Warning, Error)
  - Search text

### Opening Blueprints

1. **Content Browser** → `Content/Blueprints/`
2. **Double-click** `BP_TodoGameMode`
3. **Blueprint Editor Opens**:
   - Event Graph (visual scripting)
   - Components panel (for Actor Blueprints)
   - My Blueprint (variables, functions, macros)
   - Details panel

### Opening Widgets

1. **Content Browser** → `Content/UI/`
2. **Double-click** `WBP_MainMenu`
3. **Widget Designer Opens**:
   - **Designer Tab**: Visual layout editor
   - **Graph Tab**: Blueprint event graph
   - **Hierarchy**: Widget tree structure
   - **Details**: Selected widget properties

### Playing in Editor (PIE)

1. **Click "Play" button** (green play icon)
   - Or press **Alt+P**
2. **Game starts in viewport**
3. **Interact with UI**
4. **Stop**: Click "Stop" button or press **Esc**

**Play Modes**:
- **Selected Viewport**: Plays in main editor viewport
- **New Editor Window**: Opens separate window (better for UI testing)
- **Standalone Game**: Launches as separate process

Configure: Editor Preferences → Play → Play in Editor

---

## First-Time Configuration

### Project Settings

1. **Edit → Project Settings**

2. **Game → Maps & Modes**:
   - **Game Default Map**: `/Game/Maps/MainMenu`
   - **Editor Startup Map**: `/Game/Maps/MainMenu`
   - **Default GameMode**: `BP_TodoGameMode`

3. **Engine → Input**:
   - Configure keyboard bindings (if needed)
   - Default mappings work for this project

4. **Engine → Rendering**:
   - **Default RHI**: DirectX 12 (Windows), Metal (macOS), Vulkan (Linux)

5. **Project → Description**:
   - Set project name, description, company name

### Editor Preferences

1. **Edit → Editor Preferences**

2. **General → Performance**:
   - ❌ **Use Less CPU when in Background** (disable for better responsiveness)
   - ✅ **Use Less CPU when not Foreground** (enable for battery saving)

3. **General → Loading & Saving**:
   - ✅ **Auto-save Enabled**
   - **Auto-save Interval**: 10 minutes

4. **General → Blueprints**:
   - ✅ **Compile on Save**

5. **General → Source Code**:
   - **Source Code Editor**: Visual Studio 2022 (or your IDE)

### Creating a Main Menu Map

The project expects a main menu map. If it doesn't exist, create it:

1. **File → New Level**
2. **Choose "Empty Level"**
3. **Save**: `Content/Maps/MainMenu`
4. **Add Level Blueprint**:
   - Blueprints → Open Level Blueprint
   - Add this graph:
     ```
     Event BeginPlay
       └─> Get Player Controller (Index 0)
           └─> Set Show Mouse Cursor (True)
           └─> Set Input Mode UIOnly
               └─> Create Widget (WBP_MainMenu)
                   └─> Add to Viewport (ZOrder = 0)
     ```
5. **Save Level**

---

## Platform-Specific Setup

### Windows-Specific Configuration

#### DirectX 12 vs DirectX 11

- **DX12**: Better performance, required for latest features
- **DX11**: Broader compatibility with older GPUs

Change: Project Settings → Platforms → Windows → Default RHI

#### Windows SDK Version

If you encounter SDK errors:
1. Visual Studio Installer
2. Modify installation
3. Individual Components
4. Install missing Windows SDK version
5. Or: Project Properties → General → Windows SDK Version → Latest installed

### macOS-Specific Configuration

#### Metal API

Ensure Metal is enabled:
- Project Settings → Platforms → Mac → Targeted RHI → Default

#### Code Signing

For packaged builds, you need an Apple Developer account:
1. Xcode → Preferences → Accounts
2. Add Apple ID
3. Project Settings → Platforms → Mac → Build → Signing Certificate

### Linux-Specific Configuration

#### Vulkan

Ensure Vulkan drivers are installed:

```bash
# Check Vulkan support
vulkaninfo

# Ubuntu: Install Vulkan
sudo apt install vulkan-tools libvulkan-dev
```

#### Running Packaged Build

```bash
chmod +x TodoListUE.sh
./TodoListUE.sh
```

---

## Troubleshooting Setup Issues

### Compilation Errors

**Error: "Cannot open include file: 'SomeHeader.h'"**
- **Cause**: Missing module dependency
- **Fix**: Add module to `TodoListUE.Build.cs`:
  ```csharp
  PublicDependencyModuleNames.AddRange(new string[] {
      "Core", "CoreUObject", "Engine", "UMG", "MissingModule"
  });
  ```

**Error: "Unresolved external symbol"**
- **Cause**: Function declared but not defined
- **Fix**: Implement the function in .cpp file, or add `TODOLISTUE_API` to class declaration

**Error: "Incompatible with precompiled header"**
- **Cause**: PCH issues
- **Fix**: Clean build (delete Intermediate, Binaries, rebuild)

### Editor Crashes

**Crash on Startup**
- **Cause**: Corrupted config or shaders
- **Fix**: Delete `Saved/` and `Intermediate/ShaderCache/`, relaunch

**Crash When Opening Blueprint**
- **Cause**: Blueprint corruption
- **Fix**: Restore from source control or recreate Blueprint

**Random Crashes**
- **Cause**: Various (GPU driver, memory, bugs)
- **Fix**:
  1. Update GPU drivers
  2. Verify project files (Epic Launcher → Library → Project → Verify)
  3. Increase virtual memory (Windows: System → Advanced → Performance Settings)

### Performance Issues

**Slow Editor**
- Disable real-time rendering: Viewport → Realtime (uncheck)
- Reduce viewport quality: Viewport → Engine Scalability Settings → Low
- Close unnecessary editor windows

**Slow Compilation**
- Enable "Use Parallel Build" in Visual Studio
- Increase parallel projects: Tools → Options → Projects → Build → Maximum parallel projects

### Asset Issues

**Missing Assets**
- **Cause**: Assets not committed to Git or not downloaded
- **Fix**: Check `.gitignore`, ensure Git LFS is configured

**Textures Not Loading**
- **Cause**: DerivedDataCache corruption
- **Fix**: Delete `DerivedDataCache/` folder, restart editor

---

## Next Steps

Once setup is complete:

1. ✅ Verify project opens in UE Editor
2. ✅ Verify C++ code compiles
3. ✅ Test Play-in-Editor (PIE)
4. ✅ Open and inspect Blueprints
5. 📖 Read [CPP_BLUEPRINT_GUIDE.md](./CPP_BLUEPRINT_GUIDE.md) for C++/Blueprint integration
6. 📖 Read [UMG_GUIDE.md](./UMG_GUIDE.md) for UI development
7. 📖 Read [ARCHITECTURE.md](./ARCHITECTURE.md) for system design

---

**Setup Complete!** 🎉

You're now ready to develop and extend the Todo List application.

For questions or issues, consult the [Troubleshooting](#troubleshooting-setup-issues) section or open a GitHub issue.
