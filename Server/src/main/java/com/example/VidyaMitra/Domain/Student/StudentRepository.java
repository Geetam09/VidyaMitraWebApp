package com.example.VidyaMitra.Domain.Student;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<StudentEntity, Long> {
    // Finds all students belonging to a specific class
    List<StudentEntity> findBySchoolClass_Id(Long classId);
}
