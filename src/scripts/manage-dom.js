class ManageDOM {
  #domCells = Array.from(document.querySelectorAll('.gameboard__cell'));
  #domBoards = Array.from(document.querySelectorAll('.gameboard'));
  #turnPlate = document.querySelector('.turn-plate');

  constructor(player1, player2, isPVP) {
    this.isPVP = isPVP;
    this.players = [player1, player2];
    this.activePlayer = player1;
    this.inactivePlayer = player2;

    this.init();
  }

  init() {
    this.#domBoards.forEach((board, index) =>
      this.bindAttackEvent(board, index),
    );

    this.render();
  }

  resetDOM() {
    this.#domCells.forEach((cell) => {
      cell.className = 'gameboard__cell';
    });
  }

  render() {
    this.resetDOM();
    this.#turnPlate.textContent = `${this.activePlayer.posessiveName} turn`;
    const firstGameboardOccupiedCells = this.players[0]
      .getBoard()
      .getPlacedShips();

    firstGameboardOccupiedCells.forEach(([x, y]) => {
      this.#domBoards[0]
        .querySelector(`[data-index="${x}${y}"`)
        .classList.add('gameboard__cell--occupied');
    });

    this.players.forEach((player, i) => {
      const gameboard = player.getBoard();

      gameboard.getHitShots().forEach(([x, y]) => {
        this.#domBoards[i]
          .querySelector(`[data-index="${x}${y}"]`)
          .classList.add('gameboard__cell--hit');
      });
      gameboard.getMissedShots().forEach(([x, y]) => {
        this.#domBoards[i]
          .querySelector(`[data-index="${x}${y}"]`)
          .classList.add('gameboard__cell--miss');
      });
    });
  }

  bindAttackEvent(board, boardIndex) {
    board.addEventListener('click', (e) => {
      const cell = e.target;
      if (!cell.classList.contains('gameboard__cell')) return;

      const coordinate = cell.dataset.index.split('').map((el) => Number(el));
      this.attackBoard(coordinate, this.players[boardIndex]);
    });
  }

  switchActivePlayer() {
    [this.activePlayer, this.inactivePlayer] = [
      this.inactivePlayer,
      this.activePlayer,
    ];
  }

  attackBoard([x, y], player) {
    let wasHit = false;
    if (this.inactivePlayer !== player) return false;
    try {
      wasHit = this.inactivePlayer.getBoard().receiveAttack(x, y);
    } catch (error) {
      return false;
    }

    if (!wasHit) this.switchActivePlayer();
    this.render();
    if (this.inactivePlayer.getBoard().areAllShipsSunk()) return this.endGame();

    if (!this.activePlayer.isComputer) return true;
    setTimeout(() => {
      this.attackBoard(
        this.activePlayer.getAttackedCell(this.inactivePlayer.getBoard()),
        this.inactivePlayer,
      );
    }, 400);

    return true;
  }

  endGame() {
    this.#turnPlate.textContent = `${this.activePlayer.name} won!`;
    this.#domBoards.forEach((board) =>
      board.replaceWith(board.cloneNode(true)),
    );
  }
}

export default ManageDOM;
