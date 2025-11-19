# Troubleshooting Guide

Common issues and solutions for building and running the Bevy Todo List application.

## Table of Contents

1. [Compilation Issues](#compilation-issues)
2. [Runtime Issues](#runtime-issues)
3. [Performance Issues](#performance-issues)
4. [Platform-Specific Issues](#platform-specific-issues)
5. [Development Tools](#development-tools)

## Compilation Issues

### Issue: Missing System Libraries (Linux)

**Error:**
```
error: failed to run custom build command for `alsa-sys`
The system library `alsa` required by crate `alsa-sys` was not found.
```

or

```
error: failed to run custom build command for `libudev-sys`
The system library `libudev` required by crate `libudev-sys` was not found.
```

**Solution for Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install -y \
    g++ \
    pkg-config \
    libx11-dev \
    libasound2-dev \
    libudev-dev \
    libxcb-render0-dev \
    libxcb-shape0-dev \
    libxcb-xfixes0-dev
```

**Solution for Fedora:**
```bash
sudo dnf install gcc-c++ libX11-devel alsa-lib-devel systemd-devel
```

**Solution for Arch Linux:**
```bash
sudo pacman -S base-devel libx11 alsa-lib systemd
```

### Issue: Rust Version Too Old

**Error:**
```
error: package requires rustc 1.75 or newer
```

**Solution:**
Update Rust to the latest stable version:
```bash
rustup update stable
```

### Issue: Cargo Lock File Conflicts

**Error:**
```
error: failed to select a version for the requirement
```

**Solution:**
Delete the lock file and regenerate it:
```bash
rm Cargo.lock
cargo build
```

### Issue: Feature Conflicts

**Error:**
```
error: feature `xxx` is required by `yyy` but not declared
```

**Solution:**
Make sure you're using the correct feature flags. For desktop builds:
```bash
cargo build --features desktop
```

For headless/CI environments, you may need to disable certain features.

## Runtime Issues

### Issue: Window Doesn't Open

**Symptoms:**
- Application starts but no window appears
- Application exits immediately

**Solutions:**

1. **Check Graphics Drivers:**
   ```bash
   # Linux - Update graphics drivers
   sudo ubuntu-drivers autoinstall  # Ubuntu
   sudo dnf update                  # Fedora
   ```

2. **Verify Display Server:**
   ```bash
   # Check if X11 or Wayland is running
   echo $XDG_SESSION_TYPE

   # If using Wayland, try forcing X11
   export GDK_BACKEND=x11
   cargo run
   ```

3. **Check Console Output:**
   Look for error messages in the terminal output that might indicate what's wrong.

### Issue: Todos Not Saving

**Symptoms:**
- Todos disappear when application closes
- "Failed to save" errors in console

**Solutions:**

1. **Check File Permissions:**
   ```bash
   # Ensure the storage directory is writable
   ls -la ~/.bevy_todos/
   chmod 755 ~/.bevy_todos/
   ```

2. **Check Disk Space:**
   ```bash
   df -h ~
   ```

3. **Manually Test Storage:**
   ```bash
   # Try to create a file in the storage location
   mkdir -p ~/.bevy_todos/
   touch ~/.bevy_todos/test.txt
   ```

### Issue: Application Crashes on Startup

**Symptoms:**
- Immediate crash with backtrace
- Segmentation fault

**Solutions:**

1. **Enable Debug Logging:**
   ```bash
   RUST_LOG=debug cargo run
   ```

2. **Run with Backtrace:**
   ```bash
   RUST_BACKTRACE=full cargo run
   ```

3. **Check for Corrupt Save File:**
   ```bash
   # Backup and remove the save file
   mv ~/.bevy_todos/todos.json ~/.bevy_todos/todos.json.bak
   cargo run
   ```

## Performance Issues

### Issue: Low FPS / Lag

**Symptoms:**
- Application feels slow or choppy
- FPS below 30

**Solutions:**

1. **Always Use Release Mode:**
   ```bash
   cargo run --release
   ```

   Debug builds are significantly slower!

2. **Check System Resources:**
   ```bash
   # Linux
   htop

   # Check GPU usage (NVIDIA)
   nvidia-smi
   ```

3. **Enable Performance Logging:**
   Press `F1` to enable debug mode and check FPS in console output.

4. **Reduce Window Size:**
   Edit `main.rs` and reduce the window resolution:
   ```rust
   resolution: WindowResolution::new(600.0, 700.0),
   ```

### Issue: High Memory Usage

**Symptoms:**
- Application uses excessive RAM
- System becomes sluggish

**Solutions:**

1. **Check for Memory Leaks:**
   ```bash
   # Run with memory profiling
   cargo build --release
   valgrind --leak-check=full ./target/release/todolist-bevy
   ```

2. **Limit Todo Count:**
   The current implementation rebuilds the entire UI on changes. With 1000+ todos, this can be memory-intensive.

## Platform-Specific Issues

### Linux

#### Issue: Wayland Compatibility

**Solution:**
```bash
# Force X11 backend
export GDK_BACKEND=x11
cargo run
```

Or modify `Cargo.toml` to use Wayland features:
```toml
bevy = { version = "0.12", features = ["wayland"] }
```

#### Issue: Audio Errors

**Error:**
```
ALSA lib ... Unknown PCM
```

**Solution:**
These warnings are usually harmless. To suppress them, disable audio features:
```bash
# Run without audio
cargo run --no-default-features --features bevy/x11
```

### macOS

#### Issue: Code Signing Errors

**Solution:**
```bash
# Remove quarantine attribute
xattr -cr target/release/todolist-bevy
```

#### Issue: Metal Backend Issues

**Solution:**
Update to the latest macOS and Xcode command-line tools:
```bash
xcode-select --install
softwareupdate --install -a
```

### Windows

#### Issue: MSVC Linker Errors

**Error:**
```
error: linker `link.exe` not found
```

**Solution:**
Install Visual Studio 2019 or later with C++ support, or use the GNU toolchain:
```bash
rustup default stable-gnu
```

#### Issue: DLL Not Found

**Solution:**
Ensure all required DLLs are in the PATH or copy them to the executable directory.

## Development Tools

### Running Tests

```bash
# Run all tests
cargo test

# Run tests with output
cargo test -- --nocapture

# Run specific test
cargo test test_add_todo

# Run tests in release mode (faster)
cargo test --release
```

### Running Clippy

```bash
# Check for lints
cargo clippy

# Auto-fix some issues
cargo clippy --fix

# Strict mode (fail on warnings)
cargo clippy -- -D warnings
```

### Checking Code Format

```bash
# Check formatting
cargo fmt --check

# Auto-format code
cargo fmt
```

### Building Documentation

```bash
# Generate and open documentation
cargo doc --open

# Include private items
cargo doc --document-private-items --open
```

### Profiling Performance

```bash
# Install profiling tools
cargo install cargo-flamegraph

# Generate flame graph
cargo flamegraph

# Profile specific scenario
cargo flamegraph --example my_scenario
```

### Analyzing Binary Size

```bash
# Install cargo-bloat
cargo install cargo-bloat

# Analyze what's taking up space
cargo bloat --release

# Analyze specific crate
cargo bloat --release --crates
```

### Checking Dependencies

```bash
# Install cargo-tree
cargo install cargo-tree

# View dependency tree
cargo tree

# View dependencies of a specific crate
cargo tree -p bevy
```

### Security Audit

```bash
# Install cargo-audit
cargo install cargo-audit

# Check for vulnerabilities
cargo audit

# Fix vulnerabilities automatically
cargo audit fix
```

## Getting Help

If you're still experiencing issues:

1. **Check the Logs:**
   - Enable debug mode with `F1`
   - Check console output for error messages

2. **Search Existing Issues:**
   - [Bevy Issue Tracker](https://github.com/bevyengine/bevy/issues)
   - Project issue tracker (if available)

3. **Ask for Help:**
   - [Bevy Discord](https://discord.gg/bevy)
   - [Rust Users Forum](https://users.rust-lang.org/)
   - [r/rust on Reddit](https://www.reddit.com/r/rust/)

4. **File a Bug Report:**
   When filing a bug report, include:
   - Rust version (`rustc --version`)
   - OS and version
   - Bevy version
   - Full error message or stack trace
   - Steps to reproduce
   - Relevant code snippets

## Additional Resources

- [Bevy Troubleshooting Guide](https://bevyengine.org/learn/book/troubleshooting/)
- [Rust Error Index](https://doc.rust-lang.org/error-index.html)
- [Bevy Cheat Book](https://bevy-cheatbook.github.io/)
