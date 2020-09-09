export interface Category {
  id: string;
  name: string;
  userId: number;
}

export interface Card {
  id: number;
  front: string;
  back: string;
  orderInDeck: number;
  type: string;
}
