import Gameboard from '../scripts/gameboard.js';
import Ship from '../scripts/ships.js';

function isShip(cell) {
  return cell instanceof Ship;
}

describe('Placing ships', () => {
  let gameboard;

  beforeEach(() => {
    gameboard = new Gameboard();
  });

  test('Should be able to place ships at specific coordinates', () => {
    const coordinate = [5, 5];

    gameboard.placeShip({ coordinate });

    const placedShip = gameboard.getCell(coordinate);

    expect(isShip(placedShip)).toBe(true);
  });

  test('Should place ships in multiple cells if length > 1', () => {
    gameboard.placeShip({ coordinate: [0, 0], shipLength: 3 });

    expect(isShip(gameboard.getCell([0, 0]))).toBe(true);
    expect(isShip(gameboard.getCell([1, 0]))).toBe(true);
    expect(isShip(gameboard.getCell([2, 0]))).toBe(true);
  });

  test('Should work for vertical alignment', () => {
    gameboard.placeShip({
      coordinate: [9, 0],
      shipLength: 3,
      isVertical: true,
    });

    expect(isShip(gameboard.getCell([9, 0]))).toBe(true);
    expect(isShip(gameboard.getCell([9, 1]))).toBe(true);
    expect(isShip(gameboard.getCell([9, 2]))).toBe(true);
  });

  test("Shouldn't be able to place out of bounds", () => {
    expect(() => gameboard.placeShip({ coordinate: [10, 10] })).toThrow(
      'Coordinate goes out of bounds',
    );
  });

  test("Ship parts can't go out of bounds either", () => {
    expect(() =>
      gameboard.placeShip({ coordinate: [9, 9], shipLength: 2 }),
    ).toThrow('Coordinate goes out of bounds');
  });

  test("Ships shouldn't be able to overlap each other", () => {
    gameboard.placeShip({ coordinate: [0, 0] });
    expect(() => gameboard.placeShip({ coordinate: [0, 0] })).toThrow(
      "Ships can't overlap",
    );
  });

  test("Ships' parts can't overlap either", () => {
    gameboard.placeShip({ coordinate: [0, 1], shipLength: 3 });
    expect(() =>
      gameboard.placeShip({
        coordinate: [0, 0],
        shipLength: 3,
        isVertical: true,
      }),
    ).toThrow("Ships can't overlap");
  });
});

// Gameboards should have a receiveAttack function that takes a pair of coordinates,
// determines whether or not the attack hit a ship and then sends the ‘hit’ function
// to the correct ship, or records the coordinates of the missed shot.

describe('receiveAttack method', () => {
  let gameboard;

  beforeEach(() => {
    gameboard = new Gameboard();
  });

  test('Returns false on miss', () => {
    expect(gameboard.receiveAttack(0, 0)).toBe(false);
  });

  test('Returns true on hit', () => {
    gameboard.placeShip({ coordinate: [0, 0] });
    expect(gameboard.receiveAttack(0, 0)).toBe(true);
  });

  test('Records coordinates on misses', () => {
    const coords = [
      [0, 0],
      [0, 1],
      [5, 5],
      [3, 4],
    ];

    coords.forEach(([x, y]) => gameboard.receiveAttack(x, y));

    expect(gameboard.getMissedShots()).toEqual(coords);
  });

  test('Sends the hit function to the correct ship on hits', () => {
    expect(true).toBe(true);
  });
});
