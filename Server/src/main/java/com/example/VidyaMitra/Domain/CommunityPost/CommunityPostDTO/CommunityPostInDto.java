package com.example.VidyaMitra.Domain.CommunityPost.CommunityPostDTO;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CommunityPostInDto {
    private Long authorId;
    private String content;
    private String imageUrl;
}