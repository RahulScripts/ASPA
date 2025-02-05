import { Box, Button, FormControl, Heading, Input, Link, Stack, Text } from '@chakra-ui/react'
import { doc, setDoc } from 'firebase/firestore'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { useState } from 'react'
import * as Yup from 'yup'
import logo from '../assets/ASPA.png'
import { db } from '../firebase-config' // Import Firestore instance
import '../styles/Registration.css'

const Register = () => {
  const [message, setMessage] = useState('')

  // Validation schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    walletAddress: Yup.string().required('Wallet address is required'),
  })

  // Handle registration and push data to Firestore
  const handleRegistration = async (values) => {
    try {
      const userRef = doc(db, 'users', values.email) // Using email as document ID
      await setDoc(userRef, {
        name: values.name,
        email: values.email,
        walletAddress: values.walletAddress,
      })
      setMessage('Registration successful! Please login now.')
    } catch (error) {
      console.error('Error during registration:', error)
      setMessage('Registration failed. Please try again.')
    }
  }

  return (
    <Box className="registration-container" display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Box className="logo-container">
        <img src={logo} alt="Logo" className="animated-logo" />
      </Box>
      <Box className="registration-card" p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
        <Heading as="h2" className="registration-title" size="lg" mb={6} textAlign="center">
          Registration
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

        <Formik
          initialValues={{ name: '', email: '', walletAddress: '' }}
          validationSchema={validationSchema}
          onSubmit={handleRegistration}
        >
          {({ isSubmitting }) => (
            <Form>
              <Stack spacing={4}>
                <FormControl id="name">
                  <Field name="name">
                    {({ field }) => <Input {...field} type="text" placeholder="Enter your name" className="input-field" />}
                  </Field>
                  <ErrorMessage name="name" component={Text} color="red.500" />
                </FormControl>

                <FormControl id="email">
                  <Field name="email">
                    {({ field }) => <Input {...field} type="email" placeholder="Enter your email" className="input-field" />}
                  </Field>
                  <ErrorMessage name="email" component={Text} color="red.500" />
                </FormControl>

                <FormControl id="walletAddress">
                  <Field name="walletAddress">
                    {({ field }) => <Input {...field} type="text" placeholder="Enter your wallet address" className="input-field" />}
                  </Field>
                  <ErrorMessage name="walletAddress" component={Text} color="red.500" />
                </FormControl>

                <Button className="registration-button" size="md" mt={4} type="submit" isLoading={isSubmitting}>
                  Register
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>

        <Box textAlign="center" mt={4}>
          <Text fontWeight="600">Already have an account? </Text>
          <Link color="#215D13" href="/login" fontWeight="600">
            Login here
          </Link>
        </Box>
      </Box>
    </Box>
  )
}

export default Register
