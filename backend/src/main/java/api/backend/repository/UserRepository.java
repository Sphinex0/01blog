package api.backend.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import api.backend.model.user.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);
    Optional<User> findByRole(String email);

    Optional<User> findByUsernameOrEmail(String username, String Email);

    Page<User> findAllByIdLessThan(Long cursor, Pageable pageable);

    Page<User> findAllBySubscribedToIdAndIdLessThan(Long userId, Long cursor, Pageable pageable);

    Page<User> findAllBySubscribersIdAndIdLessThan(Long userId, Long cursor, Pageable pageable);

    Page<User> findByIdLessThanAndFullNameContainingIgnoreCaseOrUsernameContainingIgnoreCase(
             Long cursor ,String fullNameQuery, String usernameQuery, Pageable pageable
    );

}
