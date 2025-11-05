package com.example.VidyaMitra.Domain.PostLike;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostLikeRepository extends JpaRepository<PostLikeEntity, Long> {
    boolean existsByTeacher_IdAndPost_Id(Long TeacherId, Long postId);
    long countByPost_Id(Long postId);
    long deleteByTeacher_IdAndPost_Id(Long TeacherId, Long postId);
}
