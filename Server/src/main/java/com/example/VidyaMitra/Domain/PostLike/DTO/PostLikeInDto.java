package com.example.VidyaMitra.Domain.PostLike.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PostLikeInDto {
    @JsonProperty("postId")
    private Long postId;
    
    @JsonProperty("TeacherId")  // Match the exact case from JSON
    private Long teacherId;
}
