import { Box, Button, FormControl, FormLabel, Input, Select, Textarea, VStack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LeaveRequestCreateRequest, LeaveType, createLeaveRequest } from '../../services/leaveRequestService';

const leaveRequestSchema = z.object({
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  leaveType: z.enum(['ANNUAL', 'SICK', 'PERSONAL', 'MATERNITY', 'PATERNITY', 'OTHER']),
  reason: z.string().min(10, 'Please provide a detailed reason for your leave request'),
  employeeId: z.number()
});

type LeaveRequestFormData = z.infer<typeof leaveRequestSchema>;

interface LeaveRequestFormProps {
  employeeId: number;
  onSuccess?: () => void;
}

const LeaveRequestForm = ({ employeeId, onSuccess }: LeaveRequestFormProps) => {
  const toast = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<LeaveRequestFormData>({
    resolver: zodResolver(leaveRequestSchema),
    defaultValues: {
      employeeId
    }
  });

  const onSubmit = async (data: LeaveRequestFormData) => {
    try {
      await createLeaveRequest(data);
      toast({
        title: 'Success',
        description: 'Leave request submitted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      reset();
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to submit leave request',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const leaveTypes: LeaveType[] = ['ANNUAL', 'SICK', 'PERSONAL', 'MATERNITY', 'PATERNITY', 'OTHER'];

  return (
    <Box p={8} maxWidth="600px" borderWidth={1} borderRadius={8} boxShadow="lg">
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4} align="stretch">
          <FormControl isInvalid={!!errors.startDate}>
            <FormLabel>Start Date</FormLabel>
            <Input
              type="date"
              {...register('startDate')}
            />
            {errors.startDate && <Box color="red.500">{errors.startDate.message}</Box>}
          </FormControl>

          <FormControl isInvalid={!!errors.endDate}>
            <FormLabel>End Date</FormLabel>
            <Input
              type="date"
              {...register('endDate')}
            />
            {errors.endDate && <Box color="red.500">{errors.endDate.message}</Box>}
          </FormControl>

          <FormControl isInvalid={!!errors.leaveType}>
            <FormLabel>Leave Type</FormLabel>
            <Select
              {...register('leaveType')}
            >
              {leaveTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0) + type.slice(1).toLowerCase()}
                </option>
              ))}
            </Select>
            {errors.leaveType && <Box color="red.500">{errors.leaveType.message}</Box>}
          </FormControl>

          <FormControl isInvalid={!!errors.reason}>
            <FormLabel>Reason</FormLabel>
            <Textarea
              {...register('reason')}
              placeholder="Please provide a detailed reason for your leave request"
            />
            {errors.reason && <Box color="red.500">{errors.reason.message}</Box>}
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            isLoading={isSubmitting}
            mt={4}
          >
            Submit Request
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default LeaveRequestForm;