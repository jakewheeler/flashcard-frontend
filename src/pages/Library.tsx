import React, { useState } from 'react';
import {
  Box,
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
  Spinner,
  Heading,
} from '@chakra-ui/core';
import { useDecks, useCards, useCategories, useAllUserDecks } from '../hooks';
import { Category, Deck } from '../types/card';
import useSelectedDeck from '../stores/deck';
import CardTemplate, { ResponsiveCardLayout } from '../components/Card';
// import { useHistory } from 'react-router-dom';

export default function Library() {
  const selectedDeck = useSelectedDeck((state) => state.currentDeck);
  //   const { push } = useHistory();
  //   const token = useStore((state) => state.token);

  //   if (!token) {
  //     push('/');
  //   }

  return (
    <Flex className='lib-container'>
      {/* left side menu */}
      <MenuSection />
      <Flex flexDir='column'>
        {selectedDeck && (
          <Heading color='teal.900' ml={55} mt={5}>
            {selectedDeck.name}
          </Heading>
        )}
        {/* shows cards in a specific deck */}
        <ResponsiveCardLayout>
          {selectedDeck && <CardPanel deck={selectedDeck} />}
        </ResponsiveCardLayout>
      </Flex>
    </Flex>
  );
}

function CardPanel({ deck }: { deck: Deck }) {
  const { isLoading, error, isError, data } = useCards(deck);

  if (isError) {
    return <span>Error: {(error as Error).message}</span>;
  }

  if (isLoading) {
    return <Spinner color='white' />;
  }

  return (
    <>
      {data?.map((card) => (
        <Box key={card.id} m={50}>
          <CardTemplate card={card} />
        </Box>
      ))}
    </>
  );
}

function MenuSection() {
  const [viewByValue, setViewByValue] = useState<React.ReactText>('category');

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
        {viewByValue === 'category' ? <CategoryDisplay /> : <DeckDisplay />}
      </VStack>
    </Box>
  );
}

function CategoryDisplay() {
  const { isLoading, error, isError, data } = useCategories();

  if (isError) {
    return <span>Error: {(error as Error).message}</span>;
  }

  if (isLoading) {
    return <span>Loading...</span>;
  }

  return (
    <>
      {data?.map((category) => (
        <CollapsibleCategory key={category.id} category={category} />
      ))}
    </>
  );
}

function DeckDisplay() {
  const { isLoading, error, isError, data } = useAllUserDecks();
  if (isError) {
    return <span>Error: {(error as Error).message}</span>;
  }

  if (isLoading) {
    return <span>Loading...</span>;
  }

  return (
    <>
      <RadioCardGroup decks={data!} />
    </>
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
    return <Spinner color='white' />;
  }

  return (
    <>
      <Button colorScheme='teal' onClick={handleToggle}>
        <Text isTruncated> {category.name}</Text>
      </Button>
      <Collapse mt={4} isOpen={show}>
        <Box ml={10}>
          <RadioCardGroup decks={data!} />
        </Box>
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
  const setSelectedDeck = useSelectedDeck((state) => state.setDeck);
  const deckNameOptions = decks.map((deck) => deck.name);

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'decks',
    defaultValue: 'react',
    onChange: (selectedDeck) =>
      setSelectedDeck(decks.find((d) => d.name === selectedDeck)!),
  });

  const group = getRootProps();

  return (
    <VStack {...group} align='left'>
      {deckNameOptions.map((value) => {
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
