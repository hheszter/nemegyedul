import { Component, OnInit } from '@angular/core';
import { ChessTestService } from '../../../services/chess-test.service';
import { ChessMoveStartService } from '../../../services/chess-move-start.service';
import { DatabaseService } from '../../../services/database.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../../model/user';
import { Subscription } from 'rxjs';

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

  colorPieces = {
    black: ['BlackBishop', 'BlackKing', 'BlackKnight', 'BlackPawn', 'BlackQueen', 'BlackRook'],
    white: ['WhiteBishop', 'WhiteKing', 'WhiteKnight', 'WhitePawn', 'WhiteQueen', 'WhiteRook']
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
    game: {
      created: new Date(),
      game: 'chess',
      hasEnded: false,
      imageUrl: '../../../assets/images/chess.jpg',
      isDraw: false,
      name: 'Sakk'
    },
    players: {
      white: {
        name: '',
        id: '',
        color: 'white',
        photo: '',
        inCheck: false,
        hasWon: false
      },
      black: {
        name: '',
        id: '',
        color: 'black',
        photo: '',
        inCheck: false,
        hasWon: false
      }
    },
    next: {
      color: 'white',
      possibleMoves: {}
    },
    state: { ...this.initialGame },
    moves: [],
    users: []
  };

  squares: any;
  pieces: any;

  user: User;
  userId: string;
  dbSubscription: Subscription;
  gameId: string = ''

  highlightNext = {
    moves: [],
    hits: [],
    current: [],
  };

  tempPossibleMoves = {
    moves: [],
    hits: [],
    current: ''
  };

  chessFuncs = {
    calculatePossibleMoves: this.calculatePossibleMoves,
    calcMOve: this.calcMove,
    left: this.left,
    right: this.right,
    up: this.up,
    down: this.down,
    whatIsOnPosition: this.whatIsOnPosition,
    getPawnMoves: this.getPawnMoves,
    getKnightMoves: this.getKnightMoves,
    getKingMoves: this.getKingMoves,
    getRookMoves: this.getRookMoves,
    getBishopMoves: this.getBishopMoves,
    getQueenMoves: this.getQueenMoves
  }

  constructor(
    private db: DatabaseService,
    private db2: AngularFirestore,
    private chessTestService: ChessTestService,
    private chessMoveStartService: ChessMoveStartService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getSquares();

    this.dbSubscription = this.db.loggedInUser.subscribe(
      (user: any) => {
        this.user = user;
        this.userId = this.user.id;
      },
      (err: any) => console.error(err),
      () => this.dbSubscription.unsubscribe()
    );

    this.route.paramMap.subscribe(params => {
      this.gameId = params.get('matchId');
    });

    const gameRef: AngularFirestoreDocument = this.db2.doc(`games/${this.gameId}`);
    gameRef.valueChanges().subscribe(game => {

      this.currentGame.game = game.game;
      this.currentGame.game.hasEnded = true;
      this.currentGame.players = game.players;
      this.currentGame.next = game.next;
      this.currentGame.state = game.state;
      this.currentGame.moves = game.moves;
      this.currentGame.users = game.users;

      this.currentGame.next.possibleMoves = this.calculatePossibleMoves(this.chessFuncs, this.currentGame);

      if (!!this.currentGame.moves.length) {
        const lastMove = this.currentGame.moves[this.currentGame.moves.length - 1]

        this.checkwin(this.currentGame);
        this.makeOtherPlayerMoves(this.currentGame, lastMove);

        const message = document.getElementById('message');

        if (this.currentGame.players.white.hasWon) {
          message.innerText = 'Feh??r Nyert';
          this.disableMouse(this.squares, this.pieces);
        } else if (this.currentGame.players.black.hasWon) {
          message.innerText = 'Fekete Nyert';
          this.disableMouse(this.squares, this.pieces);
        }
      }
    });

    this.chessTestService.chessBoardStateChanged.subscribe(
      state => {

        this.currentGame.game = state.game;
        this.currentGame.players = state.players;
        this.currentGame.next = state.next;
        this.currentGame.state = state.state;
        this.currentGame.moves = state.moves;
        this.currentGame.users = state.users;

        this.currentGame.next.possibleMoves = this.calculatePossibleMoves(this.chessFuncs, state);

      });

    this.chessTestService.chessPieceNotMoved.subscribe(
      state => {
        // Became obsolete
      });


    this.chessMoveStartService.chessPiecePicked.subscribe(
      state => {
        // Became obsolete
      }
    );

    this.setPieces();
    this.addEventListeners();
  }

  disableMouse(squares, pieces) {
    this.squares.forEach(element => {
      element.style.pointerEvents = 'none';
    });
    this.pieces.forEach(element => {
      element.style.pointerEvents = 'none';
    });
  }

  checkIfInitialState() {
    let initialState = true;
    Object.entries(this.initialGame).forEach(p => {
      const square = document.getElementById(p[0]);
      if (square.children[0].getAttribute('data-piece') !== p[1]) {
        initialState = false;
      }
    });
    return initialState;
  }

  checkwin(game) {
    const values = Object.values(game.state);
    if (!values.includes('BlackKing')) {
      game.game.hasEnded = true;
      game.players.white.hasWon = true;
    } else if (!values.includes('WhiteKing')) {
      game.game.hasEnded = true;
      game.players.black.hasWon = true;
    }
  }

  makeOtherPlayerMoves(game, move) {
    const from = move.from;
    const to = move.to;
    const fromSquare = document.getElementById(from);
    const toSquare = document.getElementById(to);
    const piecefrom = fromSquare?.children[0];
    const pieceto = toSquare?.children[0];

    if (!!pieceto && pieceto.getAttribute('data-piece') === move.piece) {
      return;
    }

    if (piecefrom) {
      fromSquare.innerHTML = '';
      toSquare.innerHTML = '';
      toSquare.appendChild(piecefrom);
    }
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

  updateFirestore(game, db, id) {
    db.collection('games').doc(id).update(game);
  }

  addEventListeners() {

    let draggedPiece: HTMLElement;
    let fromMessage: string;
    let fromId: string;

    let squares = this.squares;
    let pieces = this.pieces;

    let currentGame = this.currentGame;

    const chessTestService = this.chessTestService;
    const chessMoveStartService = this.chessMoveStartService;

    const disableMouseFun = this.disableMouse;

    const chessBoard = document.getElementById('chess-board');

    const updateFirestoreFun = this.updateFirestore;

    const db = this.db2;
    const id = this.gameId;
    const userId = this.userId;

    const tempPossibleMoves = this.tempPossibleMoves;

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

        let possibleMoves: any = null;

        if (currentGame.players[currentGame.next.color].id === userId) {
          possibleMoves = currentGame.next.possibleMoves[fromId]?.moves;
        }

        if (possibleMoves) {
          squares.forEach(s => possibleMoves.indexOf(s.id) !== -1 ? s.style.pointerEvents = 'all' : s.style.pointerEvents = 'none');
          squares.find(s => s.id === fromId).style.pointerEvents = 'all';

          tempPossibleMoves.moves = currentGame.next.possibleMoves[fromId]?.moves;
          tempPossibleMoves.hits = currentGame.next.possibleMoves[fromId]?.hits;
          tempPossibleMoves.current = fromId;

          document.getElementById(tempPossibleMoves.current).classList.add('square-current');

          tempPossibleMoves.moves.forEach(m => document.getElementById(m).classList.add('square-possible'));

          tempPossibleMoves.hits.forEach(m => document.getElementById(m).classList.add('square-hit'));
        }
        if (!possibleMoves) {
          squares.forEach(s => s.style.pointerEvents = 'none');
        }
      });

      piece.addEventListener('dragend', function () {
        squares.forEach(s => s.style.pointerEvents = 'all');

        // Ha ugyanarra  amez??re ??rkez??nk vissza
        if (draggedPiece.parentElement.id === piece.parentElement.id) {
          chessTestService.chessPieceNotMoved.next(true);
        }

        if (tempPossibleMoves.current !== '') {
          document.getElementById(tempPossibleMoves.current).classList.remove('square-current');
          tempPossibleMoves.current = '';
        }

        if (tempPossibleMoves.moves.length) {
          tempPossibleMoves.moves.forEach(m => document.getElementById(m).classList.remove('square-possible'));
          tempPossibleMoves.moves = [];
        }

        if (tempPossibleMoves.hits.length) {
          tempPossibleMoves.hits.forEach(m => document.getElementById(m).classList.remove('square-hit'));
          tempPossibleMoves.hits = [];
        }

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

        delete currentGame.state[fromId];
        currentGame.state[square.id] = draggedPiece.getAttribute('data-piece');

        currentGame.next.color = currentGame.next.color === 'white' ? 'black' : 'white';
        currentGame.moves.push({
          from: fromId,
          to: square.id,
          piece: draggedPiece.getAttribute('data-piece'),
          hit: {
            piece: hittedPiece
          }
        })

        const message = document.getElementById('message');

        if (currentGame.players.white.hasWon) {
          message.innerText = 'O Nyert';
          disableMouseFun(squares, pieces);
        } else if (currentGame.players.black.hasWon) {
          message.innerText = 'X Nyert';
          disableMouseFun(squares, pieces);
        }

        chessTestService.chessBoardStateChanged.next(currentGame);
        updateFirestoreFun(currentGame, db, id);
      }

      );
    });
  }

  calculatePossibleMoves(chessFuncs, game) {
    const color = game.next.color;
    //Amikor m??r j??tszunk mindig csak a k??vetkez?? sz??n l??p??seit sz??moljuk ki
    let squares = Object.entries(game.state).filter(e => this.colorPieces[color].includes(e[1].toString()));

    let possibleMoves = squares.map(s => this.calcMove(chessFuncs, game, s[0]));
    const result = possibleMoves.reduce((a, c) => {
      if (c.moves.length > 0 || c.hits.length > 0) {
        a[c.pos] = { moves: c.moves, hits: c.hits };
      }
      return a;
    }, {});

    let movesToFilter = [];

    possibleMoves = possibleMoves.filter(m => m.moves.length > 0);
    possibleMoves.forEach(m => {
      const pos = m.pos;
      const moves = m.moves;
      moves.forEach(single => {

        const testState = JSON.parse(JSON.stringify(game));
        const piece = testState.state[pos];
        delete testState.state[pos];
        testState.state[single] = piece;

        testState.next.color = testState.next.color === 'white' ? 'black' : 'white';

        const clearMoves = Object.entries(testState.state).filter(e => this.colorPieces[testState.next.color].includes(e[1].toString()));
        let notPossibleMoves = clearMoves.map(s => this.calcMove(chessFuncs, testState, s[0])).filter(e => e.hits.length > 0).map(e => e.hits);

        movesToFilter.push(notPossibleMoves);
      });

    });

    const king = game.next.color === 'white' ? 'WhiteKing' : 'BlackKing';
    if (!!Object.entries(game.state).find(e => e[1] === king)) {
      const kingPosition = Object.entries(game.state).find(e => e[1] === king)[0];

      movesToFilter = Array.from(new Set(movesToFilter.filter(m => m.length > 0).reduce((a, c) => [...a, ...c], []).flat())).sort();

      if (movesToFilter.includes(kingPosition)) {
        game.players[game.next.color].inCheck = true;
      } else {
        game.players[game.next.color].inCheck = false;
      }

      if (kingPosition && result[kingPosition]) {
        const positions = (result[kingPosition].moves || []).reduce((a, c) => movesToFilter.includes(c) ? a : [...a, c], []);
        result[kingPosition].moves = positions;
      }
    }

    return result;
  }

  calcMove(chessFuncs, game, pos) {
    const moveCalcFuncs = {
      'BlackBishop': this.getBishopMoves,
      'BlackKing': this.getKingMoves,
      'BlackKnight': this.getKnightMoves,
      'BlackPawn': this.getPawnMoves,
      'BlackQueen': this.getQueenMoves,
      'BlackRook': this.getRookMoves,
      'WhiteBishop': this.getBishopMoves,
      'WhiteKing': this.getKingMoves,
      'WhiteKnight': this.getKnightMoves,
      'WhitePawn': this.getPawnMoves,
      'WhiteQueen': this.getQueenMoves,
      'WhiteRook': this.getRookMoves,
    };

    const value = moveCalcFuncs[game.state[pos]](chessFuncs, game, pos);
    return { pos, moves: value.moves, hits: value.hits };
  }

  left(val: string) {
    const x = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    if (!val || val === 'a') { return null; }
    return x[x.indexOf(val) - 1];
  }

  right(val: string) {
    const x = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    if (!val || val === 'h') { return null; }
    return x[x.indexOf(val) + 1];
  }

  up(val: any) {
    if (!val) { return null; }
    return +val < 8 ? (++val).toString() : null;
  }

  down(val: any) {
    if (!val) { return null; }
    return +val > 1 ? (--val).toString() : null;
  }

  whatIsOnPosition(game, pos) {
    return game.state[pos] ? game.state[pos].slice(0, 5) : null;
  }

  getPawnMoves(chessFuncs, game, pos) {

    const piece = game.state[pos];
    const color = piece.slice(0, 5) === 'Black' ? 'Black' : 'White';

    const moves = [];
    const hits = [];


    if (color === 'White') {
      if (pos[1] === '2') {
        if (!(pos[0] + (+pos[1] + 1).toString() in game.state)) {
          moves.push(pos[0] + '3');
          if (!(pos[0] + (+pos[1] + 2).toString() in game.state)) {
            moves.push(pos[0] + '4');
          }
        }
      }
      if (pos[1] < '8') {
        if (!(pos[0] + (+pos[1] + 1).toString() in game.state)) {
          moves.push(pos[0] + (+pos[1] + 1).toString());
        }
        if (chessFuncs.left(pos[0])) {
          if (chessFuncs.whatIsOnPosition(game, chessFuncs.left(pos[0]) + (+pos[1] + 1).toString()) === 'Black') {
            moves.push(chessFuncs.left(pos[0]) + (+pos[1] + 1).toString());
            hits.push(chessFuncs.left(pos[0]) + (+pos[1] + 1).toString());
          }
        }
        if (chessFuncs.right(pos[0])) {
          if (chessFuncs.whatIsOnPosition(game, chessFuncs.right(pos[0]) + (+pos[1] + 1).toString()) === 'Black') {
            moves.push(chessFuncs.right(pos[0]) + (+pos[1] + 1).toString());
            hits.push(chessFuncs.right(pos[0]) + (+pos[1] + 1).toString());
          }
        }
      }
    }
    if (color === 'Black') {
      if (pos[1] === '7') {
        if (!(pos[0] + (+pos[1] - 1).toString() in game.state)) {
          moves.push(pos[0] + '6');
          if (!(pos[0] + (+pos[1] - 2).toString() in game.state)) {
            moves.push(pos[0] + '5');
          }
        }
      }
      if (pos[1] > '1') {
        if (!(pos[0] + (+pos[1] - 1).toString() in game.state)) {
          moves.push(pos[0] + (+pos[1] - 1).toString());
        }
        if (chessFuncs.left(pos[0])) {
          if (chessFuncs.whatIsOnPosition(game, chessFuncs.left(pos[0]) + (+pos[1] - 1).toString()) === 'White') {
            moves.push(chessFuncs.left(pos[0]) + (+pos[1] - 1).toString());
            hits.push(chessFuncs.left(pos[0]) + (+pos[1] - 1).toString());
          }
        }
        if (chessFuncs.right(pos[0])) {
          if (chessFuncs.whatIsOnPosition(game, chessFuncs.right(pos[0]) + (+pos[1] - 1).toString()) === 'White') {
            moves.push(chessFuncs.right(pos[0]) + (+pos[1] - 1).toString());
            hits.push(chessFuncs.right(pos[0]) + (+pos[1] - 1).toString());
          }
        }

      }
    }

    return ({ moves: [...new Set(moves)], hits, piece });
  }

  getKnightMoves(chessFuncs, game, pos) {
    const piece = game.state[pos];
    const color = piece.slice(0, 5) === 'Black' ? 'Black' : 'White';

    const moves = [];
    const hits = [];

    const alpha = pos[0];
    const number = pos[1];
    const preMoves = [
      [chessFuncs.left(chessFuncs.left(alpha)), chessFuncs.up(number)],
      [chessFuncs.left(chessFuncs.left(alpha)), chessFuncs.down(number)],
      [chessFuncs.right(chessFuncs.right(alpha)), chessFuncs.up(number)],
      [chessFuncs.right(chessFuncs.right(alpha)), chessFuncs.down(number)],
      [chessFuncs.left(alpha), chessFuncs.up(chessFuncs.up(number))],
      [chessFuncs.left(alpha), chessFuncs.down(chessFuncs.down(number))],
      [chessFuncs.right(alpha), chessFuncs.up(chessFuncs.up(number))],
      [chessFuncs.right(alpha), chessFuncs.down(chessFuncs.down(number))]
    ];

    preMoves.forEach(m => {
      if (m[0] && m[1]) {
        if (!((m[0] + m[1]) in game.state)) {
          moves.push(m[0] + m[1]);
        } else if (game.state[m[0] + m[1]].slice(0, 5) !== color) {
          moves.push(m[0] + m[1]);
          hits.push(m[0] + m[1]);
        }
      }
    });

    return ({ moves: [...new Set(moves)], hits, piece });
  }

  getKingMoves(chessFuncs, game, pos) {
    const piece = game.state[pos];
    const color = piece.slice(0, 5) === 'Black' ? 'Black' : 'White';

    const moves = [];
    const hits = [];

    const alpha = pos[0];
    const number = pos[1];

    const preMoves = [
      [alpha, chessFuncs.up(number)],
      [alpha, chessFuncs.down(number)],
      [chessFuncs.left(alpha), number],
      [chessFuncs.right(alpha), number],
      [chessFuncs.left(alpha), chessFuncs.up(number)],
      [chessFuncs.right(alpha), chessFuncs.up(number)],
      [chessFuncs.left(alpha), chessFuncs.down(number)],
      [chessFuncs.right(alpha), chessFuncs.down(number)]
    ];

    preMoves.forEach(m => {
      if (m[0] && m[1]) {
        if (!((m[0] + m[1]) in game.state)) {
          moves.push(m[0] + m[1]);
        } else if (game.state[m[0] + m[1]].slice(0, 5) !== color) {
          moves.push(m[0] + m[1]);
          hits.push(m[0] + m[1]);
        }
      }
    });

    return ({ moves: [...new Set(moves)], hits, piece });
  }

  getRookMoves(chessFuncs, game, pos) {
    const piece = game.state[pos];
    const color = piece.slice(0, 5) === 'Black' ? 'Black' : 'White';

    const moves = [];
    const hits = [];

    let alpha = pos[0];
    let number = pos[1];

    const movesLeft = [];
    const movesRight = [];
    const movesUp = [];
    const movesDown = [];

    number = chessFuncs.up(number);
    while (number) { movesUp.push([alpha, number]); number = chessFuncs.up(number); }
    number = pos[1];
    number = chessFuncs.down(number)
    while (number) { movesDown.push([alpha, number]); number = chessFuncs.down(number); }
    number = pos[1];
    alpha = chessFuncs.left(alpha);
    while (alpha) { movesLeft.push([alpha, number]); alpha = chessFuncs.left(alpha); }
    alpha = pos[0];
    alpha = chessFuncs.right(alpha);
    while (alpha) { movesRight.push([alpha, number]); alpha = chessFuncs.right(alpha); }

    [movesLeft, movesRight, movesUp, movesDown].filter(e => e.length).forEach(m => {
      for (let i = 0; i < m.length; i++) {
        if (m[i][0] && m[i][1]) {
          if (!((m[i][0] + m[i][1]) in game.state)) {
            moves.push(m[i][0] + m[i][1]);
          } else if (game.state[m[i][0] + m[i][1]]) {
            if (game.state[m[i][0] + m[i][1]].slice(0, 5) !== color) {
              moves.push(m[i][0] + m[i][1]);
              hits.push(m[i][0] + m[i][1]);
            }
            break;
          }
        }
      }
    });

    return ({ moves: [...new Set(moves)], hits, piece });
  }


  getBishopMoves(chessFuncs, game, pos) {
    const piece = game.state[pos];
    const color = piece.slice(0, 5) === 'Black' ? 'Black' : 'White';

    const moves = [];
    const hits = [];

    let alpha = pos[0];
    let number = pos[1];

    const movesUpLeft = [];
    const movesUpRight = [];
    const movesDownLeft = [];
    const movesDownRight = [];

    number = chessFuncs.up(number);
    alpha = chessFuncs.left(alpha);
    while (number && alpha) { movesUpLeft.push([alpha, number]); number = chessFuncs.up(number); alpha = chessFuncs.left(alpha); }
    alpha = pos[0];
    number = pos[1];
    number = chessFuncs.up(number);
    alpha = chessFuncs.right(alpha);
    while (number && alpha) { movesUpRight.push([alpha, number]); number = chessFuncs.up(number); alpha = chessFuncs.right(alpha); }
    alpha = pos[0];
    number = pos[1];
    number = chessFuncs.down(number);
    alpha = chessFuncs.left(alpha);
    while (number && alpha) { movesDownLeft.push([alpha, number]); number = chessFuncs.down(number); alpha = chessFuncs.left(alpha); }
    alpha = pos[0];
    number = pos[1];
    number = chessFuncs.down(number);
    alpha = chessFuncs.right(alpha);
    while (number && alpha) { movesDownRight.push([alpha, number]); number = chessFuncs.down(number); alpha = chessFuncs.right(alpha); }

    [movesUpLeft, movesUpRight, movesDownLeft, movesDownRight].filter(e => e.length).forEach(m => {
      for (let i = 0; i < m.length; i++) {
        if (m[i][0] && m[i][1]) {
          if (!((m[i][0] + m[i][1]) in game.state)) {
            moves.push(m[i][0] + m[i][1]);
          } else if (game.state[m[i][0] + m[i][1]]) {
            if (game.state[m[i][0] + m[i][1]].slice(0, 5) !== color) {
              moves.push(m[i][0] + m[i][1]);
              hits.push(m[i][0] + m[i][1]);
            }
            break;
          }
        }
      }
    });

    return ({ moves: [...new Set(moves)], hits, piece });
  }

  getQueenMoves(chessFuncs, game, pos) {
    const piece = game.state[pos];
    const { moves: bishopMoves, hits: bishopHits, piece: bishopPiece } = chessFuncs.getBishopMoves(chessFuncs, game, pos);
    const { moves: rookMoves, hits: rookHits, piece: rookPiece } = chessFuncs.getRookMoves(chessFuncs, game, pos);

    return ({
      moves: [...new Set([...bishopMoves, ...rookMoves])],
      hits: [...new Set([...bishopHits, ...rookHits])],
      piece
    });
  }
}
