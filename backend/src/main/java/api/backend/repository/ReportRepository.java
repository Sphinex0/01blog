
package api.backend.repository;



import org.springframework.data.domain.Page;

import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;



import api.backend.model.report.Report;

import api.backend.model.user.UserReportSummary;



import java.time.LocalDateTime;

import java.util.List;



public interface ReportRepository extends JpaRepository<Report, Long> {



    Page<Report> findAllByIdLessThan(Long cursor, Pageable pageable);



    long countByCreatedAtAfter(LocalDateTime date);



    long countByStatus(Report.Status status);



    @Query("SELECT new api.backend.model.user.UserReportSummary(r.reported.id, r.reported.username, r.reported.fullName, r.reported.avatar, COUNT(r), MAX(r.createdAt)) FROM Report r GROUP BY r.reported.id, r.reported.username, r.reported.fullName, r.reported.avatar ORDER BY COUNT(r) DESC")
    List<UserReportSummary> findMostReportedUsers(Pageable pageable);



}