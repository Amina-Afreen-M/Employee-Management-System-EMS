import { Box, Container, Heading, Tab, TabList, TabPanel, TabPanels, Tabs, VStack } from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import TimeEntryForm from '../components/timesheet/TimeEntryForm';
import TimeEntryList from '../components/timesheet/TimeEntryList';

const TimesheetPage = () => {
  const { user } = useAuth();
  const isManager = user?.roles?.includes('MANAGER') || user?.roles?.includes('ADMIN');

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="lg">Timesheet Management</Heading>

        <Tabs variant="enclosed">
          <TabList>
            <Tab>Submit Time Entry</Tab>
            <Tab>View Time Entries</Tab>
            {isManager && <Tab>Team Time Entries</Tab>}
          </TabList>

          <TabPanels>
            <TabPanel>
              <TimeEntryForm employeeId={user?.id || 0} />
            </TabPanel>

            <TabPanel>
              <TimeEntryList employeeId={user?.id} />
            </TabPanel>

            {isManager && (
              <TabPanel>
                <Box mb={4}>
                  <Heading size="md">Team Timesheet Review</Heading>
                </Box>
                <TimeEntryList isManager={true} />
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
};

export default TimesheetPage;