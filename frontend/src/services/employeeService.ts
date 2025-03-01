import axios, { AxiosError } from 'axios';
import { AuthResponse } from './authService';

const API_URL = 'http://localhost:8080/api';

export interface Employee extends Omit<AuthResponse, 'token'> {
  phoneNumber: string;
  position: string;
  hireDate?: string;
  salary?: number;
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
  managerId?: number;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface EmployeeCreateRequest extends Omit<Employee, 'id' | 'userId'> {
  password: string;
}

export interface EmployeeUpdateRequest extends Partial<Omit<Employee, 'id' | 'userId'>> {}

export interface ApiError {
  message: string;
  status: number;
}

const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const apiError: ApiError = {
      message: error.response?.data?.message || 'An unexpected error occurred',
      status: error.response?.status || 500
    };
    throw apiError;
  }
  throw new Error('An unexpected error occurred');
};

export const getEmployees = async (): Promise<Employee[]> => {
  try {
    const response = await axios.get<Employee[]>(`${API_URL}/employees`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getEmployee = async (id: number): Promise<Employee> => {
  try {
    const response = await axios.get<Employee>(`${API_URL}/employees/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createEmployee = async (employee: EmployeeCreateRequest): Promise<Employee> => {
  try {
    const response = await axios.post<Employee>(`${API_URL}/employees`, employee);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateEmployee = async (id: number, employee: EmployeeUpdateRequest): Promise<Employee> => {
  try {
    const response = await axios.put<Employee>(`${API_URL}/employees/${id}`, employee);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteEmployee = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/employees/${id}`);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getSubordinates = async (managerId: number): Promise<Employee[]> => {
  try {
    const response = await axios.get<Employee[]>(`${API_URL}/employees/manager/${managerId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getDepartmentEmployees = async (departmentId: number): Promise<Employee[]> => {
  const response = await axios.get<Employee[]>(`${API_URL}/employees/department/${departmentId}`);
  return response.data;
};