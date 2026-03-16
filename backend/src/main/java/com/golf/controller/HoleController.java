package com.golf.controller;

import com.golf.model.Course;
import com.golf.model.Hole;
import com.golf.service.CourseService;
import com.golf.repository.HoleRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/courses/{courseId}/holes")
@RequiredArgsConstructor
public class HoleController {

    private final CourseService courseService;
    private final HoleRepository holeRepository;

    @GetMapping
    public List<Hole> getAll(@PathVariable Long courseId) {
        return courseService.findById(courseId).getHoles();
    }

    @PostMapping
    public ResponseEntity<Hole> create(@PathVariable Long courseId, @Valid @RequestBody Hole hole) {
        Course course = courseService.findById(courseId);
        hole.setCourse(course);
        return ResponseEntity.status(HttpStatus.CREATED).body(holeRepository.save(hole));
    }
}
