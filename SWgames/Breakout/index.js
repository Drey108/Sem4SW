const grid = document.querySelector('.grid');
const scoreDisplay = document.querySelector('#score');
const blockWidth = 200;
const blockHeight = 40;
const ballDiameter = 40;
const boardWidth = 1120;
const boardHeight = 600;
let xDirection = -2;
let yDirection = 2;

const userStart = [460, 10];
let currentPosition = userStart;

const ballStart = [540, 50];
let ballCurrentPosition = ballStart;

let timerId;
let score = 0;

// Sounds
const hitSound = new Audio('hit.mp3'); // Sound for ball hit
const breakSound = new Audio('break.mp3'); // Sound for brick destruction

// Function to play sound correctly
function playSound(sound) {
  sound.pause();  // Stop any ongoing sound
  sound.currentTime = 0;  // Reset playback position
  sound.play();  // Play the sound
}

// Block class
class Block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis];
    this.bottomRight = [xAxis + blockWidth, yAxis];
    this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
    this.topLeft = [xAxis, yAxis + blockHeight];
  }
}

// Blocks array
const blocks = [
  new Block(20, 540), new Block(240, 540), new Block(460, 540), new Block(680, 540), new Block(900, 540),
  new Block(20, 480), new Block(240, 480), new Block(460, 480), new Block(680, 480), new Block(900, 480),
  new Block(20, 420), new Block(240, 420), new Block(460, 420), new Block(680, 420), new Block(900, 420),
];
// Draw blocks
function addBlocks() {
  for (let i = 0; i < blocks.length; i++) {
    const block = document.createElement('div');
    block.classList.add('block');
    block.style.left = blocks[i].bottomLeft[0] + 'px';
    block.style.bottom = blocks[i].bottomLeft[1] + 'px';
    grid.appendChild(block);
  }
}
addBlocks();

// Add user
const user = document.createElement('div');
user.classList.add('user');
grid.appendChild(user);
drawUser();

// Add ball
const ball = document.createElement('div');
ball.classList.add('ball');
grid.appendChild(ball);
drawBall();

// Move user
function moveUser(e) {
  switch (e.key) {
    case 'ArrowLeft':
      if (currentPosition[0] > 0) {
        currentPosition[0] -= 10;
        drawUser();
      }
      break;
    case 'ArrowRight':
      if (currentPosition[0] < (boardWidth - blockWidth)) {
        currentPosition[0] += 10;
        drawUser();
      }
      break;
  }
}
document.addEventListener('keydown', moveUser);

// Draw user
function drawUser() {
  user.style.left = currentPosition[0] + 'px';
  user.style.bottom = currentPosition[1] + 'px';
}

// Draw ball
function drawBall() {
  ball.style.left = ballCurrentPosition[0] + 'px';
  ball.style.bottom = ballCurrentPosition[1] + 'px';
}

// Move ball
function moveBall() {
  ballCurrentPosition[0] += xDirection;
  ballCurrentPosition[1] += yDirection;
  drawBall();
  checkForCollisions();
}
timerId = setInterval(moveBall, 10);

// Check for collisions
function checkForCollisions() {
  // Check for block collision
  for (let i = 0; i < blocks.length; i++) {
    if (
      ballCurrentPosition[0] > blocks[i].bottomLeft[0] &&
      ballCurrentPosition[0] < blocks[i].bottomRight[0] &&
      ballCurrentPosition[1] + ballDiameter > blocks[i].bottomLeft[1] &&
      ballCurrentPosition[1] < blocks[i].topLeft[1]
    ) {
      const allBlocks = Array.from(document.querySelectorAll('.block'));
      allBlocks[i].classList.remove('block');
      blocks.splice(i, 1);
      changeDirection();
      score++;
      scoreDisplay.innerHTML = score;
      playSound(breakSound); // Play brick destruction sound

      if (blocks.length === 0) {
        scoreDisplay.innerHTML = 'You Win!';
        clearInterval(timerId);
        document.removeEventListener('keydown', moveUser);
      }
    }
  }

  // Check for wall hits
  if (
    ballCurrentPosition[0] >= (boardWidth - ballDiameter) ||
    ballCurrentPosition[0] <= 0 ||
    ballCurrentPosition[1] >= (boardHeight - ballDiameter)
  ) {
    changeDirection();
    playSound(hitSound); // Play ball hit sound
  }

  // Check for user collision
  if (
    ballCurrentPosition[0] > currentPosition[0] &&
    ballCurrentPosition[0] < currentPosition[0] + blockWidth &&
    ballCurrentPosition[1] > currentPosition[1] &&
    ballCurrentPosition[1] < currentPosition[1] + blockHeight
  ) {
    changeDirection();
    playSound(hitSound); // Play ball hit sound
  }

  // Game over
  if (ballCurrentPosition[1] <= 0) {
    clearInterval(timerId);
    scoreDisplay.innerHTML = 'You lose!';
    document.removeEventListener('keydown', moveUser);
  }
}

// Change ball direction
function changeDirection() {
  if (xDirection === 2 && yDirection === 2) {
    yDirection = -2;
    return;
  }
  if (xDirection === 2 && yDirection === -2) {
    xDirection = -2;
    return;
  }
  if (xDirection === -2 && yDirection === -2) {
    yDirection = 2;
    return;
  }
  if (xDirection === -2 && yDirection === 2) {
    xDirection = 2;
    return;
  }
}
