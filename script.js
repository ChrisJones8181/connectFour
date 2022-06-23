'use strict';

// Selecting elements
const btnInfo = document.querySelector('.btn-info');
const infoPanel = document.querySelector('.info-panel');
const btnCloseInfo = document.querySelector('.btn-close-info');
const drawPanel = document.querySelector('.draw-panel');
const btnCloseDraw = document.querySelector('.btn-close-draw');
const overlay = document.querySelector('.overlay');
const btnNew = document.querySelector('.btn-new');
const singlePlayer = document.getElementById('single');
const twoPlayer = document.getElementById('two');
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
let playBot = true;

// Listen for which column is clicked
colArr.forEach(function (element) {
  element.addEventListener('click', function () {
    const colClick = +element.className.slice(-1); // Return column number
    if (gameGrid[0][colClick] === 0) {
      // Check there is at least one space in the column
      if (gameActive === true) {
        addCounter(colClick);
        checkWin();
        switchPlayer();

        // Get bot to place a counter if it's turned on
        if (playBot === true && gameActive === true) {
          setTimeout(function () {
            botAction();
            checkWin();
            switchPlayer();
          }, 1000);
        }
      }
    }
  });
});

// Listen for new game
btnNew.addEventListener('click', function () {
  newGame();
});

const botAction = function () {
  let target = 0; // The column to place the counter in
  let actionTaken = false; // Status of this function to allow only one action
  // Check for 3 opisition counters in a row horizontally and block a fourth
  for (let i = 0; i < gameGrid.length; i++) {
    for (let j = 0; j < 7; j++) {
      // Check there are 3 opposition counters in a row
      if (
        gameGrid[i][j] === 1 &&
        gameGrid[i][j + 1] === 1 &&
        gameGrid[i][j + 2] === 1
      ) {
        // Add a counter to the right if there is space in the grid
        if (gameGrid[i][j + 3] === 0 && j <= 3) {
          target = j + 3;
          actionTaken = true;
          addCounter(target);
          break;
        }
        // Add a counter to the left if there is no space to the right
        if (gameGrid[i][j - 1] === 0) {
          target = j - 1;
          actionTaken = true;
          addCounter(target);
          break;
        }
      }
    }
  }

  // Check for 3 opisition counters in a row vertically and block a fourth
  if (actionTaken === false) {
    for (let col = 0; col < gameGrid[1].length; col++) {
      for (let row = 5; row > 2; row--) {
        if (
          gameGrid[row][col] === 1 &&
          gameGrid[row - 1][col] === 1 &&
          gameGrid[row - 2][col] === 1 &&
          gameGrid[row - 3][col] === 0
        ) {
          target = col;
          actionTaken = true;
          addCounter(target);
          break;
        }
      }
    }
  }

  // Check for 3 opposition counters in a row diagonally from left to right and block a fourth
  if (actionTaken === false) {
    for (let col = 0; col < 4; col++) {
      for (let row = 5; row > 2; row--) {
        if (
          gameGrid[row][col] === 1 &&
          gameGrid[row - 1][col + 1] === 1 &&
          gameGrid[row - 2][col + 2] === 1 &&
          gameGrid[row - 3][col + 3] === 0 &&
          gameGrid[row - 2][col + 3] !== 0
        ) {
          target = col + 3;
          actionTaken = true;
          addCounter(target);
          break;
        }
      }
    }
  }

  // Check for 3 opposition counters in a row diagonally from right to left and block a fourth
  if (actionTaken === false) {
    for (let col = 6; col > 2; col--) {
      for (let row = 5; row > 2; row--) {
        if (
          gameGrid[row][col] === 1 &&
          gameGrid[row - 1][col - 1] === 1 &&
          gameGrid[row - 2][col - 2] === 1 &&
          gameGrid[row - 3][col - 3] === 0 &&
          gameGrid[row - 2][col - 3] !== 0
        ) {
          target = col - 3;
          actionTaken = true;
          addCounter(target);
          break;
        }
      }
    }
  }

  // Check for 3 bot counters in a row vertically and add a fourth
  if (actionTaken === false) {
    for (let col = 0; col < gameGrid[1].length; col++) {
      for (let row = 5; row > 2; row--) {
        if (
          gameGrid[row][col] === 2 &&
          gameGrid[row - 1][col] === 2 &&
          gameGrid[row - 2][col] === 2 &&
          gameGrid[row - 3][col] === 0
        ) {
          target = col;
          actionTaken = true;
          addCounter(target);
          break;
        }
      }
    }
  }

  // Check for 3 bot counters in a row horizontally and add a fourth
  if (actionTaken === false) {
    for (let i = 0; i < gameGrid.length; i++) {
      for (let j = 0; j < 7; j++) {
        // Check there are 3 opposition counters in a row
        if (
          gameGrid[i][j] === 2 &&
          gameGrid[i][j + 1] === 2 &&
          gameGrid[i][j + 2] === 2
        ) {
          // Add a counter to the right if there is space in the grid
          if (gameGrid[i][j + 3] === 0 && j <= 3) {
            target = j + 3;
            actionTaken = true;
            addCounter(target);
            break;
          }
          // Add a counter to the left if there is no space to the right
          if (gameGrid[i][j - 1] === 0) {
            target = j - 1;
            actionTaken = true;
            addCounter(target);
            break;
          }
        }
      }
    }
  }

  // Check for 3 bot counters in a row diagonally from left to right and add a fourth
  if (actionTaken === false) {
    for (let col = 0; col < 4; col++) {
      for (let row = 5; row > 2; row--) {
        if (
          gameGrid[row][col] === 2 &&
          gameGrid[row - 1][col + 1] === 2 &&
          gameGrid[row - 2][col + 2] === 2 &&
          gameGrid[row - 3][col + 3] === 0 &&
          gameGrid[row - 2][col + 3] !== 0
        ) {
          target = col + 3;
          actionTaken = true;
          addCounter(target);
          break;
        }
      }
    }
  }

  // Check for 3 bot counters in a row diagonally from right to left and add a fourth
  if (actionTaken === false) {
    for (let col = 6; col > 2; col--) {
      for (let row = 5; row > 2; row--) {
        if (
          gameGrid[row][col] === 2 &&
          gameGrid[row - 1][col - 1] === 2 &&
          gameGrid[row - 2][col - 2] === 2 &&
          gameGrid[row - 3][col - 3] === 0 &&
          gameGrid[row - 2][col - 3] !== 0
        ) {
          target = col - 3;
          actionTaken = true;
          addCounter(target);
          break;
        }
      }
    }
  }

  // Check for 2 bot counters with a gap between them horizontally and add a counter in the gap
  if (actionTaken === false) {
    for (let i = 0; i < gameGrid.length; i++) {
      for (let j = 0; j < 7; j++) {
        if (
          gameGrid[i][j] === 2 &&
          gameGrid[i][j + 1] === 0 &&
          gameGrid[i][j + 2] === 2
        ) {
          target = j + 1;
          actionTaken = true;
          addCounter(target);
          break;
        }
      }
    }
  }

  // Check for 2 opposition counters with a gap between them horizontally and add a counter in the gap
  if (actionTaken === false) {
    for (let i = 0; i < gameGrid.length; i++) {
      for (let j = 0; j < 7; j++) {
        if (
          gameGrid[i][j] === 1 &&
          gameGrid[i][j + 1] === 0 &&
          gameGrid[i][j + 2] === 1
        ) {
          target = j + 1;
          actionTaken = true;
          addCounter(target);
          break;
        }
      }
    }
  }

  // Place a random counter if no other action taken
  if (actionTaken === false) {
    randAction();
  }
};

