package com.ems.service;

import com.ems.domain.Department;
import com.ems.domain.Organization;
import com.ems.domain.User;

import java.util.List;

public interface DepartmentService {
    Department createDepartment(Department department);
    Department updateDepartment(Long id, Department department);
    Department getDepartmentById(Long id);
    List<Department> getDepartmentsByOrganization(Organization organization);
    List<Department> getDepartmentsByOrganizationId(Long organizationId);
    List<Department> getDepartmentsByManager(Long managerId);
    Department assignManager(Long departmentId, Long managerId);
    Department addEmployee(Long departmentId, Long employeeId);
    Department removeEmployee(Long departmentId, Long employeeId);
    boolean existsByNameInOrganization(String name, Long organizationId);
    void deleteDepartment(Long id);
}