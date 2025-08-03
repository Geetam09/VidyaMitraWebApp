package com.example.VidyaMitra.Domain.Teacher;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TeacherRepository extends JpaRepository<TeacherEntity, Long> {

    // Used for login and to check if email is already registered
    Optional<TeacherEntity> findByEmail(String email);
}
