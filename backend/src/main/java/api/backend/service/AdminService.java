package api.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;

import api.backend.model.report.Report;
import api.backend.model.user.AdminUserResponse;
import api.backend.model.user.UserReportSummary;
import api.backend.repository.PostRepository;
import api.backend.repository.ReportRepository;
import api.backend.repository.UserRepository;

@Service
public class AdminService {
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final ReportRepository reportRepository;

    public AdminService(UserRepository userRepository, PostRepository postRepository, ReportRepository reportRepository) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.reportRepository = reportRepository;
    }

    public List<AdminUserResponse> getAllUsers(long cursor) {
        Pageable pageable = PageRequest.of(0, 10, Direction.DESC, "id");
        return userRepository.findAllByIdLessThan(cursor, pageable).stream().map(UserService::toAdminUserResponse).toList();
    }

    public AdminStatsResponse getAdminStats() {
        long totalUsers = userRepository.count();
        long totalPosts = postRepository.count();
        long totalReports = reportRepository.count();

        LocalDateTime monthStart = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
        long postsThisMonth = postRepository.countByCreatedAtAfter(monthStart);
        long reportsThisMonth = reportRepository.countByCreatedAtAfter(monthStart);

        long pendingReports = reportRepository.countByStatus(Report.Status.PENDING);
        long resolvedReports = reportRepository.countByStatus(Report.Status.RESOLVED);
        long dismissedReports = reportRepository.countByStatus(Report.Status.DISMISSED);

        long bannedUsersCount = userRepository.findAll().stream()
                .filter(u -> u.getBannedUntil() != null && LocalDateTime.now().isBefore(u.getBannedUntil()))
                .count();
        long activeUsers = totalUsers - bannedUsersCount;

        List<UserReportSummary> mostReportedUsers = reportRepository.findMostReportedUsers(PageRequest.of(0, 5));

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
                bannedUsersCount);
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

}