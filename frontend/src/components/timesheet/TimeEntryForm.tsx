import { Box, Button, FormControl, FormLabel, Input, Textarea, VStack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TimeEntryCreateRequest, createTimeEntry } from '../../services/timesheetService';

const timeEntrySchema = z.object({
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required')
    .refine((endTime, data) => {
      if (!data.startTime || !endTime) return true;
      const start = new Date(`2000-01-01T${data.startTime}`);
      const end = new Date(`2000-01-01T${endTime}`);
      return end > start;
    }, 'End time must be after start time'),
  description: z.string().min(10, 'Please provide a detailed description of your work'),
  project: z.string().optional(),
  task: z.string().optional(),
  employeeId: z.number()
});

type TimeEntryFormData = z.infer<typeof timeEntrySchema>;

interface TimeEntryFormProps {
  employeeId: number;
  onSuccess?: () => void;
}

const TimeEntryForm = ({ employeeId, onSuccess }: TimeEntryFormProps) => {
  const toast = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch } = useForm<TimeEntryFormData>({
    resolver: zodResolver(timeEntrySchema),
    defaultValues: {
      employeeId,
      date: new Date().toISOString().split('T')[0]
    }
  });

  const calculateHours = (startTime: string, endTime: string): number => {
    if (!startTime || !endTime) return 0;
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const diffMs = end.getTime() - start.getTime();
    return Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
  };

  const onSubmit = async (data: TimeEntryFormData) => {
    try {
      const hours = calculateHours(data.startTime, data.endTime);
      if (hours <= 0) {
        toast({
          title: 'Error',
          description: 'Invalid time range',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      await createTimeEntry({ ...data });
      toast({
        title: 'Success',
        description: 'Time entry submitted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      reset();
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to submit time entry',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const startTime = watch('startTime');
  const endTime = watch('endTime');
  const hours = calculateHours(startTime, endTime);

  return (
    <Box p={8} maxWidth="600px" borderWidth={1} borderRadius={8} boxShadow="lg">
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4} align="stretch">
          <FormControl isInvalid={!!errors.date}>
            <FormLabel>Date</FormLabel>
            <Input
              type="date"
              {...register('date')}
            />
            {errors.date && <Box color="red.500">{errors.date.message}</Box>}
          </FormControl>

          <FormControl isInvalid={!!errors.startTime}>
            <FormLabel>Start Time</FormLabel>
            <Input
              type="time"
              {...register('startTime')}
            />
            {errors.startTime && <Box color="red.500">{errors.startTime.message}</Box>}
          </FormControl>

          <FormControl isInvalid={!!errors.endTime}>
            <FormLabel>End Time</FormLabel>
            <Input
              type="time"
              {...register('endTime')}
            />
            {errors.endTime && <Box color="red.500">{errors.endTime.message}</Box>}
          </FormControl>

          {startTime && endTime && (
            <Box>
              <FormLabel>Total Hours</FormLabel>
              <Box>{hours} hours</Box>
            </Box>
          )}

          <FormControl isInvalid={!!errors.project}>
            <FormLabel>Project (Optional)</FormLabel>
            <Input
              {...register('project')}
              placeholder="Project name"
            />
            {errors.project && <Box color="red.500">{errors.project.message}</Box>}
          </FormControl>

          <FormControl isInvalid={!!errors.task}>
            <FormLabel>Task (Optional)</FormLabel>
            <Input
              {...register('task')}
              placeholder="Task name"
            />
            {errors.task && <Box color="red.500">{errors.task.message}</Box>}
          </FormControl>

          <FormControl isInvalid={!!errors.description}>
            <FormLabel>Description</FormLabel>
            <Textarea
              {...register('description')}
              placeholder="Describe your work"
              rows={4}
            />
            {errors.description && <Box color="red.500">{errors.description.message}</Box>}
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            isLoading={isSubmitting}
            disabled={isSubmitting || hours <= 0}
          >
            Submit Time Entry
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default TimeEntryForm;