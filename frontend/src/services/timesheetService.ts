import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export type TimesheetStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface TimeEntry {
  id: number;
  employeeId: number;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  project?: string;
  task?: string;
  hours: number;
  status: TimesheetStatus;
  approverComment?: string;
  approverId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TimeEntryCreateRequest extends Omit<TimeEntry, 'id' | 'status' | 'approverComment' | 'approverId' | 'createdAt' | 'updatedAt' | 'hours'> {}
export interface TimeEntryUpdateRequest extends Partial<TimeEntryCreateRequest> {}

export const getTimeEntries = async (startDate: string, endDate: string): Promise<TimeEntry[]> => {
  const response = await axios.get<TimeEntry[]>(`${API_URL}/timesheets`, {
    params: { startDate, endDate }
  });
  return response.data;
};

export const getTimeEntry = async (id: number): Promise<TimeEntry> => {
  const response = await axios.get<TimeEntry>(`${API_URL}/timesheets/${id}`);
  return response.data;
};

export const createTimeEntry = async (timeEntry: TimeEntryCreateRequest): Promise<TimeEntry> => {
  const response = await axios.post<TimeEntry>(`${API_URL}/timesheets`, timeEntry);
  return response.data;
};

export const updateTimeEntry = async (id: number, timeEntry: TimeEntryUpdateRequest): Promise<TimeEntry> => {
  const response = await axios.put<TimeEntry>(`${API_URL}/timesheets/${id}`, timeEntry);
  return response.data;
};

export const deleteTimeEntry = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/timesheets/${id}`);
};

export const approveTimeEntry = async (id: number, comment?: string): Promise<TimeEntry> => {
  const response = await axios.put<TimeEntry>(`${API_URL}/timesheets/${id}/approve`, { comment });
  return response.data;
};

export const rejectTimeEntry = async (id: number, comment?: string): Promise<TimeEntry> => {
  const response = await axios.put<TimeEntry>(`${API_URL}/timesheets/${id}/reject`, { comment });
  return response.data;
};

export const getMyTimeEntries = async (startDate: string, endDate: string): Promise<TimeEntry[]> => {
  const response = await axios.get<TimeEntry[]>(`${API_URL}/timesheets/my`, {
    params: { startDate, endDate }
  });
  return response.data;
};

export const getPendingTimeEntries = async (): Promise<TimeEntry[]> => {
  const response = await axios.get<TimeEntry[]>(`${API_URL}/timesheets/pending`);
  return response.data;
};

export const getWeeklyTimesheet = async (weekStartDate: string): Promise<TimeEntry[]> => {
  const response = await axios.get<TimeEntry[]>(`${API_URL}/timesheets/weekly`, {
    params: { weekStartDate }
  });
  return response.data;
};