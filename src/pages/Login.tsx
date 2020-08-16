import React from 'react';
import {
  Flex,
  Text,
  FormControl,
  Input,
  Button,
  FormLabel,
} from '@chakra-ui/core';
import { useForm } from 'react-hook-form';
import { UserData } from '../types/user';
import { fetchToken } from '../api/loginService';

export default function Login() {
  const { handleSubmit, register, errors, formState } = useForm();
  const onSubmit = async (user: UserData) => {
    window.localStorage.setItem('token', await fetchToken(user));
  };
  return (
    <Flex align='center' justifyContent='center'>
      <Flex h='100vh' w='100vw' align='center' justify='center'>
        <form onSubmit={handleSubmit<UserData>(onSubmit)}>
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
            {errors.username && (
              <Text color='red.500'>Username is required</Text>
            )}
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
            {errors.password && (
              <Text color='red.500'>Password is required</Text>
            )}
            <Button
              mt={4}
              variantColor='teal'
              isLoading={formState.isSubmitting}
              type='submit'
            >
              Submit
            </Button>
          </FormControl>
        </form>
      </Flex>
    </Flex>
  );
}
