package api.backend.model.notification;

import api.backend.model.post.Post;
import api.backend.model.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Data
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Recipient is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id", nullable = false)
    private User receiver; // The user receiving the notification

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Post post; // Optional post context

    @NotNull(message = "Status is required")
    @Column(nullable = false)
    private boolean read = false; // Status of the notification

    @NotNull(message = "Created at is required")
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // Default constructor for JPA
    public Notification() {
    }

    // Constructor for creating a notification
    public Notification(User receiver, Post post) {
        this.receiver = receiver;
        this.post = post;
        this.createdAt = LocalDateTime.now();
        this.read = false;
    }
}
