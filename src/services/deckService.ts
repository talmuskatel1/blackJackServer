import { Card } from '../types/types';

export const createDeck = () => {
  const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
  const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
  const deck = [];

  for (const suit of suits) {
    for (const value of values) {
      deck.push({ suit, value, imageUrl: `/assets/cards/${value}_of_${suit}.png` });
    }
  }
  return deck;
};

export const shuffleDeck = (deck: Card[]) => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

export const dealCards = (deck: Card[], numCards: number) => {
  return deck.splice(0, numCards);
};

