package api.backend.service;

import api.backend.model.comment.Comment;
import api.backend.model.comment.CommentRequest;
import api.backend.model.comment.CommentResponse;
import api.backend.model.post.Post;
import api.backend.model.user.User;
import api.backend.repository.CommentRepository;
import api.backend.repository.PostRepository;
import api.backend.repository.UserRepository;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public CommentService(CommentRepository commentRepository, PostRepository postRepository,
            UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
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
            parent.getReplies().add(savedComment); // Refresh replies
            commentRepository.save(parent);
        }
        CommentResponse commentResponse = new CommentResponse(
                savedComment.getId(),
                savedComment.getContent(),
                (UserService.toUserResponse(user)),
                postId,
                savedComment.getCreatedAt(),
                request.parentId(),
                0,
                0,
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
    public boolean likeComment(Long commentId, long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("No authenticated user found"));

        return commentRepository.findById(commentId)
                .map(comment -> {
                    if (comment.getLikedBy().contains(user)) {
                        comment.getLikedBy().remove(user);
                        commentRepository.save(comment);
                        return false;
                    }
                    comment.getLikedBy().add(user);
                    commentRepository.save(comment);
                    return true;
                }).get();
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

    public List<CommentResponse> getReplies(Long commentId, long cursor) {
        Pageable pageable = PageRequest.of(0, 10, Direction.DESC,"id");

        return commentRepository.findByParentIdAndIdLessThan(commentId, cursor, pageable).map(comment -> {
            int replyCount = commentRepository.findByParentId(comment.getId()).size();

            long user_id = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
            User user = userRepository.findById(user_id)
                    .orElseThrow(() -> new IllegalArgumentException("No authenticated user found"));
            boolean likedByCurrentUser = comment.getLikedBy().contains(user);
            return new CommentResponse(
                    comment.getId(),
                    comment.getContent(),
                    (UserService.toUserResponse(comment.getUser())),
                    comment.getPost().getId(),
                    comment.getCreatedAt(),
                    comment.getParent() != null ? comment.getParent().getId() : null,
                    comment.getLikedBy().size(),
                    replyCount,
                    likedByCurrentUser);
        }).toList();
    }

    public List<CommentResponse> getTopLevelComments(Long postId, long cursor) {
        Pageable pageable = PageRequest.of(0, 10, Direction.DESC, "id");
        // , cursor
        return commentRepository.findByPostIdAndParentIsNullAndIdLessThan(postId,cursor, pageable).map(comment -> {
            int replyCount = commentRepository.findByParentId(comment.getId())
                    .size();

            long user_id = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
            User user = userRepository.findById(user_id)
                    .orElseThrow(() -> new IllegalArgumentException("No authenticated user found"));
            boolean likedByCurrentUser = comment.getLikedBy().contains(user);

            return new CommentResponse(
                    comment.getId(),
                    comment.getContent(),
                    (UserService.toUserResponse(comment.getUser())),
                    postId,
                    comment.getCreatedAt(),
                    null, // Top-level comments have no parent
                    comment.getLikedBy().size(),
                    replyCount,
                    likedByCurrentUser);
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