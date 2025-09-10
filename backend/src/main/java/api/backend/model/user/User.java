package api.backend.model.user;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String username;

    private LocalDateTime birthDate;

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false, unique = true)
    private String email;

    private String avatar;

    private LocalDateTime bannedUntil;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime deletedAt;
}