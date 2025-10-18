package api.backend.service;

import api.backend.model.notification.Notification;
import api.backend.model.notification.NotificationResponse;
import api.backend.model.user.User;
import api.backend.model.user.UserResponse;
import api.backend.repository.NotificationRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
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
