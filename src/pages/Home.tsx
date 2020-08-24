import React from 'react';
import { Text, VStack, HStack, Heading } from '@chakra-ui/core';

export default function Home() {
  return (
    <VStack spacing='50px' mt='50px'>
      <Heading size='2xl' color='teal.900'>
        Welcome to Flashy Cards
      </Heading>
      <HStack></HStack>
    </VStack>
  );
}
