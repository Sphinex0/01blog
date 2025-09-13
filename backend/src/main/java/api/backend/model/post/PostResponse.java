package api.backend.model.post;

import java.time.LocalDateTime;

public record PostResponse(
    Long id,
    String username, // From user, instead of full User object
    String content,
    String mediaUrl,
    LocalDateTime createdAt,
    Integer likesCount,
    Integer commentsCount
) {}