import { Box, Button, FormControl, FormLabel, Input, VStack, useToast, Select, Text, Heading } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { Employee, getEmployee, updateEmployee } from '../../services/employeeService';
import { useAuth } from '../../contexts/AuthContext';

const employeeSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 characters'),
  position: z.string().min(2, 'Position must be at least 2 characters'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ON_LEAVE']),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface EmployeeProfileProps {
  employeeId: number;
  isEditable?: boolean;
}

const EmployeeProfile = ({ employeeId, isEditable = false }: EmployeeProfileProps) => {
  const toast = useToast();
  const { user } = useAuth();
  const [employee, setEmployee] = useState<Employee | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
  });

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        const data = await getEmployee(employeeId);
        setEmployee(data);
        reset(data);
      } catch (error: any) {
        toast({
          title: 'Error',
          description: 'Failed to load employee data',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    loadEmployee();
  }, [employeeId, reset, toast]);

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      const updated = await updateEmployee(employeeId, data);
      setEmployee(updated);
      toast({
        title: 'Success',
        description: 'Employee profile updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update employee profile',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (!employee) {
    return <Box>Loading...</Box>;
  }

  const canEdit = isEditable || user?.userId === employeeId || user?.roles.includes('ADMIN');

  return (
    <Box p={8} maxWidth="800px" borderWidth={1} borderRadius={8} boxShadow="lg">
      <Heading mb={6}>Employee Profile</Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4} align="stretch">
          <FormControl isInvalid={!!errors.firstName}>
            <FormLabel>First Name</FormLabel>
            <Input
              {...register('firstName')}
              isReadOnly={!canEdit}
            />
            {errors.firstName && <Text color="red.500">{errors.firstName.message}</Text>}
          </FormControl>

          <FormControl isInvalid={!!errors.lastName}>
            <FormLabel>Last Name</FormLabel>
            <Input
              {...register('lastName')}
              isReadOnly={!canEdit}
            />
            {errors.lastName && <Text color="red.500">{errors.lastName.message}</Text>}
          </FormControl>

          <FormControl isInvalid={!!errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              {...register('email')}
              isReadOnly={!canEdit}
            />
            {errors.email && <Text color="red.500">{errors.email.message}</Text>}
          </FormControl>

          <FormControl isInvalid={!!errors.phoneNumber}>
            <FormLabel>Phone Number</FormLabel>
            <Input
              {...register('phoneNumber')}
              isReadOnly={!canEdit}
            />
            {errors.phoneNumber && <Text color="red.500">{errors.phoneNumber.message}</Text>}
          </FormControl>

          <FormControl isInvalid={!!errors.position}>
            <FormLabel>Position</FormLabel>
            <Input
              {...register('position')}
              isReadOnly={!canEdit}
            />
            {errors.position && <Text color="red.500">{errors.position.message}</Text>}
          </FormControl>

          <FormControl isInvalid={!!errors.status}>
            <FormLabel>Status</FormLabel>
            <Select
              {...register('status')}
              isDisabled={!canEdit}
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="ON_LEAVE">On Leave</option>
            </Select>
            {errors.status && <Text color="red.500">{errors.status.message}</Text>}
          </FormControl>

          {canEdit && (
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isSubmitting}
              mt={4}
            >
              Save Changes
            </Button>
          )}
        </VStack>
      </form>
    </Box>
  );
};

export default EmployeeProfile;