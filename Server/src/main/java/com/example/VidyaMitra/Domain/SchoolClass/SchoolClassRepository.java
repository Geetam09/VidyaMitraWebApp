package com.example.VidyaMitra.Domain.SchoolClass;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SchoolClassRepository extends JpaRepository<SchoolClassEntity, Long> {
    List<SchoolClassEntity> findByTeacher_Id(Long teacherId);
}
