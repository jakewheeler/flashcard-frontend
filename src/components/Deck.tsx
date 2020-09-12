import { useForm } from 'react-hook-form';
import { EditDeckInputObj } from '../types/deck';
import React from 'react';
import {
  Input,
  Button,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  FormControl,
  FormLabel,
  ModalFooter,
  useToast,
  HStack,
} from '@chakra-ui/core';
import { useCategory } from '../hooks';
import useStore from '../stores/user';
import { useMutation, queryCache } from 'react-query';
import { createDeck } from '../api/card-service';

type EditDeckInputProps = {
  currentDeckName: string;
  handleEdit: (newName: string) => Promise<void>;
  close: () => void;
};

export function EditDeckInput({
  currentDeckName,
  handleEdit,
  close,
}: EditDeckInputProps) {
  const { register, handleSubmit } = useForm<EditDeckInputObj>();

  const onSubmit = async (input: EditDeckInputObj) => {
    await handleEdit(input.newName);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack align='left'>
        <Input
          name='newName'
          placeholder={currentDeckName}
          textColor='black'
          ref={register}
        />
        <HStack>
          <Button h='1.75rem' size='sm' type='submit' colorScheme='teal'>
            OK
          </Button>
          <Button h='1.75rem' size='sm' onClick={close} color='black'>
            Cancel
          </Button>
        </HStack>
      </VStack>
    </form>
  );
}

type AddDeckModalProps = {
  categoryId: string;
};

type AddDeckInputObj = {
  name: string;
};

export function AddDeckModal({ categoryId }: AddDeckModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: category } = useCategory(categoryId);
  const token = useStore((state) => state.token);
  const { register, handleSubmit } = useForm<AddDeckInputObj>();
  const toast = useToast();

  const initialRef = React.useRef<HTMLInputElement | null>(null);

  const cacheKeys = [
    ['decks', token],
    ['categories', token],
  ];
  const [addDeck] = useMutation(createDeck, {
    onSuccess: () =>
      cacheKeys.forEach((cacheKey) => queryCache.invalidateQueries(cacheKey)),
    throwOnError: true,
  });

  const onSubmit = async (deck: AddDeckInputObj) => {
    const { name } = deck;
    try {
      await addDeck({ categoryId, name });
      onClose();
    } catch (err) {
      onClose();
      toast({
        title: 'Unable to add deck',
        description: `Could not add deck '${deck.name}' because a deck with this name already exists`,
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  return (
    <>
      <Button colorScheme='teal' onClick={onOpen}>
        Add Deck
      </Button>
      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalContent>
              <ModalHeader>Create a new deck</ModalHeader>
              <ModalCloseButton />

              <ModalBody pb={6}>
                <VStack spacing={2}>
                  <FormControl>
                    <FormLabel>Deck name</FormLabel>
                    <Input
                      name='name'
                      ref={(ref) => {
                        if (ref) {
                          initialRef.current = ref;
                          register(ref);
                        }
                      }}
                      placeholder='enter the deck name'
                    />
                  </FormControl>
                  <Text>
                    This deck will be added to{' '}
                    <span style={{ fontWeight: 'bold' }}>{category?.name}</span>
                  </Text>
                </VStack>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme='teal' mr={3} type='submit'>
                  Save
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </form>
        </ModalOverlay>
      </Modal>
    </>
  );
}
