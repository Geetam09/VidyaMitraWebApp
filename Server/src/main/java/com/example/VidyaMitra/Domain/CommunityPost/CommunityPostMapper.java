package com.example.VidyaMitra.Domain.CommunityPost;

import com.example.VidyaMitra.Domain.CommunityPost.CommunityPostDTO.CommunityPostInDto;
import com.example.VidyaMitra.Domain.CommunityPost.CommunityPostDTO.CommunityPostOutDto;
import com.example.VidyaMitra.Domain.Teacher.TeacherEntity;

public class CommunityPostMapper {

    public static CommunityPostEntity toEntity(CommunityPostInDto dto, TeacherEntity author) {
        CommunityPostEntity entity = new CommunityPostEntity();
        entity.setAuthor(author);
        entity.setContent(dto.getContent());
        entity.setImageUrl(dto.getImageUrl());
        entity.setCreatedAt(java.time.LocalDateTime.now());
        return entity;
    }

    public static CommunityPostOutDto toDto(CommunityPostEntity entity) {
        CommunityPostOutDto dto = new CommunityPostOutDto();
        dto.setId(entity.getId());
        dto.setAuthorId(entity.getAuthor().getId());
        dto.setContent(entity.getContent());
        dto.setImageUrl(entity.getImageUrl());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setTotalLikes(entity.getLikes() != null ? entity.getLikes().size() : 0);
        dto.setTotalComments(entity.getComments() != null ? entity.getComments().size() : 0);
        return dto;
    }
}