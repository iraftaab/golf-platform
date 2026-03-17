package com.golf.config;

import com.golf.model.*;
import com.golf.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements ApplicationRunner {

    private final PlayerRepository playerRepository;
    private final CourseRepository courseRepository;
    private final BookingRepository bookingRepository;
    private final RoundRepository roundRepository;
    private final HoleRepository holeRepository;
    private final CoachRepository coachRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (playerRepository.count() > 0) {
            return;
        }

        log.info("Seeding sample data...");

        String pin1234 = passwordEncoder.encode("1234");
        String pin5678 = passwordEncoder.encode("5678");
        String pin9999 = passwordEncoder.encode("9999");

        // --- Players (tier: GOLD=top 4, SILVER=mid 3, BRONZE=rest) ---
        List<Player> players = playerRepository.saveAll(List.of(
            player("Tiger",   "Woods",    "tiger@golf.com",   0.0,  MembershipTier.GOLD,   pin1234),
            player("Rory",    "McIlroy",  "rory@golf.com",    0.1,  MembershipTier.GOLD,   pin1234),
            player("Phil",    "Mickelson","phil@golf.com",    0.3,  MembershipTier.GOLD,   pin5678),
            player("Jordan",  "Spieth",   "jordan@golf.com",  0.2,  MembershipTier.GOLD,   pin5678),
            player("Dustin",  "Johnson",  "dustin@golf.com",  0.4,  MembershipTier.SILVER, pin5678),
            player("Brooks",  "Koepka",   "brooks@golf.com",  0.1,  MembershipTier.SILVER, pin9999),
            player("Jon",     "Rahm",     "jon@golf.com",     0.0,  MembershipTier.SILVER, pin9999),
            player("Justin",  "Thomas",   "jt@golf.com",      0.2,  MembershipTier.BRONZE, pin9999),
            player("Collin",  "Morikawa", "collin@golf.com",  0.1,  MembershipTier.BRONZE, pin1234),
            player("Scottie", "Scheffler","scottie@golf.com", 0.0,  MembershipTier.BRONZE, pin1234)
        ));

        // --- Courses ---
        // Augusta National hole data: {par, yards, strokeIndex}
        int[][] augustaHoles = {
            {4,445,9},{5,575,13},{4,350,17},{3,240,15},{4,495,11},
            {3,180,16},{4,450,7},{5,570,5},{4,460,3},{4,495,1},
            {4,520,10},{3,155,14},{5,510,6},{4,440,4},{5,550,8},
            {3,170,18},{4,440,12},{4,465,2}
        };
        int[][] pebbleHoles = {
            {4,380,7},{5,502,13},{4,390,11},{4,331,17},{3,188,15},
            {5,523,3},{3,106,18},{4,431,5},{4,481,1},{4,446,9},
            {4,380,10},{3,202,16},{4,399,8},{5,573,4},{4,397,12},
            {4,403,6},{3,178,14},{5,543,2}
        };

        Course augusta   = seedCourse("Augusta National",       "Augusta, GA",         76.2, 137, augustaHoles);
        Course pebble    = seedCourse("Pebble Beach Golf Links", "Pebble Beach, CA",    75.5, 145, pebbleHoles);
        Course standrews = courseRepository.save(makeCourse("St Andrews Links",        "St Andrews, Scotland", 73.1, 132));
        Course torrey    = courseRepository.save(makeCourse("Torrey Pines South",      "La Jolla, CA",         75.8, 144));
        Course tpc       = courseRepository.save(makeCourse("TPC Sawgrass",            "Ponte Vedra Beach, FL",75.5, 135));
        Course whistling = courseRepository.save(makeCourse("Whistling Straits",       "Haven, WI",            76.9, 151));
        Course bethpage  = courseRepository.save(makeCourse("Bethpage Black",          "Farmingdale, NY",      78.1, 155));
        int[][] heritageHoles = {
            {4,380,7},{3,155,17},{4,365,11},{5,510,3},{4,395,5},
            {4,350,13},{3,170,15},{4,415,1},{5,525,9},{4,375,8},
            {4,360,14},{3,145,18},{5,495,4},{4,400,2},{4,355,12},
            {3,165,16},{4,420,6},{5,530,10}
        };
        Course heritage  = seedCourse("Heritage Isle Golf and Country Club", "Tampa, FL", 71.2, 128, heritageHoles);

        Player tiger = players.get(0), rory = players.get(1), phil = players.get(2),
               jordan = players.get(3), dustin = players.get(4), brooks = players.get(5),
               jon = players.get(6), jt = players.get(7), collin = players.get(8), scottie = players.get(9);

        // --- Bookings ---
        bookingRepository.saveAll(List.of(
            booking(tiger,   augusta,   LocalDate.now().plusDays(4),  LocalTime.of(7,  0),  4),
            booking(rory,    pebble,    LocalDate.now().plusDays(5),  LocalTime.of(8, 30),  2),
            booking(phil,    standrews, LocalDate.now().plusDays(6),  LocalTime.of(9,  0),  3),
            booking(jordan,  augusta,   LocalDate.now().plusDays(7),  LocalTime.of(10, 0),  1),
            booking(tiger,   pebble,    LocalDate.now().plusDays(9),  LocalTime.of(7, 30),  2),
            booking(dustin,  torrey,    LocalDate.now().plusDays(1),  LocalTime.of(6, 30),  2),
            booking(brooks,  tpc,       LocalDate.now().plusDays(1),  LocalTime.of(8,  0),  4),
            booking(jon,     augusta,   LocalDate.now().plusDays(2),  LocalTime.of(7,  0),  3),
            booking(jt,      whistling, LocalDate.now().plusDays(2),  LocalTime.of(9, 30),  2),
            booking(collin,  bethpage,  LocalDate.now().plusDays(3),  LocalTime.of(7, 45),  4),
            booking(scottie, pebble,    LocalDate.now().plusDays(3),  LocalTime.of(10, 0),  1),
            booking(rory,    torrey,    LocalDate.now().plusDays(8),  LocalTime.of(8,  0),  2),
            booking(phil,    tpc,       LocalDate.now().plusDays(8),  LocalTime.of(11, 0),  3),
            booking(dustin,  augusta,   LocalDate.now().plusDays(10), LocalTime.of(7,  0),  4),
            booking(jon,     standrews, LocalDate.now().plusDays(11), LocalTime.of(6, 45),  2)
        ));

        // --- Rounds with scores (Augusta holes must exist) ---
        if (!augusta.getHoles().isEmpty()) {
            List<Hole> holes = courseRepository.findById(augusta.getId()).get().getHoles();

            // Tiger's round at Augusta — under par
            Round tigerRound = roundRepository.save(round(tiger, augusta, LocalDate.now().minusDays(6)));
            int[] tigerStrokes = {4,4,4,3,4,2,4,4,4,4,4,3,4,4,5,3,4,4};
            saveScores(tigerRound, holes, tigerStrokes);
            tigerRound.setTotalScore(68); tigerRound.setStatus(Round.RoundStatus.COMPLETED);
            roundRepository.save(tigerRound);

            // Scottie's round — even par
            Round scottieRound = roundRepository.save(round(scottie, augusta, LocalDate.now().minusDays(3)));
            int[] scottieStrokes = {4,5,4,3,4,3,4,5,4,4,4,3,5,4,5,3,4,4};
            saveScores(scottieRound, holes, scottieStrokes);
            scottieRound.setTotalScore(72); scottieRound.setStatus(Round.RoundStatus.COMPLETED);
            roundRepository.save(scottieRound);

            // Rory's round — one over
            Round roryRound = roundRepository.save(round(rory, augusta, LocalDate.now().minusDays(1)));
            int[] roryStrokes = {4,5,4,4,4,3,4,5,4,4,5,3,5,4,5,3,4,5};
            saveScores(roryRound, holes, roryStrokes);
            roryRound.setTotalScore(74); roryRound.setStatus(Round.RoundStatus.COMPLETED);
            roundRepository.save(roryRound);
        }

        // --- Coaches ---
        if (coachRepository.count() == 0) {
            coachRepository.saveAll(List.of(
                coach("David Leadbetter", "Full Swing & Mechanics",
                    "David is a world-renowned golf instructor with over 40 years of experience coaching Tour professionals. " +
                    "He is credited with revamping the swings of Nick Faldo, Nick Price, Greg Norman, and many others. " +
                    "His unique \"A Swing\" methodology has helped thousands of amateur golfers improve consistency and power.",
                    "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=400&q=80",
                    75.0, 130.0, "(813) 555-0101", "david@golfplatform.com", "Mon–Fri 8am–5pm"),
                coach("Butch Harmon", "Short Game & Course Management",
                    "Butch Harmon is a legendary instructor best known for his work with Tiger Woods during Tiger's dominant era. " +
                    "He specialises in short game finesse, bunker play, and strategic course management. " +
                    "Butch's patient, detail-oriented approach makes him ideal for golfers of all skill levels looking to shave strokes.",
                    "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400&q=80",
                    80.0, 140.0, "(813) 555-0202", "butch@golfplatform.com", "Tue–Sat 7am–4pm"),
                coach("Hank Haney", "Driver & Long Game",
                    "Hank Haney has coached multiple PGA Tour winners and is renowned for his expertise in driver distance and long-iron play. " +
                    "He employs a data-driven approach using launch monitors and video analysis to identify swing faults and unlock distance. " +
                    "Hank's structured lesson plans deliver measurable improvement in just a few sessions.",
                    "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&q=80",
                    65.0, 110.0, "(813) 555-0303", "hank@golfplatform.com", "Mon–Thu 9am–6pm"),
                coach("Aimee Cho", "Beginner & Junior Programs",
                    "Aimee is a certified PGA teaching professional specialising in beginner foundations and junior development. " +
                    "Her encouraging, positive coaching style builds confidence alongside technique, covering grip, stance, alignment, and the mental side of golf. " +
                    "She has produced several junior state champions and is passionate about growing the game.",
                    "https://images.unsplash.com/photo-1580982324076-d95230549339?w=400&q=80",
                    50.0, 90.0, "(813) 555-0404", "aimee@golfplatform.com", "Mon–Sat 8am–6pm")
            ));
        }

        log.info("Sample data seeded: {} players, {} courses, {} bookings, {} coaches",
                playerRepository.count(), courseRepository.count(), bookingRepository.count(), coachRepository.count());
    }

    private Course seedCourse(String name, String location, double rating, int slope, int[][] holeData) {
        Course course = courseRepository.save(makeCourse(name, location, rating, slope));
        List<Hole> holes = new ArrayList<>();
        for (int i = 0; i < holeData.length; i++) {
            Hole h = new Hole();
            h.setCourse(course); h.setHoleNumber(i + 1);
            h.setPar(holeData[i][0]); h.setYardage(holeData[i][1]); h.setHandicapIndex(holeData[i][2]);
            holes.add(h);
        }
        holeRepository.saveAll(holes);
        return courseRepository.findById(course.getId()).get();
    }

    private Course makeCourse(String name, String location, double rating, int slope) {
        Course c = new Course();
        c.setName(name); c.setLocation(location);
        c.setNumberOfHoles(18); c.setCourseRating(rating); c.setSlopeRating(slope);
        return c;
    }

    private void saveScores(Round round, List<Hole> holes, int[] strokes) {
        List<Score> scores = new ArrayList<>();
        for (int i = 0; i < holes.size() && i < strokes.length; i++) {
            Score s = new Score();
            s.setRound(round); s.setHole(holes.get(i)); s.setStrokes(strokes[i]);
            scores.add(s);
        }
        round.getScores().addAll(scores);
    }

    private Round round(Player player, Course course, LocalDate date) {
        Round r = new Round();
        r.setPlayer(player); r.setCourse(course); r.setDatePlayed(date);
        return r;
    }

    private Player player(String first, String last, String email, double handicap,
                          MembershipTier tier, String hashedPin) {
        Player p = new Player();
        p.setFirstName(first); p.setLastName(last);
        p.setEmail(email); p.setHandicapIndex(handicap);
        p.setMembershipTier(tier); p.setMemberPin(hashedPin);
        return p;
    }

    private Coach coach(String name, String specialty, String bio, String photoUrl,
                        double price30, double price60, String phone, String email, String availability) {
        Coach c = new Coach();
        c.setName(name); c.setSpecialty(specialty); c.setBio(bio);
        c.setPhotoUrl(photoUrl); c.setPrice30min(price30); c.setPrice60min(price60);
        c.setPhone(phone); c.setEmail(email); c.setAvailability(availability);
        return c;
    }

    private Booking booking(Player player, Course course, LocalDate date, LocalTime tee, int numPlayers) {
        Booking b = new Booking();
        b.setPlayer(player); b.setCourse(course);
        b.setBookingDate(date); b.setTeeTime(tee);
        b.setNumberOfPlayers(numPlayers);
        return b;
    }
}
