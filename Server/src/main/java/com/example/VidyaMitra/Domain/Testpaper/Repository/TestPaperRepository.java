package com.example.VidyaMitra.Domain.Testpaper.Repository;

import com.example.VidyaMitra.Domain.Testpaper.Entity.TestPaper;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public interface TestPaperRepository extends JpaRepository<TestPaper, Long> {
    List<TestPaper>findByActiveTrue();
    List<TestPaper> findByEndTimeBefore(LocalTime currentTime);
}
