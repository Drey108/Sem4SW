document.addEventListener('DOMContentLoaded', () => {
  const cardArray = [
    { name: 'red', color: '#e74c3c' },
    { name: 'blue', color: '#3498db' },
    { name: 'green', color: '#2ecc71' },
    { name: 'yellow', color: '#f1c40f' },
    { name: 'purple', color: '#9b59b6' },
    { name: 'orange', color: '#e67e22' },
    { name: 'red', color: '#e74c3c' },
    { name: 'blue', color: '#3498db' },
    { name: 'green', color: '#2ecc71' },
    { name: 'yellow', color: '#f1c40f' },
    { name: 'purple', color: '#9b59b6' },
    { name: 'orange', color: '#e67e22' }
  ];

  cardArray.sort(() => 0.5 - Math.random());

  const grid = document.querySelector('.grid');
  const resultDisplay = document.querySelector('#result');
  const timerDisplay = document.querySelector('#timer'); // Timer display element
  let cardsChosen = [];
  let cardsChosenId = [];
  let cardsWon = [];
  let time = 0; // Timer variable
  let timerInterval = null; // Variable to hold the timer interval

  // Function to start the timer
  function startTimer() {
    timerInterval = setInterval(() => {
      time++;
      timerDisplay.textContent = time;
    }, 1000); // Update every second
  }

  // Function to stop the timer
  function stopTimer() {
    clearInterval(timerInterval);
  }

  function createBoard() {
    for (let i = 0; i < cardArray.length; i++) {
      const card = document.createElement('div');
      card.style.backgroundColor = '#34495e'; // Default card color
      card.setAttribute('data-id', i);
      card.addEventListener('click', flipCard);
      grid.appendChild(card);
    }
    startTimer(); // Start the timer when the board is created
  }

  function checkForMatch() {
    const cards = document.querySelectorAll('.grid div');
    const [optionOneId, optionTwoId] = cardsChosenId;

    if (optionOneId === optionTwoId) {
      cards[optionOneId].style.backgroundColor = '#34495e';
      cards[optionTwoId].style.backgroundColor = '#34495e';
      alert('You clicked the same card!');
    } else if (cardsChosen[0] === cardsChosen[1]) {
      alert('You found a match!');
      cards[optionOneId].style.backgroundColor = '#2c3e50'; // Match color
      cards[optionTwoId].style.backgroundColor = '#2c3e50'; // Match color
      cards[optionOneId].removeEventListener('click', flipCard);
      cards[optionTwoId].removeEventListener('click', flipCard);
      cardsWon.push(cardsChosen);
    } else {
      cards[optionOneId].style.backgroundColor = '#34495e';
      cards[optionTwoId].style.backgroundColor = '#34495e';
      alert('Sorry, try again.');
    }

    cardsChosen = [];
    cardsChosenId = [];
    resultDisplay.textContent = cardsWon.length;

    if (cardsWon.length === cardArray.length / 2) {
      resultDisplay.textContent = "Congratulations! You Are'nt Ghajini!";
      stopTimer(); // Stop the timer when the game is complete
    }
  }

  function flipCard() {
    const cardId = this.getAttribute('data-id');
    cardsChosen.push(cardArray[cardId].name);
    cardsChosenId.push(cardId);
    this.style.backgroundColor = cardArray[cardId].color;
    if (cardsChosen.length === 2) {
      setTimeout(checkForMatch, 500);
    }
  }

  createBoard();
});