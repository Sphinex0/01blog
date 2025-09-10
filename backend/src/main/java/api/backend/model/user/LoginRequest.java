package api.backend.model.user;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String passwordHash;  // Plain password
}