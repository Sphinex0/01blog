package api.backend.repository;

import api.backend.model.comment.Comment;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    Page<Comment> findByParentId(Long parentId, Pageable pageable);
    Page<Comment> findByPostIdAndParentIsNull(Long postId, Pageable pageable);
    
}