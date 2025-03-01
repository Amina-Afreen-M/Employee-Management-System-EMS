package com.ems.repository;

import com.ems.domain.Department;
import com.ems.domain.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    List<Department> findByOrganization(Organization organization);
    List<Department> findByOrganizationId(Long organizationId);
    List<Department> findByManagerId(Long managerId);
    boolean existsByNameAndOrganizationId(String name, Long organizationId);
}