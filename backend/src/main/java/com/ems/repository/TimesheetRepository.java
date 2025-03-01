package com.ems.repository;

import com.ems.domain.Timesheet;
import com.ems.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TimesheetRepository extends JpaRepository<Timesheet, Long> {
    List<Timesheet> findByUser(User user);
    List<Timesheet> findByUserAndDateBetween(User user, LocalDate startDate, LocalDate endDate);
    List<Timesheet> findByDepartmentIdAndStatus(Long departmentId, Timesheet.TimesheetStatus status);
    List<Timesheet> findByStatus(Timesheet.TimesheetStatus status);
    List<Timesheet> findByUserAndDate(User user, LocalDate date);
    List<Timesheet> findByProjectContainingIgnoreCase(String project);
}