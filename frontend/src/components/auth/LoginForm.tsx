import { Box, Button, FormControl, FormLabel, Input, VStack, Text, Flex, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { login, setAuthToken } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await login(data);
      setAuthToken(response.token);
      setUser(response);
      
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${response.firstName}!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      navigate('/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Please check your credentials and try again';
      toast({
        title: 'Login Failed',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex h="100vh">
      {/* Left Section */}
      <Box flex="1" bg="white" p={32} display="flex" flexDirection="column" justifyContent="center">
        <Box maxW="400px" mx="auto">
          <Text fontSize="5xl" fontWeight="bold" mb={6}>Login</Text>
          <Text color="gray.500" fontSize="sm">
            By logging in you agree to the ridiculously long terms that you didn't bother to read
          </Text>
        </Box>
      </Box>

      {/* Right Section */}
      <Box flex="4" bg="gray.700" py={16} px={20} display="flex" alignItems="center" justifyContent="center">
        <Box w="full" maxW="600px">
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={6} align="stretch">
              <FormControl isInvalid={!!errors.email}>
                <FormLabel color="white">Email</FormLabel>
                <Input
                  type="email"
                  {...register('email')}
                  variant="flushed"
                  borderColor="pink.500"
                  _focus={{ borderColor: 'pink.500' }}
                  color="white"
                  _placeholder={{ color: 'gray.400' }}
                />
                {errors.email && <Text color="red.300" fontSize="sm" mt={1}>{errors.email.message}</Text>}
              </FormControl>

              <FormControl isInvalid={!!errors.password}>
                <FormLabel color="white">Password</FormLabel>
                <Input
                  type="password"
                  {...register('password')}
                  variant="flushed"
                  borderColor="gray.500"
                  _focus={{ borderColor: 'gray.400' }}
                  color="white"
                  _placeholder={{ color: 'gray.400' }}
                />
                {errors.password && <Text color="red.300" fontSize="sm" mt={1}>{errors.password.message}</Text>}
              </FormControl>

              <Button
                type="submit"
                bg="gray.600"
                color="white"
                size="lg"
                w="full"
                mt={6}
                _hover={{ bg: 'gray.500' }}
                isLoading={isSubmitting}
              >
                Submit
              </Button>
            </VStack>
          </form>
        </Box>
      </Box>
    </Flex>
  );
};

export default LoginForm;