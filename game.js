const {
    arrow,
    score: scoreElement,
    time: timeElement,
    'start-button': startButton,
    'gesture-area': gestureArea
} = Object.fromEntries(
    ['arrow', 'score', 'time', 'start-button', 'gesture-area']
        .map(id => [id, document.getElementById(id)])
);

const arrows = ['⬆️', '➡️', '⬇️', '⬅️'];
const keys = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'];

let currentArrow;
let previousArrow;
let score = 0;
let timeLeft = 60;
let gameInterval;
let hammer;
let swipeEffect;
let swipeEffectTimeout;

const GAME_DURATION = 60;
const FEEDBACK_DURATION = 300;
const DIRECTIONS = {
    UP: 'ArrowUp',
    RIGHT: 'ArrowRight',
    DOWN: 'ArrowDown',
    LEFT: 'ArrowLeft'
};

const scoreContainer = document.getElementById('score-container');
const timeBar = document.getElementById('time-bar');

const MAX_SCORE_DISPLAY = 200; // Maximum score for a full circle

function startGame() {
    score = 0;
    timeLeft = GAME_DURATION;
    updateScore();
    startButton.style.display = 'none';
    document.addEventListener('keydown', handleKeyPress);
    
    // Initialize Hammer.js
    hammer = new Hammer(gestureArea);
    hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
    hammer.on('swipe', handleSwipe);
    
    // Initialize swipe effect
    initializeSwipeEffect();
    
    // Create time bar fill
    timeBar.innerHTML = '<div id="time-bar-fill"></div>';
    
    updateTime(); // Move this after creating the time bar fill
    
    gameInterval = setInterval(() => {
        timeLeft--;
        updateTime();
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
    showNextArrow();
}

function showNextArrow() {
    arrow.classList.remove('correct', 'incorrect');
    do {
        currentArrow = Math.floor(Math.random() * 4);
    } while (currentArrow === previousArrow);
    arrow.textContent = arrows[currentArrow];
    previousArrow = currentArrow;
}

function handleKeyPress(event) {
    if (keys.includes(event.key)) {
        handleInput(event.key);
    }
}

function handleSwipe(event) {
    console.log('Swipe detected:', event.direction);
    let direction;
    switch(event.direction) {
        case Hammer.DIRECTION_UP:
            direction = 'ArrowUp';
            break;
        case Hammer.DIRECTION_RIGHT:
            direction = 'ArrowRight';
            break;
        case Hammer.DIRECTION_DOWN:
            direction = 'ArrowDown';
            break;
        case Hammer.DIRECTION_LEFT:
            direction = 'ArrowLeft';
            break;
    }
    if (direction) {
        handleInput(direction);
        showSwipeEffect();
    }
}

function handleInput(input) {
    if (input === keys[currentArrow]) {
        score++;
        updateScore();
        showFeedback(true);
        setTimeout(() => {
            showNextArrow();
        }, 100);
    } else {
        score = Math.max(0, score - 1);
        updateScore();
        showFeedback(false);
    }
}

function showFeedback(isCorrect) {
    if (isCorrect) {
        arrow.classList.add('correct');
        setTimeout(() => {
            arrow.classList.remove('correct');
        }, 100);
    } else {
        arrow.classList.add('incorrect');
        setTimeout(() => {
            arrow.classList.remove('incorrect');
        }, 300);
    }
}

function updateScore() {
    const scoreContainer = document.getElementById('score-container');
    scoreContainer.innerHTML = '';

    const scoreCircle = document.createElement('div');
    scoreCircle.className = 'score-circle';
    
    const scoreText = document.createElement('div');
    scoreText.className = 'score-text';
    scoreText.textContent = score;

    const percentage = Math.min((score / MAX_SCORE_DISPLAY) * 100, 100);
    scoreCircle.style.background = `conic-gradient(#4CAF50 ${percentage}%, #ddd ${percentage}%)`;

    // Add a title attribute for hover tooltip
    scoreCircle.title = `Score: ${score}/${MAX_SCORE_DISPLAY}`;

    scoreContainer.appendChild(scoreCircle);
    scoreContainer.appendChild(scoreText);

    // Update color based on score milestones
    updateScoreColor(percentage);
}

function updateScoreColor(percentage) {
    const scoreCircle = document.querySelector('.score-circle');
    let color = '#4CAF50'; // Default green

    console.log(percentage);
    
    if (percentage >= 100) {
        color = '#FFD700'; // Gold for maximum score
    } else if (percentage >= 75) {
        color = '#FFA500'; // Orange for 75%+
    } else if (percentage >= 50) {
        color = '#2196F3'; // Blue for 50%+
    } else if (percentage >= 25) {
        color = '#9C27B0'; // Purple for 25%+
    }

    scoreCircle.style.background = `conic-gradient(${color} ${percentage}%, #ddd ${percentage}%)`;
}

function updateTime() {
    const percentage = (timeLeft / GAME_DURATION) * 100;
    const timeBarFill = document.getElementById('time-bar-fill');
    if (timeBarFill) {
        timeBarFill.style.width = `${percentage}%`;
    }
}

function endGame() {
    clearInterval(gameInterval);
    document.removeEventListener('keydown', handleKeyPress);
    
    // Remove Hammer.js event listener
    if (hammer) {
        hammer.off('swipe', handleSwipe);
        hammer.destroy();
        hammer = null;
    }
    
    arrow.textContent = '🏁';
    startButton.style.display = 'block';
    startButton.textContent = 'Play Again';
    alert(`Game Over! Your score: ${score}`);
    
    // Clear the time bar
    timeBar.innerHTML = '';
}

startButton.addEventListener('click', startGame);

function initializeSwipeEffect() {
    swipeArea = document.getElementById('gesture-area');
}

function showSwipeEffect() {
    swipeArea.classList.add('active');
    
    // Clear any existing timeout
    if (swipeEffectTimeout) {
        clearTimeout(swipeEffectTimeout);
    }
    
    // Set a timeout to remove the effect
    swipeEffectTimeout = setTimeout(() => {
        swipeArea.classList.remove('active');
    }, 100);
}

// Add this line at the end of the file to ensure the swipe effect is initialized
document.addEventListener('DOMContentLoaded', initializeSwipeEffect);
