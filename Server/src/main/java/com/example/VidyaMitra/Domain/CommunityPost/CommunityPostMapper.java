package com.example.VidyaMitra.Domain.CommunityPost;

import com.example.VidyaMitra.Domain.CommunityPost.CommunityPostDTO.CommunityPostInDto;
import com.example.VidyaMitra.Domain.CommunityPost.CommunityPostDTO.CommunityPostOutDto;
import com.example.VidyaMitra.Domain.Teacher.TeacherEntity;

import java.time.LocalDateTime;
import java.util.Base64;

public class CommunityPostMapper {

    // Convert input DTO + author entity to Post entity
    public static CommunityPostEntity toEntity(CommunityPostInDto dto, TeacherEntity author) {
        CommunityPostEntity entity = new CommunityPostEntity();
        entity.setAuthor(author);
        entity.setContent(dto.getContent());
        entity.setCreatedAt(LocalDateTime.now());
        return entity;
    }

    // Convert entity to output DTO
    public static CommunityPostOutDto toDto(CommunityPostEntity entity) {
        if (entity == null) return null;

        CommunityPostOutDto dto = new CommunityPostOutDto();
        dto.setId(entity.getId());

        if (entity.getAuthor() != null) {
            dto.setAuthorId(entity.getAuthor().getId());
            dto.setAuthorName(entity.getAuthor().getFirstName() + " " + entity.getAuthor().getLastName());
        }

        dto.setContent(entity.getContent());
        dto.setCreatedAt(entity.getCreatedAt());

        // Convert image to Base64 for frontend
        if (entity.getImageUrl() != null) {
            dto.setImageUrl("data:image/jpeg;base64," + Base64.getEncoder().encodeToString(entity.getImageUrl()));
        }

        dto.setTotalLikes(entity.getLikes() != null ? entity.getLikes().size() : 0);
        dto.setTotalComments(entity.getComments() != null ? entity.getComments().size() : 0);

        return dto;
    }
}
