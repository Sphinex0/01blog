package api.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import api.backend.model.post.Post;

public interface PostRepository extends JpaRepository<Post, Long> {

}
