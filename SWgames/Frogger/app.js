const timeLeftDisplay = document.querySelector('#time-left');
const resultDisplay = document.querySelector('#result');
const startPauseButton = document.querySelector('#start-pause-button');
const squares = document.querySelectorAll('.grid div');
const logsLeft = document.querySelectorAll('.log-left');
const logsRight = document.querySelectorAll('.log-right');
const carsLeft = document.querySelectorAll('.car-left');
const carsRight = document.querySelectorAll('.car-right');

// Audio elements
const bgMusic = new Audio('background.mp3');
const jumpSound = new Audio('jump.mp3');
const collisionSound = new Audio('collision.mp3');
const goalSound = new Audio('goal.mp3');

let currentIndex = 76;
const width = 9;
let timerId;
let outcomeTimerId;
let currentTime = 20;
let isPlaying = false;

// Store initial classes of all squares
const initialClasses = [];
squares.forEach((square, index) => {
    initialClasses[index] = square.className;
});

function playBackgroundMusic() {
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    bgMusic.play();
}

function stopBackgroundMusic() {
    bgMusic.pause();
    bgMusic.currentTime = 0;
}

function moveFrog(e) {
    e.preventDefault();
    squares[currentIndex].classList.remove('frog');

    switch(e.key) {
        case 'ArrowLeft':
            if (currentIndex % width !== 0) currentIndex -= 1;
            break;
        case 'ArrowRight':
            if (currentIndex % width < width - 1) currentIndex += 1;
            break;
        case 'ArrowUp':
            if (currentIndex - width >= 0) currentIndex -= width;
            break;
        case 'ArrowDown':
            if (currentIndex + width < width * width) currentIndex += width;
            break;
    }

    squares[currentIndex].classList.add('frog');
    jumpSound.currentTime = 0;
    jumpSound.play();
}

function autoMoveElements() {
    currentTime--;
    timeLeftDisplay.textContent = currentTime;
    
    if(currentTime <= 5) {
        timeLeftDisplay.style.color = '#E5989B';
        timeLeftDisplay.style.fontWeight = 'bold';
    } else {
        timeLeftDisplay.style.color = '#B5838D';
    }
    
    logsLeft.forEach(logLeft => moveLogLeft(logLeft));
    logsRight.forEach(logRight => moveLogRight(logRight));
    carsLeft.forEach(carLeft => moveCarLeft(carLeft));
    carsRight.forEach(carRight => moveCarRight(carRight));
}

function moveLogLeft(logLeft) {
    switch(true) {
        case logLeft.classList.contains('l1'): logLeft.classList.replace('l1', 'l2'); break;
        case logLeft.classList.contains('l2'): logLeft.classList.replace('l2', 'l3'); break;
        case logLeft.classList.contains('l3'): logLeft.classList.replace('l3', 'l4'); break;
        case logLeft.classList.contains('l4'): logLeft.classList.replace('l4', 'l5'); break;
        case logLeft.classList.contains('l5'): logLeft.classList.replace('l5', 'l1'); break;
    }
}

function moveLogRight(logRight) {
    switch(true) {
        case logRight.classList.contains('l1'): logRight.classList.replace('l1', 'l5'); break;
        case logRight.classList.contains('l2'): logRight.classList.replace('l2', 'l1'); break;
        case logRight.classList.contains('l3'): logRight.classList.replace('l3', 'l2'); break;
        case logRight.classList.contains('l4'): logRight.classList.replace('l4', 'l3'); break;
        case logRight.classList.contains('l5'): logRight.classList.replace('l5', 'l4'); break;
    }
}

function moveCarLeft(carLeft) {
    switch(true) {
        case carLeft.classList.contains('c1'): carLeft.classList.replace('c1', 'c2'); break;
        case carLeft.classList.contains('c2'): carLeft.classList.replace('c2', 'c3'); break;
        case carLeft.classList.contains('c3'): carLeft.classList.replace('c3', 'c1'); break;
    }
}

function moveCarRight(carRight) {
    switch(true) {
        case carRight.classList.contains('c1'): carRight.classList.replace('c1', 'c3'); break;
        case carRight.classList.contains('c2'): carRight.classList.replace('c2', 'c1'); break;
        case carRight.classList.contains('c3'): carRight.classList.replace('c3', 'c2'); break;
    }
}

function checkOutcomes() {
    if (squares[currentIndex].classList.contains('c1') ||
        squares[currentIndex].classList.contains('l4') ||
        squares[currentIndex].classList.contains('l5') ||
        currentTime <= 0) {
        resultDisplay.textContent = 'Game Over! 💔';
        collisionSound.play();
        gameOver();
    } else if (squares[currentIndex].classList.contains('ending-block')) {
        resultDisplay.textContent = 'You Win! 🎉';
        goalSound.play();
        gameOver();
    }
}

function gameOver() {
    stopBackgroundMusic();
    clearInterval(timerId);
    clearInterval(outcomeTimerId);
    document.removeEventListener('keyup', moveFrog);
    isPlaying = false;
    startPauseButton.textContent = 'Play Again';
}

function resetGame() {
    // Reset all squares to their initial classes
    squares.forEach((square, index) => {
        square.className = initialClasses[index];
    });
    
    currentTime = 20;
    timeLeftDisplay.textContent = currentTime;
    resultDisplay.textContent = '';
    currentIndex = 76;
    squares[currentIndex].classList.add('frog');
}

startPauseButton.addEventListener('click', () => {
    if (!isPlaying) {
        resetGame();
        playBackgroundMusic();
        timerId = setInterval(autoMoveElements, 1000);
        outcomeTimerId = setInterval(checkOutcomes, 50);
        document.addEventListener('keyup', moveFrog);
        startPauseButton.textContent = 'Pause Game';
        isPlaying = true;
    } else {
        stopBackgroundMusic();
        clearInterval(timerId);
        clearInterval(outcomeTimerId);
        document.removeEventListener('keyup', moveFrog);
        startPauseButton.textContent = 'Resume Game';
        isPlaying = false;
    }
});