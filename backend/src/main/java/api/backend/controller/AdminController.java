package api.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import api.backend.model.report.ReportResponse;
import api.backend.model.report.ReviewRequest;
import api.backend.model.report.Report.Status;
import api.backend.model.user.BanRequest;
import api.backend.model.user.DeleteRequest;
import api.backend.model.user.User;
import api.backend.service.ReportService;
import api.backend.service.UserService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    UserService userService;
    ReportService reportService;

    public AdminController(UserService userService, ReportService reportService) {
        this.userService = userService;
        this.reportService = reportService;
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteUser(@RequestBody DeleteRequest request) {
        return ResponseEntity.ok(userService.deleteUser(request));
    }

    @PatchMapping("/ban")
    public ResponseEntity<String> banUser(@Valid @RequestBody BanRequest request) {
        return ResponseEntity.ok(userService.banUser(request));
    }

    @PatchMapping("/unban")
    public ResponseEntity<String> unbanUser(@Valid @RequestBody DeleteRequest request) {
        return ResponseEntity.ok(userService.unbanUser(request));
    }

    @PatchMapping("/promote")
    public ResponseEntity<String> promoteUser(@Valid @RequestBody DeleteRequest request) {
        return ResponseEntity.ok(userService.promoteUser(request));
    }

    @PatchMapping("/demote")
    public ResponseEntity<String> demoteUser(@Valid @RequestBody DeleteRequest request) {
        return ResponseEntity.ok(userService.demoteUser(request));
    }

    @GetMapping("/reports")
    public ResponseEntity<List<ReportResponse>> getAllReports(@RequestParam(defaultValue = "0") int page) {
        List<ReportResponse> reports = reportService.getAllReports(page);
        return ResponseEntity.ok(reports);
    }

    @PatchMapping("/reports/{reportId}/review")
    public ResponseEntity<String> reviewReport(@PathVariable long reportId, @AuthenticationPrincipal User user,@RequestBody ReviewRequest request) {
        String reports = reportService.reviewReport(reportId, user, request.decision());
        return ResponseEntity.ok(reports);
    }

}
