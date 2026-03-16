import 'package:flutter/material.dart';
import '../models/booking.dart';
import '../services/api_service.dart';

class BookingScreen extends StatefulWidget {
  final int playerId;
  const BookingScreen({super.key, required this.playerId});

  @override
  State<BookingScreen> createState() => _BookingScreenState();
}

class _BookingScreenState extends State<BookingScreen> {
  final _api = ApiService();
  List<Booking> _bookings = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadBookings();
  }

  Future<void> _loadBookings() async {
    try {
      final bookings = await _api.getBookingsByPlayer(widget.playerId);
      setState(() { _bookings = bookings; _loading = false; });
    } catch (e) {
      setState(() { _loading = false; });
    }
  }

  Future<void> _cancel(int id) async {
    try {
      await _api.cancelBooking(id);
      _loadBookings();
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text('Cancel failed: $e')));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Bookings'),
        backgroundColor: const Color(0xFF1a5c2a),
        foregroundColor: Colors.white,
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _bookings.isEmpty
              ? const Center(child: Text('No bookings found'))
              : ListView.builder(
                  itemCount: _bookings.length,
                  itemBuilder: (ctx, i) {
                    final b = _bookings[i];
                    return ListTile(
                      title: Text(b.course.name),
                      subtitle: Text('${b.bookingDate} at ${b.teeTime} · ${b.numberOfPlayers} players'),
                      trailing: b.status == 'CONFIRMED'
                          ? TextButton(
                              onPressed: () => _cancel(b.id),
                              child: const Text('Cancel', style: TextStyle(color: Colors.red)),
                            )
                          : Text(b.status, style: const TextStyle(color: Colors.grey)),
                    );
                  },
                ),
    );
  }
}
