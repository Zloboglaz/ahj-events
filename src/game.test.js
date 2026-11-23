import { startGame } from './game';

let board;
let scoreboard;
let game;

beforeEach(() => {
  jest.useFakeTimers();
  document.body.innerHTML = `
    <div id="board"></div>
    <div id="scoreboard">
      <span id="hits">0</span>
      <span id="misses">0</span>
      <p id="status"></p>
    </div>
  `;
  board = document.querySelector('#board');
  scoreboard = document.querySelector('#scoreboard');
});

afterEach(() => {
  game.stop();
  jest.clearAllTimers();
  jest.useRealTimers();
  jest.restoreAllMocks();
  document.body.innerHTML = '';
});

test('places a single goblin and moves the same node to a different cell', () => {
  jest.spyOn(Math, 'random').mockReturnValue(0);
  game = startGame(board, 'goblin.png', scoreboard);

  expect(board.children).toHaveLength(16);
  const goblin = board.children[0].firstElementChild;
  expect(goblin.tagName).toBe('IMG');

  jest.advanceTimersByTime(1000);
  expect(board.children[1].firstElementChild).toBe(goblin);
  expect(board.children[0].childElementCount).toBe(0);
  expect(board.querySelectorAll('img')).toHaveLength(1);
});

test('keeps the goblin visible for exactly one second before a miss', () => {
  game = startGame(board, 'goblin.png', scoreboard);
  const goblin = board.querySelector('img');
  const cell = goblin.parentElement;

  jest.advanceTimersByTime(999);
  expect(cell.firstElementChild).toBe(goblin);
  expect(scoreboard.querySelector('#misses').textContent).toBe('0');

  jest.advanceTimersByTime(1);
  expect(cell.childElementCount).toBe(0);
  expect(scoreboard.querySelector('#misses').textContent).toBe('1');
});

test('adds one point and hides the goblin after an image click', () => {
  game = startGame(board, 'goblin.png', scoreboard);
  const goblin = board.querySelector('img');

  goblin.click();
  expect(scoreboard.querySelector('#hits').textContent).toBe('1');
  expect(board.querySelector('img')).toBeNull();

  jest.advanceTimersByTime(999);
  expect(board.querySelector('img')).toBeNull();
  jest.advanceTimersByTime(1);
  expect(board.querySelector('img')).toBe(goblin);
  expect(scoreboard.querySelector('#misses').textContent).toBe('0');
});

test('counts a click anywhere in the occupied cell only once', () => {
  game = startGame(board, 'goblin.png', scoreboard);
  const cell = board.querySelector('img').parentElement;

  cell.click();
  cell.click();
  expect(scoreboard.querySelector('#hits').textContent).toBe('1');
  expect(board.querySelector('img')).toBeNull();
});

test('ignores clicks on empty cells and counts a miss only on timeout', () => {
  game = startGame(board, 'goblin.png', scoreboard);
  const emptyCell = [...board.children].find((cell) => !cell.firstElementChild);

  emptyCell.click();
  board.click();
  expect(scoreboard.querySelector('#hits').textContent).toBe('0');
  expect(scoreboard.querySelector('#misses').textContent).toBe('0');
  expect(board.querySelector('img')).not.toBeNull();

  jest.advanceTimersByTime(1000);
  expect(scoreboard.querySelector('#misses').textContent).toBe('1');
});

test('accepts a hit just before the one-second deadline', () => {
  game = startGame(board, 'goblin.png', scoreboard);
  jest.advanceTimersByTime(999);
  board.querySelector('img').click();
  jest.advanceTimersByTime(1);

  expect(scoreboard.querySelector('#hits').textContent).toBe('1');
  expect(scoreboard.querySelector('#misses').textContent).toBe('0');
});

test('finishes on the fifth missed appearance and stops all movement', () => {
  game = startGame(board, 'goblin.png', scoreboard);
  jest.advanceTimersByTime(4000);
  expect(scoreboard.querySelector('#misses').textContent).toBe('4');
  expect(board.querySelector('img')).not.toBeNull();
  expect(scoreboard.querySelector('#status').textContent).toBe('');

  jest.advanceTimersByTime(1000);
  expect(scoreboard.querySelector('#misses').textContent).toBe('5');
  expect(scoreboard.querySelector('#status').textContent).toBe('Игра окончена: 5 промахов.');
  expect(board.querySelector('img')).toBeNull();
  expect(jest.getTimerCount()).toBe(0);

  board.children[0].click();
  jest.advanceTimersByTime(10000);
  expect(scoreboard.querySelector('#hits').textContent).toBe('0');
  expect(scoreboard.querySelector('#misses').textContent).toBe('5');
  expect(board.querySelector('img')).toBeNull();
});

test('counts five misses even when successful hits occur between them', () => {
  game = startGame(board, 'goblin.png', scoreboard);
  jest.advanceTimersByTime(2000);
  board.querySelector('img').click();
  jest.advanceTimersByTime(3000);

  expect(scoreboard.querySelector('#hits').textContent).toBe('1');
  expect(scoreboard.querySelector('#misses').textContent).toBe('4');
  expect(board.querySelector('img')).not.toBeNull();

  jest.advanceTimersByTime(1000);
  expect(scoreboard.querySelector('#misses').textContent).toBe('5');
  expect(board.querySelector('img')).toBeNull();
});

test('does not create extra timers or cells on a repeated start', () => {
  game = startGame(board, 'goblin.png', scoreboard);
  game.start();

  expect(jest.getTimerCount()).toBe(1);
  expect(board.children).toHaveLength(16);
  expect(board.querySelectorAll('img')).toHaveLength(1);
});
