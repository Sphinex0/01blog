package api.backend.model.comment;

import api.backend.model.post.Post;
import api.backend.model.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(name = "comments")

public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "User is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull(message = "Post is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @NotBlank(message = "Content is required")
    @Size(max = 2000, message = "Content cannot exceed 2000 characters")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @NotNull(message = "Created at is required")
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Comment parent; 

    @OneToMany(mappedBy = "parent", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    private List<Comment> replies = new ArrayList<>(); 

    // Default constructor for JPA
    public Comment() {
    }

    // Constructor for creating a comment
    public Comment(User user, Post post, String content, Comment parent) {
        this.user = user;
        this.post = post;
        this.content = content;
        this.createdAt = LocalDateTime.now();
        this.parent = parent;
        if (parent != null) {
            parent.getReplies().add(this); 
        }
    }
}