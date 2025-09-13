package api.backend.model.post;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PostRequest(
        @NotBlank(message = "User ID is required") 
        Long user_id,
        @NotBlank(message = "Content is required") @Size(min = 3, max = 50, message = "Content must more than 3 characters") 
        String content,
        String media_url,
        String media_type
        ) {

}
