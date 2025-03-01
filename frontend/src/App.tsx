import { ChakraProvider, CSSReset, Box } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useParams } from 'react-router-dom';
import Layout from './components/layout/Layout';
import DashboardLayout from './components/layout/DashboardLayout';
import LoginForm from './components/auth/LoginForm';
import { AuthProvider } from './contexts/AuthContext';
import EmployeeProfile from './components/employees/EmployeeProfile';
import EmployeeList from './components/employees/EmployeeList';
import RequireAuth from './components/auth/RequireAuth';

const EmployeeProfileWrapper = ({ isEditable }: { isEditable: boolean }) => {
  const { id } = useParams();
  return <EmployeeProfile employeeId={Number(id)} isEditable={isEditable} />;
};

function App() {
  return (
    <ChakraProvider>
      <CSSReset />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route element={<Layout />}>
              <Route path="/login" element={<LoginForm />} />
            </Route>

            {/* Protected routes */}
            <Route element={
              <RequireAuth>
                <DashboardLayout />
              </RequireAuth>
            }>
              <Route path="/dashboard" element={<div>Dashboard Content</div>} />
              <Route path="/employees" element={<EmployeeList />} />
              <Route path="/employees/:id" element={<EmployeeProfileWrapper isEditable={false} />} />
              <Route path="/employees/:id/edit" element={<EmployeeProfileWrapper isEditable={true} />} />
              <Route path="/departments" element={<div>Departments</div>} />
              <Route path="/leave-management" element={<div>Leave Management</div>} />
              <Route path="/reports" element={<div>Reports</div>} />
              <Route path="/profile" element={<div>My Profile</div>} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
