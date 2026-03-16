package com.golf.repository;

import com.golf.model.Round;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RoundRepository extends JpaRepository<Round, Long> {
    List<Round> findByPlayerIdOrderByDatePlayedDesc(Long playerId);
    List<Round> findByCourseIdOrderByDatePlayedDesc(Long courseId);
}
