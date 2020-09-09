import React, { useState } from 'react';
import {
  Flex,
  IconButton,
  Stack,
  HStack,
  Box,
  Button,
  Text,
  FormLabel,
  Textarea,
  VStack,
  Collapse,
} from '@chakra-ui/core';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import ReactCardFlip from 'react-card-flip';
import { Card, CreateCardType } from '../types/card';
import useSelectedDeck from '../stores/deck';
import useStore from '../stores/user';
import { useForm } from 'react-hook-form';
import { useMutation, queryCache } from 'react-query';
import { createCard, deleteCard, editCard } from '../api/card-service';

type CardProps = {
  card: Card;
};

export default function CardTemplate({ card }: CardProps) {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const handleClick = () => setIsFlipped(!isFlipped);

  return (
    <ReactCardFlip isFlipped={isFlipped}>
      <CardStructure card={card}>
        <Flex
          className='front-card-flex'
          flexDir='column'
          justifyContent='space-between'
          alignItems='center'
          minH='inherit'
          mb={50}
        >
          <Text color='teal.100'>{card.front}</Text>

          <Button colorScheme='white' onClick={handleClick}>
            {isFlipped ? 'See description' : 'See answer'}
          </Button>
        </Flex>
      </CardStructure>
      <CardStructure card={card}>
        <Flex
          className='front-card-flex'
          flexDir='column'
          justifyContent='space-between'
          alignItems='center'
          minH='inherit'
          mb={50}
        >
          <Text color='teal.100'>{card.back}</Text>

          <Button colorScheme='white' onClick={handleClick}>
            {isFlipped ? 'See description' : 'See answer'}
          </Button>
        </Flex>
      </CardStructure>
    </ReactCardFlip>
  );
}

type CardStructureProps = {
  children: React.ReactNode;
  card: Card;
};

export function CardStructure({ children, card }: CardStructureProps) {
  const deck = useSelectedDeck((state) => state.currentDeck);
  const token = useStore((state) => state.token);

  let cardUrl: string = deck
    ? `/categories/${deck.categoryId}/decks/${deck.id}/cards/${card.id}`
    : '';
  let cacheKey: string = deck
    ? `${token}/categories/${deck.categoryId}/decks/${deck.id}/cards`
    : '';

  const [deleteMutation] = useMutation(deleteCard, {
    onSuccess: () => queryCache.invalidateQueries(cacheKey),
  });

  const [editMutation] = useMutation(editCard, {
    onSuccess: () => queryCache.invalidateQueries(cacheKey),
  });
  if (!deck) return <Box className='no-deck-cards'></Box>;

  return (
    <Stack
      className='card-structure'
      borderWidth='1px'
      rounded='lg'
      overflow='hidden'
      bg='teal.600'
      maxW='300px'
    >
      <Flex justifyContent='flex-end'>
        <HStack spacing='5px' mr='5px' mt='5px'>
          <IconButton
            aria-label='Edit'
            colorScheme='teal'
            icon={<EditIcon />}
            onClick={async () => {
              try {
                const editedProperties = {
                  front: 'hoi',
                  back: 'hi',
                  type: 'hello',
                };

                await editMutation({ token, deck, card, editedProperties });
              } catch (err) {
                console.error(`Cannot edit card`);
                console.error(err);
              }
            }}
          />
          <IconButton
            aria-label='Delete'
            colorScheme='teal'
            icon={<DeleteIcon />}
            onClick={async () => {
              try {
                await deleteMutation({ token, deck, card });
              } catch (err) {
                console.error(`Cannot delete card`);
                console.error(err);
              }
            }}
          />
        </HStack>
      </Flex>
      <Box h='100%' minW='300px' minH='350px'>
        {children}
      </Box>
    </Stack>
  );
}

type ResponsiveCardLayoutProps = {
  children: React.ReactNode;
};

