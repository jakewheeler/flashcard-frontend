import jwtDecode from 'jwt-decode';
import { Deck, DecksByCategoryObj } from '../types/deck';

interface JwtTokenPayload {
  username: string;
  iat: number;
  exp: number;
}

export function getDecodedJwt(token: string) {
  return jwtDecode<JwtTokenPayload>(token);
}

export function combineAllDecks(data: DecksByCategoryObj) {
  let decks: Deck[] = [];
  Object.keys(data).forEach((key) => {
    decks = decks.concat(data[key]);
  });
  return decks;
}
