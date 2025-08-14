package com.example.VidyaMitra.Domain.CommunityPost.CommunityPostDTO;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CommunityPostOutDto {
    private Long id;
    private Long authorId;
    private String content;
    private String imageUrl;
    private LocalDateTime createdAt;
    private int totalLikes;
    private int totalComments;
}