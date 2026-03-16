class Player {
  final int id;
  final String firstName;
  final String lastName;
  final String email;
  final double? handicapIndex;

  const Player({
    required this.id,
    required this.firstName,
    required this.lastName,
    required this.email,
    this.handicapIndex,
  });

  String get fullName => '$firstName $lastName';

  factory Player.fromJson(Map<String, dynamic> json) => Player(
        id: json['id'] as int,
        firstName: json['firstName'] as String,
        lastName: json['lastName'] as String,
        email: json['email'] as String,
        handicapIndex: (json['handicapIndex'] as num?)?.toDouble(),
      );

  Map<String, dynamic> toJson() => {
        'firstName': firstName,
        'lastName': lastName,
        'email': email,
        if (handicapIndex != null) 'handicapIndex': handicapIndex,
      };
}
