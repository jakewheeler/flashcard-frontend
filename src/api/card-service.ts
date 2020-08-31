import axios from 'axios';
import { Category, Deck, Card } from '../types/card';

export async function getCategories(token: string): Promise<Category[]> {
  const response = await axios.get<Category[]>('/categories', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 200) {
    return response.data;
  }

  throw new Error(response.statusText);
}

export async function getAllUserDecks(token: string) {
  const response = await axios.get<Deck[]>(`/categories/all/decks`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status === 200) {
    return response.data;
  }

  throw new Error(response.statusText);
}

export async function getDecks(token: string, id: string) {
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

export type CreateCardType = {
  front: string;
  back: string;
  type: string;
};

export async function createCard(
  token: string,
  deck: Deck,
  { front, back, type }: CreateCardType
) {
  const body: CreateCardType = {
    front,
    back,
    type,
  };
  const response = await axios.post<Card>(
    `/categories/${deck.categoryId}/decks/${deck.id}/cards`,
    body,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (response.status === 201) {
    return response.data;
  }

  throw new Error(response.statusText);
}

export async function editCard(
  token: string,
  deck: Deck,
  card: Card,
  { front, back, type }: CreateCardType
) {
  const body: CreateCardType = { front, back, type };

  const response = await axios.patch<Card>(
    `/categories/${deck.categoryId}/decks/${deck.id}/cards/${card.id}`,
    body,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (response.status === 201) {
    return response.data;
  }

  throw new Error(response.statusText);
}

export async function deleteCard(
  token: string,
  deck: Deck,
  card: Card
): Promise<void> {
  await axios.delete(
    `/categories/${deck.categoryId}/decks/${deck.id}/cards/${card.id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}
