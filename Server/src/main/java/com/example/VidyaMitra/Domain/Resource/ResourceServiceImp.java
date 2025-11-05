package com.example.VidyaMitra.Domain.Resource;

import com.example.VidyaMitra.Domain.Resource.DTO.ResourceInDto;
import com.example.VidyaMitra.Domain.Resource.DTO.ResourceOutDto;
import com.example.VidyaMitra.Domain.Teacher.TeacherEntity;
import com.example.VidyaMitra.Domain.Teacher.TeacherRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ResourceServiceImp implements ResourceService {


    private Path rootLocation = Paths.get("uploads/resources");

    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private TeacherRepository teacherRepository;


    @Transactional
    @Override
    public ResourceOutDto createResource(ResourceInDto resourceDto, MultipartFile file) {
        TeacherEntity uploader = teacherRepository.findById(resourceDto.getUploaderId())
                .orElseThrow(() -> new RuntimeException("Uploader not found with id: " + resourceDto.getUploaderId()));

        String filePath = storeFile(file);

        ResourceEntity resourceEntity = ResourceMapper.toEntity(resourceDto, uploader);
        resourceEntity.setFileUrl(filePath);
        resourceEntity.setUploadedAt(LocalDateTime.now());
        ResourceEntity savedResource = resourceRepository.save(resourceEntity);
        return ResourceMapper.toDto(savedResource);
    }

    @Override
    public List<ResourceOutDto> getAllResources() {
        return resourceRepository.findAll().stream()
                .map(ResourceMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public ResourceOutDto getResourceById(Long id) {
        ResourceEntity resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found with id: " + id));
        return ResourceMapper.toDto(resource);
    }

    @Override
    public String storeFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("Failed to store empty file.");
        }
        String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        try {
            Files.copy(file.getInputStream(), this.rootLocation.resolve(filename));
            return "/api/resources/download/" + filename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file " + filename, e);
        }
    }

    @Transactional
    @Override
    public void deleteResource(Long id) {
        ResourceEntity resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found with id: " + id));

        try {
            String fileUrl = resource.getFileUrl();
            String filename = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
            Path filePath = rootLocation.resolve(filename);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            System.err.println("Failed to delete physical file for resource id " + id + ": " + e.getMessage());
        }

        resourceRepository.deleteById(id);
    }



}
