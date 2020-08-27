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

export interface Card {
  id: number;
  front: string;
  back: string;
  orderInDeck: number;
  type: string;
}
