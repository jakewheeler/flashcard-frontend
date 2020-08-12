import React from 'react';
import { Box, Flex } from '@chakra-ui/core';

type layoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: layoutProps) {
  return (
    <Flex
      className='parent'
      justifyContent='center'
      margin='0 auto'
      maxW='1200px'
    >
      <Box>{children}</Box>
    </Flex>
  );
}

function Header() {
  return (
    <Box h='50px' backgroundColor='blue.500'>
      Top nav
    </Box>
  );
}

function Footer() {
  return (
    <Box h='50px' backgroundColor='red.500'>
      Bottom nav
    </Box>
  );
}
