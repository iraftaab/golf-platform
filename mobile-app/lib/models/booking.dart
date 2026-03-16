import 'course.dart';
import 'player.dart';

class Booking {
  final int id;
  final Player player;
  final Course course;
  final String bookingDate;
  final String teeTime;
  final int numberOfPlayers;
  final String status;

  const Booking({
    required this.id,
    required this.player,
    required this.course,
    required this.bookingDate,
    required this.teeTime,
    required this.numberOfPlayers,
    required this.status,
  });

  factory Booking.fromJson(Map<String, dynamic> json) => Booking(
        id: json['id'] as int,
        player: Player.fromJson(json['player'] as Map<String, dynamic>),
        course: Course.fromJson(json['course'] as Map<String, dynamic>),
        bookingDate: json['bookingDate'] as String,
        teeTime: json['teeTime'] as String,
        numberOfPlayers: json['numberOfPlayers'] as int,
        status: json['status'] as String,
      );
}
