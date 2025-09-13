package api.backend.model.post;

import jakarta.validation.constraints.Size;

public record PostUpdateRequest(
    @Size(max = 10000, message = "Content cannot exceed 10000 characters")
    String content,

    @Size(max = 255, message = "Media URL cannot exceed 255 characters")
    String mediaUrl
) {}