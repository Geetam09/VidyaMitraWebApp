package com.example.VidyaMitra.Domain.PostLike.DTO;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PostLikeOutDto {
    private Long id;
    private Long postId;
    private Long TeacherId;
}
