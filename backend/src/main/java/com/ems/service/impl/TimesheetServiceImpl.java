package com.ems.service.impl;

import com.ems.domain.Timesheet;
import com.ems.domain.User;
import com.ems.repository.TimesheetRepository;
import com.ems.service.TimesheetService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TimesheetServiceImpl implements TimesheetService {
    private final TimesheetRepository timesheetRepository;

    @Override
    public Timesheet createTimesheet(Timesheet timesheet) {
        validateTimesheet(timesheet);
        return timesheetRepository.save(timesheet);
    }

    @Override
    public Timesheet updateTimesheet(Long id, Timesheet timesheet) {
        Timesheet existingTimesheet = getTimesheetById(id);
        if (existingTimesheet.getStatus() != Timesheet.TimesheetStatus.PENDING) {
            throw new IllegalStateException("Can only update pending timesheet entries");
        }
        validateTimesheet(timesheet);
        timesheet.setId(id);
        return timesheetRepository.save(timesheet);
    }

    @Override
    public Timesheet approveTimesheet(Long id, User approver, String comments) {
        Timesheet timesheet = getTimesheetById(id);
        if (timesheet.getStatus() != Timesheet.TimesheetStatus.PENDING) {
            throw new IllegalStateException("Can only approve pending timesheet entries");
        }
        timesheet.setStatus(Timesheet.TimesheetStatus.APPROVED);
        timesheet.setApprovedBy(approver);
        timesheet.setApprovalDate(LocalDate.now());
        timesheet.setComments(comments);
        return timesheetRepository.save(timesheet);
    }

    @Override
    public Timesheet rejectTimesheet(Long id, User approver, String comments) {
        Timesheet timesheet = getTimesheetById(id);
        if (timesheet.getStatus() != Timesheet.TimesheetStatus.PENDING) {
            throw new IllegalStateException("Can only reject pending timesheet entries");
        }
        timesheet.setStatus(Timesheet.TimesheetStatus.REJECTED);
        timesheet.setApprovedBy(approver);
        timesheet.setApprovalDate(LocalDate.now());
        timesheet.setComments(comments);
        return timesheetRepository.save(timesheet);
    }

    @Override
    @Transactional(readOnly = true)
    public Timesheet getTimesheetById(Long id) {
        return timesheetRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Timesheet not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Timesheet> getTimesheetsByUser(User user) {
        return timesheetRepository.findByUser(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Timesheet> getTimesheetsByUserAndDateRange(User user, LocalDate startDate, LocalDate endDate) {
        return timesheetRepository.findByUserAndDateBetween(user, startDate, endDate);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Timesheet> getTimesheetsByDepartmentAndStatus(Long departmentId, Timesheet.TimesheetStatus status) {
        return timesheetRepository.findByDepartmentIdAndStatus(departmentId, status);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Timesheet> getTimesheetsByStatus(Timesheet.TimesheetStatus status) {
        return timesheetRepository.findByStatus(status);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Timesheet> getTimesheetsByUserAndDate(User user, LocalDate date) {
        return timesheetRepository.findByUserAndDate(user, date);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Timesheet> getTimesheetsByProject(String project) {
        return timesheetRepository.findByProjectContainingIgnoreCase(project);
    }

    @Override
    public void deleteTimesheet(Long id) {
        Timesheet timesheet = getTimesheetById(id);
        if (timesheet.getStatus() != Timesheet.TimesheetStatus.PENDING) {
            throw new IllegalStateException("Can only delete pending timesheet entries");
        }
        timesheetRepository.deleteById(id);
    }

    private void validateTimesheet(Timesheet timesheet) {
        if (timesheet.getStartTime().isAfter(timesheet.getEndTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }
    }
}