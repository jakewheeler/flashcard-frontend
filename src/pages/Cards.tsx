import React from 'react';
import { useQuery } from 'react-query';
import useStore from '../utils/user';
import Card, { ResponsiveCardLayout } from '../components/Card';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface Card {
  id: number;
  front: string;
  back: string;
  type: string;
}

async function getCards(token: string, categoryId: string, deckId: string) {
  const response = await axios.get<Card[]>(
    `/categories/${categoryId}/decks/${deckId}/cards`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (response.status === 200) {
    return response.data;
  }

  throw new Error(response.statusText);
}

function useCards(categoryId: string, deckId: string) {
  const token = useStore((state) => state.token);
  const key: string = `${token}/categories/${categoryId}/decks/${deckId}/cards`;
  return useQuery(key, () => getCards(token, categoryId, deckId));
}

type CardParamType = {
  categoryId: string;
  deckId: string;
};

function Cards() {
  const { categoryId, deckId } = useParams<CardParamType>();
  const { isLoading, error, isError, data } = useCards(categoryId, deckId);

  if (isError) {
    return <span>Error: {(error as Error).message}</span>;
  }

  if (isLoading) {
    return <span>Loading...</span>;
  }

  return (
    <ResponsiveCardLayout>
      {data?.map((card) => (
        <Card
          name={card.front}
          url={`/categories/${categoryId}/decks/${deckId}/cards`}
          key={card.id}
        />
      ))}
    </ResponsiveCardLayout>
  );
}

export default Cards;