package api.backend.service;

import api.backend.model.notification.Notification;
import api.backend.model.notification.NotificationResponse;
import api.backend.model.post.Post;
import api.backend.model.user.User;
import api.backend.model.user.UserResponse;
import api.backend.repository.NotificationRepository;
import api.backend.repository.UserRepository;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    /**
     * Creates and saves notifications for a new post and returns a DTO for broadcasting.
     * @param post The newly created post.
     * @return A NotificationResponse DTO representing the event.
     */
    public NotificationResponse createAndSaveNewPostNotification(Post post) {
        Set<User> followers = post.getUser().getSubscribers();
        
        // Find all followers of the post's author
        // List<User> followers = userRepository.findFollowersOf(author.getId());
        
        // Create a notification for each follower
        List<Notification> notifications = followers.stream()
            .map(follower -> new Notification(follower,post.getUser(), post))
            .collect(Collectors.toList());

        // Save all notifications to the database
        notificationRepository.saveAll(notifications);
        
        // Return a single DTO for the broadcast. The 'receiver' is irrelevant for the broadcast,
        // but the 'sender' (the post author) is important.
        return new NotificationResponse(
            null, // ID is not needed for the broadcast payload
            toUserResponse(post.getUser()), // Use a toResponse() method or manual mapping for sender
            post.getId(),
            false,
            post.getCreatedAt()
        );
    }

    public long getUnreadCountByUserId(long userID) {
        return notificationRepository.countByReceiverIdAndReadFalse(userID);
    }

    public void markAsRead(Long id, long userId) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found"));

        if (notification.getReceiver().getId() != userId) {
            throw new IllegalArgumentException("You are not authorized to mark this notification as read");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    public List<NotificationResponse> getNotificationByUserId(long userID, long cursor) {
        Pageable pageable = PageRequest.of(0, 10, Direction.DESC, "id");
        return notificationRepository.findByReceiverIdAndIdLessThan(userID, cursor, pageable)
                .map(this::toNotificationResponse).toList();
    }

    public boolean markAsRead(Long id) {
        return notificationRepository.findById(id)
                .map(notification -> {
                    notification.setRead(true);
                    notificationRepository.save(notification);
                    return true;
                }).get();
    }

    public NotificationResponse toNotificationResponse(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                toUserResponse(notification.getPost().getUser()),
                notification.getPost().getId(),
                notification.isRead(),
                notification.getCreatedAt());
    }

    public void markAllAsRead(long userId) {
        // List<Notification> notifications = notificationRepository.findByReceiverIdAndReadFalse(userId);
        // for (Notification notification : notifications) {
        //     notification.setRead(true);
        // }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
                user.getNotifications().forEach(notification -> notification.setRead(true));
                userRepository.save(user);
        // notificationRepository.saveAll(notifications);
    }

    public static UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getAvatar(),
                user.getCreatedAt(),
                0, 0, 0, false);
    }
}
