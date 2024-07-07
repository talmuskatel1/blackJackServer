
import { Request, Response } from 'express';
import { shuffleDeck } from '../utils/shuffle'; // Example utility for shuffling cards
import { GameState } from '../types/types'; // Adjust path as needed

const createDeck = () => {
  // Function to create and return a deck of cards (Server-side logic)
  const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
  const ranks = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];
  const deck = [];

  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank });
    }
  }

  return deck;
};

export const getInitialGameState = (req: Request, res: Response) => {
  console.log("Request received at /api/game/initial-state");
  const deck = createDeck();
  const initialState: GameState = {
    deck: shuffleDeck(deck),
    playerHand: [],
    dealerHand: [],
    gameStatus: 'waiting'
  };
  res.json(initialState);
};
