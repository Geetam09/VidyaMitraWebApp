package com.example.VidyaMitra.Domain.PostLike;

import com.example.VidyaMitra.Domain.CommunityPost.CommunityPostEntity;
import com.example.VidyaMitra.Domain.Teacher.TeacherEntity;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "post_likes")
@Data
public class PostLikeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Simple ID is often easier than composite keys

    @ManyToOne
    @JoinColumn(name = "user_id")
    private TeacherEntity teacher;

    @ManyToOne
    @JoinColumn(name = "post_id")
    private CommunityPostEntity post;
}
