package api.backend.service;

import api.backend.model.post.Post;
import api.backend.model.report.Report;
import api.backend.model.report.ReportRequest;
import api.backend.model.report.ReportResponse;
import api.backend.model.user.User;
import api.backend.repository.PostRepository;
import api.backend.repository.ReportRepository;
import api.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

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
    private final UserRepository userRepository;

    public ReportService(ReportRepository reportRepository, PostRepository postRepository, UserRepository userRepository) {
        this.reportRepository = reportRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ReportResponse getReportById(Long id) {
        Report report = reportRepository.findById(id).get();
        return toReportResponse(report);
    }

    public String resolveReport(Long id, User reviewer) {
        Report report = reportRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Report not found"));
        report.setStatus(Report.Status.RESOLVED);
        report.setReviewedAt(LocalDateTime.now());
        reportRepository.save(report);
        return "Report resolved successfully";
    }

    @Transactional
    public ReportResponse submitReport(User reporter, ReportRequest request) {
        if (request.reportedPostId() == null && request.reportedUserId() == null) {
            throw new IllegalArgumentException("Either a post or a user must be reported.");
        }

        Report report = new Report();
        report.setReporter(reporter);
        report.setReason(request.reason());

        if (request.reportedPostId() != null) {
            Post reportedPost = postRepository.findById(request.reportedPostId())
                    .orElseThrow(() -> new EntityNotFoundException("Post not found with ID: " + request.reportedPostId()));
            report.setPost(reportedPost);
            // Implicitly report the post's author
            report.setReported(reportedPost.getUser());
        } else { // reportedUserId must not be null here
            User reportedUser = userRepository.findById(request.reportedUserId())
                    .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + request.reportedUserId()));
            report.setReported(reportedUser);
        }

        Report savedReport = reportRepository.save(report);

        return toReportResponse(savedReport);
    }

    public String dismissReport(Long id, User reviewer) {
        Report report = reportRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Report not found"));
        report.setStatus(Report.Status.DISMISSED);
        report.setReviewedAt(LocalDateTime.now());
        reportRepository.save(report);
        return "Report dismissed successfully";
    }

    @Transactional
    public List<ReportResponse> getAllReports(long cursor) {
        Pageable pageable = PageRequest.of(0, 10, Direction.DESC, "id");

        return reportRepository.findAllByIdLessThan(cursor, pageable).stream().map(this::toReportResponse).toList();
    }

    public ReportResponse toReportResponse(Report report) {
        User reporter = userRepository.findById(report.getReporter().getId())
                .orElseThrow(() -> new EntityNotFoundException("Reporter not found"));
        User reported = userRepository.findById(report.getReported().getId())
                .orElseThrow(() -> new EntityNotFoundException("Reported user not found"));

        return new ReportResponse(report.getId(),
                UserService.toUserResponse(reporter),
                UserService.toAdminUserResponse(reported),
                report.getReason(),
                report.getStatus().toString(),
                report.getCreatedAt(),
                report.getReviewedAt(),
                (report.getPost() != null ? report.getPost().getId() : null),
                (report.getPost() != null ? report.getPost().isHidden() : false));
    }
}