package com.golf.controller;

import com.golf.model.Coach;
import com.golf.model.CoachSession;
import com.golf.repository.CoachRepository;
import com.golf.repository.CoachSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/coaches")
@RequiredArgsConstructor
public class CoachController {

    private final CoachRepository coachRepository;
    private final CoachSessionRepository sessionRepository;

    @GetMapping
    public List<Coach> getAll() {
        return coachRepository.findByActiveTrue();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Coach> getById(@PathVariable Long id) {
        return coachRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Coach create(@RequestBody Coach coach) {
        return coachRepository.save(coach);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Coach> update(@PathVariable Long id, @RequestBody Coach updated) {
        return coachRepository.findById(id).map(c -> {
            c.setName(updated.getName());
            c.setSpecialty(updated.getSpecialty());
            c.setBio(updated.getBio());
            c.setPhotoUrl(updated.getPhotoUrl());
            c.setPrice30min(updated.getPrice30min());
            c.setPrice60min(updated.getPrice60min());
            c.setPhone(updated.getPhone());
            c.setEmail(updated.getEmail());
            c.setAvailability(updated.getAvailability());
            c.setActive(updated.isActive());
            return ResponseEntity.ok(coachRepository.save(c));
        }).orElse(ResponseEntity.notFound().build());
    }

    // --- Sessions ---

    @GetMapping("/{id}/sessions")
    public List<CoachSession> getSessions(@PathVariable Long id) {
        return sessionRepository.findByCoachIdOrderBySessionDateAscSessionTimeAsc(id);
    }

    @PostMapping("/{id}/sessions")
    public ResponseEntity<?> bookSession(@PathVariable Long id, @RequestBody CoachSession session) {
        Coach coach = coachRepository.findById(id).orElse(null);
        if (coach == null) return ResponseEntity.notFound().build();

        session.setCoach(coach);
        // Auto-set price based on duration
        if (session.getDurationMinutes() != null) {
            session.setPrice(session.getDurationMinutes() == 30 ? coach.getPrice30min() : coach.getPrice60min());
        }
        return ResponseEntity.ok(sessionRepository.save(session));
    }

    @PostMapping("/sessions/{sessionId}/cancel")
    public ResponseEntity<?> cancelSession(@PathVariable Long sessionId) {
        return sessionRepository.findById(sessionId).map(s -> {
            s.setStatus(CoachSession.SessionStatus.CANCELLED);
            return ResponseEntity.ok(sessionRepository.save(s));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/sessions/by-email")
    public List<CoachSession> getByEmail(@RequestParam(name = "email") String email) {
        return sessionRepository.findByClientEmailOrderBySessionDateDesc(email);
    }
}
