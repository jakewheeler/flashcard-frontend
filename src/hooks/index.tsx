import { useQuery } from 'react-query';
import {
  getAllUserDecks,
  getDecks,
  getCategories,
  getCards,
} from '../api/card-service';
import useStore from '../utils/user';
import { Deck } from '../types/card';

export function useAllUserDecks() {
  const token = useStore((state) => state.token);
  const key: string = `${token}/categories/all/decks`;
  return useQuery(key, () => getAllUserDecks(token));
}

export function useDecks(id: string) {
  const token = useStore((state) => state.token);
  const key: string = `${token}/categories/${id}/decks`;
  return useQuery(key, () => getDecks(token, id));
}

export function useCategories() {
  const token = useStore((state) => state.token);
  return useQuery(`${token}categories`, () => getCategories(token));
}

export function useCards(deck: Deck) {
  const token = useStore((state) => state.token);
  return useQuery(
    `${token}/categories/${deck.categoryId}/decks/${deck.id}/cards`,
    () => getCards(token, deck)
  );
}
