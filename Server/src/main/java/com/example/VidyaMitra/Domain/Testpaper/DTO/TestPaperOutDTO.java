package com.example.VidyaMitra.Domain.Testpaper.DTO;

import lombok.Data;

@Data
public class TestPaperOutDTO {
    private Long id;

    private String title;

    private String subject;

    private String testLink;

    private boolean active;

    private String startTime;

    private String endTime;

    private Long createdByTeacherId;
}
