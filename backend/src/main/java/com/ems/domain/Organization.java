package com.ems.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@Entity
@Table(name = "organizations")
public class Organization {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(unique = true)
    private String name;

    @Column(unique = true)
    private String subdomain;

    private String address;
    private String contactEmail;
    private String contactPhone;

    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL)
    private Set<Department> departments = new HashSet<>();

    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL)
    private Set<User> users = new HashSet<>();
}