package com.golf.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "courses")
@Data
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotBlank
    private String location;

    @Min(1) @Max(18)
    @Column(nullable = false)
    private Integer numberOfHoles = 18;

    /** Course rating from authoritative golf association */
    private Double courseRating;

    /** Slope rating (55-155) */
    @Min(55) @Max(155)
    private Integer slopeRating;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("holeNumber ASC")
    private List<Hole> holes = new ArrayList<>();
}
