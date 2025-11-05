package com.example.VidyaMitra.Domain.Resource.DTO;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResourceInDto {
    private String title;
    private String description;
    private String fileType;
    private Long uploaderId;
}
