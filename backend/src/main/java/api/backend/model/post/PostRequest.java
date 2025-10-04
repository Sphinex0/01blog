package api.backend.model.post;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PostRequest(
    @Size(max = 255, message = "Media URL cannot exceed 255 characters")
    String title,

    @NotBlank(message = "Content is required")
    @Size(max = 10000, message = "Content cannot exceed 10000 characters")
    String content


) {}