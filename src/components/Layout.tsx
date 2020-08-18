import React from 'react';
import { Box, Flex, Image, Link } from '@chakra-ui/core';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import useStore from '../utils/user';
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
  const user = useStore((state) => state.user);
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
        {user === '' ? <Login /> : <Logout />}
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
  const setUser = useStore((state) => state.setUser);
  const { push } = useHistory();
  const deleteToken = () => {
    setUser('', '');
    push('/');
  };
  return (
    <Link to='/' onClick={deleteToken}>
      Logout
    </Link>
  );
}
