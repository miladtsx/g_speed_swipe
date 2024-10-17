import { GameLogic } from './gameLogic.js';
import { UIManager } from './uiManager.js';
import { KeyboardInputHandler, SwipeInputHandler } from './inputHandler.js';

class Game {
  constructor(gameLogic, uiManager, inputHandlers) {
    this.gameLogic = gameLogic;
    this.uiManager = uiManager;
    this.inputHandlers = inputHandlers;
  }

  start() {
    this.gameLogic.startGame();
    this.inputHandlers.forEach(handler => handler.enable());
    this.uiManager.updateScore(this.gameLogic.score);
    this.uiManager.setArrow(this.gameLogic.showNextArrow());
    this.gameInterval = setInterval(() => this.update(), 1000);
    this.uiManager.hideStartButton();
  }

  update() {
    this.gameLogic.updateTime();
    this.uiManager.updateTimeBar(this.gameLogic.getTimePercentage());
    if (this.gameLogic.isGameOver()) {
      this.endGame();
    }
  }

  endGame() {
    clearInterval(this.gameInterval);
    this.inputHandlers.forEach(handler => handler.disable());
    this.uiManager.showGameOver(this.gameLogic.score);
  }
}

// Initialize the game with single instances of GameLogic and UIManager
const gameLogic = new GameLogic();
const uiManager = new UIManager();
const game = new Game(gameLogic, uiManager, [
  new KeyboardInputHandler(gameLogic, uiManager),
  new SwipeInputHandler(gameLogic, uiManager, uiManager.gestureArea)
]);

// Add event listener to start button
document.getElementById('start-button').addEventListener('click', () => game.start());
