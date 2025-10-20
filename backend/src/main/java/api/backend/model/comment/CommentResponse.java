package api.backend.model.comment;

import java.time.LocalDateTime;

import api.backend.model.user.UserResponse;

public record CommentResponse(
                Long id,
                String content,
                UserResponse user,
                Long postId,
                LocalDateTime createdAt,
                Long parentId,
                int likesCount,
                Integer repliesCount,
                boolean isLiked) {
}