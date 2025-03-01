import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type LeaveType = 'ANNUAL' | 'SICK' | 'PERSONAL' | 'MATERNITY' | 'PATERNITY' | 'OTHER';

export interface LeaveRequest {
  id: number;
  employeeId: number;
  startDate: string;
  endDate: string;
  leaveType: LeaveType;
  reason: string;
  status: LeaveStatus;
  approverComment?: string;
  approverId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface LeaveRequestCreateRequest extends Omit<LeaveRequest, 'id' | 'status' | 'approverComment' | 'approverId' | 'createdAt' | 'updatedAt'> {}
export interface LeaveRequestUpdateRequest extends Partial<LeaveRequestCreateRequest> {}

export const getLeaveRequests = async (): Promise<LeaveRequest[]> => {
  const response = await axios.get<LeaveRequest[]>(`${API_URL}/leave-requests`);
  return response.data;
};

export const getLeaveRequest = async (id: number): Promise<LeaveRequest> => {
  const response = await axios.get<LeaveRequest>(`${API_URL}/leave-requests/${id}`);
  return response.data;
};

export const createLeaveRequest = async (leaveRequest: LeaveRequestCreateRequest): Promise<LeaveRequest> => {
  const response = await axios.post<LeaveRequest>(`${API_URL}/leave-requests`, leaveRequest);
  return response.data;
};

export const updateLeaveRequest = async (id: number, leaveRequest: LeaveRequestUpdateRequest): Promise<LeaveRequest> => {
  const response = await axios.put<LeaveRequest>(`${API_URL}/leave-requests/${id}`, leaveRequest);
  return response.data;
};

export const deleteLeaveRequest = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/leave-requests/${id}`);
};

export const approveLeaveRequest = async (id: number, comment?: string): Promise<LeaveRequest> => {
  const response = await axios.put<LeaveRequest>(`${API_URL}/leave-requests/${id}/approve`, { comment });
  return response.data;
};

export const rejectLeaveRequest = async (id: number, comment?: string): Promise<LeaveRequest> => {
  const response = await axios.put<LeaveRequest>(`${API_URL}/leave-requests/${id}/reject`, { comment });
  return response.data;
};

export const getMyLeaveRequests = async (): Promise<LeaveRequest[]> => {
  const response = await axios.get<LeaveRequest[]>(`${API_URL}/leave-requests/my`);
  return response.data;
};

export const getPendingLeaveRequests = async (): Promise<LeaveRequest[]> => {
  const response = await axios.get<LeaveRequest[]>(`${API_URL}/leave-requests/pending`);
  return response.data;
};