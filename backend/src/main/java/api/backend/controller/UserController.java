package api.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import api.backend.model.notification.NotificationResponse;
import api.backend.model.post.Post;
import api.backend.model.post.PostResponse;
import api.backend.model.report.ReportRequest;
import api.backend.model.report.ReportResponse;
import api.backend.model.user.User;
import api.backend.model.user.UserResponse;
import api.backend.service.NotificationService;
import api.backend.service.PostService;
import api.backend.service.ReportService;
import api.backend.service.UserService;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users") 
@RateLimiter(name = "myApiLimiter")
public class UserController {

    private final UserService userService;
    private final PostService postService;
    private final ReportService reportService;
    private final NotificationService notificationService;

    public UserController(UserService userService, PostService postService, ReportService reportService,
            NotificationService notificationService) {
        this.userService = userService;
        this.postService = postService;
        this.reportService = reportService;
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers(@RequestParam(defaultValue = "0") long cursor) {
        if (cursor == 0) {
            cursor = Long.MAX_VALUE;
        }
        List<UserResponse> users = userService.getAllUsers(cursor);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserResponse>> searchUsers(
            @RequestParam("q") String query,
            @RequestParam(defaultValue = "0") long cursor) {

        List<UserResponse> users = userService.searchUsers(query, cursor);
        if (users != null && !users.isEmpty()) {
            long firstId = users.get(0).id();
            long lastId = users.get(users.size() - 1).id();
            System.out.println("First id: " + firstId + ", Last id: " + lastId);
        } else {
            System.out.println("No users found");
        }
        return ResponseEntity.ok(users);
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<UserResponse> getUser(@PathVariable String username) {
        UserResponse user = userService.getUserByUsername(username);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<NotificationResponse>> getAllNotifications(@AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") long cursor) {
        if (cursor == 0) {
            cursor = Long.MAX_VALUE;
        }
        List<NotificationResponse> users = notificationService.getNotificationByUserId(user.getId(), cursor);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/username/{username}/posts")
    public ResponseEntity<List<PostResponse>> getPostsByUsername(@RequestParam(defaultValue = "0") long cursor,
            @PathVariable String username) {
        if (cursor == 0) {
            cursor = Long.MAX_VALUE;
        }
        List<PostResponse> posts = postService.getPostsByUsername(cursor, username);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/subscribers/{userId}")
    public ResponseEntity<List<UserResponse>> getAllsubscribers(@PathVariable long userId,
            @RequestParam(defaultValue = "0") long cursor) {
        if (cursor == 0) {
            cursor = Long.MAX_VALUE;
        }
        return ResponseEntity.ok(userService.getSubscribers(userId, cursor));
    }

    @GetMapping("/subscribtions/{userId}")
    public ResponseEntity<List<UserResponse>> getAllsubscribedTo(@PathVariable long userId,
            @RequestParam(defaultValue = "0") long cursor) {
        if (cursor == 0) {
            cursor = Long.MAX_VALUE;
        }
        return ResponseEntity.ok(userService.getSubscribtions(userId, cursor));
    }

    @PostMapping("/subscribe/{subscribedTo}")
    public ResponseEntity<Map<String, String>> subscribe(@Valid @PathVariable long subscribedTo,
            @AuthenticationPrincipal User currentUser) {

        return ResponseEntity.ok(Map.of("action", userService.subscribe(subscribedTo)));
    }

    @PostMapping("/{reportedId}/report")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ReportResponse> submitReport(@RequestParam Long postId, @PathVariable Long reportedId,
            @RequestBody ReportRequest request, @AuthenticationPrincipal User currentUser) {
        try {
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