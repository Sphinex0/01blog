package api.backend.model.user;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Future;

public record BanRequest(Long id,
       @Future LocalDateTime until) {
}
