# Ember.js Todo List - Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies

```bash
cd 03-modern-frameworks/13-emberjs
npm install
```

### 2. Start Development Server

```bash
npm start
```

### 3. Open in Browser

Visit: **http://localhost:4200**

## 📋 Available Commands

```bash
npm start          # Start development server
npm test           # Run tests
npm run build      # Build for production
npm run lint       # Lint code
npm run lint:fix   # Fix linting issues
```

## 🎯 What's Included

### Core Features
- ✅ Add new todos
- ✅ Toggle todo completion
- ✅ Delete todos
- ✅ Edit todos (double-click)
- ✅ Filter todos (All/Active/Completed)
- ✅ Clear completed todos
- ✅ LocalStorage persistence

### Ember.js Features Demonstrated
- ✅ Glimmer Components
- ✅ Tracked Properties (@tracked)
- ✅ Services (Dependency Injection)
- ✅ Actions (@action)
- ✅ Handlebars Templates
- ✅ Route/Controller/Template pattern
- ✅ Convention over Configuration

## 📁 Key Files

```
app/
├── components/
│   ├── todo-input.js          # Input component
│   ├── todo-list.js           # List container
│   └── todo-item.js           # Individual item
├── controllers/
│   └── application.js         # App controller
├── routes/
│   └── application.js         # App route
├── services/
│   └── todo-storage.js        # Storage service
└── templates/
    ├── application.hbs        # Main template
    └── components/            # Component templates
```

## 🔧 Configuration Files

- `ember-cli-build.js` - Build configuration
- `config/environment.js` - Environment settings
- `.eslintrc.js` - ESLint configuration
- `.prettierrc.js` - Prettier configuration
- `package.json` - Dependencies

## 📚 Learn More

See the detailed [README.md](./README.md) for:
- Complete Ember.js introduction
- Framework comparisons
- Best practices
- Advanced patterns
- Troubleshooting

## 🎓 Key Ember Concepts

### Convention over Configuration
Files are automatically discovered based on naming:
```
app/components/todo-item.js
app/templates/components/todo-item.hbs
```

### Tracked Properties
Automatic reactivity:
```javascript
@tracked isEditing = false;
```

### Services
Singleton shared state:
```javascript
@service todoStorage;
```

### Actions
Event handlers:
```javascript
@action
handleClick() { ... }
```

## 🐛 Troubleshooting

**Port already in use?**
```bash
npm start -- --port=3000
```

**Dependencies issues?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Clear browser cache** if changes don't appear.

## 🌟 Next Steps

1. Try adding new features (tags, priorities, due dates)
2. Add Ember Data for backend integration
3. Implement user authentication
4. Add animations with Liquid Fire
5. Deploy to production (Netlify, Vercel)

Happy coding with Ember.js! 🐹
