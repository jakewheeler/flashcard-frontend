import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Flex, Text, Link, IconButton, Icon, Stack } from '@chakra-ui/core';

type CardProps = {
  name: string;
  url: string;
};

export default function Card({ name, url }: CardProps) {
  return (
    <Flex
      minW='300px'
      minH='350px'
      borderWidth='1px'
      rounded='lg'
      overflow='hidden'
      bg='teal.600'
      alignItems='center'
      justifyContent='center'
      margin='50px'
      _hover={{
        borderColor: 'black',
        bg: 'teal.500',
        color: 'black',
      }}
      as={RouterLink}
      to={url}
    >
      <Text
        color='teal.100'
        overflowWrap='break-word'
        maxW='300px'
        padding='20px'
      >
        {name}
      </Text>
    </Flex>
  );
}

type ResponsiveCardLayoutProps = {
  children: React.ReactNode;
};

export function ResponsiveCardLayout({ children }: ResponsiveCardLayoutProps) {
  return (
    <Flex
      justifyContent={['center', 'center', 'left', 'left']}
      padding='20px'
      flexWrap='wrap'
    >
      {children}
    </Flex>
  );
}
