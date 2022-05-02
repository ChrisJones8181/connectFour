/////Connect Four app by Chris Jones 2022/////

'use strict';

// Selecting elements
const btnInfo = document.querySelector('.btn-info');
const infoPanel = document.querySelector('.info-panel');
const btnCloseInfo = document.querySelector('.btn-close-info');
const overlay = document.querySelector('.overlay');
const btnNew = document.querySelector('.btn-new');
const player1 = document.querySelector('.player_1');
const player2 = document.querySelector('.player_2');
const column_0 = [...document.querySelectorAll('.column_0')];
const column_1 = [...document.querySelectorAll('.column_1')];
const column_2 = [...document.querySelectorAll('.column_2')];
const column_3 = [...document.querySelectorAll('.column_3')];
const column_4 = [...document.querySelectorAll('.column_4')];
const column_5 = [...document.querySelectorAll('.column_5')];
const column_6 = [...document.querySelectorAll('.column_6')];
const colArr = [
  ...column_0,
  ...column_1,
  ...column_2,
  ...column_3,
  ...column_4,
  ...column_5,
  ...column_6,
];

let gameGrid = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
];

let activePlayer = 1;
let gameActive = true;
let winCoords = [];
let playerScore = [0, 0];

// Listen for which column is clicked
colArr.forEach(function (element) {
  element.addEventListener('click', function () {
    if (gameActive === true) {
      const colClick = +element.className.slice(-1); // Return column number

      addCounter(colClick);
      checkWin();
      switchPlayer();
    }
  });
});

// Listen for new game
btnNew.addEventListener('click', function () {
  newGame();
});

// Add a counter in the game grid
const addCounter = function (col) {
  let row;
  // Check which row doesn't have a counter yet
  for (let i = gameGrid.length - 1; i >= 0; i--) {
    if (gameGrid[i][col] !== 0) {
      continue;
    }
    row = i;
    break;
  }
  if (gameGrid[0][col] === 0) {
    // Check the column isn't already full of counters
    gameGrid[row][col] = activePlayer; // Add the player's counter to the correct grid coordinate
  }
  document
    .getElementById(`${col}${row}`)
    .classList.replace('counter_0', `counter_${activePlayer}`); // Add the counter graphic in UI
};

const switchPlayer = function () {
  activePlayer = activePlayer === 1 ? 2 : 1;
  // Add outline around active player in UI
  if (gameActive === true) toggleOutline();
};

const toggleOutline = function () {
  player1.classList.toggle('outline_1');
  player2.classList.toggle('outline_2');
};

const checkWin = function () {
  // Loop over the game grid to check for 4 counters in a row horizontally
  for (let i = 0; i < gameGrid.length; i++) {
    for (let j = 0; j < 4; j++) {
      if (
        gameGrid[i][j] === activePlayer &&
        gameGrid[i][j + 1] === activePlayer &&
        gameGrid[i][j + 2] === activePlayer &&
        gameGrid[i][j + 3] === activePlayer
      ) {
        gameActive = false;
        winCoords = [
          [j, i],
          [j + 1, i],
          [j + 2, i],
          [j + 3, i],
        ];
        winCounters(winCoords);
        updateScore(activePlayer);
        break;
      }
    }
  }
  // Loop over game grid to check for 4 counters in a row vertically
  if (gameActive === true) {
    for (let col = 0; col < gameGrid[1].length; col++) {
      for (let row = 0; row < 3; row++) {
        if (
          gameGrid[row][col] === activePlayer &&
          gameGrid[row + 1][col] === activePlayer &&
          gameGrid[row + 2][col] === activePlayer &&
          gameGrid[row + 3][col] === activePlayer
        ) {
          gameActive = false;
          winCoords = [
            [col, row],
            [col, row + 1],
            [col, row + 2],
            [col, row + 3],
          ];
          winCounters(winCoords);
          updateScore(activePlayer);
          break;
        }
      }
    }
  }
  // Loop over game grid to check for 4 counters in a row diagonally from left to right
  if (gameActive === true) {
    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 3; row++) {
        if (
          gameGrid[row][col] === activePlayer &&
          gameGrid[row + 1][col + 1] === activePlayer &&
          gameGrid[row + 2][col + 2] === activePlayer &&
          gameGrid[row + 3][col + 3] === activePlayer
        ) {
          gameActive = false;
          winCoords = [
            [col, row],
            [col + 1, row + 1],
            [col + 2, row + 2],
            [col + 3, row + 3],
          ];
          winCounters(winCoords);
          updateScore(activePlayer);
          break;
        }
      }
    }
  }
  // Loop over game grid to check for 4 counters in a row diagonally from right to left
  if (gameActive === true) {
    for (let col = 6; col > 0; col--) {
      for (let row = 0; row < 3; row++) {
        if (
          gameGrid[row][col] === activePlayer &&
          gameGrid[row + 1][col - 1] === activePlayer &&
          gameGrid[row + 2][col - 2] === activePlayer &&
          gameGrid[row + 3][col - 3] === activePlayer
        ) {
          gameActive = false;
          winCoords = [
            [col, row],
            [col - 1, row + 1],
            [col - 2, row + 2],
            [col - 3, row + 3],
          ];
          winCounters(winCoords);
          updateScore(activePlayer);
          break;
        }
      }
    }
  }
};

const winCounters = function (coords) {
  // Highlight the winning 4 counters in the UI
  coords.forEach(function (_, i) {
    document
      .getElementById(`${coords[i][0]}${coords[i][1]}`)
      .classList.add('winning_counter');
  });
};

const updateScore = function (player) {
  playerScore[player - 1] += 1;

  // Update the score in the UI
  document.getElementById(`score_${player}`).textContent =
    playerScore[player - 1];

  // Fade out losing player in UI
  document
    .querySelector(`.player_${player === 1 ? 2 : 1}`)
    .classList.add('fade');
};

const newGame = function () {
  // Loop through the grid to reset the game grid in the UI
  for (let i = 0; i < gameGrid.length; i++) {
    for (let j = 0; j < gameGrid[i].length; j++) {
      if (gameGrid[i][j] !== 0) {
        const el = document.getElementById(`${j}${i}`);
        el.classList.remove('counter_1');
        el.classList.remove('counter_2');
        el.classList.add('counter_0');

        gameGrid[i][j] = 0;
      }
    }
  }
  winCoords.forEach(function (_, i) {
    document
      .getElementById(`${winCoords[i][0]}${winCoords[i][1]}`)
      .classList.remove('winning_counter');
  });
  if (gameActive === false) toggleOutline();
  player1.classList.remove('fade');
  player2.classList.remove('fade');
  gameActive = true;
};

// Open and close the info panel in the UI
const openInfo = function () {
  infoPanel.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeInfo = function () {
  infoPanel.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnInfo.addEventListener('click', openInfo);
btnCloseInfo.addEventListener('click', closeInfo);
overlay.addEventListener('click', closeInfo);

document.addEventListener('keydown', function (e) {
  if (
    (e.key === 'Escape' && !infoPanel.classList.contains('hidden')) ||
    (e.key === 'Escape' && !overlay.classList.contains('hidden'))
  ) {
    closeInfo();
  }
});
