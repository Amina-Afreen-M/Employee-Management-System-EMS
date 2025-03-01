import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export interface LoginRequest {
  email: string;
  password: string;
  subdomain?: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  organizationName: string | null;
  departmentName: string | null;
}

export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, credentials);
  return response.data;
};

export const setAuthToken = (token: string): void => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};