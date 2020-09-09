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
  IconButton,
  InputGroup,
  Input,
  InputRightElement,
} from '@chakra-ui/core';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { useCards, useAllUserDecks, useCategory } from '../hooks';
import { Deck, DecksByCategoryObj } from '../types/card';
import useSelectedDeck from '../stores/deck';
import CardTemplate, {
  ResponsiveCardLayout,
  CreateCardCollapsible,
} from '../components/Card';
import { useMutation, queryCache } from 'react-query';
import { deleteDeck, editDeck } from '../api/card-service';
import useStore from '../stores/user';
import { useForm } from 'react-hook-form';
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
        <VStack ml={60} mt={5} align='left' spacing={3}>
          <Heading color='teal.900'>
            {selectedDeck ? selectedDeck.name : 'Select a deck'}
          </Heading>
          {selectedDeck && <CreateCardCollapsible />}
        </VStack>
        {/* shows cards in a specific deck */}
        <ResponsiveCardLayout>
          {selectedDeck && <CardView deck={selectedDeck} />}
        </ResponsiveCardLayout>
      </Flex>
    </Flex>
  );
}

type CardPanelProps = {
  deck: Deck;
};

function CardView({ deck }: CardPanelProps) {
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
        {viewByValue === 'category' ? <ViewByCategory /> : <ViewByDeck />}
      </VStack>
    </Box>
  );
}

function ViewByCategory() {
  const setDeck = useSelectedDeck((state) => state.setDeck);
  const { isLoading, error, isError, data } = useAllUserDecks();

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'decks',
    defaultValue: 'react',
    onChange: (selectedDeck) => {
      setDeck(combineAllDecks(data!).find((d) => d.name === selectedDeck)!);
    },
  });

  const group = getRootProps();

  if (isError) {
    return <span>Error: {(error as Error).message}</span>;
  }

  if (isLoading || !data) {
    return <span>Loading...</span>;
  }

  return (
    <>
      {Object.keys(data).map((categoryId) => (
        // each category has its own collapsible
        <CollapsibleCategory key={categoryId} categoryId={categoryId}>
          <VStack {...group} align='left'>
            {data[categoryId].map((deckInCategory: Deck) => {
              const value = deckInCategory.name;
              const radio = getRadioProps({ value });
              return (
                <RadioCard
                  key={deckInCategory.id}
                  deck={deckInCategory}
                  {...radio}
                >
                  <Text isTruncated>{value}</Text>
                </RadioCard>
              );
            })}
          </VStack>
        </CollapsibleCategory>
      ))}
    </>
  );
}

const combineAllDecks = (data: DecksByCategoryObj) => {
  let decks: Deck[] = [];
  Object.keys(data).forEach((key) => {
    decks = decks.concat(data[key]);
  });
  return decks;
};

function ViewByDeck() {
  const { isLoading, error, isError, data } = useAllUserDecks();
  if (isError) {
    return <span>Error: {(error as Error).message}</span>;
  }

  if (isLoading || !data) {
    return <span>Loading...</span>;
  }

  return (
    <>
      <RadioCardGroup decks={combineAllDecks(data)} />
    </>
  );
}

// Category that will display the deck radio button group under it
function CollapsibleCategory({
  categoryId,
  children,
}: {
  categoryId: string;
  children: React.ReactNode;
}) {
  const { isLoading, error, isError, data: category } = useCategory(categoryId);

  const [show, setShow] = React.useState<boolean>(false);

  const handleToggle = () => setShow(!show);

  if (isError) {
    return <span>Error: {(error as Error).message}</span>;
  }

  if (isLoading || !category) {
    return <Spinner color='white' />;
  }

  return (
    <>
      <Button colorScheme='teal' onClick={handleToggle}>
        <Text isTruncated> {category.name}</Text>
      </Button>
      <Collapse mt={4} isOpen={show}>
        <Box ml={10}>{children}</Box>
      </Collapse>
    </>
  );
}

interface CustomRadioBtnProps extends UseRadioProps {
  children: React.ReactNode;
  deck: Deck;
}

function RadioCard(props: CustomRadioBtnProps) {
  const { getInputProps, getCheckboxProps } = useRadio(props);
  const { deck } = props;
  const { currentDeck, setDeck } = useSelectedDeck();
  const [isEditing, setIsEditing] = useState(false);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  const token = useStore((state) => state.token);

  const cacheKey = `${token}/categories/all/decks`;

  const [deleteSelectedDeck] = useMutation(deleteDeck, {
    onSuccess: () => queryCache.invalidateQueries(cacheKey),
  });

  const [editSelectedDeck] = useMutation(editDeck, {
    onSuccess: () => queryCache.invalidateQueries(cacheKey),
  });

  const deletion = async () => {
    try {
      await deleteSelectedDeck({ token, deck });
      setDeck(null);
    } catch (err) {
      console.error(`Could not delete deck: ${deck.name}`);
      console.error(err);
    }
  };

  const edit = async (newName: string) => {
    try {
      await editSelectedDeck({ token, deck, newName });
      setIsEditing(false);
    } catch (err) {
      console.error(`Could not delete deck: ${deck.name}`);
      console.error(err);
    }
  };

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
        <HStack justifyContent='space-between'>
          {isEditing && currentDeck ? (
            <EditDeckInput
              currentDeckName={currentDeck.name}
              handleEdit={edit}
            />
          ) : (
            props.children
          )}
          {currentDeck?.name === deck.name && (
            <HStack>
              <IconButton
                colorScheme='black'
                aria-label={`edit ${props.deck?.name}`}
                icon={<EditIcon />}
                onClick={() => setIsEditing(!isEditing)}
              />
              <IconButton
                colorScheme='black'
                aria-label={`delete ${props.deck?.name}`}
                icon={<DeleteIcon />}
                onClick={deletion}
              />
            </HStack>
          )}
        </HStack>
      </Box>
    </Box>
  );
}

type EditDeckProps = {
  currentDeckName: string;
  handleEdit: (newName: string) => Promise<void>;
};

interface EditDeckInput {
  newName: string;
}

function EditDeckInput({ currentDeckName, handleEdit }: EditDeckProps) {
  const { register, handleSubmit } = useForm<EditDeckInput>();

  const onSubmit = async (input: EditDeckInput) => {
    await handleEdit(input.newName);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputGroup size='md'>
        <Input
          name='newName'
          pr='4.5rem'
          placeholder={currentDeckName}
          textColor='black'
          ref={register}
        />
        <InputRightElement width='4.5rem'>
          <Button h='1.75rem' size='sm' type='submit' colorScheme='teal'>
            OK
          </Button>
        </InputRightElement>
      </InputGroup>
    </form>
  );
}

type RadioCardGroupProps = {
  decks: Deck[];
};

function RadioCardGroup({ decks }: RadioCardGroupProps) {
  const setDeck = useSelectedDeck((state) => state.setDeck);

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'decks',
    defaultValue: 'react',
    onChange: (selectedDeck) => {
      setDeck(decks.find((d) => d.name === selectedDeck)!);
    },
  });

  const group = getRootProps();

  return (
    <VStack {...group} align='left'>
      {decks.map((deck) => {
        let value = deck.name;
        const radio = getRadioProps({ value });
        return (
          <RadioCard key={value} deck={deck} {...radio}>
            <Text isTruncated>{value}</Text>
          </RadioCard>
        );
      })}
    </VStack>
  );
}
