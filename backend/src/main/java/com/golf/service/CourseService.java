package com.golf.service;

import com.golf.model.Course;
import com.golf.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@Transactional
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;

    public List<Course> findAll() {
        return courseRepository.findAll();
    }

    public Course findById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Course not found: " + id));
    }

    public List<Course> findByLocation(String location) {
        return courseRepository.findByLocationContainingIgnoreCase(location);
    }

    public Course create(Course course) {
        return courseRepository.save(course);
    }

    public Course update(Long id, Course updated) {
        Course existing = findById(id);
        existing.setName(updated.getName());
        existing.setLocation(updated.getLocation());
        existing.setNumberOfHoles(updated.getNumberOfHoles());
        existing.setCourseRating(updated.getCourseRating());
        existing.setSlopeRating(updated.getSlopeRating());
        return courseRepository.save(existing);
    }

    public void delete(Long id) {
        courseRepository.delete(findById(id));
    }
}
