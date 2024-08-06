import Gameboard from '../scripts/gameboard.js';
import Ship from '../scripts/ships.js';

function isShip(cell) {
  return cell instanceof Ship;
}

let gameboard;
describe('Placing ships', () => {
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
