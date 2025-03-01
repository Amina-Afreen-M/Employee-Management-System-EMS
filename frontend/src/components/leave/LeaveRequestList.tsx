import { Box, Table, Thead, Tbody, Tr, Th, Td, Badge, Button, HStack, useToast, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { LeaveRequest, LeaveStatus, getLeaveRequests, approveLeaveRequest, rejectLeaveRequest } from '../../services/leaveRequestService';
import { useAuth } from '../../contexts/AuthContext';

const LeaveRequestList = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const toast = useToast();

  const loadRequests = async () => {
    try {
      const data = await getLeaveRequests();
      setRequests(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load leave requests',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      await approveLeaveRequest(id);
      await loadRequests();
      toast({
        title: 'Success',
        description: 'Leave request approved',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to approve request',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleReject = async (id: number) => {
    try {
      await rejectLeaveRequest(id);
      await loadRequests();
      toast({
        title: 'Success',
        description: 'Leave request rejected',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to reject request',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getStatusColor = (status: LeaveStatus) => {
    switch (status) {
      case 'APPROVED': return 'green';
      case 'REJECTED': return 'red';
      default: return 'yellow';
    }
  };

  if (loading) {
    return <Box>Loading...</Box>;
  }

  if (requests.length === 0) {
    return <Text>No leave requests found.</Text>;
  }

  const isManager = user?.roles.includes('MANAGER') || user?.roles.includes('ADMIN');

  return (
    <Box overflowX="auto">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Employee</Th>
            <Th>Type</Th>
            <Th>Start Date</Th>
            <Th>End Date</Th>
            <Th>Status</Th>
            <Th>Reason</Th>
            {isManager && <Th>Actions</Th>}
          </Tr>
        </Thead>
        <Tbody>
          {requests.map((request) => (
            <Tr key={request.id}>
              <Td>{request.employeeId}</Td>
              <Td>{request.leaveType}</Td>
              <Td>{new Date(request.startDate).toLocaleDateString()}</Td>
              <Td>{new Date(request.endDate).toLocaleDateString()}</Td>
              <Td>
                <Badge colorScheme={getStatusColor(request.status)}>
                  {request.status}
                </Badge>
              </Td>
              <Td>{request.reason}</Td>
              {isManager && request.status === 'PENDING' && (
                <Td>
                  <HStack spacing={2}>
                    <Button
                      size="sm"
                      colorScheme="green"
                      onClick={() => handleApprove(request.id)}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleReject(request.id)}
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

export default LeaveRequestList;