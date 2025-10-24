package api.backend.model.user;

import java.time.LocalDateTime;

public record AdminUserResponse(
        Long id,
        String fullName,
        String username,
        String email,
        String role,
        String avatar,
        LocalDateTime createdAt,
        int postsCount,
        int followersCount,
        int followingCount,
        boolean isFollowed,
        boolean isBanned,
        LocalDateTime bannedUntil
        ) {
}
