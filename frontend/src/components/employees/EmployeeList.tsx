import { Box, Table, Thead, Tbody, Tr, Th, Td, Button, useToast, Spinner, HStack, IconButton } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Employee, getEmployees, deleteEmployee } from '../../services/employeeService';
import { useNavigate } from 'react-router-dom';
import { EditIcon, DeleteIcon, ViewIcon } from '@chakra-ui/icons';
import { useAuth } from '../../contexts/AuthContext';

const EmployeeList = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to fetch employees',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleView = (employeeId: number) => {
    navigate(`/employees/${employeeId}`);
  };

  const handleEdit = (employeeId: number) => {
    navigate(`/employees/${employeeId}/edit`);
  };

  const handleDelete = async (employeeId: number) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    try {
      await deleteEmployee(employeeId);
      setEmployees(employees.filter(emp => emp.userId !== employeeId));
      toast({
        title: 'Success',
        description: 'Employee deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete employee',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="200px">
        <Spinner size="xl" />
      </Box>
    );
  }

  const isAdmin = user?.roles.includes('ADMIN');

  return (
    <Box overflowX="auto">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Position</Th>
            <Th>Department</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {employees.map((employee) => (
            <Tr key={employee.userId}>
              <Td>{`${employee.firstName} ${employee.lastName}`}</Td>
              <Td>{employee.email}</Td>
              <Td>{employee.position}</Td>
              <Td>{employee.departmentName || '-'}</Td>
              <Td>{employee.status}</Td>
              <Td>
                <HStack spacing={2}>
                  <IconButton
                    aria-label="View employee"
                    icon={<ViewIcon />}
                    size="sm"
                    onClick={() => handleView(employee.userId)}
                  />
                  {isAdmin && (
                    <>
                      <IconButton
                        aria-label="Edit employee"
                        icon={<EditIcon />}
                        size="sm"
                        onClick={() => handleEdit(employee.userId)}
                      />
                      <IconButton
                        aria-label="Delete employee"
                        icon={<DeleteIcon />}
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleDelete(employee.userId)}
                      />
                    </>
                  )}
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {isAdmin && (
        <Button
          colorScheme="blue"
          onClick={() => navigate('/employees/create')}
          mt={4}
        >
          Create Employee
        </Button>
      )}
    </Box>
  );
};

export default EmployeeList;