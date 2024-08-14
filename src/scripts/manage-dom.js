class ManageDOM {
  #domCells = Array.from(document.querySelectorAll('.gameboard__cell'));
  #domBoards = Array.from(document.querySelectorAll('.gameboard'));

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
    this.players[0]
      .getBoard()
      .getPlacedShips()
      .forEach(([x, y]) => {
        this.#domBoards[0]
          .querySelector(`[data-index="${x}${y}"`)
          .classList.add('gameboard__cell--occupied');
      });

    this.players.forEach((player) => {
      const gameboard = player.getBoard();

      gameboard.getHitShots().forEach(([x, y]) => {
        this.#domBoards
          .querySelector(`[data-index="${x}${y}"]`)
          .classList.add('gameboard__cell--hit');
      });
    });
  }

  bindAttackEvent(board, index) {
    board.addEventListener('click', (e) => {
      const cell = e.target;
      if (!cell.classList.includes('.gameboard__cell')) return;

      const coordinate = cell.dataset.index.split('').map((el) => Number(el));
      this.attackBoard(coordinate, index);
    });
  }

  switchActivePlayer() {
    [this.activePlayer, this.inactivePlayer] = [
      this.inactivePlayer,
      this.activePlayer,
    ];
  }

  attackBoard([x, y], boardIndex) {
    if (this.inactivePlayer !== this.players[boardIndex]) return;
    this.inactivePlayer.getBoard().receiveAttack(x, y);

    this.render();
    this.switchActivePlayer();

    if (!this.activePlayer.isComputer) return;
    this.attackBoard(
      this.activePlayer.getAttackedCell(this.inactivePlayer.getBoard()),
    );
  }
}

export default ManageDOM;
