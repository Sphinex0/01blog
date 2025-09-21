package api.backend.service;

import api.backend.model.post.Post;
import api.backend.model.report.Report;
import api.backend.model.report.ReportRequest;
import api.backend.model.report.ReportResponse;
import api.backend.model.user.User;
import api.backend.model.user.UserResponse;
import api.backend.repository.PostRepository;
import api.backend.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final PostRepository postRepository;

    @Autowired
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
                toUserResponse(savedReport.getReported()),
                savedReport.getReason(),
                savedReport.getStatus().name(),
                savedReport.getCreatedAt(),
                savedReport.getReviewedAt(),
                request.postId() // Reflect the requested postId
        );
    }

    public ReportResponse getReportById(Long id) {
        Report report = reportRepository.findById(id).get();
        return new ReportResponse(
                report.getId(),
                toUserResponse(report.getReporter()),
                toUserResponse(report.getReported()),
                report.getReason(),
                report.getStatus().name(),
                report.getCreatedAt(),
                report.getReviewedAt(),
                (report.getPost() != null ? report.getPost().getId() : null));
    }

    public String reviewReport(Long id, User reviewer, Report.Status newStatus) {
        return reportRepository.findById(id)
                .map(report -> {
                    report.setStatus(newStatus);
                    report.setReviewedAt(LocalDateTime.now());
                    reportRepository.save(report);
                    return "Report reviewed";
                }).get();
    }

    public List<ReportResponse> getAllReports(int page) {
        Pageable pageable = PageRequest.of(page, 10, Direction.DESC, "id");

        return reportRepository.findAll(pageable).stream().map(this::toReportResponse).toList();
    }

    public ReportResponse toReportResponse(Report report) {
        return new ReportResponse(report.getId(),
                toUserResponse(report.getReporter()),
                toUserResponse(report.getReported()),
                report.getReason(),
                report.getStatus().toString(),
                report.getCreatedAt(),
                report.getReviewedAt(),
                (report.getPost() != null ? report.getPost().getId() : null));
    }

    public static UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getAvatar(),
                user.getCreatedAt());
    }
}