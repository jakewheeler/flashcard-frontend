import React, { useState } from 'react';
import {
  Flex,
  IconButton,
  Stack,
  HStack,
  Box,
  Button,
  Text,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
} from '@chakra-ui/core';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import ReactCardFlip from 'react-card-flip';
import { Card } from '../types/card';
import useSelectedDeck from '../stores/deck';
import FocusLock from 'react-focus-lock';
import useStore from '../stores/user';
import { useForm } from 'react-hook-form';
import { useMutation, queryCache } from 'react-query';
import { createCard, CreateCardType } from '../api/card-service';

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

          <Button colorScheme='teal' onClick={handleClick}>
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

          <Button colorScheme='teal' onClick={handleClick}>
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
  if (!deck) return <Box className='no-deck-cards'></Box>;

  const { id, categoryId } = deck;

  const cardUrl = `/categories/${categoryId}/decks/${id}/cards/${card.id}`;
  return (
    <Stack
      className='card-structure'
      borderWidth='1px'
      rounded='lg'
      overflow='hidden'
      bg='teal.600'
      _hover={{
        borderColor: 'black',
        bg: 'teal.500',
        color: 'black',
      }}
    >
      <Flex justifyContent='flex-end'>
        <HStack spacing='5px' mr='5px' mt='5px'>
          <IconButton
            aria-label='Edit'
            colorScheme='teal'
            icon={<EditIcon />}
            onClick={() => console.log('edit', cardUrl)}
          />
          <IconButton
            aria-label='Delete'
            colorScheme='teal'
            icon={<DeleteIcon />}
            onClick={() => console.log('delete', cardUrl)}
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

type TextInputProps = {
  id?: string;
  name: string;
  label: string;
  defaultValue?: string;
};

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (props, ref) => {
    return (
      <FormControl>
        <FormLabel color='teal.100' htmlFor={props.id}>
          {props.label}
        </FormLabel>
        <Input ref={ref} id={props.id} {...props} />
      </FormControl>
    );
  }
);

type CardFormProps = {
  firstFieldRef: React.MutableRefObject<HTMLInputElement | null>;
  onCancel: () => void;
};

function CardForm({ firstFieldRef, onCancel }: CardFormProps) {
  const token = useStore((state) => state.token);
  const selectedDeck = useSelectedDeck((state) => state.currentDeck);
  const cacheKey = `/categories/${selectedDeck!.categoryId}/decks/${
    selectedDeck!.id
  }/cards`;
  const { handleSubmit, register, reset, formState } = useForm();
  const [mutate] = useMutation(
    (formData: CreateCardType) => {
      return createCard(token, selectedDeck!, formData);
    },
    { onSuccess: () => queryCache.invalidateQueries(cacheKey) }
  );

  const onSubmit = async (card: CreateCardType) => {
    try {
      await mutate(card);
      reset();
      onCancel();
    } catch (e) {
      console.error(`Could not add new card to ${selectedDeck!.name}`);
    }
  };

  return (
    <VStack spacing={4}>
      <form onSubmit={handleSubmit<CreateCardType>(onSubmit)}>
        <TextInput
          name='front'
          label='Description'
          id='front'
          ref={(e) => {
            firstFieldRef.current = e;
            register(e, { required: true });
          }}
        />
        <TextInput
          name='back'
          label='Answer'
          id='back'
          ref={register({ required: true })}
        />
        <TextInput
          name='type'
          label='Type'
          id='type'
          ref={register({ required: true })}
        />
        <HStack justifyContent='flex-end' mt={5}>
          <Button
            variant='outline'
            onClick={onCancel}
            color='teal.100'
            isDisabled={formState.isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant='outline'
            color='teal.100'
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

export function CardFormPopover() {
  const [isOpen, setIsOpen] = React.useState(false);
  const firstFieldRef = React.useRef(null);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return (
    <>
      <Popover
        isOpen={isOpen}
        initialFocusRef={firstFieldRef}
        onOpen={open}
        onClose={close}
        placement='right'
        closeOnBlur={false}
      >
        <PopoverTrigger>
          <Button width={20} colorScheme='teal'>
            Add card
          </Button>
        </PopoverTrigger>
        <PopoverContent p={5} bg='teal.500'>
          <FocusLock returnFocus persistentFocus={false}>
            <PopoverArrow bg='white' />
            <PopoverCloseButton />
            <CardForm firstFieldRef={firstFieldRef} onCancel={close} />
          </FocusLock>
        </PopoverContent>
      </Popover>
    </>
  );
}
