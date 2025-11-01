package api.backend.repository;

import api.backend.model.comment.Comment;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    Page<Comment> findByParentIdAndIdLessThan(Long parentId, Long cursor, Pageable pageable);
    List<Comment> findByParentId(Long parentId);
    
    Page<Comment> findByPostIdAndParentIsNullAndIdLessThan(Long postId, Long cursor, Pageable pageable);

}