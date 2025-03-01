package com.ems.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@Entity
@Table(name = "leaves")
public class Leave {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @NotNull
    private User user;

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @NotNull
    private LeaveType type;

    @Column(length = 1000)
    private String reason;

    @Enumerated(EnumType.STRING)
    @NotNull
    private LeaveStatus status = LeaveStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private User approvedBy;

    private LocalDate approvalDate;

    @Column(length = 1000)
    private String comments;

    public enum LeaveType {
        ANNUAL,
        SICK,
        PERSONAL,
        MATERNITY,
        PATERNITY,
        UNPAID
    }

    public enum LeaveStatus {
        PENDING,
        APPROVED,
        REJECTED,
        CANCELLED
    }
}