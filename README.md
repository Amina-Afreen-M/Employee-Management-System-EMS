# Employee Management System (EMS)

A comprehensive employee management system built with Spring Boot and React, featuring role-based access control, employee management, department organization, leave management, and timesheet tracking.

## Features

- **User Authentication & Authorization**
  - Role-based access control (Admin, Manager, Employee)
  - Secure JWT-based authentication
  - Protected routes and API endpoints

- **Employee Management**
  - Employee profiles with personal and professional information
  - Employee status tracking (Active, Inactive, On Leave)
  - Department assignment and transfer
  - Reporting structure management

- **Department Management**
  - Department creation and organization
  - Department head assignment
  - Employee allocation and tracking

- **Leave Management**
  - Multiple leave types (Annual, Sick, Personal, etc.)
  - Leave request submission and approval workflow
  - Leave balance tracking

- **Timesheet Management**
  - Daily time entry logging
  - Project and task tracking
  - Timesheet approval workflow

## Tech Stack

### Backend
- Spring Boot 3.1.5
- Spring Security with JWT
- Spring Data JPA
- PostgreSQL
- Maven

### Frontend
- React with TypeScript
- Chakra UI
- React Router
- Axios
- Zod for form validation

## Setup Instructions

### Prerequisites
- Java 17
- Node.js 16+
- PostgreSQL 12+

### Database Setup
1. Create a PostgreSQL database named `ems_db`
2. Update database credentials in `backend/src/main/resources/application.properties` if needed

### Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## API Documentation

The API documentation is available at `http://localhost:8080/swagger-ui.html` when running the backend server.

## Contributing

Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.