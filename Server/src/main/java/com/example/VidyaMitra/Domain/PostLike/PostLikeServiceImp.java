package com.example.VidyaMitra.Domain.PostLike;

import com.example.VidyaMitra.Domain.CommunityPost.CommunityPostEntity;
import com.example.VidyaMitra.Domain.CommunityPost.CommunityPostRepository;
import com.example.VidyaMitra.Domain.PostLike.DTO.PostLikeInDto;
import com.example.VidyaMitra.Domain.PostLike.DTO.PostLikeOutDto;
import com.example.VidyaMitra.Domain.Teacher.TeacherEntity;
import com.example.VidyaMitra.Domain.Teacher.TeacherRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

@Service
public class PostLikeServiceImp implements PostLikeService {

    @Autowired
    private PostLikeRepository postLikeRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private CommunityPostRepository communityPostRepository;

    @Transactional
    @Override
    public PostLikeOutDto likePost(PostLikeInDto likeDto) {
        // Validate input
        Assert.notNull(likeDto, "Like data cannot be null");
        
        Long teacherId = likeDto.getTeacherId();
        Long postId = likeDto.getPostId();
        
        Assert.notNull(teacherId, "Teacher ID cannot be null");
        Assert.notNull(postId, "Post ID cannot be null");

        // Check if the like already exists
        if (postLikeRepository.existsByTeacher_IdAndPost_Id(teacherId, postId)) {
            throw new IllegalStateException("Post already liked by this user.");
        }

        // Fetching related data
        TeacherEntity user = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + teacherId));
                
        CommunityPostEntity post = communityPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));

        // Mapping DTO to Entity using the mapper
        PostLikeEntity newLike = PostLikeMapper.toEntity(likeDto, user, post);

        // Saving to the database
        PostLikeEntity savedLike = postLikeRepository.save(newLike);

        // Mapping Entity to DTO for the response
        return PostLikeMapper.toDto(savedLike);
    }

    @Transactional
    @Override
    public void unlikePost(Long postId, Long teacherId) {
        Assert.notNull(postId, "Post ID cannot be null");
        Assert.notNull(teacherId, "Teacher ID cannot be null");
        
        postLikeRepository.deleteByTeacher_IdAndPost_Id(teacherId, postId);
    }

    @Override
    public long getLikeCount(Long postId) {
        Assert.notNull(postId, "Post ID cannot be null");
        return postLikeRepository.countByPost_Id(postId);
    }

    @Override
    public boolean hasUserLikedPost(Long postId, Long teacherId) {
        if (postId == null || teacherId == null) {
            return false;
        }
        return postLikeRepository.existsByTeacher_IdAndPost_Id(teacherId, postId);
    }
}
