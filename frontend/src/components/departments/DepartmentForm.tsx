import { Box, Button, FormControl, FormLabel, Input, Textarea, VStack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Department, createDepartment, updateDepartment } from '../../services/departmentService';

const departmentSchema = z.object({
  name: z.string().min(2, 'Department name must be at least 2 characters'),
  description: z.string().min(10, 'Please provide a detailed description'),
  managerId: z.number().optional(),
});

type DepartmentFormData = z.infer<typeof departmentSchema>;

interface DepartmentFormProps {
  department?: Department;
  onSuccess?: () => void;
}

const DepartmentForm = ({ department, onSuccess }: DepartmentFormProps) => {
  const toast = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: department || {},
  });

  const onSubmit = async (data: DepartmentFormData) => {
    try {
      if (department?.id) {
        await updateDepartment(department.id, data);
      } else {
        await createDepartment(data);
      }

      toast({
        title: 'Success',
        description: `Department ${department ? 'updated' : 'created'} successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      reset();
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || `Failed to ${department ? 'update' : 'create'} department`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={8} maxWidth="600px" borderWidth={1} borderRadius={8} boxShadow="lg">
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4} align="stretch">
          <FormControl isInvalid={!!errors.name}>
            <FormLabel>Department Name</FormLabel>
            <Input
              {...register('name')}
              placeholder="Enter department name"
            />
            {errors.name && <Box color="red.500">{errors.name.message}</Box>}
          </FormControl>

          <FormControl isInvalid={!!errors.description}>
            <FormLabel>Description</FormLabel>
            <Textarea
              {...register('description')}
              placeholder="Enter department description"
              rows={4}
            />
            {errors.description && <Box color="red.500">{errors.description.message}</Box>}
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            isLoading={isSubmitting}
            mt={4}
          >
            {department ? 'Update' : 'Create'} Department
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default DepartmentForm;