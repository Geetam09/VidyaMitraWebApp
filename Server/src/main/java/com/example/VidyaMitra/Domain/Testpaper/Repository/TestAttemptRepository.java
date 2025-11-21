package com.example.VidyaMitra.Domain.Testpaper.Repository;

import com.example.VidyaMitra.Domain.Testpaper.Entity.TestAttempt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TestAttemptRepository extends JpaRepository<TestAttempt, Long> {
    Optional<TestAttempt> findByTestIdAndStudentId(Long testId, Long studentId);
    List<TestAttempt> findByTestId(Long testId);
}
