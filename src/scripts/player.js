import Gameboard from './gameboard.js';

class Player {
  #gameboard = new Gameboard();
  #alreadyShot = new Array(10).fill(null).map(() => new Array(10).fill(false));
  #shotCount = 0;

  constructor(isComputer = false, name = null) {
    const defaultName = isComputer ? 'Computer' : 'Player';
    this.name = name || defaultName;
    this.posessiveName =
      this.name.charAt(this.name.length - 1).toLowerCase() === 's'
        ? `${this.name}'`
        : `${this.name}'s`;
    this.isComputer = isComputer;
  }

  getBoard() {
    return this.#gameboard;
  }

  static #getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static #getRandomCoord() {
    return [Player.#getRandomInt(0, 9), Player.#getRandomInt(0, 9)];
  }

  getAttackedCell(opponentBoard) {
    if (this.#shotCount >= 100) return false;
    const [x, y] = Player.#getRandomCoord();

    if (this.#alreadyShot[x][y]) return this.getAttackedCell(opponentBoard);

    this.#alreadyShot[x][y] = true;
    this.#shotCount += 1;
    return [x, y];
  }
}
export default Player;
