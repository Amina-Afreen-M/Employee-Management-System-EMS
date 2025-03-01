package com.ems.service.impl;

import com.ems.domain.Department;
import com.ems.domain.Organization;
import com.ems.domain.User;
import com.ems.repository.DepartmentRepository;
import com.ems.repository.UserRepository;
import com.ems.service.DepartmentService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class DepartmentServiceImpl implements DepartmentService {
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;

    @Override
    public Department createDepartment(Department department) {
        if (existsByNameInOrganization(department.getName(), department.getOrganization().getId())) {
            throw new IllegalStateException("Department with this name already exists in the organization");
        }
        return departmentRepository.save(department);
    }

    @Override
    public Department updateDepartment(Long id, Department department) {
        Department existingDepartment = getDepartmentById(id);
        if (!existingDepartment.getName().equals(department.getName()) &&
            existsByNameInOrganization(department.getName(), department.getOrganization().getId())) {
            throw new IllegalStateException("Department with this name already exists in the organization");
        }
        department.setId(id);
        return departmentRepository.save(department);
    }

    @Override
    @Transactional(readOnly = true)
    public Department getDepartmentById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Department not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Department> getDepartmentsByOrganization(Organization organization) {
        return departmentRepository.findByOrganization(organization);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Department> getDepartmentsByOrganizationId(Long organizationId) {
        return departmentRepository.findByOrganizationId(organizationId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Department> getDepartmentsByManager(Long managerId) {
        return departmentRepository.findByManagerId(managerId);
    }

    @Override
    public Department assignManager(Long departmentId, Long managerId) {
        Department department = getDepartmentById(departmentId);
        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + managerId));

        if (!manager.getRoles().contains("ROLE_MANAGER")) {
            throw new IllegalStateException("User must have manager role to be assigned as department manager");
        }

        department.setManager(manager);
        return departmentRepository.save(department);
    }

    @Override
    public Department addEmployee(Long departmentId, Long employeeId) {
        Department department = getDepartmentById(departmentId);
        User employee = userRepository.findById(employeeId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + employeeId));

        if (employee.getDepartment() != null) {
            throw new IllegalStateException("Employee is already assigned to a department");
        }

        employee.setDepartment(department);
        department.getEmployees().add(employee);
        return departmentRepository.save(department);
    }

    @Override
    public Department removeEmployee(Long departmentId, Long employeeId) {
        Department department = getDepartmentById(departmentId);
        User employee = userRepository.findById(employeeId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + employeeId));

        if (!department.equals(employee.getDepartment())) {
            throw new IllegalStateException("Employee is not assigned to this department");
        }

        employee.setDepartment(null);
        department.getEmployees().remove(employee);
        return departmentRepository.save(department);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByNameInOrganization(String name, Long organizationId) {
        return departmentRepository.existsByNameAndOrganizationId(name, organizationId);
    }

    @Override
    public void deleteDepartment(Long id) {
        Department department = getDepartmentById(id);
        if (!department.getEmployees().isEmpty()) {
            throw new IllegalStateException("Cannot delete department with assigned employees");
        }
        departmentRepository.deleteById(id);
    }
}