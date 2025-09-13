package api.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import api.backend.model.post.Post;
import api.backend.model.post.PostRequest;
import api.backend.model.post.PostResponse;
import api.backend.model.user.User;
import api.backend.repository.PostRepository;

@Service
public class PostService {

    private PostRepository postRepository;

    PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Post createPost(PostRequest request, User user) {
        Post post = new Post(user, request.content(), LocalDateTime.now());
        post.setMediaUrl(request.mediaUrl());
        return postRepository.save(post);
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
