import express, { Request, Response } from 'express';
import { createDeck, shuffleDeck, dealCards } from '../services/deckService';
import { Card, GameState } from '../types/types';
import { calculateHandValue } from '../utils/CalculateHandValue';

const router = express.Router();
let gameState: GameState = {
  deck: [],
  playerHand: [],
  dealerHand: [],
  gameStatus: 'waiting'
};

const startNewGame = () => {
  const newDeck: Card[] = createDeck();
  gameState.deck = shuffleDeck(newDeck);
  gameState.playerHand = dealCards(gameState.deck, 2);
  gameState.dealerHand = dealCards(gameState.deck, 1);
  gameState.gameStatus = 'playing'; 
};

const calculateGameOutcome = () => {
  const playerTotal = calculateHandValue(gameState.playerHand);
  const dealerTotal = calculateHandValue(gameState.dealerHand);

  if (playerTotal > 21) {
    return 'Dealer';
  } else if (dealerTotal > 21) {
    return 'Player';
  } else if (playerTotal > dealerTotal) {
    return 'Player';
  } else if (playerTotal < dealerTotal) {
    return 'Dealer';
  } else if (playerTotal == dealerTotal) {
      if (playerTotal == 21 ) {
         return 'Tie';
      }
      else{
        return 'Dealer';
      }
  }
};

router.get('/initial-state', (req: Request, res: Response) => {
  startNewGame();
  res.json(gameState);
});

router.post('/hit', (req: Request, res: Response) => {
  if (gameState.gameStatus !== 'playing') {
    return res.status(400).json({ message: 'Game is not in progress' });
  }

  gameState.playerHand.push(gameState.deck.pop()!);

  const playerTotal = calculateHandValue(gameState.playerHand);

  if (playerTotal > 21) {
    gameState.gameStatus = 'finished';
  }

  const winner = gameState.gameStatus === 'finished' ? calculateGameOutcome() : '';

  res.json({ ...gameState, winner });
});

router.post('/stand', async (req: Request, res: Response) => {
  if (gameState.dealerHand.length === 1) {
    gameState.dealerHand.push(gameState.deck.pop()!);
  }

  while (calculateHandValue(gameState.dealerHand) < 17) {
    gameState.dealerHand.push(gameState.deck.pop()!);
  }

  gameState.gameStatus = 'finished';

  const winner = calculateGameOutcome();

  res.json({ ...gameState, winner });
});

router.post('/new-game', (req: Request, res: Response) => {
  startNewGame();
  res.json(gameState);
});

export default router;
