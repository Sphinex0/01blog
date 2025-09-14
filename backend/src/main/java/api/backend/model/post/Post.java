package api.backend.model.post;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;

import api.backend.model.user.User;

@Entity
@Data
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "User is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotBlank(message = "Content is required")
    @Size(max = 10000, message = "Content cannot exceed 10000 characters")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Size(max = 255, message = "Media URL cannot exceed 255 characters")
    private String mediaUrl;

    @NotNull(message = "Created at is required")
    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime modifiedAt;

    private LocalDateTime hiddenAt;

    @NotNull(message = "Likes count is required")
    @Min(value = 0, message = "Likes count cannot be negative")
    @Column(nullable = false)
    private Integer likesCount = 0;

    @NotNull(message = "Comments count is required")
    @Min(value = 0, message = "Comments count cannot be negative")
    @Column(nullable = false)
    private Integer commentsCount = 0;

    // Default constructor for JPA
    public Post() {
    }

    // Constructor for basic creation (optional, can be used by service layer)
    public Post(User user, String content, LocalDateTime createdAt) {
        this.user = user;
        this.content = content;
        this.createdAt = createdAt;
        this.likesCount = 0;
        this.commentsCount = 0;
    }
}