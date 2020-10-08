import { VStack, Heading } from '@chakra-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { signUp } from '../api/login-service';
import { UserData } from '../types/user';
import { UserForm } from './Login';

export default function SignUp() {
  const history = useHistory();

  const onSubmit = async (user: UserData) => {
    await signUp(user);
    history.push('/login');
  };

  return (
    <VStack maxW='500px' margin='0 auto'>
      <Heading>Sign up</Heading>
      <UserForm onSubmit={onSubmit} />
    </VStack>
  );
}