export function ResponsiveCardLayout({ children }: ResponsiveCardLayoutProps) {
  return (
    <Flex
      justifyContent={['center', 'center', 'left', 'left']}
      padding='20px'
      flexWrap='wrap'
    >
      {children}
    </Flex>
  );
}

type CardFormProps = ModifyCardFormProps & {
  onSubmit: (card: CreateCardType, e: any) => Promise<void>;
};

function CardForm({ onCancel, onSubmit }: CardFormProps) {
  const { handleSubmit, register, formState, reset, errors } = useForm<
    CreateCardType
  >();
  return (
    <VStack spacing={4} color='teal.900' align='left'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormLabel color='white'>Description</FormLabel>
        <Textarea name='front' type='text' ref={register({ required: true })} />
        {errors.front && <Text color='red.900'>Description is required</Text>}
        <FormLabel color='white'>Answer</FormLabel>
        <Textarea type='text' name='back' ref={register({ required: true })} />
        {errors.back && <Text color='red.900'>Answer is required</Text>}
        <FormLabel color='white'>Type</FormLabel>
        <Textarea type='text' name='type' ref={register({ required: true })} />
        {errors.type && <Text color='red.900'>Type is required</Text>}
        <HStack justifyContent='flex-start' mt={5}>
          <Button
            colorScheme='teal'
            onClick={() => {
              onCancel();
              reset();
            }}
            isDisabled={formState.isSubmitting}
          >
            Cancel
          </Button>
          <Button
            colorScheme='teal'
            isLoading={formState.isSubmitting}
            type='submit'
          >
            Save
          </Button>
        </HStack>
      </form>
    </VStack>
  );
}

type ModifyCardFormProps = {
  onCancel: () => void;
};

function AddCardForm({ onCancel }: ModifyCardFormProps) {
  const token = useStore((state) => state.token);
  const selectedDeck = useSelectedDeck((state) => state.currentDeck);
  const cacheKey = `${token}/categories/${selectedDeck!.categoryId}/decks/${
    selectedDeck!.id
  }/cards`;
  const [mutate] = useMutation(
    (formData: CreateCardType) => {
      return createCard(token, selectedDeck!, formData);
    },
    { onSuccess: () => queryCache.invalidateQueries(cacheKey) }
  );

  const onSubmit = async (card: CreateCardType, e: any) => {
    try {
      await mutate(card);
      e.target.reset();
      onCancel();
    } catch (err) {
      console.error(err);
      console.error(`Could not add new card to ${selectedDeck!.name}`);
    }
  };

  return <CardForm onCancel={onCancel} onSubmit={onSubmit} />;
}
// function EditCardForm({ firstFieldRef, onCancel }: ModifyCardFormProps) {
//   const token = useStore((state) => state.token);
//   const selectedDeck = useSelectedDeck((state) => state.currentDeck);
//   const cacheKey = `${token}/categories/${selectedDeck!.categoryId}/decks/${
//     selectedDeck!.id
//   }/cards`;
//   const { reset } = useForm();
//   const [mutate] = useMutation(
//     (formData: CreateCardType) => {
//       return editCard(token, selectedDeck!, formData);
//     },
//     { onSuccess: () => queryCache.invalidateQueries(cacheKey) }
//   );

//   const onSubmit = async (card: CreateCardType) => {
//     try {
//       await mutate(card);
//       reset();
//       onCancel();
//     } catch (e) {
//       console.error(`Could not add new card to ${selectedDeck!.name}`);
//     }
//   };

//   return (
//     <CardForm
//       firstFieldRef={firstFieldRef}
//       onCancel={onCancel}
//       onSubmit={onSubmit}
//     />
//   );
// }

export function CreateCardCollapsible() {
  const [show, setShow] = React.useState(false);

  const handleToggle = () => setShow(!show);

  return (
    <Box w='700px'>
      <Button colorScheme='teal' onClick={handleToggle} w={20}>
        New card
      </Button>
      <Collapse mt={4} isOpen={show} mr={230}>
        <AddCardForm onCancel={handleToggle} />
      </Collapse>
    </Box>
  );
}
