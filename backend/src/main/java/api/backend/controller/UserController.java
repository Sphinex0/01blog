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

    @GetMapping("/subscribers")
    public ResponseEntity<Set<User>> getAllsubscribers() {
        return ResponseEntity.ok(userService.getSubscribers());
    }

    @GetMapping("/subscribtions")
    public ResponseEntity<Set<User>> getAllsubscribedTo() {
        return ResponseEntity.ok(userService.getSubscribtions());
    }

    @PostMapping("/subscribe")
    public ResponseEntity<String> subscribe(@Valid @RequestBody SubscribeRequest request) {
        return ResponseEntity.ok(userService.subscribe(request));
    }

}