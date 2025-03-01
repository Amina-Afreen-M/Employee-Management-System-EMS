package com.ems.repository;

import com.ems.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByEmailAndOrganizationSubdomain(String email, String subdomain);
    boolean existsByEmail(String email);
}