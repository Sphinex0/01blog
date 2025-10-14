package api.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UserDetailsService;

import api.backend.model.user.BanRequest;
import api.backend.model.user.DeleteRequest;
import api.backend.model.user.User;
import api.backend.model.user.UserResponse;
import api.backend.repository.UserRepository;
import jakarta.transaction.Transactional;

@Service
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public String subscribe(long subscribedTo) {
        long id = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
        if (id == subscribedTo) {
            throw new IllegalArgumentException("You can't subscribe to yourself");
        }
        User currentUser = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("No authenticated user found"));

        User target = userRepository.findById(subscribedTo)
                .orElseThrow(() -> new IllegalArgumentException("Target user not found"));

        if (currentUser.getSubscribedTo().contains(target)) {
            unsubscribe(currentUser, target);
            return "unsubscribed";
        }

        currentUser.getSubscribedTo().add(target);
        target.getSubscribers().add(currentUser);

        userRepository.save(currentUser);
        return "subscribed";

    }

    @Transactional
    public void unsubscribe(User currentUser, User target) {
        currentUser.getSubscribedTo().remove(target);
        target.getSubscribers().remove(currentUser);
        userRepository.save(currentUser);
    }

    public List<UserResponse> getSubscribers(long userId, long cursor) {
        Pageable pageable = PageRequest.of(0, 10, Direction.DESC,"id");
        return userRepository.findAllBySubscribedToIdAndIdLessThan(userId, cursor, pageable).stream()
                .map(UserService::toUserResponse).toList();
    }

    public List<UserResponse> getSubscribtions(long userId, long cursor) {
        Pageable pageable = PageRequest.of(0, 10, Direction.DESC,"id");
        return userRepository.findAllBySubscribersIdAndIdLessThan(userId, cursor, pageable).stream()
                .map(UserService::toUserResponse)
                .toList();
    }

    public List<UserResponse> getAllUsers(long cursor) {
        Pageable pageable = PageRequest.of(0, 10, Direction.DESC, "id");
        return userRepository.findAllByIdLessThan(cursor, pageable).stream().map(UserService::toUserResponse).toList();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public UserResponse getUserByUsername(String username) {
        return toUserResponse(userRepository.findByUsername(username).get());
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public String deleteUser(DeleteRequest request) {
        userRepository.findById(request.id()).get();
        userRepository.deleteById(request.id());
        return "user deleted";
    }

    public String banUser(BanRequest request) {
        User user = userRepository.findById(request.id()).get();
        user.setBannedUntil(request.until());
        userRepository.save(user);
        return "user banned until " + request.until();
    }

    public String unbanUser(DeleteRequest request) {
        User user = userRepository.findById(request.id()).get();
        user.setBannedUntil(null);
        userRepository.save(user);
        return "user unbanned";
    }

    public String promoteUser(DeleteRequest request) {
        User user = userRepository.findById(request.id()).get();
        user.setRole("ADMIN");
        userRepository.save(user);
        return "user " + user.getUsername() + " promoted";
    }

    public String demoteUser(DeleteRequest request) {
        User user = userRepository.findById(request.id()).get();
        user.setRole("USER");
        userRepository.save(user);
        return "user " + user.getUsername() + " demoted";
    }

    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsernameOrEmail(username, username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        if (user.getBannedUntil() != null && user.getBannedUntil().isAfter(LocalDateTime.now())) {
            throw new DisabledException("Account is banned until " + user.getBannedUntil());
        }

        return user;
    }

    public static UserResponse toUserResponse(User user) {
        User currentUser = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal());
        String currentUsername = currentUser.getUsername();
        boolean currentInSubscribersByUsername = currentUsername != null && user.getSubscribers().stream()
                .anyMatch(sub -> currentUsername.equals(sub.getUsername()));

        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getAvatar(),
                user.getCreatedAt(),
                user.getPosts().size(),
                user.getSubscribers().size(),
                user.getSubscribedTo().size(),
                currentInSubscribersByUsername);
    }

}