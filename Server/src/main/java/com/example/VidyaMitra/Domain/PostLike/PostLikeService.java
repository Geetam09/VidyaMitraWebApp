package com.example.VidyaMitra.Domain.PostLike;


import com.example.VidyaMitra.Domain.PostLike.DTO.PostLikeInDto;
import com.example.VidyaMitra.Domain.PostLike.DTO.PostLikeOutDto;

public interface PostLikeService {
    PostLikeOutDto likePost(PostLikeInDto likeDto);

    public void unlikePost(Long postId, Long userId);

    long getLikeCount(Long postId);

    boolean hasUserLikedPost(Long postId, Long userId);

}
