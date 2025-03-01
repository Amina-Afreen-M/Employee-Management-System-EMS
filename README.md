# Employee Management System (EMS)

A full-stack Employee Management System built with **Spring Boot** and **React**, featuring **role-based access control**, employee management, department organization, leave tracking, and timesheet management.

## Features

### 🔐 Authentication & Authorization
- Role-based access control (Admin, Manager, Employee)
- JWT-based authentication & authorization
- Secure API endpoints with Spring Security

### 👥 Employee Management
- Create, update, and delete employee profiles
- Assign employees to departments
- Track employee status (Active, On Leave, Inactive)

### 🏢 Department Management
- Create and manage departments
- Assign department heads
- Track employee allocations

### 🗓️ Leave Management
- Apply for leave (Annual, Sick, Personal, etc.)
- Approval workflow for managers
- Leave balance tracking

### ⏳ Timesheet Management
- Log daily work hours
- Track project-based tasks
- Manager approval workflow

---

## 🛠️ Tech Stack

### Backend
- Spring Boot 3.1.5
- Spring Security (JWT Authentication)
- Spring Data JPA (PostgreSQL)
- Maven

### Frontend
- React with TypeScript
- Chakra UI (for UI components)
- React Router (for navigation)
- Axios (API communication)
- Zod (form validation)

---

## ⚙️ Setup Instructions

### Prerequisites
- Java 17
- Node.js 16+
- PostgreSQL 12+

### Database Setup
1. Create a PostgreSQL database named `ems_db`
2. Update `backend/src/main/resources/application.properties` with credentials:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/ems_db
   spring.datasource.username=your_db_user
   spring.datasource.password=your_db_password
   ```

### Backend Setup
```sh
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend Setup
```sh
cd frontend
npm install
npm run dev
```

---

## 📑 API Documentation
API documentation is available at:  
🔗 **[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)**

### Key API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | User Login (JWT) |
| `GET` | `/api/employees` | Get all employees |
| `POST` | `/api/employees` | Create a new employee |
| `PUT` | `/api/employees/{id}` | Update employee details |
| `DELETE` | `/api/employees/{id}` | Remove an employee |
| `POST` | `/api/leaves/apply` | Apply for leave |
| `GET` | `/api/timesheets` | Get submitted timesheets |

---

## 📜 License
This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.

---
