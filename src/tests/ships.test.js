import Ship from '../scripts/ships.js';

let ship;

test('Initializes with the given length', () => {
  ship = new Ship(2);
  expect(ship.getLength()).toBe(2);
});

test('The hit function should increment the number of hits', () => {
  expect(ship.getTimesHit()).toBe(0);
  ship.hit();
  expect(ship.getTimesHit()).toBe(1);
});

test('isSunk should check if the ship is sunk', () => {
  expect(ship.isSunk()).toBe(false);
  ship.hit();
  expect(ship.isSunk()).toBe(true);
});
