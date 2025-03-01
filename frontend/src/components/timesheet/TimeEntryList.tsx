import { Box, Table, Thead, Tbody, Tr, Th, Td, Button, Badge, useToast, Text, HStack, Tooltip } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { TimeEntry, TimesheetStatus } from '../../services/timesheetService';
import { getTimeEntries, approveTimeEntry, rejectTimeEntry } from '../../services/timesheetService';
import { useAuth } from '../../contexts/AuthContext';

interface TimeEntryListProps {
  employeeId?: number;
  isManager?: boolean;
}

const TimeEntryList = ({ employeeId, isManager = false }: TimeEntryListProps) => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    fetchTimeEntries();
  }, [employeeId]);

  const fetchTimeEntries = async () => {
    try {
      const entries = await getTimeEntries(new Date().toISOString().split('T')[0], new Date().toISOString().split('T')[0]);
      setTimeEntries(entries);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to fetch time entries',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (entryId: number) => {
    try {
      await approveTimeEntry(entryId);
      await fetchTimeEntries();
      toast({
        title: 'Success',
        description: 'Time entry approved',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to approve time entry',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleReject = async (entryId: number) => {
    try {
      await rejectTimeEntry(entryId);
      await fetchTimeEntries();
      toast({
        title: 'Success',
        description: 'Time entry rejected',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to reject time entry',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getStatusBadge = (status: TimesheetStatus) => {
    const statusConfig = {
      PENDING: { color: 'yellow', label: 'Pending' },
      APPROVED: { color: 'green', label: 'Approved' },
      REJECTED: { color: 'red', label: 'Rejected' }
    };
    const config = statusConfig[status];
    return <Badge colorScheme={config.color}>{config.label}</Badge>;
  };

  if (loading) {
    return <Box>Loading...</Box>;
  }

  if (timeEntries.length === 0) {
    return <Box p={4}>No time entries found.</Box>;
  }

  return (
    <Box overflowX="auto">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th>Time</Th>
            <Th>Hours</Th>
            <Th>Project</Th>
            <Th>Task</Th>
            <Th>Description</Th>
            <Th>Status</Th>
            {isManager && <Th>Actions</Th>}
          </Tr>
        </Thead>
        <Tbody>
          {timeEntries.map((entry) => (
            <Tr key={entry.id}>
              <Td>{new Date(entry.date).toLocaleDateString()}</Td>
              <Td>{entry.startTime} - {entry.endTime}</Td>
              <Td>{entry.hours}</Td>
              <Td>{entry.project || '-'}</Td>
              <Td>{entry.task || '-'}</Td>
              <Td>
                <Tooltip label={entry.description}>
                  <Text noOfLines={2}>{entry.description}</Text>
                </Tooltip>
              </Td>
              <Td>{getStatusBadge(entry.status)}</Td>
              {isManager && entry.status === 'PENDING' && (
                <Td>
                  <HStack spacing={2}>
                    <Button
                      size="sm"
                      colorScheme="green"
                      onClick={() => handleApprove(entry.id)}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleReject(entry.id)}
                    >
                      Reject
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

export default TimeEntryList;