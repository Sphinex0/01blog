
package api.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import api.backend.model.report.Report;

public interface ReportRepository extends JpaRepository<Report, Long> {
    Page<Report> findAllByIdLessThan(Long cursor, Pageable pageable);

}