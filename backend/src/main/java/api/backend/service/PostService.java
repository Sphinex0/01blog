package api.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Service;

import api.backend.model.post.Post;
import api.backend.model.post.PostRequest;
import api.backend.model.post.PostResponse;
import api.backend.model.user.User;
import api.backend.model.user.UserResponse;
import api.backend.repository.PostRepository;

@Service
public class PostService {

    private PostRepository postRepository;

    PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public List<PostResponse> getAllPosts(int page) {
        Pageable pageable = PageRequest.of(page, 10, Direction.DESC, "id");// , Direction.DESC,"id"

        return postRepository.findAll(pageable).stream().map(this::toPostResponse).toList();
    }

    public PostResponse createPost(PostRequest request, User user) {
        Post post = new Post(user, request.content(), LocalDateTime.now());
        post.setMediaUrl(request.mediaUrl());
        return toPostResponse(postRepository.save(post));
    }


    public Post updatePost(Long id, PostRequest request) {
        return postRepository.findById(id).map(existingPost -> {
            // existingPost.setTitle(post.getTitle());
            existingPost.setContent(request.content());
            return postRepository.save(existingPost);
        }).get();
    }


    public PostResponse toPostResponse(Post post) {
        return new PostResponse(
                post.getId(),
                post.getUser().getUsername(), // Assuming User has getUsername()
                post.getContent(),
                post.getMediaUrl(),
                post.getCreatedAt(),
                post.getLikesCount(),
                post.getCommentsCount());
    }

}
