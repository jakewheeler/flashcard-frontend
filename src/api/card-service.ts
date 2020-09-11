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
  const response = await axios.post<Category>('/categories', body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

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
  const response = await axios.patch<Deck>(`/categories/${category.id}`, body, {
    headers: { Authorization: `Bearer ${token}` },
  });

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
  const response = await axios.delete<void>(`/categories/${category.id}`, {
    headers: { Authorization: `Bearer ${token}` },
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

type DeleteDeckInput = {
  token: string;
  deck: Deck;
};

export async function deleteDeck({ token, deck }: DeleteDeckInput) {
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

type EditDeckInput = {
  token: string;
  deck: Deck;
  newName: string;
};

export async function editDeck({ token, deck, newName }: EditDeckInput) {
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

type CreateDeckInput = {
  token: string;
  categoryId: string;
  name: string;
};

export async function createDeck({ token, categoryId, name }: CreateDeckInput) {
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
  await axios.delete(
    `/categories/${deck.categoryId}/decks/${deck.id}/cards/${card.id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}
