
package api.backend.controller;

import api.backend.model.user.User;
import api.backend.model.post.Post;
import api.backend.model.post.PostRequest;
import api.backend.model.post.PostResponse;
import api.backend.service.PostService;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    @Autowired
    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping
    public ResponseEntity<PostResponse> createPost(@Valid @RequestBody PostRequest post,
            @AuthenticationPrincipal User currentUser) {
        PostResponse savedPost = postService.createPost(post, currentUser);
        return ResponseEntity.ok(savedPost);
    }

    // Get all posts (public access)
    @GetMapping
    public ResponseEntity<List<PostResponse>> getAllPosts(@RequestParam(defaultValue = "0") int page) {
        List<PostResponse> posts = postService.getAllPosts(page);
        return ResponseEntity.ok(posts);
    }

    // Get a specific post by ID (public access)
    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPostById(id));
    }

    // Update a post (only the author or admin)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or  @postService.getPostById(#id).user.id == authentication.principal.id")
    public ResponseEntity<Post> updatePost(@PathVariable Long id, @Valid @RequestBody PostRequest post) {
        Post updatedPost = postService.updatePost(id, post);
        return ResponseEntity.ok(updatedPost);
    }

    // Delete a post (only the author or admin)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @postService.getPostById(#id).user.id == authentication.principal.id")
    public ResponseEntity<String> deletePost(@PathVariable Long id) {
        return ResponseEntity.ok(postService.deletePost(id));
    }

    // like post
    @PostMapping("/{id}/like")
    public ResponseEntity<Integer> likePost(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(postService.likePost(id, user.getId()));
    }

    // hide a post (only the author or admin)
    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @postService.getPostById(#id).user.id == authentication.principal.id")
    public ResponseEntity<String> hidePost(@PathVariable Long id) {
        // postService.hidePost(id);
        return ResponseEntity.ok(postService.hidePost(id));
    }
}