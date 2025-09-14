package api.backend.model.user;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;

import api.backend.model.post.Post;

@Entity
@Data
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = "username"),
        @UniqueConstraint(columnNames = "email")
})
@EqualsAndHashCode(exclude =  {"subscribers", "subscribed_to"})
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false)
    private String fullName;

    @NotBlank
    @Size(min = 3, max = 50)
    @Pattern(regexp = "^[a-zA-Z0-9_]+$")
    @Column(nullable = false, unique = true)
    private String username;

    @NotBlank
    @Email
    @Size(max = 255)
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank
    @Size(min = 60, max = 255)
    @Column(nullable = false)
    private String password;

    @NotNull
    @Column(nullable = false)
    private String role;

    private String avatar;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role));
    }

    private LocalDateTime bannedUntil;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime deletedAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Post> posts;

    @ManyToMany
    @JoinTable(name = "subscription", joinColumns = @JoinColumn(name = "subscribed_to"), inverseJoinColumns = @JoinColumn(name = "subscriber_id"), uniqueConstraints = {
            @UniqueConstraint(columnNames = { "subscriber_id", "subscribed_to" })
    })
    @JsonIgnore
    private Set<User> subscribers = new HashSet<>();

    @ManyToMany(mappedBy = "subscribers")
    @JsonIgnore
    private Set<User> subscribed_to = new HashSet<>();

    // Constructor for record mapping
    public User(String fullName, String username, String email, String password, String role,
            LocalDateTime createdAt) {
        this.fullName = fullName;
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.createdAt = createdAt;
    }

    public User() {
        // Default constructor for JPA
    }
}