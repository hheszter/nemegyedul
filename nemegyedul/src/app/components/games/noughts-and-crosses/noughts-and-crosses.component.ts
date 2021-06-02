import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-noughts-and-crosses',
  templateUrl: './noughts-and-crosses.component.html',
  styleUrls: ['./noughts-and-crosses.component.scss']
})
export class NoughtsAndCrossesComponent implements OnInit {

  markss = {
    x: '../../../../assets/images/noughts-and-crosses/x.png',
    o: '../../../../assets/images/noughts-and-crosses/o.png',
  };

  currentGame = {
    players: {
      o: {
        name: 'Ferenc',
        mark: 'o',
        id: '1',
        hasWon: false
      },
      x: {
        name: 'Jucus',
        mark: 'x',
        id: '2',
        hasWon: false
      }
    },
    rules: {
      // length and height
      size: 9,
      // how many marks to win
      length: 5
    },
    next: {
      player: 'o'
    },
    // ' ' -> empty, 'x' -> x, 'o' -> o
    // 2 dimensional array
    state: []
  };

  squares: any;
  board: any;

  constructor() {
    this.initGame();
  }

  ngOnInit(): void {
    this.board = document.getElementById('noughts-board');
    this.board.style.pointerEvents = 'all';
    this.getSquares();
    this.addEventListeners();
  }

  initGame() {
    const grid = new Array(this.currentGame.rules.size)
      .fill(' ')
      .map(row => new Array(this.currentGame.rules.size).fill(' '));
    this.currentGame.state = grid;
  }

  makeMove(game, move, checkWinFun) {
    game.state[--move.x][--move.y] = move.mark;
    game.next.player = game.next.player === 'x' ? 'o' : 'x';
    checkWinFun(game);
  }

  checkWin(game) {

    const xWinPattern = 'x'.repeat(game.rules.length);
    const oWinPattern = 'o'.repeat(game.rules.length);

    console.log(xWinPattern);
    console.log(oWinPattern);

    function calculateDiagonalArray(inputArray, outputArray) {
      for (let i = 0; i < outputArray.length; ++i) {
        outputArray[i] = [];
        if (i < inputArray.length) {
          for (var j = 0; j <= i; ++j) {
            outputArray[i].push(inputArray[i - j][j]);
          }
        }
        else {
          for (let j = inputArray.length - 1; j > i - inputArray.length; --j) {
            outputArray[i].push(inputArray[j][i - j]);
          }
        }
      }
    }

    const rows = game.state.map(e => e.reduce((a, c) => a + c, ''));
    // console.log('ROWS: ', rows);

    const columns = game.state.map((r, i) => r.reduce((a, c, j) => a + game.state[j][i], ''));
    // console.log('COLUMNS: ', columns);

    const primaryDiagonalArray = new Array(2 * game.state.length - 1);
    calculateDiagonalArray(game.state, primaryDiagonalArray);
    const primaryDiagonal = primaryDiagonalArray.map(r => r.reduce((a, c) => a + c, ''));

    // console.log('PRIMARY DIAGONAL: ', primaryDiagonal);


    const grid = JSON.parse(JSON.stringify(game.state));

    function rotateGrid(grid) {
      for (let x = 0; x < grid.length / 2; x++) {
        for (let y = x; y < grid.length - x - 1; y++) {
          let temp = grid[x][y];
          grid[x][y] = grid[y][grid.length - 1 - x];
          grid[y][grid.length - 1 - x] = grid[grid.length - 1 - x][grid.length - 1 - y];
          grid[grid.length - 1 - x][grid.length - 1 - y] = grid[grid.length - 1 - y][x];
          grid[grid.length - 1 - y][x] = temp;
        }
      }
    }

    rotateGrid(grid);
    // console.log('GRID: ', grid);
    const secondaryDiagonalArray = new Array(2 * game.state.length - 1);
    calculateDiagonalArray(grid, secondaryDiagonalArray);
    const secondaryDiagonal = secondaryDiagonalArray.map(r => r.reduce((a, c) => a + c, ''));

    // console.log('SECONDARY DIAGONAL: ', secondaryDiagonal);

    [rows, columns, primaryDiagonal, secondaryDiagonal].forEach(arr => arr.forEach(line => {
      if (line.includes(xWinPattern)) {
        game.players.x.hasWon = true;
        return;
      } else if (line.includes(oWinPattern)) {
        game.players.o.hasWon = true;
        return;
      }
    }));

  }

  getSquares() {
    this.squares = Array.from(document.querySelectorAll('.square'));
  }


  createPiece(squareElement: HTMLEmbedElement, mark: string, markImage) {
    squareElement.innerHTML = '';
    squareElement.innerHTML = `
    <div class="mark mark-${mark}" data-mark="${mark}" draggable="false">
      <image class="mark-image" src="${markImage[mark]}" alt="${mark}">
    </div>
    `;
  }

  addEventListeners() {
    const board = this.board;
    const state = this.currentGame;
    const addMarkFun = this.createPiece;
    const makeMoveFun = this.makeMove;
    const checkWinFun = this.checkWin;
    const markImages = this.markss;

    const message = document.getElementById('message');

    this.board.addEventListener('click', function (event) {
      if (!event.target?.id || !event.target.parentElement?.id || event.target.parentElement.id !== 'noughts-board') {
        return;
      }
      console.log(event.target);
      console.log(state);

      const square = event.target;
      const [x, y] = event.target.id.split('-').map(n => +n);
      const mark = state.next.player;

      console.log('COORDINATES: ', x, y);

      makeMoveFun(state, { x, y, mark }, checkWinFun);
      addMarkFun(square, mark, markImages);

      if (state.players.o.hasWon) {
        board.style.pointerEvents = 'none'
        message.innerText = 'O WON';
      } else if (state.players.x.hasWon) {
        board.style.pointerEvents = 'none'
        message.innerText = 'X WON';
      }

    });
  }
}
