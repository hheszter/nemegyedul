import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user';
import { DatabaseService } from 'src/app/services/database.service';
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
      // width and height of the gameboard
      size: 9,
      // number of identical marks in line to be able to win
      length: 5
    },
    next: {
      player: 'o'
    },
    //states:
    // ' ': empty, 'x': x, 'o': o
    board: new Array(81).fill(' '),
    moves: [],
    users: []
  };

  squares: any;
  board: any;

  constructor(
    private db: DatabaseService,
    private db2: AngularFirestore,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    // Getting the current user
    this.dbSubscription = this.db.loggedInUser.subscribe(
      (user: any) => {
        this.user = user;
        this.userId = this.user.id;
      },
      (err: any) => console.error(err),
      () => this.dbSubscription.unsubscribe()
    );

    // Getting the current games id from params
    this.route.paramMap.subscribe(params => {
      this.gameId = params.get('matchId');
    });

    // Special reference to our game object
    // We subscribe to value changes
    const gameRef: AngularFirestoreDocument = this.db2.doc(`games/${this.gameId}`);
    gameRef.valueChanges().subscribe(game => {
      const newGame = game
      const newBoard = [];
      for (let i = 0; i < 9; i++) {
        // Firestore can't store arrays in arrays, so we store it flat
        // we need to make a mattrix from the array
        newBoard.push(newGame.board.slice(i * 9, i * 9 + 9))
      }
      newGame.board = newBoard;

      // We don't want to change the memory address of aur game(state) object
      this.currentGame.game = newGame.game;
      this.currentGame.players = newGame.players;
      this.currentGame.rules = newGame.rules;
      this.currentGame.next = newGame.next;
      this.currentGame.board = newGame.board;
      this.currentGame.moves = newGame.moves;
      this.currentGame.users = newGame.users;

      // if we do have previous moves
      if (!!this.currentGame.moves.length) {
        this.currentGame.moves.forEach(m => this.makeOtherPlayerMove(this.currentGame, m));
      }
    });

    this.board = document.getElementById('noughts-board');
    this.board.style.pointerEvents = 'all';
    this.initGame();
    this.getSquares();
    this.addEventListeners();
  }

  // Updateing the game state document
  updateFirestore(game, db, id) {
    // Firestore can't handle matrixes, we store the values in a simple array
    game.board = game.board.flat();
    db.collection('games').doc(id).update(game);
  }

  initGame() {
    const grid = new Array(9)
      .fill(' ')
      .map(() => new Array(9).fill(' '));
    this.currentGame.board = grid;

  }

  // The other players move need to be "done"
  // We use this function to rebuild the board, when we come back to our unfinished game
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

  // Making our move on the board
  makeMove(game: any, move: any, checkWinFun: any, updateFirestoreFun: any, db: any, id: string) {

    // cheking if our board is flat, if so we need to make a  matrix from it
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

  // Checking whether one of the players have won
  checkWin(game) {

    // on this level we support differrent rules
    // currently not using this capability
    const xWinPattern = 'x'.repeat(game.rules.length);
    const oWinPattern = 'o'.repeat(game.rules.length);

    // We need to create an array of array of the appropriate diagonal values
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

    // For the primary diagonal we need to calculate the diagonal array
    const primaryDiagonalArray = new Array(2 * game.board.length - 1);
    calculateDiagonalArray(game.board, primaryDiagonalArray);
    const primaryDiagonal = primaryDiagonalArray.map(r => r.reduce((a: any, c: any) => a + c, ''));

    // We create a hard copy of the game board
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

    // We need to rotate the grid in order to use the same diagonal array calculator function to calculate the secondary diagonal list
    rotateGrid(grid);
    const secondaryDiagonalArray = new Array(2 * game.board.length - 1);
    calculateDiagonalArray(grid, secondaryDiagonalArray);
    const secondaryDiagonal = secondaryDiagonalArray.map(r => r.reduce((a, c) => a + c, ''));


    // We check the rows, columns, and diagonals whether one of the players have already won
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

    // We are checking whether free space is available for making movis
    for (let i = 0; i < game.board.length; i++) {
      for (let j = 0; j < game.board[0].length; j++) {
        if (game.board[i][j] === ' ') {
          return;
        }
      }
    }
    // If there's no more square left to make a move, the game has ended, and it is a draw
    game.game.hasEnded = true;
    game.game.isDraw = true;
  }

  getSquares() {
    this.squares = Array.from(document.querySelectorAll('.square'));
  }

  // Creating pieces on the board
  createPiece(squareElement: HTMLElement, mark: string, markImage) {
    squareElement.innerHTML = '';
    squareElement.innerHTML = `
    <div class="mark mark-${mark}" data-mark="${mark}" draggable="false">
      <image class="mark-image" src="${markImage[mark]}" alt="${mark}">
    </div>
    `;
  }

  // Event Listener for the board
  addEventListeners() {
    // We need references to our main players in order to be able to use them in functions called from the handler function
    const board = this.board;
    const state = this.currentGame;

    // Functions we use
    const addMarkFun = this.createPiece;
    const makeMoveFun = this.makeMove;
    const checkWinFun = this.checkWin;
    const updateFirestoreFun = this.updateFirestore;

    // Firestore related references
    const db = this.db2;
    const id = this.gameId;
    const userId = this.userId;

    // the images' paths
    const markImages = this.markss;
    const message = document.getElementById('message');

    // We listen to click event on the whole board
    this.board.addEventListener('click', function (event) {
      // if the click event's target is not appropriate, we do nothing
      if (!event.target?.id || !event.target.parentElement?.id || event.target.parentElement.id !== 'noughts-board') {
        return;
      }

      const square = event.target;
      const [x, y] = event.target.id.split('-').map(n => +n);
      const mark = state.next.player;

      // If we have the right to make a move
      if (state.players[state.next.player].id === userId) {
        // Update the game board state
        makeMoveFun(state, { x, y, mark }, checkWinFun, updateFirestoreFun, db, id);
        // setting the mark on the board too
        addMarkFun(square, mark, markImages);
      }

      // Checking whether after our move the game has ended in one way or another
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
