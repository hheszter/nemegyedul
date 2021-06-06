import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { UsersService } from 'src/app/services/users.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore'

@Component({
  selector: 'app-noughts-and-crosses',
  templateUrl: './noughts-and-crosses.component.html',
  styleUrls: ['./noughts-and-crosses.component.scss']
})
export class NoughtsAndCrossesComponent implements OnInit {

  user: User;
  userId: string;
  dbSubscription: Subscription;
  gameId: string = ''

  markss = {
    x: '../../../../assets/images/noughts-and-crosses/x.png',
    o: '../../../../assets/images/noughts-and-crosses/o.png',
  };

  currentGame: any = {
    game: {
      created: new Date(),
      game: 'nought',
      name: 'Amőba',
      isDraw: false,
      hasEnded: false,
      imageUrl: '../../../assets/images/nought.jpeg',
    },
    players: {
      o: {
        name: '',
        photo: '',
        mark: 'o',
        id: '',
        hasWon: false
      },
      x: {
        name: '',
        photo: '',
        mark: 'x',
        id: '',
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
    board: new Array(81).fill(' '),
    moves: []
  };

  squares: any;
  board: any;

  constructor(
    private db: DatabaseService,
    private db2: AngularFirestore,
    private auth: AuthService,
    private userService: UsersService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // this.initGame();
  }

  ngOnInit() {
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
      console.log(game);
      const newGame = game
      const newBoard = [];
      for (let i = 0; i < 9; i++) {
        newBoard.push(newGame.board.slice(i * 9, i * 9 + 9))
      }
      console.log('NEW BOARD: ', newBoard);
      newGame.board = newBoard;

      this.currentGame.game = newGame.game;
      this.currentGame.players = newGame.players;
      this.currentGame.rules = newGame.rules;
      this.currentGame.next = newGame.next;
      this.currentGame.board = newGame.board;
      this.currentGame.moves = newGame.moves;
      this.currentGame.users = newGame.users;

      console.log('GAME CHANGE DEETECTED: ', this.currentGame);

      if (!!this.currentGame.moves.length) {
        const lastMove = this.currentGame.moves[this.currentGame.moves.length - 1]
        console.log(lastMove);
        const mark = lastMove[0];
        const x = +lastMove[2];
        const y = +lastMove[4];

        this.currentGame.moves.forEach(m => this.makeOtherPlayerMove(this.currentGame, m));
        // this.makeOtherPlayerMove(this.currentGame, lastMove);
      }
    });

    //this.userId = this.user.id;
    //this.db2.collection('games').doc(matchId).update(this.currentGame);
    // console.log('FIRESTOREGAME: ', this.fireStoreGame);

    this.board = document.getElementById('noughts-board');
    this.board.style.pointerEvents = 'all';
    this.initGame();
    this.getSquares();
    this.addEventListeners();
  }

  updateFirestore(game, db, id) {
    game.board = game.board.flat();
    db.collection('games').doc(id).update(game);
  }

  initGame() {
    const grid = new Array(9)
      .fill(' ')
      .map(() => new Array(9).fill(' '));
    this.currentGame.board = grid;

  }

  makeOtherPlayerMove(game, move) {

    const x = (+move[2] + 1).toString();
    const y = (+move[4] + 1).toString();

    const square = document.getElementById(x + '-' + y);

    if (square.children.length === 0) {
      this.createPiece(square, move[0], this.markss);

      this.checkWin(game);

      const message = document.getElementById('message');

      if (game.players.o.hasWon) {
        this.board.style.pointerEvents = 'none'
        message.innerText = 'O Nyert';
      } else if (game.players.x.hasWon) {
        this.board.style.pointerEvents = 'none'
        message.innerText = 'X Nyert';
      } else if (game.game.isDraw) {
        this.board.style.pointerEvents = 'none'
        message.innerText = 'Döntetlen';
      }
    }
  }

  makeMove(game: any, move: any, checkWinFun: any, updateFirestoreFun: any, db: any, id: string) {
    // console.log('BOARD WHEN MAKING A MOVE: ', game.board);

    if (game.board.length == 81) {
      const newBoard = [];
      for (let i = 0; i < 9; i++) {
        newBoard.push(game.board.slice(i * 9, i * 9 + 9));
      }
      game.board = newBoard;
    }

    game.board[--move.x][--move.y] = move.mark;
    game.moves.push(`${move.mark}:${move.x}-${move.y}`);
    game.next.player = game.next.player === 'x' ? 'o' : 'x';
    checkWinFun(game);
    updateFirestoreFun(game, db, id);
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

    const rows = game.board.map((e: any[]) => e.reduce((a, c) => a + c, ''));
    const columns = game.board.map((r: any[], i: string | number) => r.reduce((a, _, j) => a + game.board[j][i], ''));

    const primaryDiagonalArray = new Array(2 * game.board.length - 1);
    calculateDiagonalArray(game.board, primaryDiagonalArray);
    const primaryDiagonal = primaryDiagonalArray.map(r => r.reduce((a: any, c: any) => a + c, ''));

    const grid = JSON.parse(JSON.stringify(game.board));

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
    const secondaryDiagonalArray = new Array(2 * game.board.length - 1);
    calculateDiagonalArray(grid, secondaryDiagonalArray);
    const secondaryDiagonal = secondaryDiagonalArray.map(r => r.reduce((a, c) => a + c, ''));


    [rows, columns, primaryDiagonal, secondaryDiagonal].forEach(arr => arr.forEach(line => {
      if (line.includes(xWinPattern)) {
        game.players.x.hasWon = true;
        game.game.hasEnded = true;
        return;
      } else if (line.includes(oWinPattern)) {
        game.game.hasEnded = true;
        game.players.o.hasWon = true;
        return;
      }
    }));

    for (let i = 0; i < game.board.length; i++) {
      for (let j = 0; j < game.board[0].length; j++) {
        if (game.board[i][j] === ' ') {
          return;
        }
      }
    }
    // No more square left to be played
    game.game.hasEnded = true;
    game.game.isDraw = true;
  }

  getSquares() {
    this.squares = Array.from(document.querySelectorAll('.square'));
  }

  createPiece(squareElement: HTMLElement, mark: string, markImage) {
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
    const updateFirestoreFun = this.updateFirestore;

    const db = this.db2;
    const id = this.gameId;
    const userId = this.userId;

    const markImages = this.markss;

    const message = document.getElementById('message');

    this.board.addEventListener('click', function (event) {
      if (!event.target?.id || !event.target.parentElement?.id || event.target.parentElement.id !== 'noughts-board') {
        return;
      }

      const square = event.target;
      const [x, y] = event.target.id.split('-').map(n => +n);
      const mark = state.next.player;

      // console.log('STATE BEFORE MAKING A MOVE: ', state.players[state.next.player].id);
      // console.log('STATE BEFORE MAKING A MOVE USERID: ', userId);


      console.log('STATE BEFORE MAKING A MOVE: ', state);

      if (state.players[state.next.player].id === userId) {
        console.log('MAKING THE MOVE');
        makeMoveFun(state, { x, y, mark }, checkWinFun, updateFirestoreFun, db, id);
        addMarkFun(square, mark, markImages);
      }


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
