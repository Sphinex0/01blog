package api.backend.model.subscription;

import jakarta.validation.constraints.NotNull;

public record SubscribeRequest(
        @NotNull(message = "Target user ID is required") Long subscribedTo) {
}