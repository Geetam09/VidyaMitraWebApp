package com.example.VidyaMitra.Domain.Resource.DTO;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ResourceOutDto {
    private Long id;
    private String title;
    private String description;
    private String fileUrl;
    private String fileType;
    private Long uploaderId;
    private String uploaderName;
    private LocalDateTime uploadedAt;
}
