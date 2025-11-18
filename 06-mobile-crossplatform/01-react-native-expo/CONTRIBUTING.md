# Contributing to Todo List

Thank you for your interest in contributing to this React Native + Expo Todo List application! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please be respectful and considerate in all interactions.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:

- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Device/platform information
- React Native and Expo versions

### Suggesting Features

Feature suggestions are welcome! Please include:

- Clear description of the feature
- Use case and benefits
- Potential implementation approach

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/todo-list-expo.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow the code style (Prettier + ESLint)
   - Add tests if applicable
   - Update documentation

4. **Test your changes**
   ```bash
   npm run lint
   npm run type-check
   npm test
   ```

5. **Commit your changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```

   Use conventional commit messages:
   - `feat:` new feature
   - `fix:` bug fix
   - `docs:` documentation
   - `style:` formatting
   - `refactor:` code restructuring
   - `test:` adding tests
   - `chore:` maintenance

6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

7. **Open a Pull Request**
   - Describe your changes
   - Reference related issues
   - Add screenshots for UI changes

## Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Lint code
npm run lint

# Type check
npm run type-check
```

## Code Style

- Use TypeScript for all new code
- Follow existing code patterns
- Use functional components and hooks
- Add JSDoc comments for complex functions
- Keep components small and focused

## Testing

- Write unit tests for utility functions
- Write component tests for React components
- Ensure tests pass before submitting PR

## Questions?

Feel free to open an issue for any questions!

Thank you for contributing! 🎉
