import { Card } from '../types/types';

export const calculateHandValue = (hand: Card[]): number => {
  let total = 0;
  let aceCount = 0;

  for (let card of hand) {
    if (card.value === 'ace') {
      aceCount++;
    } else if (['jack', 'queen', 'king'].includes(card.value)) {
      total += 10;
    } else {
      total += Number(card.value);
    }
  }

  for (let i = 0; i < aceCount; i++) {
    if (total + 11 <= 21) {
      total += 11;
    } else {
      total += 1;
    }
  }

  return total;
};
