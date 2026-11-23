import { Board } from './board';

export class Game {
  constructor(board, scoreboard) {
    this.board = board;
    this.scoreboard = scoreboard;
    this.hits = 0;
    this.misses = 0;
    this.timer = null;
    this.handleClick = this.handleClick.bind(this);
  }

  start() {
    if (this.timer !== null || this.misses >= 5) {
      return;
    }
    this.updateScore();
    this.board.showGoblin();
    this.board.element.addEventListener('click', this.handleClick);
    this.timer = setInterval(() => this.nextTurn(), 1000);
  }

  handleClick(event) {
    if (this.timer === null || !this.board.isHit(event.target)) {
      return;
    }
    this.hits++;
    this.board.hideGoblin();
    this.updateScore();
  }

  nextTurn() {
    if (this.board.isVisible()) {
      this.misses++;
      this.updateScore();
    }
    if (this.misses >= 5) {
      this.stop();
      this.scoreboard.querySelector('#status').textContent = 'Игра окончена: 5 промахов.';
      return;
    }
    this.board.showGoblin();
  }

  updateScore() {
    this.scoreboard.querySelector('#hits').textContent = this.hits;
    this.scoreboard.querySelector('#misses').textContent = this.misses;
  }

  stop() {
    clearInterval(this.timer);
    this.timer = null;
    this.board.hideGoblin();
    this.board.element.removeEventListener('click', this.handleClick);
  }
}

export function startGame(element, imageUrl, scoreboard) {
  const board = new Board(element, imageUrl);
  const game = new Game(board, scoreboard);
  game.start();
  return game;
}
