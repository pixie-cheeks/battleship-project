import Gameboard from './gameboard.js';

class Player {
  #gameboard = new Gameboard();

  constructor(isComputer = false) {
    this.isComputer = isComputer;
  }

  getBoard() {
    return this.#gameboard;
  }
}
export default Player;
