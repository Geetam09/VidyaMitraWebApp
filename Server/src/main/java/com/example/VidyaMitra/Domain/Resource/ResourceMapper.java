package com.example.VidyaMitra.Domain.Resource;

import com.example.VidyaMitra.Domain.Resource.DTO.ResourceInDto;
import com.example.VidyaMitra.Domain.Resource.DTO.ResourceOutDto;
import com.example.VidyaMitra.Domain.Teacher.TeacherEntity;
import org.hibernate.annotations.Comment;
import org.springframework.stereotype.Component;

@Component
public class ResourceMapper {
    public static ResourceOutDto toDto(ResourceEntity entity) {
        if (entity == null) {
            return null;
        }
        ResourceOutDto dto = new ResourceOutDto();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setDescription(entity.getDescription());
        dto.setFileUrl(entity.getFileUrl());
        dto.setFileType(entity.getFileType());
        dto.setUploadedAt(entity.getUploadedAt());
        dto.setUploaderId(entity.getUploader().getId());
        dto.setUploaderName(entity.getUploader().getFirstName() + " " + entity.getUploader().getLastName());
        return dto;
    }

    public static ResourceEntity toEntity(ResourceInDto dto, TeacherEntity uploader) {
        if (dto == null) {
            return null;
        }
        ResourceEntity entity = new ResourceEntity();
        entity.setTitle(dto.getTitle());
        entity.setDescription(dto.getDescription());
        entity.setFileType(dto.getFileType());
        entity.setUploader(uploader);
        return entity;
    }
}
