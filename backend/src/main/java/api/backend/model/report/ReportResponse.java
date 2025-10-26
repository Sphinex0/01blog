package api.backend.model.report;

import java.time.LocalDateTime;

import api.backend.model.user.AdminUserResponse;
import api.backend.model.user.UserResponse;

public record ReportResponse(
        Long id,
        UserResponse reporter,
        AdminUserResponse reported,
        String reason,
        String status,
        LocalDateTime createdAt,
        LocalDateTime reviewedAt,
        Long postId,
        boolean postHidden
) {}