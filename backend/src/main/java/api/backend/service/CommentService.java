package api.backend.service;

import api.backend.model.comment.Comment;
import api.backend.model.comment.CommentRequest;
import api.backend.model.comment.CommentResponse;
import api.backend.model.post.Post;
import api.backend.model.user.User;
import api.backend.repository.CommentRepository;
import api.backend.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    @Autowired
    public CommentService(CommentRepository commentRepository, PostRepository postRepository) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
    }

    public CommentResponse addComment(Long postId, User user, CommentRequest request) {
        Post post = postRepository.findById(postId).get();
        Comment parent = null;
        if (request.parentId() != null) {
            parent = commentRepository.findById(request.parentId())
            .filter(p -> p.getPost().getId().equals(postId)) // Ensure parent is for the same post
            .orElseThrow(() -> new IllegalStateException("Parent comment not found"));
        }
        
        Comment comment = new Comment(user, post, request.content(), parent);
        Comment savedComment = commentRepository.save(comment);
        
        // Update commentsCount in Post
        post.setCommentsCount(post.getCommentsCount() + 1);
        postRepository.save(post);
        
        // Update replyCount for the parent if it exists
        if (parent != null) {
            parent.getReplies().add(savedComment); // Refresh replies
            commentRepository.save(parent);
        }

        return new CommentResponse(
                savedComment.getId(),
                savedComment.getContent(),
                user.getId(),
                postId,
                savedComment.getCreatedAt(),
                request.parentId(),
                0 // Initial replyCount, updated below if parent exists
        );
    }

    public boolean deleteComment(Long commentId, User currentUser) {
        return commentRepository.findById(commentId)
                .map(comment -> {
                    commentRepository.delete(comment);
                    // Update commentsCount in Post
                    postRepository.findById(comment.getPost().getId()).ifPresent(post -> {
                        post.setCommentsCount(Math.max(0, post.getCommentsCount() - 1 - countReplies(comment)));
                        postRepository.save(post);
                    });
                    // Update replyCount for the parent if it exists
                    if (comment.getParent() != null) {
                        comment.getParent().getReplies().remove(comment);
                        commentRepository.save(comment.getParent());
                    }
                    return true;
                }).get();
    }

    public Comment getCommentById(Long commentId) {
        return commentRepository.findById(commentId).get();
    }

    public List<CommentResponse> getReplies(Long commentId, Pageable pageable) {
        return commentRepository.findByParentId(commentId, pageable).map(comment -> {
            int replyCount = commentRepository.findByParentId(comment.getId(), Pageable.unpaged()).getNumberOfElements();
            return new CommentResponse(
                    comment.getId(),
                    comment.getContent(),
                    comment.getUser().getId(),
                    comment.getPost().getId(),
                    comment.getCreatedAt(),
                    comment.getParent() != null ? comment.getParent().getId() : null,
                    replyCount
            );
        }).toList();
    }

    public List<CommentResponse> getTopLevelComments(Long postId, Pageable pageable) {
        return commentRepository.findByPostIdAndParentIsNull(postId, pageable).map(comment -> {
            int replyCount = commentRepository.findByParentId(comment.getId(), Pageable.unpaged()).getNumberOfElements();
            return new CommentResponse(
                    comment.getId(),
                    comment.getContent(),
                    comment.getUser().getId(),
                    postId,
                    comment.getCreatedAt(),
                    null, // Top-level comments have no parent
                    replyCount
            );
        }).toList();
    }

    private int countReplies(Comment comment) {
        int count = comment.getReplies().size();
        for (Comment reply : comment.getReplies()) {
            count += countReplies(reply);
        }
        return count;
    }
}