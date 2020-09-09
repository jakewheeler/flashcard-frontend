import axios from 'axios';
import { Category, Card } from '../types/card';
import { Deck, DecksByCategoryObj } from '../types/deck';

export async function getCategory(
  token: string,
  id: string
): Promise<Category> {
  const response = await axios.get<Category>(`/categories/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 200) {
    return response.data;
  }

  throw new Error(response.statusText);
}

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
  const response = await axios.get<DecksByCategoryObj>(
    `/categories/all/decks`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

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

type DeleteDeckProps = {
  token: string;
  deck: Deck;
};

export async function deleteDeck({ token, deck }: DeleteDeckProps) {
  const response = await axios.delete<void>(
    `/categories/${deck.categoryId}/decks/${deck.id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (response.status === 200) {
    return response.data;
  }

  throw new Error(response.statusText);
}

type EditDeckProps = DeleteDeckProps & {
  newName: string;
};

export async function editDeck({ token, deck, newName }: EditDeckProps) {
  const body = {
    name: newName,
  };
  const response = await axios.patch<Deck>(
    `/categories/${deck.categoryId}/decks/${deck.id}`,
    body,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

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
