package com.example.VidyaMitra.Domain.CommunityPost;

import com.example.VidyaMitra.Domain.CommunityPost.CommunityPostDTO.CommunityPostInDto;
import com.example.VidyaMitra.Domain.CommunityPost.CommunityPostDTO.CommunityPostOutDto;
import com.example.VidyaMitra.Domain.Teacher.TeacherEntity;
import com.example.VidyaMitra.Domain.Teacher.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommunityPostServiceImpl implements CommunityPostService {

    private final CommunityPostRepository communityPostRepository;
    private final TeacherRepository teacherRepository;

    @Override
    public CommunityPostOutDto createPost(CommunityPostInDto dto) {
        TeacherEntity author = teacherRepository.findById(dto.getAuthorId())
                .orElseThrow(() -> new RuntimeException("Author not found"));

        CommunityPostEntity entity = CommunityPostMapper.toEntity(dto, author);
        return CommunityPostMapper.toDto(communityPostRepository.save(entity));
    }

    @Override
    public List<CommunityPostOutDto> getAllPosts() {
        return communityPostRepository.findAll()
                .stream()
                .map(CommunityPostMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public CommunityPostOutDto getPostById(Long id) {
        return communityPostRepository.findById(id)
                .map(CommunityPostMapper::toDto)
                .orElseThrow(() -> new RuntimeException("Post not found"));
    }

    @Override
    public void deletePost(Long id) {
        communityPostRepository.deleteById(id);
    }
}