import React from 'react';
import { Text, VStack, Heading } from '@chakra-ui/core';

export default function Home() {
  return (
    <VStack spacing='50px' mt='50px'>
      <Heading size='2xl' color='teal.900'>
        Welcome to Flashy Cards
      </Heading>
      <Text>What will you learn today?</Text>
    </VStack>
  );
}
