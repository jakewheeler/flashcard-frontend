import React from 'react';
import {
  Box,
  Flex,
  Image,
  Link,
  Heading,
  HStack,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  VStack,
  Divider,
  IconButton,
} from '@chakra-ui/core';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import useStore from '../stores/user';
import { HamburgerIcon } from '@chakra-ui/icons';

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <Box minH='100vh' bg='teal.300'>
      <Header>
        <HomeLink />
        <LibraryLink />
      </Header>
      <Flex justifyContent='left'>{children}</Flex>
    </Box>
  );
}

function HeaderDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef<HTMLButtonElement | null>(null);

  return (
    <>
      <IconButton
        ref={btnRef}
        aria-label='hamburger'
        colorScheme='teal'
        onClick={onOpen}
        icon={<HamburgerIcon />}
      >
        Open
      </IconButton>
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerBody bgColor='teal.500'>
              <VStack align='left'>
                <HomeLink />
                <LibraryLink />
                <LoginLink />
                <Divider />
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
}

function LibraryLink() {
  const user = useStore((state) => state.user);
  return (
    <>
      {user ? (
        <Link as={RouterLink} to='/library' color='teal.100'>
          My Library
        </Link>
      ) : null}
    </>
  );
}

function HomeLink() {
  return (
    <Link as={RouterLink} to='/' color='teal.100'>
      Home
    </Link>
  );
}

function LoginLink() {
  const user = useStore((state) => state.user);
  return user === '' ? <Login /> : <Logout />;
}

type HeaderProps = {
  children: React.ReactNode;
};

function Header({ children }: HeaderProps) {
  return (
    <Flex justifyContent='space-between' bg='teal.500'>
      <Flex className='left' marginLeft='15px' align='center'>
        <Link as={RouterLink} to='/' style={{ textDecoration: 'none' }}>
          <Flex className='logo' flexDir='row' alignItems='center'>
            <Image
              src='https://img.icons8.com/fluent/344/saving-book.png'
              w='100px'
              h='100px'
            />
            <Heading size='md' color='teal.100' marginLeft='8px'>
              Flashy Cards
            </Heading>
          </Flex>
        </Link>
        <HStack
          marginLeft='100px'
          spacing='35px'
          mr={['50px']}
          display={{
            base: 'block',
            xs: 'none',
            sm: 'none',
            md: 'block',
          }}
        >
          {children}
        </HStack>
      </Flex>
      <Flex className='right' marginRight='15px' align='center'>
        <Box
          className='responsive-drawer'
          display={{
            base: 'block',
            xs: 'block',
            md: 'none',
            lg: 'none',
            xl: 'none',
          }}
        >
          <HeaderDrawer />
        </Box>
        <Box
          className='responsive-login'
          display={{
            base: 'block',
            xs: 'none',
            sm: 'none',
            md: 'block',
          }}
        >
          <LoginLink />
        </Box>
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
