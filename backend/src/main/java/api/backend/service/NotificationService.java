package api.backend.service;

import api.backend.model.notification.Notification;
import api.backend.model.notification.NotificationResponse;
import api.backend.model.post.Post;
import api.backend.model.user.User;
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

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate; // Inject the template

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository, SimpMessagingTemplate messagingTemplate) {
        this.notificationRepository = notificationRepository;
        this.messagingTemplate = messagingTemplate;
    }


    /**
     * Creates, saves, and sends new post notifications to each of the author's followers.
     * @param post The newly created post.
     */
    public void createAndSendNewPostNotifications(Post post) {
        User author = post.getUser();
        Set<User> followers = author.getSubscribers();
        
        if (followers.isEmpty()) {
            return;
        }

        List<Notification> notificationsToSave = new ArrayList<>();

        for (User follower : followers) {
            Notification notification = new Notification(follower, author, post);
            notificationsToSave.add(notification);

            NotificationResponse notificationResponse = toNotificationResponse(notification);

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

    public NotificationResponse toNotificationResponse(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                UserService.toUserResponse(notification.getPost().getUser()),
                notification.getPost().getId(),
                notification.isRead(),
                notification.getCreatedAt());
    }

    public void markAllAsRead(long userId) {
        notificationRepository.markAllAsRead(userId);
    }
}
