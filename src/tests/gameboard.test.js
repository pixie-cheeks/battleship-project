import Gameboard from '../scripts/gameboard.js';
import Ship from '../scripts/ships.js';

function createShip(length) {
  return new Ship(length);
}

describe('Placing ships', () => {
  let gameboard;

  beforeEach(() => {
    gameboard = new Gameboard();
  });

  test('Should be able to place ships at specific coordinates', () => {
    const coordinate = [5, 5];
    const ship = createShip(1);

    gameboard.placeShip({ coordinate, ship });

    expect(gameboard.getCell(coordinate)).toEqual(ship);
  });

  test('Should place ships in multiple cells if length > 1', () => {
    const ship = createShip(3);
    gameboard.placeShip({ coordinate: [0, 0], ship });

    expect(gameboard.getCell([0, 0])).toEqual(ship);
    expect(gameboard.getCell([1, 0])).toEqual(ship);
    expect(gameboard.getCell([2, 0])).toEqual(ship);
  });

  test('Should work for vertical alignment', () => {
    const ship = createShip(3);
    gameboard.placeShip({
      coordinate: [9, 0],
      ship,
      isVertical: true,
    });

    expect(gameboard.getCell([9, 0])).toEqual(ship);
    expect(gameboard.getCell([9, 1])).toEqual(ship);
    expect(gameboard.getCell([9, 2])).toEqual(ship);
  });

  test("Shouldn't be able to place out of bounds", () => {
    expect(() =>
      gameboard.placeShip({ coordinate: [10, 10], ship: createShip(1) }),
    ).toThrow('Coordinate goes out of bounds');
  });

  test("Ship parts can't go out of bounds either", () => {
    expect(() =>
      gameboard.placeShip({ coordinate: [9, 9], ship: createShip(2) }),
    ).toThrow('Coordinate goes out of bounds');
  });

  test("Ships shouldn't be able to overlap each other", () => {
    gameboard.placeShip({ coordinate: [0, 0], ship: createShip(1) });
    expect(() =>
      gameboard.placeShip({ coordinate: [0, 0], ship: createShip(1) }),
    ).toThrow("Ships can't overlap");
  });

  test("Ships' parts can't overlap either", () => {
    gameboard.placeShip({ coordinate: [0, 1], ship: createShip(3) });
    expect(() =>
      gameboard.placeShip({
        coordinate: [0, 0],
        ship: createShip(3),
        isVertical: true,
      }),
    ).toThrow("Ships can't overlap");
  });
});

describe('receiveAttack method', () => {
  let gameboard;
  beforeEach(() => {
    gameboard = new Gameboard();
  });

  test('Returns false on miss', () => {
    expect(gameboard.receiveAttack(0, 0)).toBe(false);
  });

  test('Returns true on hit', () => {
    gameboard.placeShip({ coordinate: [0, 0], ship: createShip(1) });
    expect(gameboard.receiveAttack(0, 0)).toBe(true);
  });

  const coords = [
    [0, 0],
    [0, 1],
    [5, 5],
    [3, 4],
  ];

  test('Records coordinates on misses', () => {
    coords.forEach(([x, y]) => gameboard.receiveAttack(x, y));
    expect(gameboard.getMissedShots()).toEqual(coords);
  });

  test('Sends the hit function to the correct ship on hits', () => {
    // Same number of ships as coords
    const ships = coords.map(() => createShip(1));

    for (let i = 0; i < ships.length; i++) {
      gameboard.placeShip({ coordinate: coords[i], ship: ships[i] });
    }

    coords.forEach(([x, y]) => gameboard.receiveAttack(x, y));

    expect(ships.every((ship) => ship.getTimesHit() === 1)).toBe(true);
  });

  test('Should be able to report whether or not all ships have sunk', () => {
    const ships = coords.map(() => createShip(1));

    for (let i = 0; i < ships.length; i++) {
      gameboard.placeShip({ coordinate: coords[i], ship: ships[i] });
    }

    expect(gameboard.areAllShipsSunk()).toBe(false);
    coords.forEach(([x, y]) => gameboard.receiveAttack(x, y));
    expect(gameboard.areAllShipsSunk()).toBe(true);
  });

  test('Should throw an error if attacking an attacked cell', () => {
    gameboard.receiveAttack(0, 0);

    expect(() => gameboard.receiveAttack(0, 0)).toThrow(
      'This cell is already shot!',
    );
  });
});

describe('Info for DOM', () => {
  const gameboard = new Gameboard();
  const coords = [
    [0, 0],
    [0, 1],
    [5, 5],
    [3, 4],
  ];

  const ships = coords.map(() => createShip(1));

  test("Get placed ships' coordinates", () => {
    coords.forEach((coordinate, i) =>
      gameboard.placeShip({ coordinate, ship: ships[i] }),
    );

    expect(gameboard.getPlacedShips()).toStrictEqual(coords);
  });

  test('Get coordinates of hit shots', () => {
    coords.forEach((coordinate) => gameboard.receiveAttack(...coordinate));

    expect(gameboard.getHitShots()).toStrictEqual(coords);
  });
});
