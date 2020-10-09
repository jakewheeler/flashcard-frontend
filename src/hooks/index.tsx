import { useQuery } from 'react-query';
import {
  getAllUserDecks,
  getDecks,
  getCategories,
  getCards,
  getCategory,
} from '../api/card-service';
import useStore from '../stores/user';
import { Deck } from '../types/deck';
import { useEffect, useState } from 'react';
import { tryFetchLoggedInUser } from '../api/login-service';
import useSelectedDeck from '../stores/deck';
import { useRadioGroup, useToast } from '@chakra-ui/core';

export function useAllUserDecks() {
  const token = useStore((state) => state.token);
  return useQuery(['decks', token], getAllUserDecks);
}

export function useDecks(id: string) {
  const token = useStore((state) => state.token);
  return useQuery(['decks', token, id], () => getDecks(id));
}

export function useCategory(id: string) {
  const token = useStore((state) => state.token);
  return useQuery(['category', token, id], () => getCategory(id));
}

export function useCategories() {
  const token = useStore((state) => state.token);
  return useQuery(['categories', token], getCategories);
}

export function useCards(deck: Deck) {
  const token = useStore((state) => state.token);
  return useQuery(['cards', token, deck.categoryId, deck.id], () =>
    getCards(deck)
  );
}

// check if a stored user already exists and use that for the login
export function useStoredUser(): boolean {
  const { setUser, token, user } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    const token = window.localStorage.getItem('token');
    async function authCheck() {
      if (token) {
        try {
          let user = await tryFetchLoggedInUser();
          setUser(user, token);
        } catch (err) {
          setUser('', '');
          window.localStorage.setItem('token', '');
        }
      }
      setIsLoading(false);
    }
    authCheck();
  }, [token, user, setUser]);

  return isLoading;
}

export function useDeckRadioGroup() {
  const setDeck = useSelectedDeck((state) => state.setDeck);
  const { data } = useAllUserDecks();
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'decks',
    onChange: (selectedDeck) => {
      setDeck(data!.find((d) => d.name === selectedDeck)!);
    },
  });

  const group = getRootProps();
  return { group, getRadioProps };
}

export function useSuccessToast(duration: number = 3000) {
  const toast = useToast();
  return (description: string) =>
    toast({
      description,
      status: 'success',
      duration,
      isClosable: true,
      position: 'top-right',
    });
}

export function useErrorToast(duration: number = 9000) {
  const toast = useToast();
  return (description: string) =>
    toast({
      description,
      status: 'error',
      duration: duration,
      isClosable: true,
      position: 'top-right',
    });
}
