import { Component, OnInit } from '@angular/core';
import { ChessTestService } from '../../../services/chess-test.service';
import { ChessMoveStartService } from '../../../services/chess-move-start.service';

@Component({
  selector: 'app-chess',
  templateUrl: './chess.component.html',
  styleUrls: ['./chess.component.scss']
})
export class ChessComponent implements OnInit {

  alphaToPos = {
    'a': '1', 'b': '2', 'c': '3', 'd': '4', 'e': '5', 'f': '6', 'g': '7', 'h': '8'
  };

  posToAlpha = {
    1: 'a', 2: 'b', 3: 'c', 4: 'd', 5: 'e', 6: 'f', 7: 'g', 8: 'h',
  };

  chessPieces = {
    BlackBishop: '../../../../assets/images/chess/BlackBishop.png',
    BlackKing: '../../../../assets/images/chess/BlackKing.png',
    BlackKnight: '../../../../assets/images/chess/BlackKnight.png',
    BlackPawn: '../../../../assets/images/chess/BlackPawn.png',
    BlackQueen: '../../../../assets/images/chess/BlackQueen.png',
    BlackRook: '../../../../assets/images/chess/BlackRook.png',
    WhiteBishop: '../../../../assets/images/chess/WhiteBishop.png',
    WhiteKing: '../../../../assets/images/chess/WhiteKing.png',
    WhiteKnight: '../../../../assets/images/chess/WhiteKnight.png',
    WhitePawn: '../../../../assets/images/chess/WhitePawn.png',
    WhiteQueen: '../../../../assets/images/chess/WhiteQueen.png',
    WhiteRook: '../../../../assets/images/chess/WhiteRook.png'
  };


  initialGame = {
    'a8': 'BlackRook',
    'b8': 'BlackKnight',
    'c8': 'BlackBishop',
    'd8': 'BlackQueen',
    'e8': 'BlackKing',
    'f8': 'BlackBishop',
    'g8': 'BlackKnight',
    'h8': 'BlackRook',
    'a7': 'BlackPawn',
    'b7': 'BlackPawn',
    'c7': 'BlackPawn',
    'd7': 'BlackPawn',
    'e7': 'BlackPawn',
    'f7': 'BlackPawn',
    'g7': 'BlackPawn',
    'h7': 'BlackPawn',

    'a1': 'WhiteRook',
    'b1': 'WhiteKnight',
    'c1': 'WhiteBishop',
    'd1': 'WhiteQueen',
    'e1': 'WhiteKing',
    'f1': 'WhiteBishop',
    'g1': 'WhiteKnight',
    'h1': 'WhiteRook',
    'a2': 'WhitePawn',
    'b2': 'WhitePawn',
    'c2': 'WhitePawn',
    'd2': 'WhitePawn',
    'e2': 'WhitePawn',
    'f2': 'WhitePawn',
    'g2': 'WhitePawn',
    'h2': 'WhitePawn',
  };

  currentGame = {
    players: [{
      name: 'Jucus',
      color: 'white'
    },
    {
      name: 'Feri',
      color: 'black'
    }],
    next: 'white',
    state: { ...this.initialGame },
    moves: []
  };

  squares: any;
  pieces: any;

  highlightNext = {
    moves: [],
    hits: [],
    current: []
  };

  constructor(
    private chessTestService: ChessTestService,
    private chessMoveStartService: ChessMoveStartService
  ) { }

  ngOnInit(): void {
    this.chessTestService.chessBoardStateChanged.subscribe(
      state => {
        // if (state.state.moves[state.state.moves.length - 1] in this.highlightNext.moves
        //   || state.state.moves[state.state.moves.length - 1] in this.highlightNext.hits) {
        this.currentGame = state;
        // }
        this.removeHightlight();
      });

    this.chessTestService.chessPieceNotMoved.subscribe(
      state => {
        this.removeHightlight();
      });


    this.chessMoveStartService.chessPiecePicked.subscribe(
      state => {
        this.removeHightlight();
        this.chessPiecePicked(state);
      }
    );

    this.getSquares();
    this.setPieces();
    this.addEventListeners();
  }

