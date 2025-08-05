package com.example.VidyaMitra.Domain.PostComment.DTO;

import lombok.Data;

@Data
public class PostCommentInDto {
    private Long postId;
    private Long authorId; // 🔁 aligned with `author`
    private String content;
    private Long TeacherId;
}
