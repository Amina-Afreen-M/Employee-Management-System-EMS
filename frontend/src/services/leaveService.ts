import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
export type LeaveType = 'ANNUAL' | 'SICK' | 'MATERNITY' | 'PATERNITY' | 'UNPAID' | 'OTHER';

export interface LeaveRequest {
  id: number;
  employeeId: number;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  status: LeaveStatus;
  reason: string;
  approverId?: number;
  approverNote?: string;
  attachmentUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveBalance {
  employeeId: number;
  leaveType: LeaveType;
  totalDays: number;
  usedDays: number;
  remainingDays: number;
  year: number;
}

export interface CreateLeaveRequest {
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  attachmentUrl?: string;
}

export interface UpdateLeaveRequest {
  status?: LeaveStatus;
  approverNote?: string;
}

export const getLeaveRequests = async (employeeId?: number): Promise<LeaveRequest[]> => {
  const url = employeeId 
    ? `${API_URL}/leaves/employee/${employeeId}`
    : `${API_URL}/leaves`;
  const response = await axios.get<LeaveRequest[]>(url);
  return response.data;
};

export const getLeaveRequest = async (id: number): Promise<LeaveRequest> => {
  const response = await axios.get<LeaveRequest>(`${API_URL}/leaves/${id}`);
  return response.data;
};

export const createLeaveRequest = async (request: CreateLeaveRequest): Promise<LeaveRequest> => {
  const response = await axios.post<LeaveRequest>(`${API_URL}/leaves`, request);
  return response.data;
};

export const updateLeaveRequest = async (id: number, request: UpdateLeaveRequest): Promise<LeaveRequest> => {
  const response = await axios.put<LeaveRequest>(`${API_URL}/leaves/${id}`, request);
  return response.data;
};

export const cancelLeaveRequest = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/leaves/${id}`);
};

export const getLeaveBalance = async (employeeId: number): Promise<LeaveBalance[]> => {
  const response = await axios.get<LeaveBalance[]>(`${API_URL}/leaves/balance/${employeeId}`);
  return response.data;
};

export const getPendingApprovals = async (managerId: number): Promise<LeaveRequest[]> => {
  const response = await axios.get<LeaveRequest[]>(`${API_URL}/leaves/approvals/${managerId}`);
  return response.data;
};