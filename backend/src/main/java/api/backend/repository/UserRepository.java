package api.backend.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import api.backend.model.user.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByUsernameOrEmail(String username, String Email);


    //@Query("SELECT u FROM User u JOIN subscription s ON s.subscribed_to = u.id WHERE s.subscriber_id = :userId")
    @Query("SELECT u FROM User u JOIN u.subscribed_to sub WHERE sub.id = :userId")
    Page<User> findSubscribersById(Long userId, Pageable pageable);

    @Query("SELECT u FROM User u JOIN u.subscribers sub WHERE sub.id = :userId")
    Page<User> findSubscribtionsById(Long userId, Pageable pageable);
}
