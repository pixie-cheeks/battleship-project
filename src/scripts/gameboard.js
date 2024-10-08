class Gameboard {
  #board = new Array(10).fill(null).map(() => new Array(10).fill(null));
  #alreadyShot = new Array(10).fill(null).map(() => new Array(10).fill(false));
  #missedShots = [];
  #hitShots = [];
  #placedShips = [];
  #totalShips = 0;
  #sunkenShips = 0;

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
    if (x < 0 || y < 0 || x > 9 || y > 9) {
      throw new Error('Coordinate goes out of bounds');
    }
    return this.#board[x][y];
  }

  placeShip({ coordinate, ship, isVertical = false }) {
    const shipParts = Gameboard.#generateCoordinates(
      coordinate,
      ship.getLength(),
      isVertical,
    );

    shipParts.forEach((position) => {
      if (this.getCell(position)) {
        throw new Error("Ships can't overlap");
      }
    });

    shipParts.forEach((position) => this.#setCell(position, ship));
    ship.isVertical = isVertical;
    ship.coordinates = shipParts;
    this.#placedShips.push(...shipParts);
    this.#totalShips += 1;
  }

  receiveAttack(x, y) {
    if (this.#alreadyShot[x][y]) throw new Error('This cell is already shot!');
    this.#alreadyShot[x][y] = true;
    const ship = this.getCell([x, y]);

    if (!ship) {
      this.#missedShots.push([x, y]);
      return false;
    }

    ship.hit();
    this.#hitShots.push([x, y]);
    if (ship.isSunk()) this.#sunkenShips += 1;
    return true;
  }

  deleteShip(coordinate) {
    const ship = this.getCell(coordinate);
    if (!ship) return null;
    ship.coordinates.forEach((partPos) => this.#setCell(partPos, null));
    return ship;
  }

  getMissedShots() {
    return this.#missedShots;
  }

  getHitShots() {
    return this.#hitShots;
  }

  getPlacedShips() {
    return this.#placedShips;
  }

  areAllShipsSunk() {
    return this.#sunkenShips >= this.#totalShips;
  }
}

export default Gameboard;
