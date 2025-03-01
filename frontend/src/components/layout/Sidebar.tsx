import { Box, VStack, Text, Link, Divider, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const userRole = user?.roles?.[0]?.toLowerCase() || 'employee';

  const menuItems = {
    superAdmin: [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Organizations', path: '/organizations' },
      { label: 'System Settings', path: '/settings' },
    ],
    admin: [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Employees', path: '/employees' },
      { label: 'Departments', path: '/departments' },
      { label: 'Leave Management', path: '/leave-management' },
      { label: 'Reports', path: '/reports' },
    ],
    manager: [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'My Team', path: '/my-team' },
      { label: 'Leave Requests', path: '/leave-requests' },
      { label: 'Team Reports', path: '/team-reports' },
    ],
    employee: [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'My Profile', path: '/profile' },
      { label: 'My Attendance', path: '/attendance' },
      { label: 'Leave Requests', path: '/leave-requests' },
    ],
  };

  const currentMenuItems = menuItems[userRole as keyof typeof menuItems] || menuItems.employee;

  return (
    <Box p={4}>
      <Text fontSize="xl" fontWeight="bold" mb={6}>
        EMS
      </Text>
      <Divider mb={6} />
      <VStack spacing={3} align="stretch">
        {currentMenuItems.map((item) => (
          <Link
            key={item.path}
            as={RouterLink}
            to={item.path}
            py={2}
            px={4}
            borderRadius="md"
            _hover={{ bg: 'gray.100' }}
          >
            {item.label}
          </Link>
        ))}
      </VStack>
    </Box>
  );
};

export default Sidebar;