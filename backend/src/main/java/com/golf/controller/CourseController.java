package com.golf.controller;

import com.golf.model.Course;
import com.golf.service.CourseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @GetMapping
    public List<Course> getAll(@RequestParam(name = "location", required = false) String location) {
        if (location != null && !location.isBlank()) {
            return courseService.findByLocation(location);
        }
        return courseService.findAll();
    }

    @GetMapping("/{id}")
    public Course getById(@PathVariable Long id) {
        return courseService.findById(id);
    }

    @PostMapping
    public ResponseEntity<Course> create(@Valid @RequestBody Course course) {
        return ResponseEntity.status(HttpStatus.CREATED).body(courseService.create(course));
    }

    @PutMapping("/{id}")
    public Course update(@PathVariable Long id, @Valid @RequestBody Course course) {
        return courseService.update(id, course);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        courseService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