  getSquares() {
    this.squares = Array.from(document.querySelectorAll('.square'));
  }

  setPieces() {
    Object.keys(this.currentGame.state).forEach(position => {
      const where = this.squares.find(square => square.id === position);
      where.innerHTML = '';
      where.innerHTML = `
        <div class="piece ${this.currentGame.state[position]}" data-piece="${this.currentGame.state[position]}" draggable="true" >
          <image class="piece-image" src="${this.chessPieces[this.currentGame.state[position]]}" alt="${this.currentGame.state[position]}">
        </div>
      `;
    });
    this.pieces = Array.from(document.querySelectorAll('.piece'));
  }

  addEventListeners() {
    let draggedPiece: HTMLElement;
    let fromMessage: string;
    let fromId: string;

    let squares = this.squares;
    let pieces = this.pieces;

    let currentGame = { ...this.currentGame };

    const chessTestService = this.chessTestService;
    const chessMoveStartService = this.chessMoveStartService;

    const chessBoard = document.getElementById('chess-board');

    // chessBoard.addEventListener('drop', function (event) {
    //   let hit = '';
    //   let hittedPiece = null;
    //   let squarex = event.target;
    //   console.log(squarex);
    //   //console.log('squarex: ', squarex.parentElement);

    //   if (!squares.some(s => s === squarex)) {
    //     squarex = squarex;
    //   }

    //   let square = squares.find(e => e === event.target) || pieces.find(e => e === event.target);


    //   if (square.children[0]) {
    //     hittedPiece = square.children[0].getAttribute('data-piece');
    //     hit = 'HIT - PIECE: ' + square.children[0].getAttribute('data-piece') + ' ON: ' + square.id;
    //   }

    //   square.innerHTML = '';
    //   square.appendChild(draggedPiece);
    //   //console.log(fromMessage);
    //   //console.log('MOVE - PIECE: ', draggedPiece.getAttribute('data-piece'), ' TO: ', draggedPiece.parentElement.id);
    //   if (hit) { console.log(hit); };

    //   delete currentGame.state[fromId];
    //   currentGame.state[square.id] = draggedPiece.getAttribute('data-piece');

    //   currentGame.next = currentGame.next === 'white' ? 'black' : 'white';
    //   currentGame.moves.push({
    //     from: fromId,
    //     to: square.id,
    //     piece: draggedPiece.getAttribute('data-piece'),
    //     hit: {
    //       piece: hittedPiece
    //     }
    //   })

    //   chessTestService.chessBoardStateChanged.next(currentGame);
    //   //console.log(currentGame);
    // });

    this.pieces.forEach((piece: HTMLElement) => {
      piece.addEventListener('dragstart', function () {

        chessMoveStartService.chessPiecePicked.next({
          piece: piece.getAttribute('data-piece'),
          color: piece.getAttribute('data-piece').toLowerCase().includes('white') ? 'white' : 'black',
          from: piece.parentElement.id,
          state: currentGame
        });

        draggedPiece = piece;
        fromMessage = 'MOVE - PIECE: ' + piece.getAttribute('data-piece') + ' FROM: ' + piece.parentElement.id;
        fromId = piece.parentElement.id;
        setTimeout(function () {
          piece.style.display = 'none';
        }, 0);
      });

      piece.addEventListener('dragend', function () {
        setTimeout(() => {
          piece.style.display = 'block';
          draggedPiece = null;
        }, 0);
      });
    });

    this.squares.forEach((square: HTMLElement) => {
      square.addEventListener('dragover', function (e) {
        e.preventDefault();
      });

      square.addEventListener('dragenter', function (e) {
        e.preventDefault();
      });

      square.addEventListener('dragleave', function () {
      });

      square.addEventListener('drop', function () {
        if (fromId === square.id) {
          chessTestService.chessPieceNotMoved.next(true);
          return;
        }

        let hit = '';
        let hittedPiece = null;
        if (square.children[0]) {
          hittedPiece = square.children[0].getAttribute('data-piece');
          hit = 'HIT - PIECE: ' + square.children[0].getAttribute('data-piece') + ' ON: ' + square.id;
        }
        square.innerHTML = '';
        square.appendChild(draggedPiece);


        if (hit) { console.log(hit); };

        delete currentGame.state[fromId];
        currentGame.state[square.id] = draggedPiece.getAttribute('data-piece');

        currentGame.next = currentGame.next === 'white' ? 'black' : 'white';
        currentGame.moves.push({
          from: fromId,
          to: square.id,
          piece: draggedPiece.getAttribute('data-piece'),
          hit: {
            piece: hittedPiece
          }
        })

        chessTestService.chessBoardStateChanged.next(currentGame);
      }

      );
    });
  }

