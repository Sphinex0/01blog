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
        return ResponseEntity.ok(users);
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<UserResponse> getUser(@PathVariable String username) {
        UserResponse user = userService.getUserByUsername(username);
        return ResponseEntity.ok(user);
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

}