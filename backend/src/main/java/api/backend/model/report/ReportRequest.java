package api.backend.model.report;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ReportRequest(
        Long reportedUserId,
        Long reportedPostId,
        @NotBlank @Size(max = 1000) String reason
) {}