
package api.backend.controller;

import api.backend.model.user.User;
import api.backend.model.comment.CommentRequest;
import api.backend.model.comment.CommentResponse;
import api.backend.model.post.PostRequest;
import api.backend.model.post.PostResponse;
import api.backend.service.CommentService;
import api.backend.service.PostService;
import jakarta.validation.Valid;

import org.hibernate.Hibernate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final PostService postService;
    private final CommentService commentService;

    public CommentController(PostService postService, CommentService commentService) {
        this.postService = postService;
        this.commentService = commentService;
    }

    @GetMapping("/post/{id}")
    public ResponseEntity<List<CommentResponse>> getTopLevelComments(@PathVariable Long id,
            @RequestParam(defaultValue = "0") long cursor) {

        // System.out.println("Fetching comments for post ID: " + id + " with cursor: "
        // + cursor);
        if (cursor == 0) {
            cursor = Long.MAX_VALUE;
        }
        return ResponseEntity.ok(commentService.getTopLevelComments(id, cursor));
    }

    @PostMapping("/{postId}")
    public ResponseEntity<CommentResponse> addComment(@PathVariable Long postId, @RequestBody CommentRequest request,
            @AuthenticationPrincipal User currentUser) {
        CommentResponse comment = commentService.addComment(postId, currentUser.getId(), request);
        return ResponseEntity.ok(comment);
    }

    @DeleteMapping("/{commentId}")
    @PreAuthorize("hasRole('ADMIN') or @commentService.getcommentById(#id).user.id == authentication.principal.id")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId, @AuthenticationPrincipal User currentUser) {
        commentService.deleteComment(commentId, currentUser);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{commentId}")
    @PreAuthorize("hasRole('ADMIN') or @commentService.getcommentById(#id).user.id == authentication.principal.id")
    public ResponseEntity<Void> updateComment(@PathVariable Long commentId, @RequestBody CommentRequest request,
            @AuthenticationPrincipal User currentUser) {
        commentService.updateComment(commentId, currentUser.getId(), request);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/like/{id}")
    public ResponseEntity<Boolean> likeComment(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(commentService.likeComment(id, user.getId()));
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