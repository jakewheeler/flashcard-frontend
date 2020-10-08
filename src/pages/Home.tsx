import React from 'react';
import { Text, VStack, Heading, Image, Box } from '@chakra-ui/core';

export default function Home() {
  return (
    <VStack align='center' margin='0 auto'>
      <Heading color='teal.900'>Welcome to Flashy Cards</Heading>
      <Text>What will you learn today?</Text>
      <Box pl={10} pr={10}>
        <Image
          src='https://cdn.pixabay.com/photo/2015/10/12/15/09/person-984236_960_720.jpg'
          alt='Person with study materials'
          borderRadius='20%'
          borderColor='teal.900'
          borderWidth={10}
          borderStyle='solid'
        />
      </Box>
    </VStack>
  );
}
