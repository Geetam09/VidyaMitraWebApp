package com.example.VidyaMitra.Domain.CommunityPost;

import com.example.VidyaMitra.Domain.CommunityPost.CommunityPostDTO.CommunityPostInDto;
import com.example.VidyaMitra.Domain.CommunityPost.CommunityPostDTO.CommunityPostOutDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CommunityPostService {
    CommunityPostOutDto createPost(CommunityPostInDto dto);
    List<CommunityPostOutDto> getAllPosts();
    CommunityPostOutDto getPostById(Long id);
    void deletePost(Long id);
    public void uploadPostImage(Long id, MultipartFile file);
    public ResponseEntity<byte[]> getPostImage(Long id);
}