import { KEYS, DIRECTIONS } from './constants.js';

export class InputHandler {
  constructor(gameLogic, uiManager) {
    this.gameLogic = gameLogic;
    this.uiManager = uiManager;
  }

  handleInput(input) {
    const isCorrect = this.gameLogic.handleInput(input);
    this.uiManager.showFeedback(isCorrect);
    this.uiManager.updateScore(this.gameLogic.score);
    this.uiManager.setArrow(this.gameLogic.showNextArrow());
  }

  enable() {}
  disable() {}
}

export class KeyboardInputHandler extends InputHandler {
  constructor(gameLogic, uiManager) {
    super(gameLogic, uiManager);
    this.boundHandleKeyPress = this.handleKeyPress.bind(this);
  }

  handleKeyPress(event) {
    if (KEYS.includes(event.key)) {
      this.handleInput(event.key);
    }
  }

  enable() {
    document.addEventListener('keydown', this.boundHandleKeyPress);
  }

  disable() {
    document.removeEventListener('keydown', this.boundHandleKeyPress);
  }
}

export class SwipeInputHandler extends InputHandler {
  constructor(gameLogic, uiManager, gestureArea) {
    super(gameLogic, uiManager);
    this.hammer = new Hammer(gestureArea);
    this.hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
    this.boundHandleSwipe = this.handleSwipe.bind(this);
  }

  handleSwipe(event) {
    let direction;
    switch(event.direction) {
      case Hammer.DIRECTION_UP:
        direction = DIRECTIONS.UP;
        break;
      case Hammer.DIRECTION_RIGHT:
        direction = DIRECTIONS.RIGHT;
        break;
      case Hammer.DIRECTION_DOWN:
        direction = DIRECTIONS.DOWN;
        break;
      case Hammer.DIRECTION_LEFT:
        direction = DIRECTIONS.LEFT;
        break;
    }
    if (direction) {
      this.handleInput(direction);
      this.uiManager.showSwipeEffect(); // Call showSwipeEffect on the uiManager instance
    }
  }

  enable() {
    this.hammer.on('swipe', this.boundHandleSwipe);
  }

  disable() {
    this.hammer.off('swipe', this.boundHandleSwipe);
  }
}
