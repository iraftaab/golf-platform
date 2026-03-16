import 'package:flutter/material.dart';
import '../models/course.dart';
import '../services/api_service.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _api = ApiService();
  List<Course> _courses = [];
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadCourses();
  }

  Future<void> _loadCourses() async {
    try {
      final courses = await _api.getCourses();
      setState(() { _courses = courses; _loading = false; });
    } catch (e) {
      setState(() { _error = e.toString(); _loading = false; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Golf Platform'),
        backgroundColor: const Color(0xFF1a5c2a),
        foregroundColor: Colors.white,
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(child: Text('Error: $_error'))
              : RefreshIndicator(
                  onRefresh: _loadCourses,
                  child: ListView.builder(
                    itemCount: _courses.length,
                    itemBuilder: (ctx, i) {
                      final c = _courses[i];
                      return ListTile(
                        leading: const Icon(Icons.golf_course, color: Color(0xFF1a5c2a)),
                        title: Text(c.name),
                        subtitle: Text('${c.location} · ${c.numberOfHoles} holes'),
                        trailing: c.courseRating != null
                            ? Text('${c.courseRating} / ${c.slopeRating ?? "—"}',
                                style: const TextStyle(fontSize: 12))
                            : null,
                      );
                    },
                  ),
                ),
    );
  }
}
