# WebAssembly (WASM) Deployment Guide

Complete guide to building and deploying the Bevy Todo List as a web application using WebAssembly.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Build Process](#build-process)
4. [Deployment Options](#deployment-options)
5. [Optimization](#optimization)
6. [Troubleshooting](#troubleshooting)

## Overview

The Bevy Todo List can be compiled to WebAssembly and run in web browsers, enabling cross-platform deployment without installation.

### Benefits of WASM Deployment

- **No Installation Required:** Users can run the app directly in their browser
- **Cross-Platform:** Works on any device with a modern web browser
- **Easy Distribution:** Just share a URL
- **Automatic Updates:** Users always get the latest version

### Limitations

- **File System Access:** Limited due to browser sandboxing
  - Todos are stored in browser localStorage instead of files
- **Performance:** Slightly slower than native builds
- **Size:** WASM binaries can be large (several MB)
- **Browser Compatibility:** Requires modern browser with WebGL2 support

## Prerequisites

### 1. Install WASM Target

```bash
rustup target add wasm32-unknown-unknown
```

### 2. Install wasm-bindgen-cli

```bash
cargo install wasm-bindgen-cli
```

### 3. Install wasm-opt (Optional, for optimization)

```bash
# Linux
sudo apt-get install binaryen

# macOS
brew install binaryen

# Or via cargo
cargo install wasm-opt
```

### 4. Install a Local Web Server

```bash
# Option 1: basic-http-server (simple)
cargo install basic-http-server

# Option 2: miniserve (feature-rich)
cargo install miniserve

# Option 3: Python (if already installed)
# No installation needed
```

## Build Process

### Step 1: Build for WASM

```bash
# Build in release mode for better performance
cargo build --release --target wasm32-unknown-unknown
```

This creates a `.wasm` file in `target/wasm32-unknown-unknown/release/`.

### Step 2: Generate JavaScript Bindings

```bash
# Generate bindings in the 'wasm' directory
wasm-bindgen --out-dir ./wasm \
  --target web \
  target/wasm32-unknown-unknown/release/todolist-bevy.wasm
```

This creates:
- `wasm/todolist-bevy.js` - JavaScript glue code
- `wasm/todolist-bevy_bg.wasm` - Optimized WASM binary

### Step 3: Create HTML File

Create `wasm/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bevy Todo List - WASM</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #1a1a1a;
            font-family: Arial, sans-serif;
        }

        #loading {
            color: white;
            text-align: center;
        }

        #error {
            color: #ff6b6b;
            text-align: center;
            padding: 20px;
        }

        canvas {
            display: block;
            max-width: 100%;
            max-height: 100vh;
        }
    </style>
</head>
<body>
    <div id="loading">
        <h1>Bevy Todo List</h1>
        <p>Loading...</p>
    </div>

    <script type="module">
        import init from './todolist-bevy.js';

        async function run() {
            try {
                // Initialize the WASM module
                await init();

                // Hide loading message
                document.getElementById('loading').style.display = 'none';

                console.log('Bevy Todo List WASM loaded successfully!');
            } catch (error) {
                console.error('Failed to load WASM:', error);
                document.getElementById('loading').innerHTML = `
                    <div id="error">
                        <h1>Error Loading Application</h1>
                        <p>${error.message}</p>
                        <p>Please make sure you're using a modern web browser with WebGL2 support.</p>
                    </div>
                `;
            }
        }

        run();
    </script>
</body>
</html>
```

### Step 4: Serve Locally

```bash
# Option 1: basic-http-server
cd wasm
basic-http-server .

# Option 2: miniserve
miniserve ./wasm --index index.html

# Option 3: Python
cd wasm
python3 -m http.server 8080
```

Open your browser to `http://localhost:8080` (or the port shown).

## Deployment Options

### Option 1: GitHub Pages

1. **Create `wasm` directory** with built files
2. **Push to GitHub:**
   ```bash
   git add wasm/
   git commit -m "Add WASM build"
   git push
   ```

3. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Select branch and `/wasm` folder
   - Save

4. **Access at:** `https://yourusername.github.io/yourrepo/`

### Option 2: Netlify

1. **Build the WASM files** as described above
2. **Create `netlify.toml`:**
   ```toml
   [build]
     publish = "wasm"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

3. **Deploy:**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli

   # Deploy
   netlify deploy --prod
   ```

### Option 3: Vercel

1. **Build WASM files**
2. **Create `vercel.json`:**
   ```json
   {
     "buildCommand": "cargo build --release --target wasm32-unknown-unknown && wasm-bindgen --out-dir ./wasm --target web target/wasm32-unknown-unknown/release/todolist-bevy.wasm",
     "outputDirectory": "wasm",
     "framework": null
   }
   ```

3. **Deploy:**
   ```bash
   # Install Vercel CLI
   npm install -g vercel

   # Deploy
   vercel --prod
   ```

### Option 4: Static Web Host (Apache/Nginx)

**Apache `.htaccess`:**
```apache
# Enable CORS
<IfModule mod_headers.c>
    Header set Cross-Origin-Embedder-Policy "require-corp"
    Header set Cross-Origin-Opener-Policy "same-origin"
</IfModule>

# Set correct MIME types
<IfModule mod_mime.c>
    AddType application/wasm .wasm
</IfModule>

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE application/wasm
    AddOutputFilterByType DEFLATE application/javascript
</IfModule>
```

**Nginx Configuration:**
```nginx
location / {
    # Enable CORS headers
    add_header Cross-Origin-Embedder-Policy "require-corp";
    add_header Cross-Origin-Opener-Policy "same-origin";

    # Set correct MIME type for WASM
    types {
        application/wasm wasm;
    }

    # Enable gzip compression
    gzip on;
    gzip_types application/wasm application/javascript;
}
```

## Optimization

### 1. Optimize WASM Binary Size

**Using `wasm-opt`:**
```bash
# After wasm-bindgen, optimize the .wasm file
wasm-opt -Oz -o wasm/todolist-bevy_bg_opt.wasm wasm/todolist-bevy_bg.wasm
mv wasm/todolist-bevy_bg_opt.wasm wasm/todolist-bevy_bg.wasm
```

**Using Cargo Profile:**

Add to `Cargo.toml`:
```toml
[profile.wasm-release]
inherits = "release"
opt-level = "z"     # Optimize for size
lto = true          # Link-time optimization
codegen-units = 1   # Better optimization
panic = "abort"     # Smaller binary
strip = true        # Remove debug symbols
```

Build with:
```bash
cargo build --profile wasm-release --target wasm32-unknown-unknown
```

### 2. Enable Compression

**Brotli Compression (Best):**
```bash
# Install brotli
sudo apt-get install brotli  # Linux
brew install brotli           # macOS

# Compress WASM file
brotli -o wasm/todolist-bevy_bg.wasm.br wasm/todolist-bevy_bg.wasm

# Server must be configured to serve .br files
```

**Gzip Compression:**
```bash
gzip -9 -k wasm/todolist-bevy_bg.wasm
# Creates todolist-bevy_bg.wasm.gz
```

### 3. Lazy Loading

Split large assets and load them on demand:

```javascript
// In index.html
async function loadApp() {
    // Show loading screen
    showLoading();

    // Load WASM module
    const module = await init();

    // Load additional resources
    await loadAssets();

    // Hide loading, show app
    hideLoading();
}
```

### 4. Caching Strategy

**Service Worker for Caching:**

Create `sw.js`:
```javascript
const CACHE_NAME = 'bevy-todo-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/todolist-bevy.js',
    '/todolist-bevy_bg.wasm'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
```

Register in `index.html`:
```javascript
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
}
```

## Troubleshooting

### Issue: "RuntimeError: unreachable" in Browser

**Cause:** Panic in Rust code

**Solution:**
- Enable console logging
- Check browser console for panic messages
- Build with debug symbols: `cargo build --target wasm32-unknown-unknown`

### Issue: WASM File Not Loading

**Cause:** MIME type not set correctly

**Solution:**
- Ensure server sends `Content-Type: application/wasm`
- Use a proper web server (not `file://` protocol)

### Issue: Very Slow Performance

**Cause:** Debug build

**Solution:**
```bash
# Always use --release for WASM
cargo build --release --target wasm32-unknown-unknown
```

### Issue: Out of Memory

**Cause:** WASM has a memory limit

**Solution:**
- Reduce texture sizes
- Implement resource pooling
- Enable streaming compilation

### Issue: Black Screen

**Cause:** WebGL context not available

**Solution:**
- Check browser console for WebGL errors
- Ensure hardware acceleration is enabled
- Try a different browser

## Best Practices

1. **Always Use Release Builds:** Debug builds are too large and slow
2. **Optimize Assets:** Compress textures and audio files
3. **Enable Compression:** Use Brotli or Gzip on server
4. **Set Cache Headers:** Allow browsers to cache WASM files
5. **Monitor Bundle Size:** Keep total size under 5MB if possible
6. **Test on Multiple Browsers:** Chrome, Firefox, Safari, Edge
7. **Provide Loading Feedback:** Show progress during initialization
8. **Graceful Degradation:** Handle browsers without WASM support

## Performance Tips

- **Reduce Window Size:** Smaller canvas = better performance
- **Limit Entity Count:** Fewer UI elements = faster rendering
- **Use Object Pools:** Reuse entities instead of creating new ones
- **Batch Operations:** Group updates to reduce overhead
- **Profile in Browser:** Use browser DevTools for profiling

## Browser Compatibility

**Minimum Requirements:**
- Chrome 57+ (March 2017)
- Firefox 52+ (March 2017)
- Safari 11+ (September 2017)
- Edge 16+ (October 2017)

**Recommended:**
- Latest Chrome, Firefox, Safari, or Edge
- Hardware acceleration enabled
- At least 4GB RAM

## Resources

- [Bevy WASM Examples](https://github.com/bevyengine/bevy/tree/main/examples#wasm)
- [wasm-bindgen Book](https://rustwasm.github.io/wasm-bindgen/)
- [MDN WebAssembly Guide](https://developer.mozilla.org/en-US/docs/WebAssembly)
- [Rust WASM Book](https://rustwasm.github.io/book/)
