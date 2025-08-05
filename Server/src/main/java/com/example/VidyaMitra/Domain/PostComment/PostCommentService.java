package com.example.VidyaMitra.Domain.PostComment;

import com.example.VidyaMitra.Domain.PostComment.DTO.PostCommentInDto;
import com.example.VidyaMitra.Domain.PostComment.DTO.PostCommentOutDto;
import java.util.List;

public interface PostCommentService {
    PostCommentOutDto addComment(PostCommentInDto dto);
    List<PostCommentOutDto> getCommentsByPostId(Long postId);
    void deleteComment(Long commentId);
}
