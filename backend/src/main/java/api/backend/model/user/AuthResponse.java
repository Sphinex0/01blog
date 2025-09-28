package api.backend.model.user;

public record AuthResponse(
        String token,
        UserResponse user) {
}
