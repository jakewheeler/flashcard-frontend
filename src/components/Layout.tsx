import React from 'react';
import { Box, Flex, Image, Link, Heading } from '@chakra-ui/core';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import useStore from '../utils/user';

type layoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: layoutProps) {
  return (
    <Box minH='100vh' bg='teal.300'>
      <Header />
      <Flex justifyContent='center'>{children}</Flex>
    </Box>
  );
}

function Header() {
  const user = useStore((state) => state.user);
  return (
    <Flex justifyContent='space-between' backgroundColor='teal.500'>
      <Flex className='left' marginLeft='15px' align='center'>
        <Flex
          className='logo'
          flexDir='row'
          alignItems='center'
          marginRight='100px'
        >
          {/* <Link as={RouterLink} to='/'> */}
          <Image
            src='https://img.icons8.com/fluent/344/saving-book.png'
            w='100px'
            h='100px'
          />
          <Heading size='md' color='teal.100' marginLeft='5px'>
            Flashy Cards
          </Heading>

          {/* </Link> */}
        </Flex>

        {user ? (
          <Link as={RouterLink} to='/categories' color='teal.100'>
            Categories
          </Link>
        ) : null}
      </Flex>
      <Flex className='right' marginRight='15px' align='center'>
        {user === '' ? <Login /> : <Logout />}
      </Flex>
    </Flex>
  );
}

function Login() {
  return (
    <Link as={RouterLink} to='/login' color='teal.100'>
      Login
    </Link>
  );
}
function Logout() {
  const setUser = useStore((state) => state.setUser);
  const { push } = useHistory();
  const deleteToken = () => {
    setUser('', '');
    window.localStorage.setItem('token', '');
    push('/');
  };
  return (
    <Link to='/' onClick={deleteToken} color='teal.100'>
      Logout
    </Link>
  );
}
