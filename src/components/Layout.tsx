import React from 'react';
import { Box, Flex, Image, Link } from '@chakra-ui/core';
import { Link as RouterLink, useHistory } from 'react-router-dom';
type layoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: layoutProps) {
  return (
    <Box>
      <Header />
      <Box>{children}</Box>
    </Box>
  );
}

function Header() {
  return (
    <Flex justifyContent='space-between' backgroundColor='teal.500'>
      <Flex className='left' marginLeft='15px' align='center'>
        <Image
          src='https://img.icons8.com/fluent/344/saving-book.png'
          maxW='100px'
          maxH='100px'
          marginRight='100px'
        />
        <Link as={RouterLink} to='/categories' color='teal.100'>
          Categories
        </Link>
      </Flex>
      <Flex className='right' marginRight='15px' align='center'>
        <Login />
      </Flex>
    </Flex>
  );
}

function Login() {
  return (
    <Link as={RouterLink} to='/login'>
      Login
    </Link>
  );
}
function Logout() {
  const { push } = useHistory();
  const deleteToken = () => {
    push('/');
  };
  return (
    <Link to='/' onClick={deleteToken}>
      Logout
    </Link>
  );
}
