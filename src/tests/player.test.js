import Player from '../scripts/player.js';

test('There should be real and computer player types', () => {
  expect(new Player().isComputer).toBe(false);
  expect(new Player(true).isComputer).toBe(true);
});

test('Each Player instance should have its own Gameboard', () => {
  const player1 = new Player();
  const player2 = new Player();

  expect(player1.getBoard() === player2.getBoard()).toBe(false);
});
