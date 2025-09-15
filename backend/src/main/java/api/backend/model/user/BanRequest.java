package api.backend.model.user;

import java.time.LocalDateTime;

public record BanRequest(Long id, LocalDateTime until) {
}
