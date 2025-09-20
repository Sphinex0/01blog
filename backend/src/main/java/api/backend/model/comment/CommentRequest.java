package api.backend.model.comment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CommentRequest(
        @NotBlank(message = "Content is required")
        @Size(max = 2000, message = "Content cannot exceed 2000 characters")
        String content,
        Long parentId
) {}