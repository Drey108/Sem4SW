const squares = document.querySelectorAll('.square');
const timeLeft = document.querySelector('#time-left');
const score = document.querySelector('#score');

let result = 0;
let hitPosition;
let currentTime = 60;
let timerId = null;
let moleSpeed = 500;

// Function to randomly place the mole
function randomSquare() {
  squares.forEach(square => {
    square.classList.remove('mole');
  });

  let randomSquare = squares[Math.floor(Math.random() * squares.length)];
  randomSquare.classList.add('mole');

  hitPosition = randomSquare.id;
}

// Function to update the background color based on game speed
function updateBackgroundColor() {
  const maxSpeed = 200; // Fastest speed
  const minSpeed = 500; // Slowest speed
  const maxClicks = 30; // Maximum clicks for full transition
  const speedRatio = Math.min(result / maxClicks, 1); // Normalize clicks to a ratio (0 to 1)

  // Define color stops for the gradient
  const startColor = interpolateColor([30, 60, 114], [255, 142, 43], speedRatio * 0.5); // Blue to Orange
  const endColor = interpolateColor([255, 142, 43], [139, 0, 0], speedRatio); // Orange to Dark Red

  // Update CSS variables
  document.body.style.setProperty('--color-start', `rgb(${startColor.join(',')})`);
  document.body.style.setProperty('--color-end', `rgb(${endColor.join(',')})`);
}

// Helper function to interpolate between two colors
function interpolateColor(color1, color2, ratio) {
  return color1.map((channel, index) => {
    return Math.round(channel + (color2[index] - channel) * ratio);
  });
}

// Add event listeners to squares
squares.forEach(square => {
  square.addEventListener('mousedown', () => {
    if (square.id == hitPosition) {
      result++;
      score.textContent = `Score: ${result}`;
      hitPosition = null;
      clearInterval(timerId);
      moleSpeed = Math.max(200, 500 - result * 12); // Increase speed gradually
      timerId = setInterval(randomSquare, moleSpeed);
      updateBackgroundColor(); // Update background color based on speed
    }
  });
});

// Function to start moving the mole
function moveMole() {
  timerId = setInterval(randomSquare, moleSpeed);
}

// Start the game
moveMole();

// Function to count down the timer
function countDown() {
  currentTime--;
  timeLeft.textContent = `Time Left: ${currentTime}`;

  if (currentTime == 0) {
    clearInterval(countDownTimerId);
    clearInterval(timerId);
    alert(`GAME OVER! Your final score is ${result}`);
  }
}

// Start the countdown timer
let countDownTimerId = setInterval(countDown, 1000);