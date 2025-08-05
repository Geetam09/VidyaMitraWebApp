package com.example.VidyaMitra.Domain.CommunityPost.CommunityPostDTO;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommunityPostOutDto {
    private Long id;
    private Long authorId;
    private String content;
    private String imageUrl;
    private LocalDateTime createdAt;
    private int totalLikes;
    private int totalComments;
}