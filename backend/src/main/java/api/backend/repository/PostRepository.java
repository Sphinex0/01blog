package api.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import api.backend.model.post.Post;
import api.backend.model.user.User;

import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    // Custom query methods
    List<Post> findByUser(User user);

    List<Post> findByUserId(Long userId);

    Optional<Post> findByIdAndUserId(Long id, Long userId);

    List<Post> findByLikesCountGreaterThanEqual(Integer likesCount);

    List<Post> findByCommentsCountGreaterThanEqual(Integer commentsCount);
    
    // Optional: Find visible posts (not hidden)
    List<Post> findByHiddenAtIsNull();
}
