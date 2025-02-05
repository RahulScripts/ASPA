import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  HStack,
  IconButton,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import { useState } from 'react'
import { FaBars } from 'react-icons/fa'
import '../styles/Dash.css'

const Dashboard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    accountBalance: 2500,
  })

  return (
    <Flex direction="row" height="100vh">
      {/* Sidebar */}
      <Box className="sidebar" display={{ base: 'none', md: 'block' }}>
        <VStack spacing="10" align="start">
          <Text className="sidebar-title">Dashboard</Text>
          <Button variant="link" className="sidebar-button">
            Home
          </Button>
          <Button variant="link" className="sidebar-button">
            Profile
          </Button>
          <Button variant="link" className="sidebar-button">
            Settings
          </Button>
          <Button variant="link" className="sidebar-button">
            Logout
          </Button>
        </VStack>
      </Box>

      {/* Mobile Sidebar */}
      <Box display={{ base: 'block', md: 'none' }} p="4" bg="gray.800" color="white">
        <IconButton icon={<FaBars />} onClick={onOpen} variant="ghost" colorScheme="teal" aria-label="Open sidebar" />
      </Box>

      <Drawer isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody>
            <VStack spacing="10" align="start">
              <Text className="sidebar-title">Dashboard</Text>
              <Button variant="link" className="sidebar-button">
                Home
              </Button>
              <Button variant="link" className="sidebar-button">
                Profile
              </Button>
              <Button variant="link" className="sidebar-button">
                Settings
              </Button>
              <Button variant="link" className="sidebar-button">
                Logout
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main Content */}
      <Box className="main-content" flex="1" p="8">
        <Flex direction="column" h="full">
          <Flex align="center" justify="space-between" mb="6" direction={{ base: 'column', md: 'row' }}>
            <VStack align="start" spacing={0}>
              <Text className="user-name">Welcome, {userData.name}</Text>
              <Text className="user-email">{userData.email}</Text>
            </VStack>
            <Avatar size="lg" name={userData.name} />
          </Flex>

          {/* Account Overview */}
          <Box className="account-overview">
            <Text className="section-title">Account Balance</Text>
            <Text className="balance-amount">₹ {userData.accountBalance}</Text>
          </Box>

          {/* Quick Actions */}
          <Box>
            <Text className="section-title">Quick Actions</Text>
            <HStack spacing="6">
              <Button className="quick-action-btn">View Profile</Button>
              <Button className="quick-action-btn">Transactions</Button>
              <Button className="quick-action-btn">Settings</Button>
            </HStack>
          </Box>

          {/* Recent Activities */}
          <Box mt="10">
            <Text className="section-title">Recent Activities</Text>
            <VStack align="start" spacing="6">
              <Box className="activity-card">
                <Text>Your account balance was updated to ₹2500 today.</Text>
              </Box>
              <Box className="activity-card">
                <Text>You added a new payment method.</Text>
              </Box>
            </VStack>
          </Box>
        </Flex>
      </Box>
    </Flex>
  )
}

export default Dashboard
