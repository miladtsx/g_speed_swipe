import { GAME_DURATION, ARROWS, KEYS } from './constants.js';

export class GameLogic {
  constructor() {
    this.score = 0;
    this.timeLeft = GAME_DURATION;
    this.currentArrow = null;
    this.previousArrow = null;
  }

  startGame() {
    this.score = 0;
    this.timeLeft = GAME_DURATION;
    this.showNextArrow();
  }

  handleInput(input) {
    if (input === KEYS[this.currentArrow]) {
      this.score++;
      return true;
    }
    return false;
  }

  showNextArrow() {
    do {
      this.currentArrow = Math.floor(Math.random() * 4);
    } while (this.currentArrow === this.previousArrow);
    this.previousArrow = this.currentArrow;
    return ARROWS[this.currentArrow];
  }

  updateTime() {
    this.timeLeft--;
  }

  isGameOver() {
    return this.timeLeft <= 0;
  }

  getTimePercentage() {
    return (this.timeLeft / GAME_DURATION) * 100;
  }
}
