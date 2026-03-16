package com.golf.config;

import com.golf.model.*;
import com.golf.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements ApplicationRunner {

    private final PlayerRepository playerRepository;
    private final CourseRepository courseRepository;
    private final BookingRepository bookingRepository;

    @Override
    public void run(ApplicationArguments args) {
        if (playerRepository.count() > 0) {
            return; // already seeded
        }

        log.info("Seeding sample data...");

        // Players
        Player tiger = new Player();
        tiger.setFirstName("Tiger"); tiger.setLastName("Woods");
        tiger.setEmail("tiger@golf.com"); tiger.setHandicapIndex(0.0);

        Player rory = new Player();
        rory.setFirstName("Rory"); rory.setLastName("McIlroy");
        rory.setEmail("rory@golf.com"); rory.setHandicapIndex(0.1);

        Player phil = new Player();
        phil.setFirstName("Phil"); phil.setLastName("Mickelson");
        phil.setEmail("phil@golf.com"); phil.setHandicapIndex(0.3);

        Player jordan = new Player();
        jordan.setFirstName("Jordan"); jordan.setLastName("Spieth");
        jordan.setEmail("jordan@golf.com"); jordan.setHandicapIndex(0.2);

        List<Player> players = playerRepository.saveAll(List.of(tiger, rory, phil, jordan));
        tiger = players.get(0); rory = players.get(1);
        phil = players.get(2); jordan = players.get(3);

        // Courses
        Course augusta = new Course();
        augusta.setName("Augusta National"); augusta.setLocation("Augusta, GA");
        augusta.setNumberOfHoles(18); augusta.setCourseRating(76.2); augusta.setSlopeRating(137);

        Course pebble = new Course();
        pebble.setName("Pebble Beach Golf Links"); pebble.setLocation("Pebble Beach, CA");
        pebble.setNumberOfHoles(18); pebble.setCourseRating(75.5); pebble.setSlopeRating(145);

        Course standrews = new Course();
        standrews.setName("St Andrews Links"); standrews.setLocation("St Andrews, Scotland");
        standrews.setNumberOfHoles(18); standrews.setCourseRating(73.1); standrews.setSlopeRating(132);

        List<Course> courses = courseRepository.saveAll(List.of(augusta, pebble, standrews));
        augusta = courses.get(0); pebble = courses.get(1); standrews = courses.get(2);

        // Bookings
        bookingRepository.saveAll(List.of(
            booking(tiger,  augusta,   LocalDate.now().plusDays(4),  LocalTime.of(7, 0),  4),
            booking(rory,   pebble,    LocalDate.now().plusDays(5),  LocalTime.of(8, 30), 2),
            booking(phil,   standrews, LocalDate.now().plusDays(6),  LocalTime.of(9, 0),  3),
            booking(jordan, augusta,   LocalDate.now().plusDays(7),  LocalTime.of(10, 0), 1),
            booking(tiger,  pebble,    LocalDate.now().plusDays(9),  LocalTime.of(7, 30), 2)
        ));

        log.info("Sample data seeded: {} players, {} courses, 5 bookings",
                playerRepository.count(), courseRepository.count());
    }

    private Booking booking(Player player, Course course, LocalDate date, LocalTime tee, int players) {
        Booking b = new Booking();
        b.setPlayer(player); b.setCourse(course);
        b.setBookingDate(date); b.setTeeTime(tee);
        b.setNumberOfPlayers(players);
        return b;
    }
}
