package com.example.VidyaMitra.Domain.CommunityPost.CommunityPostDTO;

import lombok.Data;

@Data
public class CommunityPostInDto {
    private Long authorId;
    private String content;
    private String imageUrl;
}