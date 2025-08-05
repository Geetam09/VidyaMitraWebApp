package com.example.VidyaMitra.Domain.CommunityPost;

import com.example.VidyaMitra.Domain.CommunityPost.CommunityPostDTO.CommunityPostInDto;
import com.example.VidyaMitra.Domain.CommunityPost.CommunityPostDTO.CommunityPostOutDto;

import java.util.List;

public interface CommunityPostService {
    CommunityPostOutDto createPost(CommunityPostInDto dto);
    List<CommunityPostOutDto> getAllPosts();
    CommunityPostOutDto getPostById(Long id);
    void deletePost(Long id);
}