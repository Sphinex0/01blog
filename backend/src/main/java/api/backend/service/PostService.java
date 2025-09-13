package api.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import api.backend.model.post.Post;
import api.backend.model.post.PostRequest;
import api.backend.repository.PostRepository;

@Service
public class PostService {

    private PostRepository postRepository;

    PostService(PostRepository postRepository){
        this.postRepository = postRepository;
    }
    
    public List<Post> getAllPosts(){
        return postRepository.findAll();
    }

    public Post savePost(PostRequest request){
        Post post = convertToEntity(request);
        post.setCreated_at(LocalDateTime.now());

        return post;
    }

    public Post convertToEntity(PostRequest request) {
        Post blog = new Post();
        blog.setUser_id(request.user_id());
        blog.setContent(request.content());
        blog.setMedia_url(request.media_type());
        blog.setMedia_type(request.media_type());
        return blog;
    }

}
