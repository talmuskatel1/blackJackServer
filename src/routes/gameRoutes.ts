import express, { Request, Response } from 'express';
import { createDeck, shuffleDeck, dealCards } from '../services/deckService';
import { Card, GameState } from '../types/types';
import { calculateHandValue } from '../utils/CalculateHandValue';
import { PLAYERS_INITIAL_CARDS, DEALERS_INITIAL_CARDS, BLACKJACK_CONST, MIN_DECK_CARDS, STOP_DEALER_CONST } from '../variables/variables';

const router = express.Router();
let gameState: GameState = {
  deck: [],
  playerHand: [],
  dealerHand: [],
  gameStatus: 'waiting'
};

const startNewSession = () => {
  const newDeck: Card[] = shuffleDeck(createDeck());
  gameState = {
    deck: newDeck,
    playerHand: [],
    dealerHand: [],
    gameStatus: 'waiting'
  };
};

router.post('/hit', (req: Request, res: Response) => {
  if (gameState.gameStatus !== 'playing') {
    return res.status(400).json({ message: 'Game is not in progress' });
  }

  gameState.playerHand.push(gameState.deck.pop()!);

  const playerTotal = calculateHandValue(gameState.playerHand);

  if (playerTotal > BLACKJACK_CONST) {
    gameState.gameStatus = 'finished';
  }

  const winner = gameState.gameStatus === 'finished' ? calculateGameOutcome() : '';

  res.json({ ...gameState, winner });
});

router.post('/stand', (req: Request, res: Response) => {
  while (calculateHandValue(gameState.dealerHand) < STOP_DEALER_CONST) {
    gameState.dealerHand.push(gameState.deck.pop()!);
  }
  gameState.gameStatus = 'finished';
  const winner = calculateGameOutcome();
  res.json({ ...gameState, winner });
});

router.get('/new-game', (req: Request, res: Response) => {
  if (gameState.deck.length < MIN_DECK_CARDS) {
    startNewSession();
    res.json(gameState); 
  } else {
    const playerHand: Card[] = [];
    const dealerHand: Card[] = [];

    for (let i = 0; i < 2; i++) {
      const card = gameState.deck.pop();
      if (card) playerHand.push(card);
    }

    const dealerCard = gameState.deck.pop();
    if (dealerCard) dealerHand.push(dealerCard);

    if (playerHand.length === 2 && dealerHand.length === 1) {
      gameState = {
        deck: gameState.deck,
        playerHand,
        dealerHand,
        gameStatus: 'playing'
      };
      res.json(gameState);
    } else {
      res.status(500).json({ message: 'Not enough cards to start a new game' });
    }
  }
});


router.get('/initial-state', (req: Request, res: Response) => {
  if (gameState.deck.length === 0) {
    startNewSession();
  }
  res.json(gameState);
});

router.post('/new-session', (req: Request, res: Response) => {
  startNewSession();
  res.json(gameState);
});

const calculateGameOutcome = (): string => { 
  const playerTotal = calculateHandValue(gameState.playerHand);
  const dealerTotal = calculateHandValue(gameState.dealerHand);
  if (playerTotal == BLACKJACK_CONST)
  {
    return 'player';
  }
  if (playerTotal > BLACKJACK_CONST) {
    return 'Dealer';
  } else if (dealerTotal > BLACKJACK_CONST) {
    return 'Player';
  } else if (playerTotal === dealerTotal) {
    return 'Tie';
  } else if (playerTotal > dealerTotal) {
    return 'Player';
  } else {
    return 'Dealer';
  }
};

export default router;
