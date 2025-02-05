import { Box, Button, FormControl, Heading, Input, Link, Stack, Text } from '@chakra-ui/react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/ASPA.png'
import { db } from '../firebase-config' // Import Firestore instance
import '../styles/Registration.css'

const Login = () => {
  const [message, setMessage] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const navigate = useNavigate()

  // Handle login
  const handleLogin = async () => {
    try {
      // Query the 'users' collection where 'walletAddress' field matches the input wallet address
      const usersRef = collection(db, 'users') // Reference to the 'users' collection
      const q = query(usersRef, where('walletAddress', '==', walletAddress)) // Query to match walletAddress field

      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        // No document found with this wallet address
        setMessage('Wallet address not found. Please register first.')
      } else {
        // Wallet address found, log the user in
        setMessage('Login successful!')
        navigate('/dashboard') // Navigate to the dashboard or another page
      }
    } catch (error) {
      console.error('Error during login:', error)
      setMessage('Login failed. Please try again.')
    }
  }

  return (
    <Box className="registration-container" display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Box className="logo-container">
        <img src={logo} alt="Logo" className="animated-logo" />
      </Box>
      <Box className="registration-card" p={8} height={280} borderWidth={1} borderRadius={8} boxShadow="lg">
        <Heading as="h2" className="registration-title" size="lg" mb={6} textAlign="center">
          Login
        </Heading>

        {message && (
          <Box
            mb={4}
            p={4}
            border="1px solid"
            borderColor="green.500"
            borderRadius="md"
            bgColor="green.100"
            color="green.700"
            textAlign="center"
          >
            {message}
          </Box>
        )}

        <Stack spacing={4}>
          <FormControl id="walletAddress">
            <Input
              type="text"
              placeholder="Enter your wallet address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="input-field"
            />
          </FormControl>

          <Button className="registration-button" size="md" mt={4} onClick={handleLogin}>
            Login
          </Button>
        </Stack>

        <Box textAlign="center" mt={4}>
          <Text fontWeight="600">Don't have an account? </Text>
          <Link color="#215D13" href="/register" fontWeight="600">
            Register here
          </Link>
        </Box>
      </Box>
    </Box>
  )
}

export default Login
