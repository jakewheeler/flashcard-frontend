import React from 'react';
import {
  Flex,
  Text,
  FormControl,
  Input,
  Button,
  FormLabel,
} from '@chakra-ui/core';

export default function Login() {
  return (
    <Flex align='center' justifyContent='center'>
      <Flex h='100vh' w='100vw' align='center' justify='center'>
        <FormControl>
          <FormLabel htmlFor='username'>Username</FormLabel>
          <Input type='username' id='username' aria-describedby='username' />
          <FormLabel htmlFor='password'>Password</FormLabel>
          <Input type='password' id='password' aria-describedby='password' />
          <Button mt={4} variantColor='teal' isLoading={false} type='submit'>
            Submit
          </Button>
        </FormControl>
      </Flex>
    </Flex>
  );
}
