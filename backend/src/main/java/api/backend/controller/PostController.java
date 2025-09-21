
package api.backend.controller;

import api.backend.model.user.User;
import api.backend.model.comment.CommentRequest;
import api.backend.model.comment.CommentResponse;
import api.backend.model.post.Post;
import api.backend.model.post.PostRequest;
import api.backend.model.post.PostResponse;
import api.backend.model.report.ReportRequest;
import api.backend.model.report.ReportResponse;
import api.backend.service.CommentService;
import api.backend.service.PostService;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;
    private final CommentService commentService;

    @Autowired
    public PostController(PostService postService, CommentService commentService) {
        this.postService = postService;
        this.commentService = commentService;
    }

    @PostMapping
    public ResponseEntity<PostResponse> createPost(@Valid @RequestBody PostRequest post,
            @AuthenticationPrincipal User currentUser) {
        PostResponse savedPost = postService.createPost(post, currentUser.getId());
        return ResponseEntity.ok(savedPost);
    }

    // Get all posts (public access)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PostResponse>> getAllPosts(@RequestParam(defaultValue = "0") int page) {
        List<PostResponse> posts = postService.getAllPosts(page);
        return ResponseEntity.ok(posts);
    }

    // Get all posts (public access)


    // Get all posts (public access)
    @GetMapping("/feed")
    public ResponseEntity<List<PostResponse>> getSubscribedToPosts(@RequestParam(defaultValue = "0") int page,
            @AuthenticationPrincipal User user) {
        List<PostResponse> posts = postService.getSubscribedToPosts(page, user.getId());
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
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> hidePost(@PathVariable Long id) {
        return ResponseEntity.ok(postService.hidePost(id));
    }

    // Comment

    @GetMapping("/{id}/comments")
    public ResponseEntity<List<CommentResponse>> getTopLevelComments(@PathVariable Long id, Pageable pageable) {
        return ResponseEntity.ok(commentService.getTopLevelComments(id, pageable));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<CommentResponse> addComment(@PathVariable Long id, @RequestBody CommentRequest request,
            @AuthenticationPrincipal User currentUser) {
        try {
            CommentResponse comment = commentService.addComment(id, currentUser, request);
            return ResponseEntity.ok(comment);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @DeleteMapping("/comments/{commentId}")
    @PreAuthorize("hasRole('ADMIN') or @commentService.getcommentById(#id).user.id == authentication.principal.id")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId, @AuthenticationPrincipal User currentUser) {
        return commentService.deleteComment(commentId, currentUser)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    @GetMapping("/comments/{commentId}/replies")
    public ResponseEntity<Page<CommentResponse>> getReplies(@PathVariable Long commentId, Pageable pageable) {
        try {
            Page<CommentResponse> replies = commentService.getReplies(commentId, pageable);
            return ResponseEntity.ok(replies);
        } catch (IllegalStateException e) {
            return ResponseEntity.notFound().build();
        }
    }


    
}