package api.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import api.backend.model.user.AdminUserResponse;
import api.backend.model.user.User;
import api.backend.repository.UserRepository;

@Service
public class AdminService  {
    private final UserRepository userRepository;

    public AdminService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }



    public List<AdminUserResponse> getAllUsers(long cursor) {
        Pageable pageable = PageRequest.of(0, 10, Direction.DESC, "id");
        return userRepository.findAllByIdLessThan(cursor, pageable).stream().map(AdminService::toUserResponse).toList();
    }

    public static AdminUserResponse toUserResponse(User user) {
        User currentUser = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal());
        String currentUsername = currentUser.getUsername();
        boolean currentInSubscribersByUsername = currentUsername != null && user.getSubscribers().stream()
                .anyMatch(sub -> currentUsername.equals(sub.getUsername()));
        return new AdminUserResponse(
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
                currentInSubscribersByUsername,
                LocalDateTime.now().isBefore(user.getBannedUntil()),
                user.getBannedUntil()
                );
    }

}