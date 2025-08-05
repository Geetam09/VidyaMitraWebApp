package com.example.VidyaMitra.Domain.AssignmentSubmission;

import com.example.VidyaMitra.Domain.Assignment.AssignmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

//public interface AssignmentRepository extends JpaRepository<AssignmentEntity, Long> {}
public interface AssignmentSubmissionRepository extends JpaRepository<AssignmentSubmissionEntity, Long> {
    List<AssignmentSubmissionEntity> findByAssignmentId(Long assignmentId);
}
