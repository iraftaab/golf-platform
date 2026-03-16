import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/player.dart';
import '../models/course.dart';
import '../models/booking.dart';

class ApiService {
  static const String _baseUrl = 'http://localhost:8080/api';

  // Players
  Future<List<Player>> getPlayers() async {
    final response = await http.get(Uri.parse('$_baseUrl/players'));
    _checkStatus(response);
    return (jsonDecode(response.body) as List)
        .map((j) => Player.fromJson(j as Map<String, dynamic>))
        .toList();
  }

  Future<Player> createPlayer(Map<String, dynamic> data) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/players'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(data),
    );
    _checkStatus(response);
    return Player.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
  }

  // Courses
  Future<List<Course>> getCourses({String? location}) async {
    final uri = Uri.parse('$_baseUrl/courses')
        .replace(queryParameters: location != null ? {'location': location} : null);
    final response = await http.get(uri);
    _checkStatus(response);
    return (jsonDecode(response.body) as List)
        .map((j) => Course.fromJson(j as Map<String, dynamic>))
        .toList();
  }

  // Bookings
  Future<List<Booking>> getBookingsByPlayer(int playerId) async {
    final response = await http.get(Uri.parse('$_baseUrl/bookings/player/$playerId'));
    _checkStatus(response);
    return (jsonDecode(response.body) as List)
        .map((j) => Booking.fromJson(j as Map<String, dynamic>))
        .toList();
  }

  Future<Booking> createBooking(Map<String, dynamic> data) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/bookings'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(data),
    );
    _checkStatus(response);
    return Booking.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
  }

  Future<Booking> cancelBooking(int id) async {
    final response = await http.post(Uri.parse('$_baseUrl/bookings/$id/cancel'));
    _checkStatus(response);
    return Booking.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
  }

  void _checkStatus(http.Response response) {
    if (response.statusCode >= 400) {
      final body = jsonDecode(response.body) as Map<String, dynamic>?;
      throw Exception(body?['error'] ?? 'HTTP ${response.statusCode}');
    }
  }
}
