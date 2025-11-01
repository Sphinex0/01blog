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
public class AdminService {
    private final UserRepository userRepository;

    public AdminService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<AdminUserResponse> getAllUsers(long cursor) {
        Pageable pageable = PageRequest.of(0, 10, Direction.DESC, "id");
        return userRepository.findAllByIdLessThan(cursor, pageable).stream().map(AdminService::toUserResponse).toList();
    }

    @org.springframework.beans.factory.annotation.Autowired
    private api.backend.repository.PostRepository postRepository;

    @org.springframework.beans.factory.annotation.Autowired
    private api.backend.repository.ReportRepository reportRepository;

    public AdminStatsResponse getAdminStats() {
        List<User> users = userRepository.findAll();

        long totalUsers = users.size();

        LocalDateTime now = LocalDateTime.now();
        long bannedUsersCount = users.stream()
                .filter(u -> u.getBannedUntil() != null && now.isBefore(u.getBannedUntil()))
                .count();
        long totalBannedUsers = bannedUsersCount;
        long activeUsers = totalUsers - bannedUsersCount;

        long totalPosts = 0;
        long postsThisMonth = 0;
        LocalDateTime monthStart = now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
        if (postRepository != null) {
            List<api.backend.model.post.Post> posts = postRepository.findAll();
            totalPosts = posts.size();
            for (api.backend.model.post.Post p : posts) {
                if (p.getCreatedAt() != null && !p.getCreatedAt().isBefore(monthStart)) {
                    postsThisMonth++;
                }
            }
        } else {
            totalPosts = users.stream().mapToLong(u -> u.getPosts().size()).sum();
            // best-effort approximate month count from user posts
            postsThisMonth = users.stream()
                    .flatMap(u -> u.getPosts().stream())
                    .filter(p -> p.getCreatedAt() != null && !p.getCreatedAt().isBefore(monthStart))
                    .count();
        }

        // Reports
        long totalReports = 0;
        long reportsThisMonth = 0;
        long pendingReports = 0;
        long resolvedReports = 0;
        long dismissedReports = 0;
        List<UserReportSummary> mostReportedUsers = List.of();

        if (reportRepository != null) {
            List<api.backend.model.report.Report> reports = reportRepository.findAll();
            totalReports = reports.size();
            java.util.Map<Long, Long> reportCountsByUser = new java.util.HashMap<>();

            for (api.backend.model.report.Report r : reports) {
                if (r.getCreatedAt() != null && !r.getCreatedAt().isBefore(monthStart)) {
                    reportsThisMonth++;
                }

                Object statusObj = r.getStatus();
                if (statusObj != null) {
                    String status = statusObj.toString();
                    if ("PENDING".equalsIgnoreCase(status))
                        pendingReports++;
                    else if ("RESOLVED".equalsIgnoreCase(status))
                        resolvedReports++;
                    else if ("DISMISSED".equalsIgnoreCase(status) || "CLOSED".equalsIgnoreCase(status))
                        dismissedReports++;
                }

                if (r.getReported() != null && r.getReported().getId() != null) {
                    Long reportedId = r.getReported().getId();
                    reportCountsByUser.put(reportedId, reportCountsByUser.getOrDefault(reportedId, 0L) + 1L);
                }
            }

            // Build top reported users (limit 5)
            java.util.List<java.util.Map.Entry<Long, Long>> entries = new java.util.ArrayList<>(
                    reportCountsByUser.entrySet());
            entries.sort((a, b) -> Long.compare(b.getValue(), a.getValue()));

            java.util.List<UserReportSummary> topList = new java.util.ArrayList<>();
            int limit = Math.min(entries.size(), 5);
            for (int i = 0; i < limit; i++) {
                Long userId = entries.get(i).getKey();
                Long cnt = entries.get(i).getValue();
                String username = null;
                String fullName = null;
                String avatar = null;
                LocalDateTime lastReportedAt = null;
                // try to obtain username from any report that references this user
                for (api.backend.model.report.Report r : reportRepository.findAll()) {
                    if (r.getReported() != null && userId.equals(r.getReported().getId())) {
                        username = r.getReported().getUsername();
                        fullName = r.getReported().getFullName();
                        avatar = r.getReported().getAvatar();
                        lastReportedAt = r.getReported().getCreatedAt();
                        break;
                    }
                }
                topList.add(new UserReportSummary(userId, username,fullName,avatar, cnt, lastReportedAt));
            }
            mostReportedUsers = java.util.List.copyOf(topList);
        }

        return new AdminStatsResponse(
                totalUsers,
                totalPosts,
                totalReports,
                bannedUsersCount,
                activeUsers,
                postsThisMonth,
                reportsThisMonth,
                pendingReports,
                resolvedReports,
                dismissedReports,
                mostReportedUsers,
                totalBannedUsers);
    }

    public static record AdminStatsResponse(
            long totalUsers,
            long totalPosts,
            long totalReports,
            long bannedUsersCount,
            long activeUsers,
            long postsThisMonth,
            long reportsThisMonth,
            long pendingReports,
            long resolvedReports,
            long dismissedReports,
            List<UserReportSummary> mostReportedUsers,
            long totalBannedUsers) {
    }

    public static record UserReportSummary(Long userId, String username, String fullName, String avatar,
            long reportCount,LocalDateTime lastReportedAt) {
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
                user.getBannedUntil());
    }

}