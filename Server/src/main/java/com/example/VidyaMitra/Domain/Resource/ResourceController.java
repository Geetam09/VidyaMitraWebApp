package com.example.VidyaMitra.Domain.Resource;

import com.example.VidyaMitra.Domain.Resource.DTO.ResourceInDto;
import com.example.VidyaMitra.Domain.Resource.DTO.ResourceOutDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin
public class ResourceController {
    @Autowired
    private ResourceService resourceService;

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<ResourceOutDto> createResource(
                                                    @RequestPart("resourceData") ResourceInDto resourceDto,
                                                    @RequestPart("file") MultipartFile file) {
        ResourceOutDto createdResource = resourceService.createResource(resourceDto, file);
        return new ResponseEntity<>(createdResource, HttpStatus.CREATED);
    }

    @GetMapping("/getAllResources")
    public ResponseEntity<List<ResourceOutDto>> getAllResources() {
        List<ResourceOutDto> resources = resourceService.getAllResources();
        return ResponseEntity.ok(resources);
    }

    @GetMapping("/getResourceById/{id}")
    public ResponseEntity<ResourceOutDto> getResourceById(@PathVariable Long id) {
        ResourceOutDto resource = resourceService.getResourceById(id);
        return ResponseEntity.ok(resource);
    }

    @GetMapping("/downloadFile/{filename:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
        try {
            Path file = Paths.get("uploads/resources").resolve(filename);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                throw new RuntimeException("Could not read the file!");
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/deleteResource/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build(); // Returns HTTP 204 No Content
    }
}