// Function for bot to place a random counter
const randAction = function () {
  let target = Math.floor(Math.random() * 7);
  // Check there is space for a counter, if not, end game
  if (!gameGrid[0].includes(0)) {
    gameActive = false;
  }
  if (gameGrid[0][target] === 0) {
    addCounter(target);
  } else if (gameActive === true) {
    randAction();
  }
};

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
  // Check the column isn't already full of counters
  if (gameGrid[0][col] === 0) {
    // Add the player's counter to the correct grid coordinate
    gameGrid[row][col] = activePlayer;

    // Add the counter graphic in UI
    document
      .getElementById(`${col}${row}`)
      .classList.replace('counter_0', `counter_${activePlayer}`);
  }
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

  // Call a draw if the grid is full with no winner
  if (!gameGrid[0].includes(0)) {
    gameActive = false;
    openDraw();
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
  if (playBot === true && activePlayer === 2) {
    setTimeout(function () {
      botAction();
      checkWin();
      switchPlayer();
    }, 1000);
  }
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
overlay.addEventListener('click', function () {
  if (!infoPanel.classList.contains('hidden')) closeInfo();
  if (!drawPanel.classList.contains('hidden')) closeDraw();
}); // Closes for draw

document.addEventListener('keydown', function (e) {
  if (
    (e.key === 'Escape' && !infoPanel.classList.contains('hidden')) ||
    (e.key === 'Escape' && !overlay.classList.contains('hidden'))
  ) {
    closeInfo();
  }
});

// Open and close draw panel
const openDraw = function () {
  setTimeout(function () {
    drawPanel.classList.remove('hidden');
    overlay.classList.remove('hidden');
  }, 500);
};

const closeDraw = function () {
  drawPanel.classList.add('hidden');
  overlay.classList.add('hidden');
  newGame();
};

btnCloseDraw.addEventListener('click', closeDraw);

document.addEventListener('keydown', function (e) {
  if (
    (e.key === 'Escape' && !drawPanel.classList.contains('hidden')) ||
    (e.key === 'Escape' && !overlay.classList.contains('hidden'))
  ) {
    closeDraw();
  }
});

// Settings options
singlePlayer.addEventListener('click', function () {
  playBot = true;
  newGame();
});

twoPlayer.addEventListener('click', function () {
  playBot = false;
  newGame();
});

/////Connect Four app by Chris Jones 2022/////
