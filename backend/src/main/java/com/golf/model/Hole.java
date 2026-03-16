package com.golf.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

@Entity
@Table(name = "holes", uniqueConstraints = @UniqueConstraint(columnNames = {"course_id", "hole_number"}))
@Data
public class Hole {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Min(1) @Max(18)
    @Column(name = "hole_number", nullable = false)
    private Integer holeNumber;

    @Min(3) @Max(6)
    @Column(nullable = false)
    private Integer par;

    /** Yards from the standard (white/middle) tee */
    private Integer yardage;

    /** Stroke index / handicap ranking of this hole (1 = hardest) */
    @Min(1) @Max(18)
    private Integer handicapIndex;
}
