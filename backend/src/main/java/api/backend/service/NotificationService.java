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
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate; // Inject the template

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository, SimpMessagingTemplate messagingTemplate) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.messagingTemplate = messagingTemplate;
    }


    /**
     * Creates, saves, and sends new post notifications to each of the author's followers.
     * @param post The newly created post.
     */
    public void createAndSendNewPostNotifications(Post post) {
        User author = post.getUser();
        Set<User> followers = author.getSubscribers(); // You need to implement this query
        
        if (followers.isEmpty()) {
            return;
        }

        List<Notification> notificationsToSave = new ArrayList<>();

        for (User follower : followers) {
            // 1. Create the notification entity to save in the database
            Notification notification = new Notification(follower, author, post);
            notificationsToSave.add(notification);

            // 2. Create the DTO to be sent over WebSocket
            NotificationResponse notificationResponse = toNotificationResponse(notification);

            // 3. Send the notification directly to the specific follower's queue
            // Spring automatically maps follower.getUsername() to the correct WebSocket session
            messagingTemplate.convertAndSendToUser(
                follower.getUsername(),       // The user (principal name) to send to
                "/queue/new-posts",           // The private destination
                notificationResponse          // The payload
            );
        }

        // 4. Save all notifications to the database
        notificationRepository.saveAll(notificationsToSave);
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
