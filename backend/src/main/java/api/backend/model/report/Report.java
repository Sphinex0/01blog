package api.backend.model.report;

import api.backend.model.post.Post;
import api.backend.model.user.User;
import api.backend.model.user.UserResponse;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "reports", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"reporter_id", "reported_id", "post_id"}) // Prevent duplicate reports for the same user and post
})
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Reporter is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporter_id", nullable = false)
    private User reporter; 

    @NotNull(message = "Reported user is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reported_id", nullable = false)
    private User reported;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private Post post; // Optional post related to the report

    @NotBlank(message = "Reason is required")
    @Size(max = 500, message = "Reason cannot exceed 500 characters")
    @Column(nullable = false)
    private String reason; // Description of the issue (e.g., offensive content)

    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PENDING; // Report status (e.g., PENDING, REVIEWED, RESOLVED)

    @NotNull(message = "Created at is required")
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime reviewedAt; // Timestamp when the report is reviewed

    // Enum for report status
    public enum Status {
        PENDING, REVIEWED, RESOLVED
    }

    // Default constructor for JPA
    public Report() {
    }

    // Constructor for creating a report
    public Report(User reporter, User reported, Post post, String reason) {
        this.reporter = reporter;
        this.reported = reported;
        this.post = post;
        this.reason = reason;
        this.createdAt = LocalDateTime.now();
        this.status = Status.PENDING;
    }
}