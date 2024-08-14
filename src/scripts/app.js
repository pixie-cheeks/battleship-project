import Player from './player.js';
import Ship from './ships.js';
import ManageDOM from './manage-dom.js';

const coords = [
  [0, 0],
  [5, 0],
  [3, 0],
  [9, 0],
  [8, 0],
];
const player = new Player();
const computer = new Player(true);
const players = [player, computer];
coords.forEach((coord, i) => {
  players.forEach((player) =>
    player.getBoard().placeShip({
      coordinate: coord,
      ship: new Ship(i + 1),
      isVertical: true,
    }),
  );
});

const domManager = new ManageDOM(player, computer);
