package com.golf.service;

import com.golf.model.Booking;
import com.golf.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@Transactional
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final PlayerService playerService;
    private final CourseService courseService;

    public List<Booking> findByPlayer(Long playerId) {
        playerService.findById(playerId);
        return bookingRepository.findByPlayerIdOrderByBookingDateDesc(playerId);
    }

    public List<Booking> findByCourseAndDate(Long courseId, LocalDate date) {
        return bookingRepository.findByCourseIdAndBookingDate(courseId, date);
    }

    public Booking findById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Booking not found: " + id));
    }

    public Booking create(Booking booking) {
        booking.setPlayer(playerService.findById(booking.getPlayer().getId()));
        booking.setCourse(courseService.findById(booking.getCourse().getId()));
        return bookingRepository.save(booking);
    }

    public Booking cancel(Long id) {
        Booking booking = findById(id);
        if (booking.getStatus() == Booking.BookingStatus.COMPLETED) {
            throw new IllegalStateException("Cannot cancel a completed booking");
        }
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        return bookingRepository.save(booking);
    }

    public void delete(Long id) {
        bookingRepository.delete(findById(id));
    }
}
