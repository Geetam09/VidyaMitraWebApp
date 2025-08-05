package com.example.VidyaMitra.Domain.PostComment;

import com.example.VidyaMitra.Domain.CommunityPost.CommunityPostEntity;
import com.example.VidyaMitra.Domain.CommunityPost.CommunityPostRepository;
import com.example.VidyaMitra.Domain.PostComment.DTO.PostCommentInDto;
import com.example.VidyaMitra.Domain.PostComment.DTO.PostCommentOutDto;
import com.example.VidyaMitra.Domain.Teacher.TeacherEntity;
import com.example.VidyaMitra.Domain.Teacher.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostCommentServiceImpl implements PostCommentService {

    @Autowired
    private PostCommentRepository postCommentRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private CommunityPostRepository communityPostRepository;

    @Override
    public PostCommentOutDto addComment(PostCommentInDto dto) {
        TeacherEntity teacher = teacherRepository.findById(dto.getTeacherId())
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
        CommunityPostEntity post = communityPostRepository.findById(dto.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found"));

        PostCommentEntity entity = PostCommentMapper.toEntity(dto, post, teacher);
        return PostCommentMapper.toDto(postCommentRepository.save(entity));
    }

    @Override
    public List<PostCommentOutDto> getCommentsByPostId(Long postId) {
        return postCommentRepository.findByPost_Id(postId)
                .stream()
                .map(PostCommentMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteComment(Long commentId) {
        postCommentRepository.deleteById(commentId);
    }
}
