import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Flex, Text, IconButton, Stack, HStack, Box } from '@chakra-ui/core';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

type CardProps = {
  children: string;
  url: string;
};

export default function Card({ children, url }: CardProps) {
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
            colorScheme='teal'
            icon={<EditIcon />}
            onClick={() => console.log('edit', url)}
          />
          <IconButton
            aria-label='Delete'
            colorScheme='teal'
            icon={<DeleteIcon />}
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
            {children}
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
