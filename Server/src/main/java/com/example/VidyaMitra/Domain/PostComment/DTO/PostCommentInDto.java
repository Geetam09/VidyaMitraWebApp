package com.example.VidyaMitra.Domain.PostComment.DTO;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PostCommentInDto {
    private Long postId;
    private Long authorId; // 🔁 aligned with `author`
    private String content;
    private Long TeacherId;
}
