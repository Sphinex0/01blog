package api.backend.model.notification;

import api.backend.model.comment.Comment;
import api.backend.model.post.Post;
import api.backend.model.report.Report;
import api.backend.model.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

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
    private User recipient; // The user receiving the notification

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private Post post; // Optional post context

    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.UNREAD; // Status of the notification

    @NotNull(message = "Created at is required")
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // Enum for notification status
    public enum Status {
        UNREAD, READ
    }

    // Default constructor for JPA
    public Notification() {
    }

    // Constructor for creating a notification
    public Notification(User recipient, Post post) {
        this.recipient = recipient;
        this.post = post;
        this.createdAt = LocalDateTime.now();
        this.status = Status.UNREAD;
    }
}
