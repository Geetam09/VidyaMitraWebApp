package com.example.VidyaMitra.Domain.PostLike;

import com.example.VidyaMitra.Domain.CommunityPost.CommunityPostEntity;
import com.example.VidyaMitra.Domain.PostLike.DTO.PostLikeInDto;
import com.example.VidyaMitra.Domain.PostLike.DTO.PostLikeOutDto;
import com.example.VidyaMitra.Domain.Teacher.TeacherEntity;
import org.springframework.stereotype.Component;

@Component
public class PostLikeMapper {
    /**
     * Converts a PostLikeEntity to a PostLikeOutDto.
     */
    public static PostLikeOutDto toDto(PostLikeEntity entity) {
        if (entity == null) {
            return null;
        }
        PostLikeOutDto dto = new PostLikeOutDto();
        dto.setId(entity.getId());
        dto.setPostId(entity.getPost().getId());
        dto.setTeacherId(entity.getUser().getId());
        return dto;
    }

    /**
     * Converts a PostLikeInDto to a PostLikeEntity.
     * It requires the fetched User and Post entities to build the relationship.
     */
    public static PostLikeEntity toEntity(PostLikeInDto dto, TeacherEntity user, CommunityPostEntity post) {
        if (dto == null) {
            return null;
        }
        PostLikeEntity entity = new PostLikeEntity();
        entity.setUser(user);
        entity.setPost(post);
        return entity;
    }
}
