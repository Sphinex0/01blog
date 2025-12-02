package api.backend.repository;

import api.backend.model.notification.Notification;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    Page<Notification> findByReceiverIdAndIdLessThan(long userId, long cursor, Pageable pageable);

    long countByReceiverIdAndReadFalse(long userId);

    @Transactional
    @Modifying
    @Query("UPDATE Notification n SET n.read = true WHERE n.receiver.id = :userId AND n.read = false")
    void markAllAsRead(@Param("userId") long userId);
}