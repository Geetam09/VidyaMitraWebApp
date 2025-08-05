package com.example.VidyaMitra.Domain.PostComment;

import com.example.VidyaMitra.Domain.CommunityPost.CommunityPostEntity;
import com.example.VidyaMitra.Domain.PostComment.DTO.PostCommentInDto;
import com.example.VidyaMitra.Domain.PostComment.DTO.PostCommentOutDto;
import com.example.VidyaMitra.Domain.Teacher.TeacherEntity;

public class PostCommentMapper {
    public static PostCommentEntity toEntity(PostCommentInDto dto, CommunityPostEntity post, TeacherEntity author) {
        PostCommentEntity entity = new PostCommentEntity();
        entity.setPost(post);
        entity.setAuthor(author);
        entity.setContent(dto.getContent());
        entity.setCreatedAt(java.time.LocalDateTime.now()); // ✅ set timestamp
        return entity;
    }

    public static PostCommentOutDto toDto(PostCommentEntity entity) {
        PostCommentOutDto dto = new PostCommentOutDto();
        dto.setId(entity.getId());
        dto.setPostId(entity.getPost().getId());
        dto.setAuthorId(entity.getAuthor().getId()); // 🔁
        dto.setContent(entity.getContent());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }
}
