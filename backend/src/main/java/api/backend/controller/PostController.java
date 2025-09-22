
package api.backend.controller;

import api.backend.model.user.User;
import api.backend.model.comment.CommentRequest;
import api.backend.model.comment.CommentResponse;
import api.backend.model.post.Post;
import api.backend.model.post.PostRequest;
import api.backend.model.post.PostResponse;
import api.backend.service.CommentService;
import api.backend.service.PostService;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
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
    public ResponseEntity<List<PostResponse>> getSubscribedToPosts(@RequestParam(defaultValue = "0") int page,
            @AuthenticationPrincipal User user) {
        List<PostResponse> posts = postService.getSubscribedToPosts(page, user.getId());
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPostById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or  @postService.getPostById(#id).user.id == authentication.principal.id")
    public ResponseEntity<Post> updatePost(@PathVariable Long id, @Valid @RequestBody PostRequest post) {
        Post updatedPost = postService.updatePost(id, post);
        return ResponseEntity.ok(updatedPost);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @postService.getPostById(#id).user.id == authentication.principal.id")
    public ResponseEntity<String> deletePost(@PathVariable Long id) {
        return ResponseEntity.ok(postService.deletePost(id));
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Integer> likePost(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(postService.likePost(id, user.getId()));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> hidePost(@PathVariable Long id) {
        return ResponseEntity.ok(postService.hidePost(id));
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<List<CommentResponse>> getTopLevelComments(@PathVariable Long id,
            @RequestParam(defaultValue = "0") long cursor) {
        if (cursor == 0) {
            cursor = Long.MAX_VALUE;
        }
        return ResponseEntity.ok(commentService.getTopLevelComments(id, cursor));
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
    public ResponseEntity<List<CommentResponse>> getReplies(@PathVariable Long commentId,
            @RequestParam(defaultValue = "0") long cursor) {
        if (cursor == 0) {
            cursor = Long.MAX_VALUE;
        }

        List<CommentResponse> replies = commentService.getReplies(commentId, cursor);
        return ResponseEntity.ok(replies);
    }

}