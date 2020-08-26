import React, { useState } from 'react';
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
  useRadio,
  UseRadioProps,
  useRadioGroup,
} from '@chakra-ui/core';
import Card, { ResponsiveCardLayout } from '../components/Card';
import { useDecks, Deck } from '../pages/Decks';

function useCategories() {
  const token = useStore((state) => state.token);
  return useQuery(`${token}categories`, () => getCategories(token));
}

export default function Categories() {
  const [selectedDeck, setSelectedDeck] = useState<string>();

  return (
    <Flex className='lib-container'>
      {/* left side menu */}
      <MenuSection />

      {/* shows cards in a specific deck */}
      <ResponsiveCardLayout>
        {/* {data?.map((category) => (
          <Box key={category.id}>
            <Card url={`/categories/${category.id}/decks`}>
              {category.name}
            </Card>
          </Box>
        ))} */}
      </ResponsiveCardLayout>
    </Flex>
  );
}

function MenuSection() {
  const [viewByValue, setViewByValue] = useState<React.ReactText>('category');
  const { isLoading, error, isError, data } = useCategories();

  if (isError) {
    return <span>Error: {(error as Error).message}</span>;
  }

  if (isLoading) {
    return <span>Loading...</span>;
  }

  return (
    <Box minH='100vh' minW='500px' maxW='500px' bgColor='teal.400'>
      <Heading align='center' mt='35px' color='teal.100' mb='10px'>
        Library
      </Heading>
      <Divider />
      <VStack spacing='5px' mx='20px' mt='20px' align='left'>
        <Text align='left' color='teal.100'>
          View by{' '}
        </Text>
        <RadioGroup
          defaultValue='category'
          onChange={setViewByValue}
          value={viewByValue}
        >
          <HStack spacing={5}>
            <Radio colorScheme='white' value='category'>
              Category
            </Radio>
            <Radio colorScheme='white' value='deck'>
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
  const { isLoading, error, isError, data } = useDecks(category.id);
  const [show, setShow] = React.useState<boolean>(false);

  const handleToggle = () => setShow(!show);

  if (isError) {
    return <span>Error: {(error as Error).message}</span>;
  }

  if (isLoading) {
    return <span>Loading...</span>;
  }

  return (
    <>
      <Button colorScheme='teal' onClick={handleToggle}>
        <Text isTruncated> {category.name}</Text>
      </Button>
      <Collapse mt={4} isOpen={show}>
        <RadioCardGroup decks={data!} />
      </Collapse>
    </>
  );
}

interface CustomRadioBtnProps extends UseRadioProps {
  children: React.ReactNode;
}

function RadioCard(props: CustomRadioBtnProps) {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as='label'>
      <input {...input} />
      <Box
        {...checkbox}
        cursor='pointer'
        borderWidth='1px'
        borderRadius='md'
        boxShadow='md'
        _checked={{
          bg: 'teal.600',
          color: 'white',
          borderColor: 'teal.600',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        px={5}
        py={3}
      >
        {props.children}
      </Box>
    </Box>
  );
}

type RadioCardGroupProps = {
  decks: Deck[];
};

function RadioCardGroup({ decks }: RadioCardGroupProps) {
  const options = decks.map((deck) => deck.name);

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'decks',
    defaultValue: 'react',
    onChange: console.log,
  });

  const group = getRootProps();

  return (
    <VStack {...group} align='left' ml={10}>
      {options.map((value) => {
        const radio = getRadioProps({ value });
        return (
          <RadioCard key={value} {...radio}>
            <Text isTruncated>{value}</Text>
          </RadioCard>
        );
      })}
    </VStack>
  );
}
