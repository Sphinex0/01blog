
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
    public ResponseEntity<PostResponse> createPost(@Valid @RequestBody PostRequest post, @AuthenticationPrincipal User currentUser) {
        PostResponse savedPost = postService.createPost(post,currentUser);
        return ResponseEntity.ok(savedPost);
    }

    // Get all posts (public access)
    @GetMapping
    public ResponseEntity<List<PostResponse>> getAllPosts(@RequestParam(defaultValue = "0") int page) {
        List<PostResponse> posts = postService.getAllPosts(page);
        return ResponseEntity.ok(posts);
    }

    // // Get a specific post by ID (public access)
    // @GetMapping("/{id}")
    // public ResponseEntity<Post> getPostById(@PathVariable Long id) {
    //     return postService.getPostById(id)
    //             .map(ResponseEntity::ok)
    //             .orElseGet(() -> ResponseEntity.notFound().build());
    // }

    // // Update a post (only the author or admin)
    // @PutMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN') or #post.author == authentication.principal")
    // public ResponseEntity<Post> updatePost(@PathVariable Long id, @RequestBody Post post) {
    //     Post updatedPost = postService.updatePost(id, post);
    //     return updatedPost != null ? ResponseEntity.ok(updatedPost) : ResponseEntity.notFound().build();
    // }

    // // Delete a post (only the author or admin)
    // @DeleteMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN') or #post.author == authentication.principal")
    // public ResponseEntity<Void> deletePost(@PathVariable Long id, @AuthenticationPrincipal User currentUser) {
    //     boolean deleted = postService.deletePost(id, currentUser);
    //     return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    // }
}