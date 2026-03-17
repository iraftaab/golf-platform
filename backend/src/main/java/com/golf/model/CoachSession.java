package com.golf.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "coach_sessions")
@Data
public class CoachSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "coach_id", nullable = false)
    private Coach coach;

    @NotBlank
    private String clientName;

    @Email
    @NotBlank
    private String clientEmail;

    private String clientPhone;

    private LocalDate sessionDate;
    private LocalTime sessionTime;

    /** 30 or 60 */
    private Integer durationMinutes;

    private Double price;

    @Enumerated(EnumType.STRING)
    private SessionStatus status = SessionStatus.CONFIRMED;

    private String notes;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum SessionStatus { CONFIRMED, CANCELLED, COMPLETED }
}
