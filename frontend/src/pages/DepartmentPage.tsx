import { Box, Button, Heading, useDisclosure, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import DepartmentList from '../components/departments/DepartmentList';
import DepartmentForm from '../components/departments/DepartmentForm';
import { Department } from '../services/departmentService';
import { useAuth } from '../contexts/AuthContext';

const DepartmentPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDepartment, setSelectedDepartment] = useState<Department | undefined>();
  const { user } = useAuth();
  const isAdmin = user?.roles.includes('ADMIN');

  const handleSuccess = () => {
    onClose();
    setSelectedDepartment(undefined);
  };

  return (
    <Box p={8}>
      <VStack spacing={8} align="stretch">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Heading size="lg">Departments</Heading>
          {isAdmin && (
            <Button colorScheme="blue" onClick={onOpen}>
              Add Department
            </Button>
          )}
        </Box>

        <DepartmentList />

        {isOpen && (
          <Box
            position="fixed"
            top={0}
            right={0}
            bottom={0}
            width="500px"
            bg="white"
            boxShadow="-4px 0 6px rgba(0, 0, 0, 0.1)"
            p={6}
            overflowY="auto"
            zIndex={1000}
          >
            <VStack spacing={6} align="stretch">
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Heading size="md">
                  {selectedDepartment ? 'Edit Department' : 'New Department'}
                </Heading>
                <Button variant="ghost" onClick={onClose}>
                  Close
                </Button>
              </Box>
              <DepartmentForm
                department={selectedDepartment}
                onSuccess={handleSuccess}
              />
            </VStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default DepartmentPage;