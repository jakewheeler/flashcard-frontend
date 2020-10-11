import { VStack, Heading, Text } from '@chakra-ui/core';
import React, { useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { login, signUp } from '../api/login-service';
import useStore from '../stores/user';
import { UserData } from '../types/user';
import { UserForm } from './Login';

export default function SignUp() {
  let { user, setUser } = useStore();
  const history = useHistory();
  const [showSignUpError, setShowSignUpError] = useState(false);

  if (user) {
    return <Redirect to='/' />;
  }

  const onSubmit = async (user: UserData) => {
    try {
      // sign user up
      await signUp(user);

      // try logging the user in too
      const { username, token } = await login(user);
      setUser(username, token);
      window.localStorage.setItem('token', token);
      history.push('/library');
    } catch (err) {
      setShowSignUpError(true);
    }
  };

  return (
    <VStack maxW='500px' margin='0 auto'>
      <Heading>Sign up</Heading>
      {showSignUpError ? (
        <Text color='red.500'>
          An error occurred during sign up. Please try again.
        </Text>
      ) : null}
      <UserForm onSubmit={onSubmit} />
    </VStack>
  );
}
