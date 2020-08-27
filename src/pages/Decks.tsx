import React from 'react';
import useStore from '../utils/user';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Box } from '@chakra-ui/core';
import CardTemplate, { ResponsiveCardLayout } from '../components/Card';

export interface Deck {
  id: number;
  categoryId: number;
  name: string;
}

export interface Card {
  id: number;
  front: string;
  back: string;
  orderInDeck: number;
  type: string;
}

async function getAllUserDecks(token: string) {
  const response = await axios.get<Deck[]>(`/categories/all/decks`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status === 200) {
    return response.data;
  }

  throw new Error(response.statusText);
}

export function useAllUserDecks() {
  const token = useStore((state) => state.token);
  const key: string = `${token}/categories/all/decks`;
  return useQuery(key, () => getAllUserDecks(token));
}

async function getDecks(token: string, id: string) {
  const response = await axios.get<Deck[]>(`/categories/${id}/decks`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status === 200) {
    return response.data;
  }

  throw new Error(response.statusText);
}

export async function getCards(token: string, deck: Deck) {
  const response = await axios.get<Card[]>(
    `/categories/${deck.categoryId}/decks/${deck.id}/cards`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (response.status === 200) {
    return response.data;
  }

  throw new Error(response.statusText);
}

export function useDecks(id: string) {
  const token = useStore((state) => state.token);
  const key: string = `${token}/categories/${id}/decks`;
  return useQuery(key, () => getDecks(token, id));
}

type DeckParamType = {
  id: string;
};

function Decks() {
  const { id } = useParams<DeckParamType>();
  const { isLoading, error, isError, data } = useDecks(id);

  if (isError) {
    return <span>Error: {(error as Error).message}</span>;
  }

  if (isLoading) {
    return <span>Loading...</span>;
  }

  return (
    <ResponsiveCardLayout>
      <Box>Nope</Box>
    </ResponsiveCardLayout>
  );
}

export default Decks;
