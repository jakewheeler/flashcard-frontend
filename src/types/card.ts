export interface Category {
  id: string;
  name: string;
  userId: number;
}

export interface Deck {
  id: number;
  categoryId: number;
  name: string;
}

interface DecksByCategory {
  key: string;
  value: Deck[];
}

export interface DecksByCategoryObj {
  [key: string]: Deck[];
}

export interface Card {
  id: number;
  front: string;
  back: string;
  orderInDeck: number;
  type: string;
}
