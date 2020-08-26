import React from 'react';
import { useQuery } from 'react-query';
import { getCategories, Category } from '../api/cardService';
import useStore from '../utils/user';
import {
  Box,
  Heading,
  Flex,
  RadioGroup,
  Radio,
  Text,
  VStack,
  Divider,
  HStack,
  Button,
  Collapse,
} from '@chakra-ui/core';
import Card, { ResponsiveCardLayout } from '../components/Card';

function useCategories() {
  const token = useStore((state) => state.token);
  return useQuery(`${token}categories`, () => getCategories(token));
}

export default function Categories() {
  const { isLoading, error, isError, data } = useCategories();

  if (isError) {
    return <span>Error: {(error as Error).message}</span>;
  }

  if (isLoading) {
    return <span>Loading...</span>;
  }

  return (
    <Flex>
      <MenuSection />
      <ResponsiveCardLayout>
        {data?.map((category) => (
          <Box key={category.id}>
            <Card url={`/categories/${category.id}/decks`}>
              {category.name}
            </Card>
          </Box>
        ))}
      </ResponsiveCardLayout>
    </Flex>
  );
}

function MenuSection() {
  const { isLoading, error, isError, data } = useCategories();

  if (isError) {
    return <span>Error: {(error as Error).message}</span>;
  }

  if (isLoading) {
    return <span>Loading...</span>;
  }

  return (
    <Box minH='100vh' minW='300px' maxW='300px' bgColor='teal.400'>
      <Heading align='center' mt='35px' color='teal.100' mb='5px'>
        Library
      </Heading>
      <Divider />
      <VStack spacing='5px' mx='20px' mt='20px' align='left'>
        <Text align='left' color='teal.100'>
          View by{' '}
        </Text>
        <RadioGroup defaultValue='1'>
          <HStack spacing={5}>
            <Radio colorScheme='teal' value='1'>
              Category
            </Radio>
            <Radio colorScheme='teal' value='2'>
              Deck
            </Radio>
          </HStack>
        </RadioGroup>
      </VStack>
      <VStack align='left' paddingTop={5} mr={5} ml={5}>
        {data?.map((category) => (
          <CollapsibleCategory key={category.id} category={category} />
        ))}
      </VStack>
    </Box>
  );
}

function CollapsibleCategory({ category }: { category: Category }) {
  const [show, setShow] = React.useState<boolean>(false);

  const handleToggle = () => setShow(!show);

  return (
    <>
      <Button colorScheme='teal' onClick={handleToggle}>
        <Text isTruncated> {category.name}</Text>
      </Button>
      <Collapse mt={4} isOpen={show}>
        {category.id}
      </Collapse>
    </>
  );
}
