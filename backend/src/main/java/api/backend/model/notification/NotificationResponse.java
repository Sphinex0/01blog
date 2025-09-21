package api.backend.model.notification;

import java.time.LocalDateTime;

public record NotificationResponse(
        Long id,
        Long recipientId,
        Long postId,
        String status,
        LocalDateTime createdAt
) {}
