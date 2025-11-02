package api.backend.model.user;

import java.time.LocalDateTime;

public record UserReportSummary(Long userId, String username, String fullName, String avatar,
        long reportCount,LocalDateTime lastReportedAt) {
}
