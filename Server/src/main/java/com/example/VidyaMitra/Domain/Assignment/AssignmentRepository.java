package com.example.VidyaMitra.Domain.Assignment;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AssignmentRepository extends JpaRepository<AssignmentEntity, Long> {
    List<AssignmentEntity> findBySchoolClass_Id(Long classId);
}
