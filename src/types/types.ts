export interface Card {
    suit: string;
    value: string;
    imageUrl: string;
  }
  
  export interface GameState {
    deck: Card[];
    playerHand: Card[];
    dealerHand: Card[];
    gameStatus: 'waiting' | 'playing' | 'finished';
  }
  