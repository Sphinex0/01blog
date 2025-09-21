package api.backend.model.report;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ReportRequest(
        @NotBlank(message = "Reason is required")
        @Size(max = 500, message = "Reason cannot exceed 500 characters")
        String reason,
        Long postId // Optional, null if not related to a specific post
) {}