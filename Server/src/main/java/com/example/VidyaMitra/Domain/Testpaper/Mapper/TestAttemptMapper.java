package com.example.VidyaMitra.Domain.Testpaper.Mapper;

import com.example.VidyaMitra.Domain.Testpaper.DTO.TestAttemptInDTO;
import com.example.VidyaMitra.Domain.Testpaper.DTO.TestAttemptOutDTO;
import com.example.VidyaMitra.Domain.Testpaper.Entity.TestAttempt;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class TestAttemptMapper {
    public TestAttempt toEntity(TestAttemptInDTO dto) {
        return TestAttempt.builder()
                .testId(dto.getTestId())
                .studentId(dto.getStudentId())
                .startedAt(LocalDateTime.now())
                .tabSwitchDetected(false)
                .tabSwitchCount(0)
                .cancelled(false)
                .submitted(false)
                .blocked(false)
                .score(null)
                .passed(null)
                .build();
    }

    public TestAttemptOutDTO toOutDTO(TestAttempt entity) {
        return TestAttemptOutDTO.builder()
                .id(entity.getId())
                .testId(entity.getTestId())
                .studentId(entity.getStudentId())
                .startedAt(entity.getStartedAt())
                .endedAt(entity.getEndedAt())
                .tabSwitchDetected(entity.isTabSwitchDetected())
                .tabSwitchCount(entity.getTabSwitchCount())
                .cancelled(entity.isCancelled())
                .submitted(entity.isSubmitted())
                .blocked(entity.isBlocked())
                .score(entity.getScore())
                .passed(entity.getPassed())
                .build();
    }
}
