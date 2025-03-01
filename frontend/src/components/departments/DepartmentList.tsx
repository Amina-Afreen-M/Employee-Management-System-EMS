import { Box, Table, Thead, Tbody, Tr, Th, Td, Button, useToast, Text, HStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Department, getDepartments, deleteDepartment } from '../../services/departmentService';
import { useAuth } from '../../contexts/AuthContext';

const DepartmentList = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to fetch departments',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (departmentId: number) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;

    try {
      await deleteDepartment(departmentId);
      await fetchDepartments();
      toast({
        title: 'Success',
        description: 'Department deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete department',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return <Box>Loading...</Box>;
  }

  if (departments.length === 0) {
    return <Box p={4}>No departments found.</Box>;
  }

  const isAdmin = user?.roles.includes('ADMIN');

  return (
    <Box overflowX="auto">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Description</Th>
            <Th>Manager</Th>
            <Th>Employee Count</Th>
            {isAdmin && <Th>Actions</Th>}
          </Tr>
        </Thead>
        <Tbody>
          {departments.map((department) => (
            <Tr key={department.id}>
              <Td>{department.name}</Td>
              <Td>
                <Text noOfLines={2}>{department.description}</Text>
              </Td>
              <Td>{department.managerName || 'Not Assigned'}</Td>
              <Td>{department.employeeCount || 0}</Td>
              {isAdmin && (
                <Td>
                  <HStack spacing={2}>
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDelete(department.id)}
                    >
                      Delete
                    </Button>
                  </HStack>
                </Td>
              )}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default DepartmentList;