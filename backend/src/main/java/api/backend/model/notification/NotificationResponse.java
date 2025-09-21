package api.backend.model.notification;

import java.time.LocalDateTime;

import api.backend.model.user.UserResponse;

public record NotificationResponse(
        Long id,
        // UserResponse recipient,
        UserResponse sender,
        Long postId,
        boolean read,
        LocalDateTime createdAt
) {}
