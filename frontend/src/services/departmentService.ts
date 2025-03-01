import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export interface Department {
  id: number;
  name: string;
  description?: string;
  managerId?: number;
  parentDepartmentId?: number;
  budget?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentCreateRequest extends Omit<Department, 'id' | 'createdAt' | 'updatedAt'> {}

export interface DepartmentUpdateRequest extends Partial<DepartmentCreateRequest> {}

export const getDepartments = async (): Promise<Department[]> => {
  const response = await axios.get<Department[]>(`${API_URL}/departments`);
  return response.data;
};

export const getDepartment = async (id: number): Promise<Department> => {
  const response = await axios.get<Department>(`${API_URL}/departments/${id}`);
  return response.data;
};

export const createDepartment = async (department: DepartmentCreateRequest): Promise<Department> => {
  const response = await axios.post<Department>(`${API_URL}/departments`, department);
  return response.data;
};

export const updateDepartment = async (id: number, department: DepartmentUpdateRequest): Promise<Department> => {
  const response = await axios.put<Department>(`${API_URL}/departments/${id}`, department);
  return response.data;
};

export const deleteDepartment = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/departments/${id}`);
};

export const getDepartmentHierarchy = async (): Promise<Department[]> => {
  const response = await axios.get<Department[]>(`${API_URL}/departments/hierarchy`);
  return response.data;
};

export const getSubDepartments = async (parentId: number): Promise<Department[]> => {
  const response = await axios.get<Department[]>(`${API_URL}/departments/${parentId}/subdepartments`);
  return response.data;
};