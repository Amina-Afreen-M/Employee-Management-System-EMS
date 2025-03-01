import { Box } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

interface LayoutProps {
  children?: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box minH="100vh" bg="gray.50" w="100%">
      <Box px={4} py={6}>
        {children || <Outlet />}
      </Box>
    </Box>
  );
};

export default Layout;