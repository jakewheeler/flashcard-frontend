import { Card, CreateCardType } from '../types/card';
import { Deck } from '../types/deck';
import { Category } from '../types/category';
import client from './client';

export async function getCategory(
  id: string
): Promise<Category> {
  const response = await client().get<Category>(`/categories/${id}`);

  if (response.status === 200) {
    return response.data;
  }

  throw new Error(response.statusText);
}

export async function getCategories(token: string): Promise<Category[]> {
  const response = await client().get<Category[]>('/categories');

  if (response.status === 200) {
    return response.data;
  }

  throw new Error(response.statusText);
}

type CategoryInput = {
  token: string;
  name: string;
};

export async function createCategory({
  token,
  name,
}: CategoryInput): Promise<Category> {
  const body = {
    name,
  };
  const response = await client().post<Category>('/categories', body);

  if (response.status === 201) {
    return response.data;
  }

  throw new Error(response.statusText);
}

type EditCategoryInput = {
  token: string;
  category: Category;
  name: string;
};

export async function editCategory({
  token,
  category,
  name,
}: EditCategoryInput) {
  const body = {
    name,
  };
  const response = await client().patch<Deck>(
    `/categories/${category.id}`,
    body
  );

  if (response.status === 200) {
    return response.data;
  }

  throw new Error(response.statusText);
}

type DeleteCategoryInput = {
  token: string;
  category: Category;
};

export async function deleteCategory({ token, category }: DeleteCategoryInput) {
  const response = await client().delete<void>(`/categories/${category.id}`);

  if (response.status === 200) {
    return response.data;
  }

  throw new Error(response.statusText);
}

export async function getAllUserDecks(token: string) {
  const response = await client().get<Deck[]>(`/categories/all/decks`);

  if (response.status === 200) {
    return response.data;
  }

  throw new Error(response.statusText);
}

export async function getDecks(token: string, id: string) {
  const response = await client().get<Deck[]>(`/categories/${id}/decks`);

  if (response.status === 200) {
    return response.data;
  }

  throw new Error(response.statusText);
}

type DeleteDeckInput = {
  token: string;
  deck: Deck;
};

export async function deleteDeck({ token, deck }: DeleteDeckInput) {
  const response = await client().delete<void>(
    `/categories/${deck.categoryId}/decks/${deck.id}`
  );

  if (response.status === 200) {
    return response.data;
  }

  throw new Error(response.statusText);
}

type EditDeckInput = {
  token: string;
  deck: Deck;
  newName: string;
};

export async function editDeck({ token, deck, newName }: EditDeckInput) {
  const body = {
    name: newName,
  };
  const response = await client().patch<Deck>(
    `/categories/${deck.categoryId}/decks/${deck.id}`,
    body
  );

  if (response.status === 200) {
    return response.data;
  }

  throw new Error(response.statusText);
}

type CreateDeckInput = {
  token: string;
  categoryId: string;
  name: string;
};

export async function createDeck({ token, categoryId, name }: CreateDeckInput) {
  const body = {
    name,
  };
  const response = await client().post<Deck>(
    `/categories/${categoryId}/decks`,
    body
  );

  if (response.status === 201) {
    return response.data;
  }

  throw new Error(response.statusText);
}

export async function getCards(token: string, deck: Deck) {
  const response = await client().get<Card[]>(
    `/categories/${deck.categoryId}/decks/${deck.id}/cards`
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
  const response = await client().post<Card>(
    `/categories/${deck.categoryId}/decks/${deck.id}/cards`,
    body
  );

  if (response.status === 201) {
    return response.data;
  }

  throw new Error(response.statusText);
}

type EditCardInput = {
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
}: EditCardInput) {
  const { front, back, type } = editedProperties;
  const body: CreateCardType = { front, back, type };

  const response = await client().patch<Card>(
    `/categories/${deck.categoryId}/decks/${deck.id}/cards/${card.id}`,
    body
  );

  if (response.status === 200) {
    return response.data;
  }

  throw new Error(response.statusText);
}

type DeleteCardInput = {
  token: string;
  deck: Deck;
  card: Card;
};

export async function deleteCard({
  token,
  deck,
  card,
}: DeleteCardInput): Promise<void> {
  await client().delete(
    `/categories/${deck.categoryId}/decks/${deck.id}/cards/${card.id}`
  );
}
