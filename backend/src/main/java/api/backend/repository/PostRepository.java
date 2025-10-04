package api.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import api.backend.model.post.Post;
import api.backend.model.user.User;

import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    // Custom query methods
    List<Post> findByUser(User user);

    Page<Post> findByUserIdAndIdLessThan(Long userId, Long cursor, Pageable pageable);
    Page<Post> findAllByIdLessThan(Long cursor, Pageable pageable);

    Optional<Post> findByIdAndUserId(Long id, Long userId);

    List<Post> findByLikesCountGreaterThanEqual(Integer likesCount);

    List<Post> findByCommentsCountGreaterThanEqual(Integer commentsCount);

    @Query("SELECT p FROM Post p WHERE p.user IN :subscribedTo AND p.isHidden = false AND p.id < :cursor")
    Page<Post> findPostsBySubscribedTo(@Param("subscribedTo") Set<User> subscribedTo, @Param("cursor") long cursor, Pageable page);

    // Optional: Find visible posts (not hidden)
    // List<Post> findByHiddenAtIsNull();
}
