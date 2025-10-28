package api.backend.controller;

import api.backend.model.report.ReportRequest;
import api.backend.model.report.ReportResponse;
import api.backend.model.user.User;
import api.backend.service.ReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping
    public ResponseEntity<ReportResponse> submitReport(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody ReportRequest request) {
        
        ReportResponse response = reportService.submitReport(currentUser, request);
        return ResponseEntity.ok(response);
    }
}