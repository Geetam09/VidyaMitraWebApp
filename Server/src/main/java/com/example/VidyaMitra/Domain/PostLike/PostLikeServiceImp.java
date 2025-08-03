package com.example.VidyaMitra.Domain.PostLike;

import com.example.VidyaMitra.Domain.CommunityPost.CommunityPostEntity;
import com.example.VidyaMitra.Domain.PostLike.DTO.PostLikeInDto;
import com.example.VidyaMitra.Domain.PostLike.DTO.PostLikeOutDto;
import com.example.VidyaMitra.Domain.Teacher.TeacherEntity;
import com.example.VidyaMitra.Domain.Teacher.TeacherRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PostLikeServiceImp implements PostLikeService {

    @Autowired
    private PostLikeRepository postLikeRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private  CommunityPostRepository communityPostRepository;



        @Transactional
        @Override
        public PostLikeOutDto likePost(PostLikeInDto likeDto) {
            // 1. Validation
            if (postLikeRepository.existsByTeacher_IdAndPost_Id(likeDto.getTeacherId(), likeDto.getPostId())) {
                throw new IllegalStateException("Post already liked by this user.");
            }

            // 2. Fetching related data
            TeacherEntity user = teacherRepository.findById(likeDto.getTeacherId())
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + likeDto.getTeacherId()));
            CommunityPostEntity post = communityPostRepository.findById(likeDto.getPostId())
                    .orElseThrow(() -> new RuntimeException("Post not found with id: " + likeDto.getPostId()));

            // 3. Mapping DTO to Entity using the mapper
            PostLikeEntity newLike = PostLikeMapper.toEntity(likeDto, user, post);

            // 4. Saving to the database
            PostLikeEntity savedLike = postLikeRepository.save(newLike);

            // 5. Mapping Entity to DTO for the response
            return PostLikeMapper.toDto(savedLike);
        }

    @Transactional
    @Override
    public void unlikePost(Long postId, Long TeacherId) {
        long deletedCount = postLikeRepository.deleteByTeacher_IdAndPost_Id(TeacherId, postId);
    }

    @Override
    public long getLikeCount(Long postId) {
        return postLikeRepository.countByPost_Id(postId);
    }

    @Override
    public boolean hasUserLikedPost(Long postId, Long TeacherId) {
        return postLikeRepository.existsByTeacher_IdAndPost_Id(TeacherId, postId);
    }

}
