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
import api.backend.model.user.AdminUserResponse;
import api.backend.model.user.BanRequest;
import api.backend.model.user.DeleteRequest;
import api.backend.model.user.User;
import api.backend.model.user.UserResponse;
import api.backend.service.AdminService;
import api.backend.service.ReportService;
import api.backend.service.UserService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    UserService userService;
    ReportService reportService;
    AdminService adminService;

    public AdminController(UserService userService, ReportService reportService, AdminService adminService) {
        this.userService = userService;
        this.reportService = reportService;
        this.adminService = adminService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponse>> getAllUsers(@RequestParam(defaultValue = "0") long cursor) {
        if (cursor == 0) {
            cursor = Long.MAX_VALUE;
        }
        List<AdminUserResponse> users = adminService.getAllUsers(cursor);
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable long userId) {
        return ResponseEntity.ok(userService.deleteUser(userId));
    }

    @PatchMapping("/ban")
    public ResponseEntity<String> banUser(@Valid @RequestBody BanRequest request) {
        return ResponseEntity.ok(userService.banUser(request));
    }

    @PatchMapping("/unban")
    public ResponseEntity<String> unbanUser(@Valid @RequestBody DeleteRequest request) {
        return ResponseEntity.ok(userService.unbanUser(request));
    }

    @PatchMapping("/promote/{userId}")
    public ResponseEntity<String> promoteUser(@PathVariable long userId) {
        return ResponseEntity.ok(userService.promoteUser(userId));
    }

    @PatchMapping("/demote/{userId}")
    public ResponseEntity<String> demoteUser(@PathVariable long userId) {
        return ResponseEntity.ok(userService.demoteUser(userId));
    }

    @GetMapping("/reports")
    public ResponseEntity<List<ReportResponse>> getAllReports(@RequestParam(defaultValue = "0") long cursor) {
        if (cursor == 0) {
            cursor = Long.MAX_VALUE;
        }
        List<ReportResponse> reports = reportService.getAllReports(cursor);
        return ResponseEntity.ok(reports);
    }

    // @PatchMapping("/reports/{reportId}/review")
    // public ResponseEntity<String> reviewReport(@PathVariable long reportId, @AuthenticationPrincipal User user,
    //         @RequestBody ReviewRequest request) {
    //     String reports = reportService.reviewReport(reportId, user, request.decision());
    //     return ResponseEntity.ok(reports);
    // }

    @PatchMapping("/reports/resolve/{reportId}")
    public ResponseEntity<String> resolveReport(@PathVariable long reportId, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(reportService.resolveReport(reportId, user));
    }

    @PatchMapping("/reports/dismiss/{reportId}")
    public ResponseEntity<String> dismissReport(@PathVariable long reportId, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(reportService.dismissReport(reportId, user));
    }

}
