package com.example.VidyaMitra.Domain.PostComment;

import com.example.VidyaMitra.Domain.PostComment.DTO.PostCommentInDto;
import com.example.VidyaMitra.Domain.PostComment.DTO.PostCommentOutDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "http://localhost:3000")
public class PostCommentController {

    @Autowired
    private PostCommentService postCommentService;

    @PostMapping("/add")
    public ResponseEntity<PostCommentOutDto> addComment(@RequestBody PostCommentInDto dto) {
        return ResponseEntity.ok(postCommentService.addComment(dto));
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<PostCommentOutDto>> getComments(@PathVariable Long postId) {
        return ResponseEntity.ok(postCommentService.getCommentsByPostId(postId));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        postCommentService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }
}
