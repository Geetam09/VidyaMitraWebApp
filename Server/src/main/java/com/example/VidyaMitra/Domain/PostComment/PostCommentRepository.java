package com.example.VidyaMitra.Domain.PostComment;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PostCommentRepository extends JpaRepository<PostCommentEntity, Long> {
    List<PostCommentEntity> findByPost_Id(Long postId);
}