  chessPiecePicked(state) {
    console.log(state);
    // if (this.currentGame.next === state.color) {
    //   this.highlightSquares(state);
    // }
    this.highlightSquares(state);
  }

  highlightSquares(state) {

    switch (state.piece) {
      case 'WhitePawn':
        this.moveWhitePawn(state); break;
      case 'BlackPawn':
        this.moveBlackPawn(state); break;
      case 'WhiteKnight':
        this.moveKnight(state, 'White'); break;
      case 'BlackKnight':
        this.moveKnight(state, 'Black'); break;
      case 'WhiteKing':
        this.moveKing(state, 'White'); break;
      case 'BlackKing':
        this.moveKing(state, 'Black'); break;
      case 'WhiteRook':
        this.moveRook(state, 'White'); break;
      case 'BlackRook':
        this.moveRook(state, 'Black'); break;
      case 'WhiteBishop':
        this.moveBishop(state, 'White'); break;
      case 'BlackBishop':
        this.moveBishop(state, 'Black'); break;
      case 'WhiteQueen':
        this.moveQueen(state, 'White'); break;
      case 'BlackQueen':
        this.moveQueen(state, 'Black'); break;
    }

    this.highlightNext.current.push(state.from);
    this.highlightNext.current.forEach(e => document.getElementById(e).classList.add('square-current'));

    this.highlightNext.moves.forEach(e => document.getElementById(e).classList.add('square-possible'));
    this.highlightNext.hits.forEach(e => document.getElementById(e).classList.add('square-hit'));
  }

  removeHightlight() {
    this.highlightNext.moves.forEach(e => document.getElementById(e).classList.remove('square-possible'));
    this.highlightNext.hits.forEach(e => document.getElementById(e).classList.remove('square-hit'));
    this.highlightNext.current.forEach(e => document.getElementById(e).classList.remove('square-current'));
    this.highlightNext.moves = [];
    this.highlightNext.hits = [];
    this.highlightNext.current = [];
  }

  left(val) {
    const x = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    if (!val || val === 'a') { return null; }
    return x[x.indexOf(val) - 1];
  }

  right(val) {
    const x = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    if (!val || val === 'h') { return null; }
    return x[x.indexOf(val) + 1];
  }

  up(val) {
    if (!val) { return null; }
    return +val < 8 ? (++val).toString() : null;
  }

  down(val) {
    if (!val) { return null; }
    return +val > 1 ? (--val).toString() : null;
  }

  whatIsOnPosition(pos) {
    return this.currentGame.state[pos] ? this.currentGame.state[pos].slice(0, 5) : null;
  }

