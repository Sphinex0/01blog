package api.backend.model.post;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

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
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "User is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
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

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "post_likes",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id"))
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private Set<User> likes = new HashSet<>();


    public Post() {
    }

    public Post(User user, String title, String content, LocalDateTime createdAt) {
        this.user = user;
        this.title = title;
        this.content = content;
        this.createdAt = createdAt;
        this.likesCount = 0;
        this.commentsCount = 0;
    }
}
