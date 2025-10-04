package api.backend.model.post;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


import com.fasterxml.jackson.annotation.JsonIgnore;

import api.backend.model.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

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

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title cannot exceed 255 characters")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String title;
    
    @NotBlank(message = "Content is required")
    @Size(max = 10000, message = "Content cannot exceed 10000 characters")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;


    @NotNull(message = "Created at is required")
    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime modifiedAt;

    private boolean isHidden;

    @NotNull(message = "Likes count is required")
    @Min(value = 0, message = "Likes count cannot be negative")
    @Column(nullable = false)
    private Integer likesCount = 0;

    @NotNull(message = "Comments count is required")
    @Min(value = 0, message = "Comments count cannot be negative")
    @Column(nullable = false)
    private Integer commentsCount = 0;



    @ManyToMany
    @JoinTable(name = "likes", joinColumns = @JoinColumn(name = "post_id"), inverseJoinColumns = @JoinColumn(name = "user_id"), uniqueConstraints = {
            @UniqueConstraint(columnNames = { "post_id", "user_id" })
    })
    @JsonIgnore
    private List<User> likedBy = new ArrayList<>();

    // Default constructor for JPA
    public Post() {
    }

    // Constructor for basic creation (optional, can be used by service layer)
    public Post(User user, String title, String content, LocalDateTime createdAt) {
        this.user = user;
        this.title = title;
        this.content = content;
        this.createdAt = createdAt;
        this.likesCount = 0;
        this.commentsCount = 0;
    }
}