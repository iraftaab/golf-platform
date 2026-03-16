import 'package:flutter/material.dart';
import 'screens/home_screen.dart';

void main() {
  runApp(const GolfPlatformApp());
}

class GolfPlatformApp extends StatelessWidget {
  const GolfPlatformApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Golf Platform',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF1a5c2a)),
        useMaterial3: true,
      ),
      home: const HomeScreen(),
    );
  }
}
