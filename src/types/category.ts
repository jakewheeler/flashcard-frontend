import { Deck } from './deck';

export interface Category {
  id: string;
  name: string;
  userId: number;
  decks: Deck[];
}
