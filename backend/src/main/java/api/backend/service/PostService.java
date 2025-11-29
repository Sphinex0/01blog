package api.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import api.backend.model.post.Post;
import api.backend.model.post.PostRequest;
import api.backend.model.post.PostResponse;
import api.backend.model.user.User;
import api.backend.repository.PostRepository;
import api.backend.repository.UserRepository;
import jakarta.transaction.Transactional;

@Service
public class PostService {

    private PostRepository postRepository;
    private UserRepository userRepository;
    private final NotificationService notificationService;

    PostService(PostRepository postRepository, UserRepository userRepository,
            NotificationService notificationService) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    public List<PostResponse> getAllPosts(long cursor) {
        Pageable pageable = PageRequest.of(0, 10, Direction.DESC, "id");// , Direction.DESC,"id"

        return postRepository.findAllByIdLessThan(cursor, pageable).stream().map(this::toPostResponse).toList();
    }

    public List<PostResponse> getPostsByUsername(long cursor, String username) {
        Pageable pageable = PageRequest.of(0, 10, Direction.DESC, "id");// , Direction.DESC,"id"

        User user = userRepository.findByUsername(username).get();

        return postRepository.findByUserAndIdLessThan(user, cursor, pageable).stream().map(this::toPostResponse)
                .toList();
    }

    public List<PostResponse> getSubscribedToPosts(long cursor, long user_id) {
        Pageable pageable = PageRequest.of(0, 10, Direction.DESC, "id");// , Direction.DESC,"id"
        User user = userRepository.findById(user_id)
                .orElseThrow(() -> new IllegalArgumentException("No authenticated user found"));

        return postRepository.findPostsBySubscribedTo(user.getSubscribedTo(), cursor, pageable)
                .map(this::toPostResponse).toList();
    }

    public PostResponse getPostById(long id) {
        return toPostResponse(postRepository.findByIdAndIsHiddenFalse(id).get());
    }

    public Post getPostEntityById(long id) {
        return postRepository.findById(id).get();
    }


    @Transactional
    public PostResponse createPost(PostRequest postRequest, User currentUser) {

        User user = userRepository.findById(currentUser.getId()).get();
        Post post = new Post(user, postRequest.title(), postRequest.content(), LocalDateTime.now());
        Post savedPost = postRepository.save(post);

        notificationService.createAndSendNewPostNotifications(savedPost);
        
        return toPostResponse(post);
    }

    public String deletePost(long id) {
        postRepository.findById(id).get();
        postRepository.deleteById(id);
        return "Post deleted successfully";
    }

    public String hidePost(long id) {
        Post post = postRepository.findById(id).get();
        post.setHidden(!post.isHidden());
        postRepository.save(post);
        return post.isHidden() ? "Post hidden successfully" : "Post unhidden successfully";
    }

    public PostResponse updatePost(Long id, PostRequest request) {
        Post existingPost = postRepository.findById(id).get();
        existingPost.setTitle(request.title());
        existingPost.setContent(request.content());
        existingPost.setModifiedAt(LocalDateTime.now());
        return toPostResponse(postRepository.save(existingPost));
    }

    // likes
    @Transactional
    public int likePost(long postId, long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("No authenticated user found"));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Target post not found"));

        Set<User> likes = post.getLikes();
        if (likes.contains(user)) {
            likes.remove(user);
            post.setLikesCount(post.getLikesCount() - 1);
            postRepository.save(post);
            return -1;
        } else {
            likes.add(user);
            post.setLikesCount(post.getLikesCount() + 1);
            postRepository.save(post);
            return 1;
        }
    }

    public PostResponse toPostResponse(Post post) {
        User currentUser = getCurrentUser();
        boolean likedByCurrentUser = false;
        if (currentUser != null) {
            likedByCurrentUser = post.getLikes().contains(currentUser);
        }

        return new PostResponse(
                post.getId(),
                (UserService.toUserResponse(post.getUser())),
                post.getTitle(),
                post.getContent(),
                post.getCreatedAt(),
                post.getLikesCount(),
                post.getCommentsCount(),
                likedByCurrentUser,
                post.isHidden());
    }

    private User getCurrentUser() {
            long userId = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
            return userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("No authenticated user found"));
    }
}