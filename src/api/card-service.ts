import { Card, CreateCardType } from '../types/card';
import { Deck } from '../types/deck';
import { Category } from '../types/category';
import client from './client';

export async function getCategory(id: string): Promise<Category> {
  const response = await client().get<Category>(`/categories/${id}`);

  if (response.status === 200) {
    return response.data;
  }

  throw new Error(response.statusText);
}

export async function getCategories(): Promise<Category[]> {
  const response = await client().get<Category[]>('/categories');

  if (response.status === 200) {
    return response.data;
  }

  throw new Error(response.statusText);
}

type CategoryInput = {
  name: string;
};

export async function createCategory({
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
  category: Category;
  name: string;
};

export async function editCategory({ category, name }: EditCategoryInput) {
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
  category: Category;
};

export async function deleteCategory({ category }: DeleteCategoryInput) {
  const response = await client().delete<void>(`/categories/${category.id}`);

  if (response.status === 200) {
    return response.data;
  }

  throw new Error(response.statusText);
}

export async function getAllUserDecks() {
  const response = await client().get<Deck[]>(`/categories/all/decks`);

  if (response.status === 200) {
    return response.data;
  }

  throw new Error(response.statusText);
}

export async function getDecks(id: string) {
  const response = await client().get<Deck[]>(`/categories/${id}/decks`);

  if (response.status === 200) {
    return response.data;
  }

  throw new Error(response.statusText);
}

type DeleteDeckInput = {
  deck: Deck;
};

export async function deleteDeck({ deck }: DeleteDeckInput) {
  const response = await client().delete<void>(
    `/categories/${deck.categoryId}/decks/${deck.id}`
  );

  if (response.status === 200) {
    return response.data;
  }

  throw new Error(response.statusText);
}

type EditDeckInput = {
  deck: Deck;
  newName: string;
};

export async function editDeck({ deck, newName }: EditDeckInput) {
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
  categoryId: string;
  name: string;
};

export async function createDeck({ categoryId, name }: CreateDeckInput) {
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

export async function getCards(deck: Deck) {
  const response = await client().get<Card[]>(
    `/categories/${deck.categoryId}/decks/${deck.id}/cards`
  );

  if (response.status === 200) {
    return response.data;
  }

  throw new Error(response.statusText);
}

export async function createCard(
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
  deck: Deck;
  card: Card;
  editedProperties: CreateCardType;
};

export async function editCard({
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
  deck: Deck;
  card: Card;
};

export async function deleteCard({
  deck,
  card,
}: DeleteCardInput): Promise<void> {
  await client().delete(
    `/categories/${deck.categoryId}/decks/${deck.id}/cards/${card.id}`
  );
}
