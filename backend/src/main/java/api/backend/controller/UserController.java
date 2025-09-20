package api.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import api.backend.model.post.PostResponse;
import api.backend.model.subscription.SubscribeRequest;
import api.backend.model.user.UserResponse;
import api.backend.service.PostService;
import api.backend.service.UserService;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/users") // Define a specific path
public class UserController {

    private final UserService userService;
    private final PostService postService;

    @Autowired
    public UserController(UserService userService, PostService postService) {
        this.userService = userService;
        this.postService = postService;
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers(@RequestParam(defaultValue = "0") int page) {
        List<UserResponse> users = userService.getAllUsers(page);
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
            @RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok(userService.getSubscribers(userId, page));
    }

    @GetMapping("/{userId}/subscribtions")
    public ResponseEntity<List<UserResponse>> getAllsubscribedTo(@PathVariable long userId,
            @RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok(userService.getSubscribtions(userId, page));
    }

    @PostMapping("/subscribe")
    public ResponseEntity<String> subscribe(@Valid @RequestBody SubscribeRequest request) {
        return ResponseEntity.ok(userService.subscribe(request));
    }

}