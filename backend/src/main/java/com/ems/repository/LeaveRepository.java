package com.ems.repository;

import com.ems.domain.Leave;
import com.ems.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LeaveRepository extends JpaRepository<Leave, Long> {
    List<Leave> findByUser(User user);
    List<Leave> findByUserAndStartDateBetween(User user, LocalDate startDate, LocalDate endDate);
    List<Leave> findByDepartmentIdAndStatus(Long departmentId, Leave.LeaveStatus status);
    List<Leave> findByStatus(Leave.LeaveStatus status);
    boolean existsByUserAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
        User user, LocalDate endDate, LocalDate startDate
    );
}