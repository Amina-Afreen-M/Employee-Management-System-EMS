package com.ems.service.impl;

import com.ems.domain.Leave;
import com.ems.domain.User;
import com.ems.repository.LeaveRepository;
import com.ems.service.LeaveService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class LeaveServiceImpl implements LeaveService {
    private final LeaveRepository leaveRepository;

    @Override
    public Leave createLeaveRequest(Leave leave) {
        if (hasOverlappingLeave(leave.getUser(), leave.getStartDate(), leave.getEndDate())) {
            throw new IllegalStateException("Employee already has an approved leave for the specified date range");
        }
        return leaveRepository.save(leave);
    }

    @Override
    public Leave updateLeaveRequest(Long id, Leave leave) {
        Leave existingLeave = getLeaveById(id);
        if (existingLeave.getStatus() != Leave.LeaveStatus.PENDING) {
            throw new IllegalStateException("Can only update pending leave requests");
        }
        leave.setId(id);
        return leaveRepository.save(leave);
    }

    @Override
    public Leave approveLeaveRequest(Long id, User approver, String comments) {
        Leave leave = getLeaveById(id);
        if (leave.getStatus() != Leave.LeaveStatus.PENDING) {
            throw new IllegalStateException("Can only approve pending leave requests");
        }
        leave.setStatus(Leave.LeaveStatus.APPROVED);
        leave.setApprovedBy(approver);
        leave.setApprovalDate(LocalDate.now());
        leave.setComments(comments);
        return leaveRepository.save(leave);
    }

    @Override
    public Leave rejectLeaveRequest(Long id, User approver, String comments) {
        Leave leave = getLeaveById(id);
        if (leave.getStatus() != Leave.LeaveStatus.PENDING) {
            throw new IllegalStateException("Can only reject pending leave requests");
        }
        leave.setStatus(Leave.LeaveStatus.REJECTED);
        leave.setApprovedBy(approver);
        leave.setApprovalDate(LocalDate.now());
        leave.setComments(comments);
        return leaveRepository.save(leave);
    }

    @Override
    public Leave cancelLeaveRequest(Long id) {
        Leave leave = getLeaveById(id);
        if (leave.getStatus() == Leave.LeaveStatus.CANCELLED) {
            throw new IllegalStateException("Leave request is already cancelled");
        }
        leave.setStatus(Leave.LeaveStatus.CANCELLED);
        return leaveRepository.save(leave);
    }

    @Override
    @Transactional(readOnly = true)
    public Leave getLeaveById(Long id) {
        return leaveRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Leave not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Leave> getLeavesByUser(User user) {
        return leaveRepository.findByUser(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Leave> getLeavesByUserAndDateRange(User user, LocalDate startDate, LocalDate endDate) {
        return leaveRepository.findByUserAndStartDateBetween(user, startDate, endDate);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Leave> getLeavesByDepartmentAndStatus(Long departmentId, Leave.LeaveStatus status) {
        return leaveRepository.findByDepartmentIdAndStatus(departmentId, status);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Leave> getLeavesByStatus(Leave.LeaveStatus status) {
        return leaveRepository.findByStatus(status);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean hasOverlappingLeave(User user, LocalDate startDate, LocalDate endDate) {
        return leaveRepository.existsByUserAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                user, endDate, startDate);
    }

    @Override
    public void deleteLeave(Long id) {
        Leave leave = getLeaveById(id);
        if (leave.getStatus() != Leave.LeaveStatus.PENDING) {
            throw new IllegalStateException("Can only delete pending leave requests");
        }
        leaveRepository.deleteById(id);
    }
}