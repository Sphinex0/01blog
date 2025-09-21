package api.backend.service;

import api.backend.model.notification.Notification;
import api.backend.model.notification.NotificationResponse;
import api.backend.model.post.Post;
import api.backend.model.comment.Comment;
import api.backend.model.report.Report;
import api.backend.model.user.User;
import api.backend.repository.NotificationRepository;
import api.backend.repository.PostRepository;
import api.backend.repository.CommentRepository;
import api.backend.repository.ReportRepository;
import api.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final ReportRepository reportRepository;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository,
            PostRepository postRepository, CommentRepository commentRepository, ReportRepository reportRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.reportRepository = reportRepository;
    }

    public Optional<Notification> getNotificationById(Long id) {
        return notificationRepository.findById(id);
    }

    public boolean markAsRead(Long id) {
        return notificationRepository.findById(id)
                .map(notification -> {
                    notification.setStatus(Notification.Status.READ);
                    notificationRepository.save(notification);
                    return true;
                }).orElse(false);
    }
}
