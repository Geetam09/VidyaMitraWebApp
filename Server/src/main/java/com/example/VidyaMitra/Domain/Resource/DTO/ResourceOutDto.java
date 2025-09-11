package com.example.VidyaMitra.Domain.Resource.DTO;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
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
