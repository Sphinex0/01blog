package api.backend.service;

import api.backend.model.comment.Comment;
import api.backend.model.comment.CommentRequest;
import api.backend.model.comment.CommentResponse;
import api.backend.model.like.CommentLike;
import api.backend.model.post.Post;
import api.backend.model.user.User;
import api.backend.repository.CommentRepository;
import api.backend.repository.PostRepository;
import api.backend.repository.UserRepository;
import api.backend.repository.like.CommentLikeRepository;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CommentLikeRepository commentLikeRepository;

    public CommentService(CommentRepository commentRepository, PostRepository postRepository,
            UserRepository userRepository, CommentLikeRepository commentLikeRepository) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.commentLikeRepository = commentLikeRepository;
    }

    public CommentResponse addComment(Long postId, long userId, CommentRequest request) {
        User user = userRepository.findById(userId).get();
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
            parent.setRepliesCount(parent.getRepliesCount() + 1);
            commentRepository.save(parent);
        }
        CommentResponse commentResponse = new CommentResponse(
                savedComment.getId(),
                savedComment.getContent(),
                (UserService.toUserResponse(user)),
                postId,
                savedComment.getCreatedAt(),
                request.parentId(),
                savedComment.getLikesCount(),
                savedComment.getRepliesCount(),
                false);

        return commentResponse;
    }

    // updateComment
    public boolean updateComment(Long commentId, Long userId, CommentRequest request) {
        return commentRepository.findById(commentId)
                .map(comment -> {
                    comment.setContent(request.content());
                    commentRepository.save(comment);
                    return true;
                }).get();
    }

    // likeComment
    public int likeComment(Long commentId, long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("No authenticated user found"));
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Target comment not found"));

        Optional<CommentLike> existingLike = commentLikeRepository.findByCommentIdAndUserId(commentId, userId);

        if (existingLike.isPresent()) {
            commentLikeRepository.delete(existingLike.get());
            comment.setLikesCount(comment.getLikesCount() - 1);
            commentRepository.save(comment);
            return -1;
        } else {
            CommentLike newLike = new CommentLike(user, comment);
            commentLikeRepository.save(newLike);
            comment.setLikesCount(comment.getLikesCount() + 1);
            commentRepository.save(comment);
            return 1;
        }
    }

    public boolean deleteComment(Long commentId, User currentUser) {
        return commentRepository.findById(commentId)
                .map(comment -> {
                    commentRepository.delete(comment);
                    // Update commentsCount in Post
                    postRepository.findById(comment.getPost().getId()).ifPresent(post -> {
                        post.setCommentsCount(Math.max(0, post.getCommentsCount() - 1 - comment.getRepliesCount()));
                        postRepository.save(post);
                    });
                    // Update replyCount for the parent if it exists
                    if (comment.getParent() != null) {
                        comment.getParent().setRepliesCount(comment.getParent().getRepliesCount() - 1);
                        commentRepository.save(comment.getParent());
                    }
                    return true;
                }).get();
    }

    public Comment getCommentById(Long commentId) {
        return commentRepository.findById(commentId).get();
    }

    public List<CommentResponse> getReplies(Long commentId, long cursor) {
        Pageable pageable = PageRequest.of(0, 10, Direction.DESC,"id");

        return commentRepository.findByParentIdAndIdLessThan(commentId, cursor, pageable).map(comment -> {
            User currentUser = getCurrentUser();
            boolean likedByCurrentUser = commentLikeRepository.findByCommentIdAndUserId(comment.getId(), currentUser.getId()).isPresent();
            return new CommentResponse(
                    comment.getId(),
                    comment.getContent(),
                    (UserService.toUserResponse(comment.getUser())),
                    comment.getPost().getId(),
                    comment.getCreatedAt(),
                    comment.getParent() != null ? comment.getParent().getId() : null,
                    comment.getLikesCount(),
                    comment.getRepliesCount(),
                    likedByCurrentUser);
        }).toList();
    }

    public List<CommentResponse> getTopLevelComments(Long postId, long cursor) {
        Pageable pageable = PageRequest.of(0, 10, Direction.DESC, "id");
        return commentRepository.findByPostIdAndParentIsNullAndIdLessThan(postId,cursor, pageable).map(comment -> {
            User currentUser = getCurrentUser();
            boolean likedByCurrentUser = commentLikeRepository.findByCommentIdAndUserId(comment.getId(), currentUser.getId()).isPresent();

            return new CommentResponse(
                    comment.getId(),
                    comment.getContent(),
                    (UserService.toUserResponse(comment.getUser())),
                    postId,
                    comment.getCreatedAt(),
                    null, 
                    comment.getLikesCount(),
                    comment.getRepliesCount(),
                    likedByCurrentUser);
        }).toList();
    }

    private User getCurrentUser() {
        long userId = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("No authenticated user found"));
    }
}