import React from 'react';
import { Text, VStack, Heading } from '@chakra-ui/core';
import Card, { ResponsiveCardLayout } from '../components/Card';

export default function Home() {
  return (
    <VStack spacing='50px' mt='50px'>
      <Heading size='2xl' color='teal.900'>
        Welcome to Flashy Cards
      </Heading>
      <Text>What will you learn today?</Text>
      <ResponsiveCardLayout>
        <Card url=''>Art</Card>
        <Card url=''>Science</Card>
        <Card url=''>History</Card>
      </ResponsiveCardLayout>
    </VStack>
  );
}
