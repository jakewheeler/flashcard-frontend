import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Flex, Text, Link } from '@chakra-ui/core';

type CardProps = {
  name: string;
  url: string;
};

export default function Card({ name, url }: CardProps) {
  return (
    <Link
      className='card'
      as={RouterLink}
      to={url}
      textDecor='none'
      padding='20px'
    >
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
      >
        <Text color='teal.100' overflowWrap='break-word' maxW='300px'>
          {name}
        </Text>
      </Flex>
    </Link>
  );
}

type ResponsiveCardParentProps = {
  children: React.ReactNode;
};

export function ResponsiveCardParent({ children }: ResponsiveCardParentProps) {
  return (
    <Flex
      //   flexDir={['column', 'column', 'column', 'row']}
      justifyContent={['center', 'center', 'left', 'left']}
      padding='20px'
      flexWrap='wrap'
    >
      {children}
    </Flex>
  );
}
