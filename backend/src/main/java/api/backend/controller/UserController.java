package api.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import api.backend.model.subscription.SubscribeRequest;
import api.backend.model.user.User;
import api.backend.model.user.UserResponse;
import api.backend.service.UserService;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/users") // Define a specific path
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers(@RequestParam(defaultValue = "0") int page) {
        List<UserResponse> users = userService.getAllUsers(page);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{userId}/subscribers")
    public ResponseEntity<List<UserResponse>> getAllsubscribers(@PathVariable long userId,@RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok(userService.getSubscribers(userId, page));
    }

    @GetMapping("/{userId}/subscribtions")
    public ResponseEntity<List<UserResponse>> getAllsubscribedTo(@PathVariable long userId,@RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok(userService.getSubscribtions(userId, page));
    }

    @PostMapping("/subscribe")
    public ResponseEntity<String> subscribe(@Valid @RequestBody SubscribeRequest request) {
        return ResponseEntity.ok(userService.subscribe(request));
    }

}