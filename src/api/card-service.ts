import axios from 'axios';
import { Card, CreateCardType } from '../types/card';
import { Deck } from '../types/deck';
import { Category } from '../types/category';

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

type CreateDeckProps = {
  token: string;
  categoryId: string;
  name: string;
};

export async function createDeck({ token, categoryId, name }: CreateDeckProps) {
  const body = {
    name,
  };
  const response = await axios.post<Deck>(
    `/categories/${categoryId}/decks`,
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

type EditCardType = {
  token: string;
  deck: Deck;
  card: Card;
  editedProperties: CreateCardType;
};

export async function editCard({
  token,
  deck,
  card,
  editedProperties,
}: EditCardType) {
  const { front, back, type } = editedProperties;
  const body: CreateCardType = { front, back, type };

  const response = await axios.patch<Card>(
    `/categories/${deck.categoryId}/decks/${deck.id}/cards/${card.id}`,
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

type DeleteCardType = {
  token: string;
  deck: Deck;
  card: Card;
};

export async function deleteCard({
  token,
  deck,
  card,
}: DeleteCardType): Promise<void> {
  await axios.delete(
    `/categories/${deck.categoryId}/decks/${deck.id}/cards/${card.id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}
