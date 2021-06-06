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
    game: {
      isDraw: false
    },
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
      .map(() => new Array(this.currentGame.rules.size).fill(' '));
    this.currentGame.state = grid;
  }

  makeMove(game: { state: any[][]; next: { player: string; }; }, move: { x: number; y: number; mark: any; }, checkWinFun: (arg0: any) => void) {
    game.state[--move.x][--move.y] = move.mark;
    game.next.player = game.next.player === 'x' ? 'o' : 'x';
    checkWinFun(game);
  }

  checkWin(game) {

    const xWinPattern = 'x'.repeat(game.rules.length);
    const oWinPattern = 'o'.repeat(game.rules.length);

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

    const rows = game.state.map((e: any[]) => e.reduce((a, c) => a + c, ''));
    const columns = game.state.map((r: any[], i: string | number) => r.reduce((a, _, j) => a + game.state[j][i], ''));

    const primaryDiagonalArray = new Array(2 * game.state.length - 1);
    calculateDiagonalArray(game.state, primaryDiagonalArray);
    const primaryDiagonal = primaryDiagonalArray.map(r => r.reduce((a: any, c: any) => a + c, ''));

    const grid = JSON.parse(JSON.stringify(game.state));

    function rotateGrid(grid: string | any[]) {
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
    const secondaryDiagonalArray = new Array(2 * game.state.length - 1);
    calculateDiagonalArray(grid, secondaryDiagonalArray);
    const secondaryDiagonal = secondaryDiagonalArray.map(r => r.reduce((a, c) => a + c, ''));


    [rows, columns, primaryDiagonal, secondaryDiagonal].forEach(arr => arr.forEach(line => {
      if (line.includes(xWinPattern)) {
        game.players.x.hasWon = true;
        return;
      } else if (line.includes(oWinPattern)) {
        game.players.o.hasWon = true;
        return;
      }
    }));

    for (let i = 0; i < game.state.length; i++) {
      for (let j = 0; j < game.state[0].length; j++) {
        if (game.state[i][j] === ' ') {
          return;
        }
      }
    }
    // No more square left to be played
    game.game.isDraw = true;
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

      const square = event.target;
      const [x, y] = event.target.id.split('-').map(n => +n);
      const mark = state.next.player;

      makeMoveFun(state, { x, y, mark }, checkWinFun);
      addMarkFun(square, mark, markImages);

      if (state.players.o.hasWon) {
        board.style.pointerEvents = 'none'
        message.innerText = 'O Nyert';
      } else if (state.players.x.hasWon) {
        board.style.pointerEvents = 'none'
        message.innerText = 'X Nyert';
      } else if (state.game.isDraw) {
        board.style.pointerEvents = 'none'
        message.innerText = 'Döntetlen';
      }
    });
  }
}
