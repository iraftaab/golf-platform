class Course {
  final int id;
  final String name;
  final String location;
  final int numberOfHoles;
  final double? courseRating;
  final int? slopeRating;

  const Course({
    required this.id,
    required this.name,
    required this.location,
    required this.numberOfHoles,
    this.courseRating,
    this.slopeRating,
  });

  factory Course.fromJson(Map<String, dynamic> json) => Course(
        id: json['id'] as int,
        name: json['name'] as String,
        location: json['location'] as String,
        numberOfHoles: json['numberOfHoles'] as int,
        courseRating: (json['courseRating'] as num?)?.toDouble(),
        slopeRating: json['slopeRating'] as int?,
      );

  Map<String, dynamic> toJson() => {
        'name': name,
        'location': location,
        'numberOfHoles': numberOfHoles,
        if (courseRating != null) 'courseRating': courseRating,
        if (slopeRating != null) 'slopeRating': slopeRating,
      };
}
