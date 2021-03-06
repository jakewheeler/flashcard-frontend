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
import { Link, Redirect, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { UserData } from '../types/user';
import { login } from '../api/login-service';
import useStore from '../stores/user';

export default function Login() {
  const { user, setUser } = useStore();
  const [showLoginError, setShowLoginError] = useState(false);
  const history = useHistory();

  if (user) {
    return <Redirect to='/library' />;
  }

  const onSubmit = async (user: UserData) => {
    try {
      const { username, token } = await login(user);
      setUser(username, token);
      window.localStorage.setItem('token', token);
      history.push('/library');
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
      <Link to='/signup'>Don't have an account? Sign up</Link>
    </VStack>
  );
}

type UserFormProps = {
  onSubmit: (user: UserData) => void;
};

export function UserForm({ onSubmit }: UserFormProps) {
  const { handleSubmit, register, errors, formState } = useForm<UserData>();

  const localSubmission = (user: UserData) => {
    onSubmit(user);
  };

  return (
    <>
      <FormControl as='form' onSubmit={handleSubmit(localSubmission)}>
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
    </>
  );
}
