import { Box, Container, Flex, IconButton, Text, useDisclosure, VStack, HStack, Avatar } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children?: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });
  const { user } = useAuth();

  return (
    <Box minH="100vh" bg="gray.50">
      <Flex>
        {/* Sidebar */}
        <Box
          display={{ base: isOpen ? 'block' : 'none', md: 'block' }}
          w={{ base: 'full', md: '250px' }}
          bg="white"
          borderRight="1px"
          borderColor="gray.200"
          h="100vh"
          position={{ base: 'fixed', md: 'sticky' }}
          top="0"
          zIndex={20}
        >
          <Sidebar />
        </Box>

        {/* Main Content */}
        <Box flex="1">
          {/* Header */}
          <Box
            bg="white"
            px={4}
            py={2}
            borderBottom="1px"
            borderColor="gray.200"
            position="sticky"
            top={0}
            zIndex={10}
          >
            <Flex justify="space-between" align="center">
              <IconButton
                icon={<HamburgerIcon />}
                variant="ghost"
                onClick={onToggle}
                aria-label="Toggle Sidebar"
                display={{ base: 'flex', md: 'none' }}
              />
              <HStack spacing={4} ml="auto">
                <Avatar size="sm" name={`${user?.firstName} ${user?.lastName}`} />
                <Text display={{ base: 'none', md: 'block' }}>{`${user?.firstName} ${user?.lastName}`}</Text>
              </HStack>
            </Flex>
          </Box>

          {/* Page Content */}
          <Box p={6} w="100%">
            {children || <Outlet />}
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default DashboardLayout;