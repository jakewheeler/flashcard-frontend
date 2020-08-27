import create from 'zustand';
import { Deck } from '../types/card';

interface DeckValues {
  currentDeck: Deck | null;
  setDeck: (newDeck: Deck) => void;
}

const useSelectedDeck = create<DeckValues>(
  (set): DeckValues => ({
    currentDeck: null,
    setDeck: (newDeck: Deck) => {
      set({ currentDeck: newDeck });
    },
  })
);

export default useSelectedDeck;
