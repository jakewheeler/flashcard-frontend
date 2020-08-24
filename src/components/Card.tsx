import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Flex,
  Text,
  IconButton,
  Icon,
  Stack,
  HStack,
  Box,
} from '@chakra-ui/core';

type CardProps = {
  name: string;
  url: string;
};

export default function Card({ name, url }: CardProps) {
  return (
    <Stack
      borderWidth='1px'
      rounded='lg'
      overflow='hidden'
      bg='teal.600'
      margin='50px'
      _hover={{
        borderColor: 'black',
        bg: 'teal.500',
        color: 'black',
      }}
    >
      <Flex justifyContent='flex-end'>
        <HStack spacing='5px' mr='5px' mt='5px'>
          <IconButton
            aria-label='Edit'
            icon={<Icon />}
            onClick={() => console.log('edit')}
          />
          <IconButton
            aria-label='Delete'
            icon={<Icon />}
            onClick={() => console.log('delete')}
          />
        </HStack>
      </Flex>
      <Box as={RouterLink} to={url} h='100%' minW='300px' minH='350px'>
        <Flex alignItems='center' justifyContent='center'>
          <Text
            color='teal.100'
            overflowWrap='break-word'
            maxW='300px'
            padding='20px'
          >
            {name}
          </Text>
        </Flex>
      </Box>
    </Stack>
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
