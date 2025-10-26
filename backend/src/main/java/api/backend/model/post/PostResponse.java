package api.backend.model.post;

import java.time.LocalDateTime;

import api.backend.model.user.UserResponse;

public record PostResponse(
    Long id,
    UserResponse user, 
    String title,
    String content,
    LocalDateTime createdAt,
    Integer likesCount,
    Integer commentsCount,
    boolean isLiked,
    boolean isHidden
) {}