import React, { useState } from 'react';
import {
  Text,
  Heading,
  FormControl,
  Input,
  Button,
  FormLabel,
  VStack,
} from '@chakra-ui/core';
import { Link, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { UserData } from '../types/user';
import { fetchToken, signUp } from '../api/login-service';
import useStore from '../stores/user';
import { getDecodedJwt } from '../utils';

export default function Login() {
  const setUser = useStore((state) => state.setUser);
  const [showLoginError, setShowLoginError] = useState<boolean>(false);
  const { push } = useHistory();

  const onSubmit = async (user: UserData) => {
    try {
      let token = await fetchToken(user);
      let username = getDecodedJwt(token).username;
      setUser(username, token);
      window.localStorage.setItem('token', token);
      push('/library');
    } catch (err) {
      setShowLoginError(true);
    }
  };

  return (
    <VStack maxW='500px' margin='0 auto'>
      <Heading>Login</Heading>
      {showLoginError && (
        <Text color='red.500'>Username and password are incorrect</Text>
      )}
      <UserForm onSubmit={onSubmit} />
      <Link to='/signup'>Don't have an account? Sign up for free!</Link>
    </VStack>
  );
}

export function SignUp() {
  const { push } = useHistory();

  const onSubmit = async (user: UserData) => {
    await signUp(user);
    push('/login');
  };

  return (
    <VStack maxW='500px' margin='0 auto'>
      <Heading>Sign up</Heading>
      <UserForm onSubmit={onSubmit} />
    </VStack>
  );
}

type UserFormProps = {
  onSubmit: (user: UserData) => void;
};

function UserForm({ onSubmit }: UserFormProps) {
  const { handleSubmit, register, errors, formState } = useForm<UserData>();

  const localSubmission = async (user: UserData) => {
    await onSubmit(user);
  };

  return (
    <>
      <form onSubmit={handleSubmit(localSubmission)}>
        <FormControl>
          <FormLabel htmlFor='username'>Username</FormLabel>
          <Input
            name='username'
            type='username'
            id='username'
            aria-describedby='username'
            ref={register({
              required: true,
            })}
          />
          {errors.username && <Text color='red.500'>Username is required</Text>}
          <FormLabel htmlFor='password'>Password</FormLabel>
          <Input
            name='password'
            type='password'
            id='password'
            aria-describedby='password'
            ref={register({
              required: true,
            })}
          />
          {errors.password && <Text color='red.500'>Password is required</Text>}
          <Button
            mt={4}
            colorScheme='teal'
            isLoading={formState.isSubmitting}
            type='submit'
          >
            Submit
          </Button>
        </FormControl>
      </form>
    </>
  );
}
