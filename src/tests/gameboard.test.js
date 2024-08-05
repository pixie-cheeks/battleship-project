import Gameboard from '../scripts/gameboard.js';

test('Should be able to place ships at specific coordinates', () => {
  const gameboard = new Gameboard();
  gameboard.placeShip({ startCell: [5, 4], shipLength: 3, isVertical: true });

  const placedShip = gameboard.getAt([5, 5]);
  expect(placedShip.constructor.name).toBe('Ship');
  expect(placedShip.getLength()).toBe(3);
});
