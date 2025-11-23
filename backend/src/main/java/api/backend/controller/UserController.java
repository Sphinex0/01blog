package api.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import api.backend.model.post.PostResponse;
import api.backend.model.user.UserResponse;
import api.backend.service.PostService;
import api.backend.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/users") 
public class UserController {

    private final UserService userService;
    private final PostService postService;

    public UserController(UserService userService, PostService postService) {
        this.userService = userService;
        this.postService = postService;
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