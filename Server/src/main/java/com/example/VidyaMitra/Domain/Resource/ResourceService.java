package com.example.VidyaMitra.Domain.Resource;

import com.example.VidyaMitra.Domain.Resource.DTO.ResourceInDto;
import com.example.VidyaMitra.Domain.Resource.DTO.ResourceOutDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ResourceService {
     ResourceOutDto createResource(ResourceInDto resourceDto, MultipartFile file);
     List<ResourceOutDto> getAllResources();
     ResourceOutDto getResourceById(Long id);
     String storeFile(MultipartFile file);
     void deleteResource(Long id);
}
