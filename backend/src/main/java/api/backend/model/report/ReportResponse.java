package api.backend.model.report;

import java.time.LocalDateTime;

import api.backend.model.user.UserResponse;

public record ReportResponse(
        Long id,
        UserResponse reporter,
        UserResponse reported,
        String reason,
        String status,
        LocalDateTime createdAt,
        LocalDateTime reviewedAt,
        Long postId // Null if not related to a specific post
) {}