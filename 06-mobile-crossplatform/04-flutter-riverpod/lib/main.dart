import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'screens/todo_list_screen.dart';

/// Main Entry Point
///
/// Wraps the app with ProviderScope to enable Riverpod.
/// ProviderScope is the root of all Riverpod providers and must be
/// at the top of the widget tree.

void main() {
  runApp(
    // ProviderScope stores the state of all providers
    // It must be the ancestor of all widgets that use providers
    const ProviderScope(
      child: MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Riverpod Todo',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
        appBarTheme: const AppBarTheme(
          centerTitle: true,
          elevation: 0,
        ),
        cardTheme: CardTheme(
          elevation: 2,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
          ),
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 12,
          ),
        ),
      ),
      home: TodoListScreen(),
    );
  }
}
