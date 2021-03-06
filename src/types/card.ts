export interface Card {
  id: number;
  front: string;
  back: string;
  orderInDeck: number;
  type: string;
}

export type CreateCardType = {
  front: string;
  back: string;
  type: string;
};
