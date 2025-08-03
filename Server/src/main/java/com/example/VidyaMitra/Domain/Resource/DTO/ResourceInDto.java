package com.example.VidyaMitra.Domain.Resource.DTO;

import lombok.Data;

@Data
public class ResourceInDto {
    private String title;
    private String description;
    private String fileType; // e.g., "PDF", "Worksheet"
    private Long uploaderId;
}
