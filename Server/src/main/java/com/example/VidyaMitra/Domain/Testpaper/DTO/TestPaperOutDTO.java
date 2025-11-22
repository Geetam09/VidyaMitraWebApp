package com.example.VidyaMitra.Domain.Testpaper.DTO;

import lombok.Data;

import java.time.LocalTime;

@Data
public class TestPaperOutDTO {
    private Long id;

    private String title;

    private String subject;

    private String testLink;

    private boolean active;

    private LocalTime startTime;

    private LocalTime endTime;

    private Long createdByTeacherId;
    private Long classId;
    private String content;
}
