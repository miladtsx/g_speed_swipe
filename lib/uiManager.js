import { FEEDBACK_DURATION, SWIPE_EFFECT_DURATION } from "./constants.js";

export class UIManager {
  constructor(maxScoreDisplay = 100) {
    this.arrow = document.getElementById('arrow');
    this.scoreContainer = document.getElementById('score-container');
    this.timeBar = document.getElementById('time-bar');
    this.startButton = document.getElementById('start-button');
    this.gestureArea = document.getElementById('gesture-area');
    this.maxScoreDisplay = maxScoreDisplay;
    this.initializeDarkModeToggle();
  }

  updateScore(score) {
    const percentage = (score / this.maxScoreDisplay) * 360;
    this.scoreContainer.innerHTML = `
      <div class="score-circle" style="background: conic-gradient(#4CAF50 ${percentage}deg, #ddd 0deg)"></div>
      <div class="score-text">${score}</div>
    `;
  }

  updateTimeBar(percentage) {
    const timeBarFill = document.getElementById('time-bar-fill');
    timeBarFill.style.width = `${percentage}%`;
  }

  showFeedback(isCorrect) {
    this.arrow.classList.add(isCorrect ? 'correct' : 'incorrect');
    setTimeout(() => {
      this.arrow.classList.remove('correct', 'incorrect');
    }, FEEDBACK_DURATION);
  }

  showSwipeEffect() {
    this.gestureArea.classList.add('active');
    clearTimeout(this.swipeEffectTimeout);
    this.swipeEffectTimeout = setTimeout(() => {
      this.gestureArea.classList.remove('active');
    }, SWIPE_EFFECT_DURATION);
  }

  showGameOver(score) {
    this.startButton.style.display = 'block';
    this.startButton.textContent = `Game Over! Score: ${score}. Play Again?`;
  }

  setArrow(arrowText) {
    this.arrow.textContent = arrowText;
  }

  hideStartButton() {
    const startButton = document.getElementById('start-button'); // Adjust the selector as needed
    if (startButton) {
      startButton.style.display = 'none';
    }
  }

  initializeDarkModeToggle() {
    const toggle = document.getElementById('toggle-dark-mode');
    if (toggle) {
      // Load saved theme preference
      const isDarkMode = localStorage.getItem('darkMode') === 'true';
      toggle.checked = isDarkMode;
      document.body.classList.toggle('dark-mode', isDarkMode);

      toggle.addEventListener('change', () => {
        const darkModeEnabled = toggle.checked;
        document.body.classList.toggle('dark-mode', darkModeEnabled);
        localStorage.setItem('darkMode', darkModeEnabled);
      });
    }
  }
}
