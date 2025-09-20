package api.backend.service;

import api.backend.model.report.Report;
import api.backend.model.report.ReportRequest;
import api.backend.model.report.ReportResponse;
import api.backend.model.user.User;
import api.backend.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ReportService {

    private final ReportRepository reportRepository;

    @Autowired
    public ReportService(ReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    public ReportResponse submitReport(User reporter, User reported, ReportRequest request) {
        // if (reportRepository.existsByReporterIdAndReportedId(reporter.getId(), reported.getId())) {
        //     throw new IllegalStateException("Report already exists for this user");
        // }
        Report report = new Report(reporter, reported, request.reason());
        Report savedReport = reportRepository.save(report);
        return new ReportResponse(
                savedReport.getId(),
                savedReport.getReason(),
                savedReport.getStatus().name(),
                savedReport.getCreatedAt(),
                savedReport.getReviewedAt()
        );
    }

    public ReportResponse getReportById(Long id) {
        Report report = reportRepository.findById(id).get();
        return new ReportResponse(
                report.getId(),
                report.getReason(),
                report.getStatus().name(),
                report.getCreatedAt(),
                report.getReviewedAt()
        );
    }

    public boolean reviewReport(Long id, User reviewer, Report.Status newStatus) {
        return reportRepository.findById(id)
                .map(report -> {
                    report.setStatus(newStatus);
                    report.setReviewedAt(LocalDateTime.now());
                    reportRepository.save(report);
                    return true;
                }).get();
    }
}