package com.example.VidyaMitra.Domain.PostLike;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostLikeRepository extends JpaRepository<PostLikeEntity, Long> {
    // Checks if a like exists for a given user and post
    boolean existsByTeacher_IdAndPost_Id(Long TeacherId, Long postId);

    // Counts all likes for a given post
    long countByPost_Id(Long postId);

    // Deletes a like for a given user and post
    // The return value indicates how many rows were deleted
    long deleteByTeacher_IdAndPost_Id(Long TeacherId, Long postId);
}
