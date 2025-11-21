package com.example.VidyaMitra.Domain.Testpaper.Mapper;

import com.example.VidyaMitra.Domain.Testpaper.DTO.TestPaperInDTO;
import com.example.VidyaMitra.Domain.Testpaper.DTO.TestPaperOutDTO;
import com.example.VidyaMitra.Domain.Testpaper.Entity.TestPaper;
import org.springframework.stereotype.Component;

@Component
public class TestPaperMapper {
    public TestPaper toEntity(TestPaperInDTO dto, String testLink) {
        return TestPaper.builder()
                .title(dto.getTitle())
                .subject(dto.getSubject())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .testLink(testLink)
                .active(true)
                .createdByTeacherId(dto.getCreatedByTeacherId())
                .build();
    }
    public TestPaperOutDTO toOutDTO(TestPaper entity) {
        TestPaperOutDTO dto = new TestPaperOutDTO();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setSubject(entity.getSubject());
        dto.setTestLink(entity.getTestLink());
        dto.setActive(entity.isActive());
        dto.setStartTime(entity.getStartTime() != null ? entity.getStartTime().toString() : null);
        dto.setEndTime(entity.getEndTime() != null ? entity.getEndTime().toString() : null);
        dto.setCreatedByTeacherId(entity.getCreatedByTeacherId());
        return dto;
    }

}
