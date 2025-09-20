package api.backend.model.comment;

import java.time.LocalDateTime;

public record CommentResponse(
        Long id,
        String content,
        Long userId,
        Long postId,
        LocalDateTime createdAt,
        Long parentId, 
        Integer replyCount 
) {}