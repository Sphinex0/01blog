package api.backend.model.user;

import lombok.Data;

@Data
public class RegisterRequest {
    private String fullName;
    private String username;
    private String email;
    private String passwordHash;  // Plain password; encode in controller
    // Add other fields like birthDate if needed
}