package com.example.VidyaMitra.Domain.PostLike;

import com.example.VidyaMitra.Domain.PostLike.DTO.PostLikeInDto;
import com.example.VidyaMitra.Domain.PostLike.DTO.PostLikeOutDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/postLike/") // A common base path for API endpoints
public class PostLikeController {

    @Autowired
    private PostLikeService postLikeService;

    /**
     * Creates a like for a post. The request body should contain postId and userId.
     * Example URL: POST /api/postLike/addLikes
     */
    @PostMapping("/addLikes")
    public ResponseEntity<PostLikeOutDto> likePost(@RequestBody PostLikeInDto likeDto) {
        PostLikeOutDto createdLike = postLikeService.likePost(likeDto);
        return new ResponseEntity<>(createdLike, HttpStatus.CREATED);
    }

    /**
     * Deletes a like from a post.
     * Example URL: DELETE /api/postLike/unlike?postId=101&userId=5
     */
    @DeleteMapping("/unlike")
    public ResponseEntity<Void> unlikePost(@RequestParam Long postId, @RequestParam Long TeacherId) {
        postLikeService.unlikePost(postId, TeacherId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Gets the total number of likes for a post.
     * Example URL: GET /api/postLike/posts/likesCount/{postId}
     */
    @GetMapping("/posts/likesCount/{postId}")
    public ResponseEntity<Long> getLikeCount(@PathVariable Long postId) {
        long count = postLikeService.getLikeCount(postId);
        return ResponseEntity.ok(count);
    }

    /**
     * Checks if a specific user has liked a post.
     * Example URL: GET /api/posts/101/likes/status?userId=5
     */
    @GetMapping("/posts/{postId}/likes/status")
    public ResponseEntity<Boolean> getLikeStatus(@PathVariable Long postId, @RequestParam Long TeacherId) {
        boolean hasLiked = postLikeService.hasUserLikedPost(postId, TeacherId);
        return ResponseEntity.ok(hasLiked);
    }
}

