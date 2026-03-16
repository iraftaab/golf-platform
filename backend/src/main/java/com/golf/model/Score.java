package com.golf.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

@Entity
@Table(name = "scores", uniqueConstraints = @UniqueConstraint(columnNames = {"round_id", "hole_id"}))
@Data
public class Score {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "round_id", nullable = false)
    @JsonIgnoreProperties("scores")
    private Round round;

    @ManyToOne(optional = false)
    @JoinColumn(name = "hole_id", nullable = false)
    @JsonIgnoreProperties("holes")
    private Hole hole;

    @Min(1) @Max(20)
    @Column(nullable = false)
    private Integer strokes;

    /** Number of putts taken on the green */
    @Min(0) @Max(10)
    private Integer putts;

    private Boolean fairwayHit;
    private Boolean greenInRegulation;
}
