package com.golf.controller;

import com.golf.model.Booking;
import com.golf.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @GetMapping("/player/{playerId}")
    public List<Booking> getByPlayer(@PathVariable Long playerId) {
        return bookingService.findByPlayer(playerId);
    }

    @GetMapping("/course/{courseId}")
    public List<Booking> getByCourseAndDate(
            @PathVariable Long courseId,
            @RequestParam(name = "date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return bookingService.findByCourseAndDate(courseId, date);
    }

    @GetMapping("/{id}")
    public Booking getById(@PathVariable Long id) {
        return bookingService.findById(id);
    }

    @PostMapping
    public ResponseEntity<Booking> create(@Valid @RequestBody Booking booking) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.create(booking));
    }

    @PostMapping("/{id}/cancel")
    public Booking cancel(@PathVariable Long id) {
        return bookingService.cancel(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        bookingService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
