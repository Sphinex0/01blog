package api.backend.model.report;

import java.time.LocalDateTime;

public record ReportResponse(
        Long id,
        String reason,
        String status,
        LocalDateTime createdAt,
        LocalDateTime reviewedAt
) {}