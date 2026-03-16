package com.golf.repository;

import com.golf.model.Hole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HoleRepository extends JpaRepository<Hole, Long> {
}
