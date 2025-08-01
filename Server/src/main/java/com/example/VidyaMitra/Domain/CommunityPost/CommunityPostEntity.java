package com.example.VidyaMitra.Domain.CommunityPost;

import com.example.VidyaMitra.Domain.PostComment.PostCommentEntity;
import com.example.VidyaMitra.Domain.PostLike.PostLikeEntity;
import com.example.VidyaMitra.Domain.Teacher.TeacherEntity;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "community_posts")
@Data
public class CommunityPostEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "author_id", nullable = false)
    private TeacherEntity author;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String imageUrl;

    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "post")
    private List<PostCommentEntity> comments;

    @OneToMany(mappedBy = "post")
    private List<PostLikeEntity> likes;
}
