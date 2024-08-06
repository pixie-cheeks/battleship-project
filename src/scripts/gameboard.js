import Ship from './ships.js';

// Isolating dependency
const createShip = (length) => new Ship(length);

class Gameboard {
  #board = new Array(10).fill(null).map(() => new Array(10).fill(null));

  #setCell([x, y], value) {
    this.#board[x][y] = value;
  }

  static #generateCoordinates(startCoordinate, shipLength, isVertical) {
    const coordinates = [];
    let incrementAxis;
    let [x, y] = startCoordinate;

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
  }

  getCell([x, y]) {
    if (x < 0 || y < 0 || x > 9 || y > 9)
      throw new Error('Coordinate goes out of bounds');
    return this.#board[x][y];
  }

  placeShip({ coordinate, shipLength = 1, isVertical = false }) {
    const shipParts = Gameboard.#generateCoordinates(
      coordinate,
      shipLength,
      isVertical,
    );

    shipParts.forEach((position) => {
      if (this.getCell(position)) throw new Error("Ships can't overlap");
    });

    const ship = createShip(shipLength);
    shipParts.forEach((position) => this.#setCell(position, ship));
  }
}

export default Gameboard;
