package api.backend.service;

import api.backend.model.post.Post;
import api.backend.model.report.Report;
import api.backend.model.report.ReportRequest;
import api.backend.model.report.ReportResponse;
import api.backend.model.user.AdminUserResponse;
import api.backend.model.user.User;
import api.backend.model.user.UserResponse;
import api.backend.repository.PostRepository;
import api.backend.repository.ReportRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final PostRepository postRepository;

    public ReportService(ReportRepository reportRepository, PostRepository postRepository) {
        this.reportRepository = reportRepository;
        this.postRepository = postRepository;
    }

    public ReportResponse submitReport(User reporter, User reported, ReportRequest request) {

        Post post = null;
        if (request.postId() != null) {
            post = postRepository.findById(request.postId())
                    .orElseThrow(() -> new IllegalStateException("Post not found"));
        }

        Report report = new Report(reporter, reported, post, request.reason());
        Report savedReport = reportRepository.save(report);
        return new ReportResponse(
                savedReport.getId(),
                toUserResponse(savedReport.getReporter()),
                toAdminUserResponse(savedReport.getReported()),     
                savedReport.getReason(),
                savedReport.getStatus().name(),
                savedReport.getCreatedAt(),
                savedReport.getReviewedAt(),
                request.postId(), false);
    }

    public ReportResponse getReportById(Long id) {
        Report report = reportRepository.findById(id).get();
        return toReportResponse(report);
    }

    // public String reviewReport(Long id, User reviewer, Report.Status newStatus) {
    //     return reportRepository.findById(id)
    //             .map(report -> {
    //                 report.setStatus(newStatus);
    //                 report.setReviewedAt(LocalDateTime.now());
    //                 reportRepository.save(report);
    //                 return "Report reviewed";
    //             }).get();
    // }

    public String resolveReport(Long id, User reviewer) {
        return reportRepository.findById(id)
                .map(report -> {
                    report.setStatus(Report.Status.RESOLVED);
                    report.setReviewedAt(LocalDateTime.now());
                    // hide the associated post if any
                    // if (report.getPost() != null) {
                    //     Post p = report.getPost();
                    //     p.setHidden(true);
                    //     postRepository.save(p);
                    // }
                    reportRepository.save(report);
                    return "";
                }).orElseThrow(() -> new IllegalStateException("Report not found"));
    }

    public String dismissReport(Long id, User reviewer) {
        return reportRepository.findById(id)
                .map(report -> {
                    report.setStatus(Report.Status.DISMISSED);
                    report.setReviewedAt(LocalDateTime.now());
                    reportRepository.save(report);
                    return "";
                }).orElseThrow(() -> new IllegalStateException("Report not found"));
    }

    public List<ReportResponse> getAllReports(long cursor) {
        Pageable pageable = PageRequest.of(0, 10, Direction.DESC, "id");

        return reportRepository.findAllByIdLessThan(cursor, pageable).stream().map(this::toReportResponse).toList();
    }

    public ReportResponse toReportResponse(Report report) {
        return new ReportResponse(report.getId(),
                toUserResponse(report.getReporter()),
                toAdminUserResponse(report.getReported()),
                report.getReason(),
                report.getStatus().toString(),
                report.getCreatedAt(),
                report.getReviewedAt(),
                (report.getPost() != null ? report.getPost().getId() : null),
                (report.getPost() != null ? report.getPost().isHidden() : false));
    }

    public static AdminUserResponse toAdminUserResponse(User user) {
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