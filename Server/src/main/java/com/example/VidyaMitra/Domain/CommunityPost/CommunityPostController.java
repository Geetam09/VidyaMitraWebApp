package com.example.VidyaMitra.Domain.CommunityPost;

import com.example.VidyaMitra.Domain.CommunityPost.CommunityPostDTO.CommunityPostInDto;
import com.example.VidyaMitra.Domain.CommunityPost.CommunityPostDTO.CommunityPostOutDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/community-posts")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class CommunityPostController {

    private final CommunityPostService communityPostService;

    @PostMapping
    public ResponseEntity<CommunityPostOutDto> createPost(@RequestBody CommunityPostInDto dto) {
        return ResponseEntity.ok(communityPostService.createPost(dto));
    }

    @GetMapping
    public ResponseEntity<List<CommunityPostOutDto>> getAllPosts() {
        return ResponseEntity.ok(communityPostService.getAllPosts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommunityPostOutDto> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(communityPostService.getPostById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        communityPostService.deletePost(id);
        return ResponseEntity.noContent().build();
    }
}