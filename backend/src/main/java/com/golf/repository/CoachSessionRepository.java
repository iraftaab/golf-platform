package com.golf.repository;

import com.golf.model.CoachSession;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CoachSessionRepository extends JpaRepository<CoachSession, Long> {
    List<CoachSession> findByCoachIdOrderBySessionDateAscSessionTimeAsc(Long coachId);
    List<CoachSession> findByClientEmailOrderBySessionDateDesc(String email);
}
