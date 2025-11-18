# Quick Start Guide

Get started with the React Native + Expo Todo List app in under 5 minutes!

## Prerequisites

- Node.js 16+ installed
- npm or yarn
- Smartphone with Expo Go app (iOS or Android)

## 1. Install Dependencies

```bash
npm install
```

## 2. Start Development Server

```bash
npm start
```

You should see a QR code in your terminal.

## 3. Run on Your Device

### iOS:
1. Install [Expo Go](https://apps.apple.com/app/expo-go/id982107779) from App Store
2. Open Camera app
3. Scan the QR code
4. Tap the notification to open in Expo Go

### Android:
1. Install [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent) from Play Store
2. Open Expo Go app
3. Tap "Scan QR Code"
4. Scan the QR code from terminal

## 4. Start Developing!

Make changes to the code and see them instantly on your device.

## Using Simulators/Emulators

### iOS Simulator (macOS only):
```bash
# In the Expo dev server terminal, press 'i'
# Or run:
npm run ios
```

### Android Emulator:
```bash
# In the Expo dev server terminal, press 'a'
# Or run:
npm run android
```

## Project Structure

```
├── App.tsx                  # Main app component
├── src/
│   ├── components/         # React components
│   │   ├── TodoInput.tsx
│   │   ├── TodoList.tsx
│   │   └── TodoItem.tsx
│   ├── types.ts           # TypeScript types
│   └── styles.ts          # Styles and theme
└── app.json               # Expo configuration
```

## Key Features

- ✅ Add, complete, and delete todos
- ✅ Data persists using AsyncStorage
- ✅ Beautiful gradient UI
- ✅ Smooth animations
- ✅ TypeScript for type safety
- ✅ Works on iOS and Android

## Available Scripts

```bash
npm start          # Start Expo development server
npm run android    # Run on Android emulator/device
npm run ios        # Run on iOS simulator/device
npm run web        # Run in web browser
npm test           # Run tests
npm run lint       # Lint code
```

## Common Issues

### Port already in use
```bash
npm start -- --port 19001
```

### Metro bundler cache
```bash
npm start -- --reset-cache
```

### Clear everything
```bash
rm -rf node_modules
npm install
npm start -- --reset-cache
```

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Explore the [Expo documentation](https://docs.expo.dev/)
- Learn about [React Native](https://reactnative.dev/)
- Check out [TypeScript](https://www.typescriptlang.org/)

## Need Help?

- [Expo Forums](https://forums.expo.dev/)
- [React Native Discord](https://discord.gg/react-native)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/expo)

Happy coding! 🚀
