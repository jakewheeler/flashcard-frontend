import create from 'zustand';
import { Deck } from '../types/deck';

interface DeckValues {
  currentDeck: Deck | null;
  setDeck: (newDeck: Deck | null) => void;
}

const useSelectedDeck = create<DeckValues>(
  (set): DeckValues => ({
    currentDeck: null,
    setDeck: (newDeck: Deck | null) => {
      set({ currentDeck: newDeck });
    },
  })
);

export default useSelectedDeck;