  moveWhitePawn(state: any) {
    if (state.from[1] === '2') {
      if (!(state.from[0] + (+state.from[1] + 1).toString() in this.currentGame.state)) {
        this.highlightNext.moves.push(state.from[0] + '3');
        if (!(state.from[0] + (+state.from[1] + 2).toString() in this.currentGame.state)) {
          this.highlightNext.moves.push(state.from[0] + '4');
        }
      }
    }
    if (state.from[1] < '8') {
      if (!(state.from[0] + (+state.from[1] + 1).toString() in this.currentGame.state)) {
        this.highlightNext.moves.push(state.from[0] + (+state.from[1] + 1).toString());
      }
      if (this.left(state.from[0])) {
        if (this.whatIsOnPosition(this.left(state.from[0]) + (+state.from[1] + 1).toString()) === 'Black') {
          this.highlightNext.hits.push(this.left(state.from[0]) + (+state.from[1] + 1).toString());
        }
        console.log(this.whatIsOnPosition(this.left(state.from[0]) + (+state.from[1] + 1).toString()));
      }
      if (this.right(state.from[0])) {
        if (this.whatIsOnPosition(this.right(state.from[0]) + (+state.from[1] + 1).toString()) === 'Black') {
          this.highlightNext.hits.push(this.right(state.from[0]) + (+state.from[1] + 1).toString());
        }
        console.log(this.whatIsOnPosition(this.right(state.from[0]) + (+state.from[1] + 1).toString()));
      }
    }
  }

  moveBlackPawn(state: any) {
    if (state.from[1] === '7') {
      if (!(state.from[0] + (+state.from[1] - 1).toString() in this.currentGame.state)) {
        this.highlightNext.moves.push(state.from[0] + '6');
        if (!(state.from[0] + (+state.from[1] - 2).toString() in this.currentGame.state)) {
          this.highlightNext.moves.push(state.from[0] + '5');
        }
      }
    }
    if (state.from[1] > '1') {
      if (!(state.from[0] + (+state.from[1] - 1).toString() in this.currentGame.state)) {
        this.highlightNext.moves.push(state.from[0] + (+state.from[1] - 1).toString());
      }
      if (this.left(state.from[0])) {
        if (this.whatIsOnPosition(this.left(state.from[0]) + (+state.from[1] - 1).toString()) === 'White') {
          this.highlightNext.hits.push(this.left(state.from[0]) + (+state.from[1] - 1).toString());
        }
        console.log(this.whatIsOnPosition(this.left(state.from[0]) + (+state.from[1] - 1).toString()));
      }
      if (this.right(state.from[0])) {
        if (this.whatIsOnPosition(this.right(state.from[0]) + (+state.from[1] - 1).toString()) === 'White') {
          this.highlightNext.hits.push(this.right(state.from[0]) + (+state.from[1] - 1).toString());
        }
        console.log(this.whatIsOnPosition(this.right(state.from[0]) + (+state.from[1] - 1).toString()));
      }
    }
  }

  moveKnight(state, color) {
    const alpha = state.from[0];
    const number = state.from[1];
    const moves = [
      [this.left(this.left(alpha)), this.up(number)],
      [this.left(this.left(alpha)), this.down(number)],
      [this.right(this.right(alpha)), this.up(number)],
      [this.right(this.right(alpha)), this.down(number)],
      [this.left(alpha), this.up(this.up(number))],
      [this.left(alpha), this.down(this.down(number))],
      [this.right(alpha), this.up(this.up(number))],
      [this.right(alpha), this.down(this.down(number))]
    ];

    moves.forEach(m => {
      if (m[0] && m[1]) {
        if (!((m[0] + m[1]) in this.currentGame.state)) {
          this.highlightNext.moves.push(m[0] + m[1]);
        } else if (this.currentGame.state[m[0] + m[1]].slice(0, 5) !== color) {
          this.highlightNext.hits.push(m[0] + m[1]);
        }
      }
    });
  }

