package com.example.VidyaMitra.Domain.PostComment.DTO;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PostCommentOutDto {
    private Long id;
    private Long postId;
    private Long authorId;
    private String content;
    private LocalDateTime createdAt;
}

