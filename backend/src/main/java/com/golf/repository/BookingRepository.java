package com.golf.repository;

import com.golf.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByPlayerIdOrderByBookingDateDesc(Long playerId);
    List<Booking> findByCourseIdAndBookingDate(Long courseId, LocalDate date);
}
