package com.example.VidyaMitra.Domain.CommunityPost;

import com.example.VidyaMitra.Domain.CommunityPost.CommunityPostDTO.CommunityPostInDto;
import com.example.VidyaMitra.Domain.CommunityPost.CommunityPostDTO.CommunityPostOutDto;
import com.example.VidyaMitra.Domain.Teacher.TeacherEntity;
import com.example.VidyaMitra.Domain.Teacher.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLConnection;
import java.time.LocalDateTime;
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
        CommunityPostEntity saved = communityPostRepository.save(entity);
        return CommunityPostMapper.toDto(saved);
    }

    @Override
    public void uploadPostImage(Long id, MultipartFile file) {
        CommunityPostEntity post = communityPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        try {
            post.setImageUrl(file.getBytes());
            communityPostRepository.save(post);
        } catch (IOException e) {
            throw new RuntimeException("Error uploading image", e);
        }
    }

    @Override
    public ResponseEntity<byte[]> getPostImage(Long id) {
        CommunityPostEntity post = communityPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (post.getImageUrl() == null) {
            return ResponseEntity.notFound().build();
        }

        try (InputStream is = new ByteArrayInputStream(post.getImageUrl())) {
            String mimeType = URLConnection.guessContentTypeFromStream(is);
            if (mimeType == null) mimeType = MediaType.APPLICATION_OCTET_STREAM_VALUE;

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(mimeType))
                    .body(post.getImageUrl());
        } catch (IOException e) {
            throw new RuntimeException("Error reading image", e);
        }
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