  moveKing(state, color) {
    const alpha = state.from[0];
    const number = state.from[1];
    const moves = [
      [alpha, this.up(number)],
      [alpha, this.down(number)],
      [this.left(alpha), number],
      [this.right(alpha), number],
      [this.left(alpha), this.up(number)],
      [this.right(alpha), this.up(number)],
      [this.left(alpha), this.down(number)],
      [this.right(alpha), this.down(number)]
    ];

    moves.forEach(m => {
      if (m[0] && m[1]) {
        if (!((m[0] + m[1]) in this.currentGame.state)) {
          this.highlightNext.moves.push(m[0] + m[1]);
        } else if (this.currentGame.state[m[0] + m[1]].slice(0, 5) !== color) {
          this.highlightNext.hits.push(m[0] + m[1]);
        }
      }
    });
  }

  moveRook(state, color) {
    let alpha = state.from[0];
    let number = state.from[1];
    const movesLeft = [];
    const movesRight = [];
    const movesUp = [];
    const movesDown = [];

    number = this.up(number);
    while (number) { movesUp.push([alpha, number]); number = this.up(number); }
    number = state.from[1];
    number = this.down(number)
    while (number) { movesDown.push([alpha, number]); number = this.down(number); }
    number = state.from[1];
    alpha = this.left(alpha);
    while (alpha) { movesLeft.push([alpha, number]); alpha = this.left(alpha); }
    alpha = state.from[0];
    alpha = this.right(alpha);
    while (alpha) { movesRight.push([alpha, number]); alpha = this.right(alpha); }

    [movesLeft, movesRight, movesUp, movesDown].filter(e => e.length).forEach(moves => {
      for (let i = 0; i < moves.length; i++) {
        if (moves[i][0] && moves[i][1]) {
          if (!((moves[i][0] + moves[i][1]) in this.currentGame.state)) {
            this.highlightNext.moves.push(moves[i][0] + moves[i][1]);
          } else if (this.currentGame.state[moves[i][0] + moves[i][1]]) {
            if (this.currentGame.state[moves[i][0] + moves[i][1]].slice(0, 5) !== color) {
              this.highlightNext.hits.push(moves[i][0] + moves[i][1]);
            }
            break;
          }
        }
      }
    });
  }

  moveBishop(state, color) {
    let alpha = state.from[0];
    let number = state.from[1];
    const movesUpLeft = [];
    const movesUpRight = [];
    const movesDownLeft = [];
    const movesDownRight = [];

    number = this.up(number);
    alpha = this.left(alpha);
    while (number && alpha) { movesUpLeft.push([alpha, number]); number = this.up(number); alpha = this.left(alpha); }
    alpha = state.from[0];
    number = state.from[1];
    number = this.up(number);
    alpha = this.right(alpha);
    while (number && alpha) { movesUpRight.push([alpha, number]); number = this.up(number); alpha = this.right(alpha); }
    alpha = state.from[0];
    number = state.from[1];
    number = this.down(number);
    alpha = this.left(alpha);
    while (number && alpha) { movesDownLeft.push([alpha, number]); number = this.down(number); alpha = this.left(alpha); }
    alpha = state.from[0];
    number = state.from[1];
    number = this.down(number);
    alpha = this.right(alpha);
    while (number && alpha) { movesDownRight.push([alpha, number]); number = this.down(number); alpha = this.right(alpha); }

    [movesUpLeft, movesUpRight, movesDownLeft, movesDownRight].filter(e => e.length).forEach(moves => {
      for (let i = 0; i < moves.length; i++) {
        if (moves[i][0] && moves[i][1]) {
          if (!((moves[i][0] + moves[i][1]) in this.currentGame.state)) {
            this.highlightNext.moves.push(moves[i][0] + moves[i][1]);
          } else if (this.currentGame.state[moves[i][0] + moves[i][1]]) {
            if (this.currentGame.state[moves[i][0] + moves[i][1]].slice(0, 5) !== color) {
              this.highlightNext.hits.push(moves[i][0] + moves[i][1]);
            }
            break;
          }
        }
      }
    });
  }

  moveQueen(state, color) {
    this.moveRook(state, color);
    this.moveBishop(state, color);
  }

}

