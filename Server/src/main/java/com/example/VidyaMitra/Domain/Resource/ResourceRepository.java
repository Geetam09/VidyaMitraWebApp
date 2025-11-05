package com.example.VidyaMitra.Domain.Resource;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<ResourceEntity, Long> {


    List<ResourceEntity> findByFileType(String fileType);
    List<ResourceEntity> findByTitleContainingIgnoreCase(String title);
    List<ResourceEntity> findByUploader_Id(Long uploaderId);
}
