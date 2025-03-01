package com.ems.service;

import com.ems.domain.Leave;
import com.ems.domain.User;

import java.time.LocalDate;
import java.util.List;

public interface LeaveService {
    Leave createLeaveRequest(Leave leave);
    Leave updateLeaveRequest(Long id, Leave leave);
    Leave approveLeaveRequest(Long id, User approver, String comments);
    Leave rejectLeaveRequest(Long id, User approver, String comments);
    Leave cancelLeaveRequest(Long id);
    Leave getLeaveById(Long id);
    List<Leave> getLeavesByUser(User user);
    List<Leave> getLeavesByUserAndDateRange(User user, LocalDate startDate, LocalDate endDate);
    List<Leave> getLeavesByDepartmentAndStatus(Long departmentId, Leave.LeaveStatus status);
    List<Leave> getLeavesByStatus(Leave.LeaveStatus status);
    boolean hasOverlappingLeave(User user, LocalDate startDate, LocalDate endDate);
    void deleteLeave(Long id);
}