export interface Deck {
  id: number;
  categoryId: number;
  name: string;
}

export interface EditDeckInputObj {
  newName: string;
}

export interface DecksByCategoryObj {
  [key: string]: Deck[];
}
