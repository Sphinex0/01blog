package api.backend.controller;

import api.backend.model.user.User;
import api.backend.model.user.UserResponse;
import api.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    private final UserService userService;

    public SubscriptionController(UserService userService) {
        this.userService = userService;
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
}
