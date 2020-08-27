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
  Spinner,
} from '@chakra-ui/core';
import Card, { ResponsiveCardLayout } from '../components/Card';
import { useDecks, useAllUserDecks, Deck, getCards } from '../pages/Decks';
import useSelectedDeck from '../utils/deck';

function useCategories() {
  const token = useStore((state) => state.token);
  return useQuery(`${token}categories`, () => getCategories(token));
}

function useCards(deck: Deck) {
  const token = useStore((state) => state.token);
  return useQuery(
    `${token}/categories/${deck.categoryId}/decks/${deck.id}/cards`,
    () => getCards(token, deck)
  );
}

export default function Categories() {
  const selectedDeck = useSelectedDeck((state) => state.currentDeck);

  return (
    <Flex className='lib-container'>
      {/* left side menu */}
      <MenuSection />
      {/* shows cards in a specific deck */}
      <ResponsiveCardLayout>
        {!selectedDeck ? (
          <Text>Select a deck</Text>
        ) : (
          <CardPanel deck={selectedDeck} />
        )}
      </ResponsiveCardLayout>
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

  if (!isLoading && !isError && data && data.length < 1) {
    return <Text color='teal.900'>No cards yet</Text>;
  }

  return (
    <>
      {data?.map((card) => (
        <Box key={card.id}>
          <Card url={``}>{card.front}</Card>
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
