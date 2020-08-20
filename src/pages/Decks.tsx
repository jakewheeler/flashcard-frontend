import React from 'react';
import useStore from '../utils/user';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Flex, Box, Text } from '@chakra-ui/core';
import { useParams } from 'react-router-dom';
import Card, { ResponsiveCardParent } from '../components/Card';

interface Deck {
  id: number;
  name: string;
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

function useDecks(id: string) {
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

  // also status === 'success', but "else" logic works, too
  return (
    <ResponsiveCardParent>
      {data?.map((deck) => (
        <Card
          name={deck.name}
          url={`/categories/${id}/decks/${deck.id}`}
          key={deck.id}
        />
      ))}
    </ResponsiveCardParent>
  );
}

export default Decks;
