import React from 'react';
import { Text, VStack, Heading } from '@chakra-ui/core';

export default function Home() {
  return (
    <VStack align='center' m='0 auto'>
      <Heading color='teal.900'>Welcome to Flashy Cards</Heading>
      <Text>What will you learn today?</Text>
    </VStack>
  );
}
