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
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from '@chakra-ui/core';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import ReactCardFlip from 'react-card-flip';
import { Card, CreateCardType } from '../types/card';
import useSelectedDeck from '../stores/deck';
import useStore from '../stores/user';
import { useForm } from 'react-hook-form';
import { useMutation, queryCache } from 'react-query';
import { createCard, deleteCard, editCard } from '../api/card-service';
import { useErrorToast, useSuccessToast } from '../hooks';

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
          <Text color='teal.100' overflowWrap='anywhere' padding={5}>
            {card.front}
          </Text>

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
          <Text color='teal.100' padding={5}>
            {card.back}
          </Text>

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

  const successToast = useSuccessToast();
  const errorToast = useErrorToast();

  const cacheKey = ['cards', token, deck?.categoryId, deck?.id];

  const [deleteMutation] = useMutation(deleteCard, {
    onSuccess: () => queryCache.invalidateQueries(cacheKey),
    throwOnError: true,
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
          <EditCardModal card={card} />
          <IconButton
            aria-label='Delete'
            colorScheme='teal'
            icon={<DeleteIcon />}
            onClick={async () => {
              try {
                await deleteMutation({ deck, card });
                successToast(`Card deleted successfully`);
              } catch (err) {
                errorToast(`Card could not be deleted`);
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
    <Flex justifyContent='left' padding='20px' flexWrap='wrap'>
      {children}
    </Flex>
  );
}

type CardFormProps = ModifyCardFormProps & {
  onSubmit: (card: CreateCardType, e: any) => Promise<void>;
  card?: Card;
};

function CardForm({ onCancel, onSubmit, card }: CardFormProps) {
  const { handleSubmit, register, formState, reset, errors } = useForm<
    CreateCardType
  >();
  return (
    <VStack
      spacing={4}
      align='left'
      borderWidth={card ? '0px' : '1px'}
      borderRadius='lg'
      padding={card ? 0 : 5}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormLabel color='white'>Description</FormLabel>
        <Textarea
          name='front'
          defaultValue={card ? card.front : ''}
          type='text'
          ref={register({ required: true })}
        />
        {errors.front && <Text color='red.900'>Description is required</Text>}
        <FormLabel color='white'>Answer</FormLabel>
        <Textarea
          type='text'
          defaultValue={card ? card.back : ''}
          name='back'
          ref={register({ required: true })}
        />
        {errors.back && <Text color='red.900'>Answer is required</Text>}
        <FormLabel color='white'>Type</FormLabel>
        <Textarea
          type='text'
          defaultValue={card ? card.type : ''}
          name='type'
          ref={register({ required: true })}
        />
        {errors.type && <Text color='red.900'>Type is required</Text>}
        <HStack justifyContent='flex-start' mt={5}>
          <Button
            colorScheme='teal'
            isLoading={formState.isSubmitting}
            type='submit'
          >
            Save
          </Button>
          <Button
            onClick={() => {
              onCancel();
              reset();
            }}
            isDisabled={formState.isSubmitting}
          >
            Cancel
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
  const deck = useSelectedDeck((state) => state.currentDeck);

  const successToast = useSuccessToast();
  const errorToast = useErrorToast();

  const cacheKey = ['cards', token, deck?.categoryId, deck?.id];
  const [mutate] = useMutation(
    (formData: CreateCardType) => {
      return createCard(deck!, formData);
    },
    { onSuccess: () => queryCache.invalidateQueries(cacheKey) }
  );

  const onSubmit = async (card: CreateCardType, e: any) => {
    try {
      await mutate(card);
      e.target.reset();
      onCancel();
      successToast(`Card added to deck '${deck?.name}'`);
    } catch (err) {
      errorToast(`Could not add card to deck '${deck?.name}'`);
    }
  };

  return <CardForm onCancel={onCancel} onSubmit={onSubmit} />;
}

export function CreateCardCollapsible() {
  const [show, setShow] = React.useState(false);

  const handleToggle = () => setShow(!show);

  return (
    <Box>
      <Button colorScheme='teal' onClick={handleToggle} w={20}>
        New card
      </Button>
      <Collapse mt={4} isOpen={show} mr={10}>
        <AddCardForm onCancel={handleToggle} />
      </Collapse>
    </Box>
  );
}

type EditCardModalProps = {
  card: Card;
};

function EditCardModal({ card }: EditCardModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const token = useStore((state) => state.token);
  const deck = useSelectedDeck((state) => state.currentDeck);

  const initialRef = React.useRef<HTMLInputElement | null>(null);

  const cacheKey = ['cards', token, deck?.categoryId, deck?.id];
  const [editMutation] = useMutation(editCard, {
    onSuccess: () => queryCache.invalidateQueries(cacheKey),
    throwOnError: true,
  });

  if (!deck || !card) {
    return <Box></Box>;
  }

  const onSubmit = async (editedProperties: CreateCardType) => {
    try {
      await editMutation({ deck, card, editedProperties });
      onClose();
    } catch (err) {
      console.error(`Cannot edit card`);
      console.error(err);
    }
  };

  return (
    <>
      <IconButton
        aria-label='Edit'
        colorScheme='teal'
        icon={<EditIcon />}
        onClick={onOpen}
      />
      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>Edit card</ModalHeader>
            <ModalCloseButton />

            <ModalBody pb={6}>
              <CardForm onCancel={onClose} onSubmit={onSubmit} card={card} />
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
}
