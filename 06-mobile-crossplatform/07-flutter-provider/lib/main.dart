import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/todo_provider.dart';
import 'screens/todo_list_screen.dart';

/// Main Entry Point
///
/// Sets up the Provider architecture and launches the app.
///
/// Provider Setup:
/// - ChangeNotifierProvider: Creates and provides TodoProvider to the widget tree
/// - Automatically disposes TodoProvider when no longer needed
/// - All descendants can access TodoProvider via context
void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    // ChangeNotifierProvider - Root provider setup
    //
    // This is the recommended way to provide a ChangeNotifier to the widget tree.
    //
    // Key points:
    // - create: Factory function to create the provider instance
    // - lazy: Provider is created only when first accessed (default: true)
    // - Automatically calls dispose() on the provider when removed from tree
    //
    // For multiple providers, use MultiProvider:
    // MultiProvider(
    //   providers: [
    //     ChangeNotifierProvider(create: (_) => TodoProvider()),
    //     ChangeNotifierProvider(create: (_) => UserProvider()),
    //   ],
    //   child: MyApp(),
    // )
    return ChangeNotifierProvider(
      create: (context) => TodoProvider(),
      child: MaterialApp(
        title: 'Flutter Provider Todo',
        debugShowCheckedModeBanner: false,

        // Material Design 3 Theme
        theme: ThemeData(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(
            seedColor: const Color(0xFF6366F1), // Indigo
            brightness: Brightness.light,
          ),

          // Typography
          textTheme: const TextTheme(
            headlineMedium: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.bold,
            ),
            titleLarge: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w600,
            ),
            bodyLarge: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w500,
            ),
          ),

          // AppBar Theme
          appBarTheme: const AppBarTheme(
            elevation: 0,
            centerTitle: true,
            backgroundColor: Colors.transparent,
          ),

          // Card Theme
          cardTheme: CardTheme(
            elevation: 2,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
          ),

          // Input Theme
          inputDecorationTheme: InputDecorationTheme(
            filled: true,
            fillColor: Colors.grey[100],
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide.none,
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(
                color: Color(0xFF6366F1),
                width: 2,
              ),
            ),
          ),

          // Button Theme
          elevatedButtonTheme: ElevatedButtonThemeData(
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(
                horizontal: 24,
                vertical: 12,
              ),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          ),

          // FloatingActionButton Theme
          floatingActionButtonTheme: FloatingActionButtonThemeData(
            backgroundColor: const Color(0xFF6366F1),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
          ),
        ),

        // Home Screen
        home: const TodoListScreen(),
      ),
    );
  }
}

/// Provider Architecture Overview
///
/// The Provider package is the officially recommended state management solution
/// for Flutter. It's built on top of InheritedWidget and provides a more
/// developer-friendly API.
///
/// Key Components:
///
/// 1. ChangeNotifier (Model)
///    - Base class for state management
///    - Extends ChangeNotifier mixin
///    - Calls notifyListeners() to trigger UI updates
///    - Example: TodoProvider extends ChangeNotifier
///
/// 2. ChangeNotifierProvider (Provider)
///    - Creates and provides a ChangeNotifier to the widget tree
///    - Handles lifecycle (creation and disposal)
///    - Should be placed above all widgets that need access
///    - Example: ChangeNotifierProvider(create: (_) => TodoProvider())
///
/// 3. Consumer (Widget)
///    - Listens to provider changes and rebuilds
///    - Rebuilds only the widget wrapped by Consumer
///    - More efficient than wrapping entire screen
///    - Example: Consumer<TodoProvider>(builder: (_, provider, __) => ...)
///
/// 4. Selector (Optimized Widget)
///    - Like Consumer but more granular
///    - Rebuilds only when selected value changes
///    - Better performance for large apps
///    - Example: Selector<TodoProvider, int>(selector: (_, p) => p.count)
///
/// 5. context.read<T>() (One-time Access)
///    - Gets provider without listening to changes
///    - Use for callbacks and event handlers
///    - Does not rebuild widget
///    - Example: context.read<TodoProvider>().addTodo(title)
///
/// 6. context.watch<T>() (Reactive Access)
///    - Gets provider and listens to changes
///    - Rebuilds widget when provider changes
///    - Alternative to Consumer for simpler cases
///    - Example: final provider = context.watch<TodoProvider>()
///
/// Provider vs Other Solutions:
///
/// Provider:
/// ✓ Official Flutter recommendation
/// ✓ Simple and easy to learn
/// ✓ Good performance with Selector
/// ✓ Strong community support
/// ✓ Works well with any app size
/// ✗ More boilerplate for large apps
/// ✗ Manual notifyListeners() calls
///
/// Riverpod:
/// ✓ Compile-time safety
/// ✓ No BuildContext needed
/// ✓ Better testability
/// ✗ Steeper learning curve
/// ✗ More complex API
///
/// GetX:
/// ✓ Very minimal boilerplate
/// ✓ Built-in routing and DI
/// ✓ Fast development
/// ✗ Magic behavior (harder to debug)
/// ✗ Not official Flutter recommendation
///
/// Bloc:
/// ✓ Predictable state changes
/// ✓ Great for large teams
/// ✓ Separation of business logic
/// ✗ More boilerplate
/// ✗ Steeper learning curve
///
/// Best Practices:
///
/// 1. Use context.read() for one-time operations (callbacks)
/// 2. Use Consumer/Selector for reactive UI updates
/// 3. Keep providers focused (single responsibility)
/// 4. Use Selector when only specific values are needed
/// 5. Dispose resources in ChangeNotifier.dispose()
/// 6. Use MultiProvider for multiple providers
/// 7. Avoid excessive notifyListeners() calls
/// 8. Consider ProxyProvider for dependent providers
///
/// Performance Tips:
///
/// 1. Use Selector instead of Consumer when possible
/// 2. Break large widgets into smaller Consumer widgets
/// 3. Use const constructors where possible
/// 4. Avoid rebuilding entire screens
/// 5. Profile with Flutter DevTools
/// 6. Use compute() for heavy computations
/// 7. Implement proper equality checks
///
/// Common Patterns:
///
/// 1. Simple Provider:
///    ChangeNotifierProvider(
///      create: (_) => MyProvider(),
///      child: MyApp(),
///    )
///
/// 2. Multiple Providers:
///    MultiProvider(
///      providers: [
///        ChangeNotifierProvider(create: (_) => Provider1()),
///        ChangeNotifierProvider(create: (_) => Provider2()),
///      ],
///      child: MyApp(),
///    )
///
/// 3. Dependent Providers:
///    ProxyProvider<Provider1, Provider2>(
///      update: (_, provider1, __) => Provider2(provider1),
///    )
///
/// 4. Future Provider:
///    FutureProvider<Data>(
///      create: (_) => fetchData(),
///      initialData: Data.initial(),
///    )
///
/// 5. Stream Provider:
///    StreamProvider<Data>(
///      create: (_) => dataStream,
///      initialData: Data.initial(),
///    )
///
/// Testing with Provider:
///
/// 1. Unit Tests:
///    test('adds todo', () {
///      final provider = TodoProvider();
///      provider.addTodo('Test');
///      expect(provider.todos.length, 1);
///    });
///
/// 2. Widget Tests:
///    testWidgets('displays todos', (tester) async {
///      await tester.pumpWidget(
///        ChangeNotifierProvider(
///          create: (_) => TodoProvider(),
///          child: MyApp(),
///        ),
///      );
///      expect(find.text('My Todos'), findsOneWidget);
///    });
///
/// This architecture provides a solid foundation for Flutter apps of any size,
/// with official support and excellent documentation from the Flutter team.
