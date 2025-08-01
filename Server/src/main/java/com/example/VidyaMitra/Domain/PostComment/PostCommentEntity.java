package com.example.VidyaMitra.Domain.PostComment;

import com.example.VidyaMitra.Domain.CommunityPost.CommunityPostEntity;
import com.example.VidyaMitra.Domain.Teacher.TeacherEntity;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "post_comments")
@Data
public class PostCommentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "post_id")
    private CommunityPostEntity post;

    @ManyToOne
    @JoinColumn(name = "author_id")
    private TeacherEntity author;

    private String content;
    private LocalDateTime createdAt;
}
