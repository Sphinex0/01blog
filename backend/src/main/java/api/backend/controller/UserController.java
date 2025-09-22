package api.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import api.backend.model.notification.NotificationResponse;
import api.backend.model.post.Post;
import api.backend.model.post.PostResponse;
import api.backend.model.report.ReportRequest;
import api.backend.model.report.ReportResponse;
import api.backend.model.subscription.SubscribeRequest;
import api.backend.model.user.User;
import api.backend.model.user.UserResponse;
import api.backend.service.NotificationService;
import api.backend.service.PostService;
import api.backend.service.ReportService;
import api.backend.service.UserService;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/users") // Define a specific path
public class UserController {

    private final UserService userService;
    private final PostService postService;
    private final ReportService reportService;
    private final NotificationService notificationService;

    @Autowired
    public UserController(UserService userService, PostService postService, ReportService reportService,
            NotificationService notificationService) {
        this.userService = userService;
        this.postService = postService;
        this.reportService = reportService;
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers(@RequestParam(defaultValue = "0") int page) {
        List<UserResponse> users = userService.getAllUsers(page);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<NotificationResponse>> getAllNotifications(@AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "9223372036854775807") long cursor) {
        List<NotificationResponse> users = notificationService.getNotificationByUserId(user.getId(), cursor);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{userId}/posts")
    public ResponseEntity<List<PostResponse>> getPostsByUserId(@RequestParam(defaultValue = "0") int page,
            @PathVariable long userId) {
        List<PostResponse> posts = postService.getPostsByUserId(page, userId);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/{userId}/subscribers")
    public ResponseEntity<List<UserResponse>> getAllsubscribers(@PathVariable long userId,
            @RequestParam(defaultValue = "0") long cursor) {
        if (cursor == 0) {
            cursor = Long.MAX_VALUE;
        }
        return ResponseEntity.ok(userService.getSubscribers(userId, cursor));
    }

    @GetMapping("/{userId}/subscribtions")
    public ResponseEntity<List<UserResponse>> getAllsubscribedTo(@PathVariable long userId,
            @RequestParam(defaultValue = "0") long cursor) {
        if (cursor == 0) {
            cursor = Long.MAX_VALUE;
        }
        return ResponseEntity.ok(userService.getSubscribtions(userId, cursor));
    }

    @PostMapping("/subscribe")
    public ResponseEntity<String> subscribe(@Valid @RequestBody SubscribeRequest request) {
        return ResponseEntity.ok(userService.subscribe(request));
    }

    // Updated endpoint to submit a report
    @PostMapping("/{reportedId}/report")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ReportResponse> submitReport(@RequestParam Long postId, @PathVariable Long reportedId,
            @RequestBody ReportRequest request, @AuthenticationPrincipal User currentUser) {
        try {
            // Fetch the reported user (assuming report targets the post author for now)
            Post post = postService.getPostEntityById(postId);

            User reported = post.getUser();
            if (!reported.getId().equals(reportedId)) {
                throw new IllegalStateException("Reported user does not match post author");
            }
            ReportResponse report = reportService.submitReport(currentUser, reported, request);
            return ResponseEntity.ok(report);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

}