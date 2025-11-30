
package api.backend.controller;

import api.backend.model.user.User;
import api.backend.model.post.PostRequest;
import api.backend.model.post.PostResponse;
import api.backend.service.PostService;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping
    public ResponseEntity<PostResponse> createPost(@Valid @RequestBody PostRequest post,
            @AuthenticationPrincipal User currentUser) {

                System.out.println("#############################################");
                System.out.println("#############################################");
                System.out.println("#############################################");
                System.out.println("#############################################");
                System.out.println("#############################################");

        PostResponse savedPost = postService.createPost(post, currentUser);
        return ResponseEntity.ok(savedPost);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PostResponse>> getAllPosts(@RequestParam(defaultValue = "0") long cursor) {
        if (cursor == 0) {
            cursor = Long.MAX_VALUE;
        }
        List<PostResponse> posts = postService.getAllPosts(cursor);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/feed")
    public ResponseEntity<List<PostResponse>> getSubscribedToPosts(@RequestParam(defaultValue = "0") long cursor,
            @AuthenticationPrincipal User user) {
        if (cursor == 0) {
            cursor = Long.MAX_VALUE;
        }
        List<PostResponse> posts = postService.getSubscribedToPosts(cursor, user.getId());
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPostById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or  @postService.getPostById(#id).user.id == authentication.principal.id")
    public ResponseEntity<PostResponse> updatePost(@PathVariable Long id, @Valid @RequestBody PostRequest post) {
        PostResponse updatedPost = postService.updatePost(id, post);
        return ResponseEntity.ok(updatedPost);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @postService.getPostById(#id).user.id == authentication.principal.id")
    public ResponseEntity<String> deletePost(@PathVariable Long id) {
        return ResponseEntity.ok(postService.deletePost(id));
    }

    @PostMapping("/like/{id}")
    public ResponseEntity<Integer> likePost(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(postService.likePost(id, user.getId()));
    }

    @PatchMapping("/hide/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> hidePost(@PathVariable Long id) {
        return ResponseEntity.ok(postService.hidePost(id));
    }

}