import { useQuery } from 'react-query';
import {
  getAllUserDecks,
  getDecks,
  getCategories,
  getCards,
  getCategory,
} from '../api/card-service';
import useStore from '../stores/user';
import { Deck } from '../types/deck';
import { useEffect } from 'react';
import { tryFetchLoggedInUser } from '../api/login-service';

export function useAllUserDecks() {
  const token = useStore((state) => state.token);
  return useQuery(`${token}/categories/all/decks`, () =>
    getAllUserDecks(token)
  );
}

export function useDecks(id: string) {
  const token = useStore((state) => state.token);
  return useQuery(`${token}/categories/${id}/decks`, () => getDecks(token, id));
}

export function useCategory(id: string) {
  const token = useStore((state) => state.token);
  return useQuery(`${token}/categories/${id}`, () => getCategory(token, id));
}

export function useCategories() {
  const token = useStore((state) => state.token);
  return useQuery(`${token}/categories`, () => getCategories(token));
}

export function useCards(deck: Deck) {
  const token = useStore((state) => state.token);
  return useQuery(
    `${token}/categories/${deck.categoryId}/decks/${deck.id}/cards`,
    () => getCards(token, deck)
  );
}

// check if a stored user already exists and use that for the login
export function useStoredUser() {
  const { setUser, token, user } = useStore();
  useEffect(() => {
    const token = window.localStorage.getItem('token');
    async function authCheck() {
      if (token) {
        try {
          let user = await tryFetchLoggedInUser(token);
          setUser(user, token);
        } catch (err) {
          console.error('Existing token is not valid');
          setUser('', '');
          window.localStorage.setItem('token', '');
        }
      }
    }
    authCheck();
  }, [token, user, setUser]);
}
