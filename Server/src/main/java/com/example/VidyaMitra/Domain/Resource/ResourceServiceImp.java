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


    private final Path rootLocation = Paths.get("uploads/resources");

    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private TeacherRepository teacherRepository;


    @Transactional
    @Override
    public ResourceOutDto createResource(ResourceInDto resourceDto, MultipartFile file) {
        // 1. Fetch the uploader
        TeacherEntity uploader = teacherRepository.findById(resourceDto.getUploaderId())
                .orElseThrow(() -> new RuntimeException("Uploader not found with id: " + resourceDto.getUploaderId()));

        // 2. Store the physical file and get its path
        String filePath = storeFile(file);

        // 3. Create and save the entity
        ResourceEntity resourceEntity = ResourceMapper.toEntity(resourceDto, uploader);
        resourceEntity.setFileUrl(filePath); // Set the path to the stored file
        resourceEntity.setUploadedAt(LocalDateTime.now());
        ResourceEntity savedResource = resourceRepository.save(resourceEntity);

        // 4. Return the DTO
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
        // Create a unique filename to avoid conflicts
        String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        try {
            Files.copy(file.getInputStream(), this.rootLocation.resolve(filename));
            return "/api/resources/download/" + filename; // Return a URL to download the file
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file " + filename, e);
        }
    }

    @Transactional
    @Override
    public void deleteResource(Long id) {
        // 1. Find the resource entity or throw an exception
        ResourceEntity resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found with id: " + id));

        // 2. Delete the physical file from the server
        try {
            String fileUrl = resource.getFileUrl();
            // Extract filename from the URL (e.g., from "/api/resources/download/filename.pdf")
            String filename = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
            Path filePath = rootLocation.resolve(filename);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            // Log the error but proceed to delete the DB record
            System.err.println("Failed to delete physical file for resource id " + id + ": " + e.getMessage());
        }

        // 3. Delete the record from the database
        resourceRepository.deleteById(id);
    }



}
