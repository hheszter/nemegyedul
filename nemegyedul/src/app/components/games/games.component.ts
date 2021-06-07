import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user';
import { DatabaseService } from 'src/app/services/database.service';
import { AngularFirestore } from '@angular/fire/firestore'

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];

  user: User;
  dbSubscription: Subscription;
  newGameForm: FormGroup;
  friendsIds: Array<string>;

  friends: any[] = [];

  gamesArray: any[] = [];
  friendsGamesArray: any[] = [];

  games = [
    {
      name: 'Amőba',
      game: 'nought'
    },
    {
      name: 'Sakk',
      game: 'chess'
    }
  ];

  constructor(
    private db: DatabaseService,
    private db2: AngularFirestore,
    private router: Router,
  ) {
    this.newGameForm = new FormGroup({
      game: new FormControl('', Validators.required),
      friend: new FormControl('', Validators.required)
    })
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.db.loggedInUser.subscribe(
        (user: any) => {
          this.user = user;
        },
        (err: any) => console.error(err),
        () => { }
      )
    );

    this.subscriptions.push(
      this.db2.collection("users", ref => ref
        .where("id", "==", this.user.id))
        .get()
        .subscribe(user => user.forEach(userData =>
          this.friendsIds = Object(userData.data()).friends.friendLists
          // console.log(Object(userData.data()).friends.friendLists)
        ))
      // Getting the ids of our friends
    );

    this.subscriptions.push(
      this.db2.collection("users", ref => ref
        .where("friends.friendLists", "array-contains", this.user.id))
        .get()
        .subscribe(user => user.forEach(userData =>
          // this.friendsIds = Object(userData.data()).friends.friendLists
          this.friends.push(Object(userData.data()))
        ))
    );

    // // Getting our friends, max the first ten
    // this.db2.collection("users", ref => ref
    //   .where("id", "in", this.friendsIds.slice(0, 10)))
    //   .get()
    //   .subscribe(user => user.forEach(userData =>
    //     this.friends = Object(userData.data())
    //   ));

    // Getting our ongoing games
    this.subscriptions.push(
      this.db2.collection("games", ref => ref
        .orderBy("game.created", "desc")
        // .where("game.game", "==", "nought")
        .where("users", "array-contains", this.user.id)
        .where("game.hasEnded", "==", false))
        .get()
        .subscribe((games) => {
          games.forEach((doc) => {
            this.gamesArray.push({ id: doc.id, ...Object(doc.data()) });
            // console.log(doc.id, " => ", doc.data());

            // console.log('/' + Object(doc.data()).game.game + '/' + doc.id);
          });
        })
    );

    //Getting all games, to find our friends' games
    // This is bad-bad-bad practice, never-ever do this
    // But fror the time-being this is it
    // this.db2.collection("games")
    //   .get()
    //   .subscribe((games) => {
    //     games.forEach((doc) => {
    //       this.friendsGamesArray.push({ id: doc.id, ...Object(doc.data()) });
    //       console.log('My Games: ', doc.id, " => ", doc.data());

    //       console.log('My Games: ', '/' + Object(doc.data()).game.game + '/' + doc.id);
    //     });
    //   });

    // console.log(this.gamesArray);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  startNewGame() {
    const formValues = this.newGameForm.value;
    const { game, friend } = formValues;

    const otherPlayer = this.friends.find(f => f.id === friend);
    // console.log("FORM VALUES: ", formValues);

    // console.log("FORM VALUES FRIEND:", otherPlayer);

    // console.log('FORM VALUES NEW GAMES: ', newGame);

    switch (game) {
      case 'nought':
        const player1 = {
          name: this.user.name,
          id: this.user.id,
          photo: this.user.photo,
          mark: 'o',
          hasWon: false
        };
        const player2 = {
          name: otherPlayer.name,
          id: otherPlayer.id,
          photo: otherPlayer.photo,
          mark: 'x',
          hasWon: false
        }

        const newGame = {
          board: new Array(81).fill(' '),
          game: {
            created: new Date(),
            game: 'nought',
            hasEnded: false,
            imageUrl: '../../../assets/images/nought.jpeg',
            isDraw: false,
            name: 'Amőba'
          },
          moves: [],
          next: {
            player: 'o'
          },
          rules: {
            length: 5,
            size: 9
          },
          players: {
            o: player1,
            x: player2
          },
          users: [
            this.user.id,
            otherPlayer.id
          ]
        };

        const p = this.db.saveData('games', newGame);
        p.then(data => this.router.navigateByUrl(`nought/${data.id}`));
        break;

      case 'chess':

        const chessPlayer1 = {
          name: this.user.name,
          id: this.user.id,
          photo: this.user.photo,
          color: 'white',
          inCheck: false,
          hasWon: false
        };
        const chessPlayer2 = {
          name: otherPlayer.name,
          id: otherPlayer.id,
          photo: otherPlayer.photo,
          color: 'black',
          inCheck: false,
          hasWon: false
        };

        const newChessGame = {
          game: {
            created: new Date(),
            game: 'chess',
            hasEnded: false,
            imageUrl: '../../../assets/images/chess.jpg',
            isDraw: false,
            name: 'Sakk'
          },
          players: {
            white: chessPlayer1,
            black: chessPlayer2
          },
          next: {
            color: 'white',
            possibleMoves: []
          },
          moves: [],
          state: {
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
          },
          users: [
            this.user.id,
            otherPlayer.id
          ]
        }

        const x = this.db.saveData('games', newChessGame);
        x.then(data => this.router.navigateByUrl(`chess/${data.id}`));

        break;
      default: break;
    }
  }

}
