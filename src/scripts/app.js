import Player from './player.js';
import Ship from './ships.js';
import ManageDOM from './manage-dom.js';

const turnPlate = document.querySelector('.turn-plate');
const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const resetGame = () => {
  document
    .querySelectorAll('.gameboard')
    .forEach((board) => board.replaceWith(board.cloneNode(true)));
  turnPlate.textContent = '';
};

const generateShipCoordinates = (shipLength, isVertical) => {
  const startPoint = [getRandomInt(0, 9), getRandomInt(0, 9)];
  const coordinates = [];

  const incrIndex = isVertical ? 1 : 0;
  function getFinalAxis([x, y], yAxis, length) {
    if (yAxis) return y + length - 1;
    return x + length - 1;
  }
  while (getFinalAxis(startPoint, isVertical, shipLength) > 9) {
    startPoint[incrIndex] = getRandomInt(0, 9);
  }
  let incrementAxis;
  let [x, y] = startPoint;

  if (isVertical) {
    incrementAxis = () => {
      y += 1;
    };
  } else {
    incrementAxis = () => {
      x += 1;
    };
  }

  for (let i = 0; i < shipLength; i++) {
    coordinates.push([x, y]);
    incrementAxis();
  }

  return coordinates;
};

const getRandomStartPoints = (shipsData) => {
  const isPlaced = new Array(10)
    .fill(null)
    .map(() => new Array(10).fill(false));
  const coords = [];
  shipsData.forEach(({ length, isVertical }) => {
    let shipCoords = generateShipCoordinates(length, isVertical);
    while (shipCoords.some(([x, y]) => isPlaced[x][y])) {
      shipCoords = generateShipCoordinates(length, isVertical);
    }

    shipCoords.forEach(([x, y]) => {
      isPlaced[x][y] = true;
    });
    coords.push(shipCoords[0]);
  });

  return coords;
};

const getRandomPlayer = (isComputer = false) => {
  const arrayTemplate = [1, 2, 3, 4, 5];
  const ships = arrayTemplate.map((length) => new Ship(length));
  const isVerticalArr = arrayTemplate.map(() => Boolean(getRandomInt(0, 1)));
  const shipsData = arrayTemplate.map((length, index) => ({
    length,
    isVertical: isVerticalArr[index],
  }));
  const startPoints = getRandomStartPoints(shipsData);

  const player = new Player(isComputer);

  ships.forEach((ship, index) => {
    player.getBoard().placeShip({
      coordinate: startPoints[index],
      ship,
      isVertical: isVerticalArr[index],
    });
  });

  return player;
};

const enemyBoard = document.querySelector('.js-opponent-board').parentElement;
const placementControls = document.querySelector('.controls__placement');
const randomizeButton = document.querySelector('.placement__randomize');
const confirmButton = document.querySelector('.placement__confirm');
const resetButton = document.querySelector('.reset-game');

const initializeGame = () => {
  resetGame();
  turnPlate.style.display = 'none';
  enemyBoard.style.display = 'none';
  resetButton.style.display = 'none';
  placementControls.style.display = '';
  return new ManageDOM(getRandomPlayer(), getRandomPlayer(true));
};

initializeGame();

randomizeButton.addEventListener('click', () => {
  resetGame();
  initializeGame();
});
confirmButton.addEventListener('click', () => {
  enemyBoard.style.display = '';
  turnPlate.style.display = '';
  placementControls.style.display = 'none';
  resetButton.style.display = '';
});

resetButton.addEventListener('click', () => initializeGame());
