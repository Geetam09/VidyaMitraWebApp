package com.example.VidyaMitra.Domain.CommunityPost;

import com.example.VidyaMitra.Domain.CommunityPost.CommunityPostDTO.CommunityPostInDto;
import com.example.VidyaMitra.Domain.CommunityPost.CommunityPostDTO.CommunityPostOutDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/community-posts")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class CommunityPostController {

    private final CommunityPostService communityPostService;

    @PostMapping("/createPost")
    public ResponseEntity<CommunityPostOutDto> createPost(
            @RequestParam("authorId") Long authorId,
            @RequestParam("content") String content,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        CommunityPostInDto postDto = new CommunityPostInDto();
        postDto.setAuthorId(authorId);
        postDto.setContent(content);

        // Save post without image first
        CommunityPostOutDto createdPost = communityPostService.createPost(postDto);

        // Then upload image (if provided)
        if (image != null && !image.isEmpty()) {
            communityPostService.uploadPostImage(createdPost.getId(), image);
        }

        return new ResponseEntity<>(createdPost, HttpStatus.CREATED);
    }


    @GetMapping("/getAllPosts")
    public ResponseEntity<List<CommunityPostOutDto>> getAllPosts() {
        return ResponseEntity.ok(communityPostService.getAllPosts());
    }

    @GetMapping("/getPostById/{id}")
    public ResponseEntity<CommunityPostOutDto> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(communityPostService.getPostById(id));
    }

    @DeleteMapping("/deletePost/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        communityPostService.deletePost(id);
        return ResponseEntity.noContent().build();
    }
}