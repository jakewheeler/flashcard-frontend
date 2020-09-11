import { Deck } from '../types/deck';
import {
  VStack,
  UseRadioProps,
  useRadio,
  Box,
  HStack,
  IconButton,
  Text,
  useToast,
} from '@chakra-ui/core';
import React, { useState } from 'react';
import useSelectedDeck from '../stores/deck';
import useStore from '../stores/user';
import { useMutation, queryCache } from 'react-query';
import { deleteDeck, editDeck } from '../api/card-service';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { ViewByProps } from '../components/Menu';
import { EditDeckInput } from '../components/Deck';

type RadioCardGroupProps = ViewByProps & {
  decks: Deck[];
};

export function RadioCardGroup({
  group,
  decks,
  getRadioProps,
}: RadioCardGroupProps) {
  return (
    <VStack {...group} align='left'>
      {decks.map((deck: Deck) => {
        // console.log(deck);
        const value = deck.name;
        const radio = getRadioProps({ value });
        return (
          <RadioCard key={deck.id} deck={deck} {...radio}>
            <Text isTruncated>{value}</Text>
          </RadioCard>
        );
      })}
    </VStack>
  );
}

interface CustomRadioBtnProps extends UseRadioProps {
  children: React.ReactNode;
  deck: Deck;
}

export function RadioCard(props: CustomRadioBtnProps) {
  const { getInputProps, getCheckboxProps } = useRadio(props);
  const { deck } = props;
  const { currentDeck, setDeck } = useSelectedDeck();
  const [isEditing, setIsEditing] = useState(false);
  const toast = useToast();

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  const token = useStore((state) => state.token);

  // data comes from either one of these sources
  const cacheKeys = [`${token}/categories`, `${token}/categories/all/decks`];

  const [deleteSelectedDeck] = useMutation(deleteDeck, {
    onSuccess: () =>
      cacheKeys.forEach((cacheKey) => queryCache.invalidateQueries(cacheKey)),
    throwOnError: true,
  });

  const [editSelectedDeck] = useMutation(editDeck, {
    onSuccess: () =>
      cacheKeys.forEach((cacheKey) => queryCache.invalidateQueries(cacheKey)),
    throwOnError: true,
  });

  const deletion = async () => {
    try {
      await deleteSelectedDeck({ token, deck });
      setDeck(null);
      toast({
        description: `${deck.name} has been deleted!`,
        duration: 2000,
        isClosable: true,
        status: 'success',
        position: 'top-right',
      });
    } catch (err) {
      toast({
        description: `Could not delete deck`,
        duration: 9000,
        isClosable: true,
        status: 'error',
        position: 'top-right',
      });
    }
  };

  const edit = async (newName: string) => {
    try {
      const editedDeck: Deck | undefined = await editSelectedDeck({
        token,
        deck,
        newName,
      });
      setIsEditing(false);
      if (editedDeck) {
        setDeck(editedDeck);
        toast({
          description: `${deck.name} has been renamed to ${editedDeck.name}`,
          duration: 2000,
          isClosable: true,
          status: 'success',
          position: 'top-right',
        });
      } else {
        setDeck(null);
      }
    } catch (err) {
      toast({
        description: `Could not edit deck`,
        duration: 9000,
        isClosable: true,
        status: 'error',
        position: 'top-right',
      });
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
          {isEditing && currentDeck?.name === deck.name ? (
            <EditDeckInput
              currentDeckName={currentDeck.name}
              handleEdit={edit}
              close={() => setIsEditing(false)}
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
