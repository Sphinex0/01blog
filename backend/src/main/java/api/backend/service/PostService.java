package api.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import api.backend.model.notification.Notification;
import api.backend.model.post.Post;
import api.backend.model.post.PostRequest;
import api.backend.model.post.PostResponse;
import api.backend.model.user.User;
import api.backend.repository.NotificationRepository;
import api.backend.repository.PostRepository;
import api.backend.repository.UserRepository;
import jakarta.transaction.Transactional;

@Service
public class PostService {

    private PostRepository postRepository;
    private UserRepository userRepository;
    private NotificationRepository notificationRepository;
    private final NotificationService notificationService;
    private final SimpMessagingTemplate messagingTemplate; // For sending WebSocket messages

    PostService(PostRepository postRepository, UserRepository userRepository,
            NotificationRepository notificationRepository, NotificationService notificationService,
            SimpMessagingTemplate messagingTemplate) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
        this.notificationService = notificationService;
        this.messagingTemplate = messagingTemplate;
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

    // public PostResponse createPost(PostRequest request, long userId) {
    //     User user = userRepository.findById(userId).get();
    //     Post post = new Post(user, request.title(), request.content(), LocalDateTime.now());
    //     post = postRepository.save(post);
    //     sendNotifications(post);
    //     return toPostResponse(post);
    // }

    @Transactional
    public PostResponse createPost(PostRequest postRequest, User currentUser) {
        // Post post = new Post();
        // post.setTitle(postRequest.title());
        // post.setContent(postRequest.content());
        // post.setUser(currentUser);
        User user = userRepository.findById(currentUser.getId()).get();
        Post post = new Post(user, postRequest.title(), postRequest.content(), LocalDateTime.now());
        Post savedPost = postRepository.save(post);

        // --- WebSocket Notification Logic ---
        // 1. Create and save notifications for followers in the database.
        // 2. This method should return a DTO for the broadcast.
        var notificationResponse = notificationService.createAndSaveNewPostNotification(savedPost);
        
        // 3. Broadcast the notification to all subscribers on the "/topic/new-posts" topic.
        messagingTemplate.convertAndSend("/topic/new-posts", notificationResponse);
        // --- End of WebSocket Logic ---

        return toPostResponse(post);
    }

    public void sendNotifications(Post post) {
        User currentUser = post.getUser();
        for (User user : currentUser.getSubscribers()) {
            Notification notification = new Notification(user, currentUser, post);
            // user.getNotifications().add(notification);
            notificationRepository.save(notification);
        }
    }

    public String deletePost(long id) {
        postRepository.findById(id).get();
        postRepository.deleteById(id);
        // return "Post deleted";
        return "";
    }

    public String hidePost(long id) {
        postRepository.findById(id).map(existingPost -> {
            existingPost.setHidden(!existingPost.isHidden());
            return postRepository.save(existingPost);
        }).get();

        // return "Post hidden";
        return "";
    }

    public PostResponse updatePost(Long id, PostRequest request) {
        Post existingPost = postRepository.findById(id).get();
        existingPost.setTitle(request.title());
        existingPost.setContent(request.content());
        existingPost.setModifiedAt(LocalDateTime.now());
        return toPostResponse(postRepository.save(existingPost));
    }

    // likes
    public int likePost(long post_id, long user_id) {

        User user = userRepository.findById(user_id)
                .orElseThrow(() -> new IllegalArgumentException("No authenticated user found"));

        Post target = postRepository.findById(post_id)
                .orElseThrow(() -> new IllegalArgumentException("Target post not found"));

        if (target.getLikedBy().contains(user)) {
            user.getLikedPosts().remove(target);
            target.getLikedBy().remove(user);
            target.setLikesCount(target.getLikesCount() - 1);
            postRepository.save(target);

            return -1;
        }

        user.getLikedPosts().add(target);
        target.getLikedBy().add(user);
        target.setLikesCount(target.getLikesCount() + 1);

        postRepository.save(target);
        return 1;
    }

    public PostResponse toPostResponse(Post post) {
        long user_id = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
        User user = userRepository.findById(user_id)
                .orElseThrow(() -> new IllegalArgumentException("No authenticated user found"));
        boolean likedByCurrentUser = post.getLikedBy().contains(user);

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

}
