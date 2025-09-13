package api.backend.model.post;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @OneToMany
    private Long user_id;

    @Column(nullable = false)
    private String content;
    private String media_url;
    private String media_type;

    @Column(nullable = false)
    private LocalDateTime created_at;
    private LocalDateTime modified_at;
    private boolean is_hidden;
    private String likes_count;
    private String comments;
    
    
}
