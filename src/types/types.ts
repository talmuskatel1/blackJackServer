export type Card = {
  value: string;
  suit: string;
  imageUrl: string;
}

  
  export type GameState = {
    deck: Card[];
    playerHand: Card[];
    dealerHand: Card[];
    gameStatus: 'waiting' | 'playing' | 'finished';
  }
  