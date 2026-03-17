package com.golf.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Entity
@Table(name = "coaches")
@Data
public class Coach {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    private String specialty;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String photoUrl;

    /** Price in USD for a 30-minute session */
    private Double price30min;

    /** Price in USD for a 60-minute session */
    private Double price60min;

    private String phone;
    private String email;

    /** e.g. "Mon-Fri 8am-5pm" */
    private String availability;

    private boolean active = true;
}
