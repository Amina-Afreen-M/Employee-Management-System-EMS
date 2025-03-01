package com.ems.service;

import com.ems.domain.Timesheet;
import com.ems.domain.User;

import java.time.LocalDate;
import java.util.List;

public interface TimesheetService {
    Timesheet createTimesheet(Timesheet timesheet);
    Timesheet updateTimesheet(Long id, Timesheet timesheet);
    Timesheet approveTimesheet(Long id, User approver, String comments);
    Timesheet rejectTimesheet(Long id, User approver, String comments);
    Timesheet getTimesheetById(Long id);
    List<Timesheet> getTimesheetsByUser(User user);
    List<Timesheet> getTimesheetsByUserAndDateRange(User user, LocalDate startDate, LocalDate endDate);
    List<Timesheet> getTimesheetsByDepartmentAndStatus(Long departmentId, Timesheet.TimesheetStatus status);
    List<Timesheet> getTimesheetsByStatus(Timesheet.TimesheetStatus status);
    List<Timesheet> getTimesheetsByUserAndDate(User user, LocalDate date);
    List<Timesheet> getTimesheetsByProject(String project);
    void deleteTimesheet(Long id);
}