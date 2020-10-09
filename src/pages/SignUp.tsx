import { VStack, Heading } from '@chakra-ui/core';
import React from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { signUp } from '../api/login-service';
import useStore from '../stores/user';
import { UserData } from '../types/user';
import { UserForm } from './Login';

export default function SignUp() {
  let user = useStore((state) => state.user);
  const history = useHistory();

  if (!user) {
    return <Redirect to='/' />;
  }

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
