package api.backend.model.post;

import jakarta.validation.constraints.Size;

public record PostUpdateRequest(
    @Size(max = 255, message = "Title cannot exceed 255 characters")
    String title,
    @Size(max = 10000, message = "Content cannot exceed 10000 characters")
    String content
) {}