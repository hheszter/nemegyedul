import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { UsersService } from 'src/app/services/users.service';
import { AngularFirestore } from '@angular/fire/firestore'

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {

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

  selectedGame = 'nought';

  constructor(
    private db: DatabaseService,
    private db2: AngularFirestore,
    private auth: AuthService,
    private userService: UsersService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.newGameForm = new FormGroup({
      game: new FormControl('', Validators.required),
      friend: new FormControl('', Validators.required)
    })
  }

  ngOnInit(): void {
    this.dbSubscription = this.db.loggedInUser.subscribe(
      (user: any) => {
        this.user = user;
        // console.log(this.user);
      },
      (err: any) => console.error(err),
      () => this.dbSubscription.unsubscribe()
    );

    // Getting the ids of our friends
    this.db2.collection("users", ref => ref
      .where("id", "==", this.user.id))
      .get()
      .subscribe(user => user.forEach(userData =>
        this.friendsIds = Object(userData.data()).friends.friendLists
        // console.log(Object(userData.data()).friends.friendLists)
      ));

    this.db2.collection("users", ref => ref
      .where("friends.friendLists", "array-contains", this.user.id))
      .get()
      .subscribe(user => user.forEach(userData =>
        // this.friendsIds = Object(userData.data()).friends.friendLists
        this.friends.push(Object(userData.data()))
      ));

    // // Getting our friends, max the first ten
    // this.db2.collection("users", ref => ref
    //   .where("id", "in", this.friendsIds.slice(0, 10)))
    //   .get()
    //   .subscribe(user => user.forEach(userData =>
    //     this.friends = Object(userData.data())
    //   ));

    // Getting our ongoing games
    this.db2.collection("games", ref => ref
      .orderBy("game.created", "desc")
      .where("users", "array-contains", this.user.id)
      .where("game.hasEnded", "==", false))
      .get()
      .subscribe((games) => {
        games.forEach((doc) => {
          this.gamesArray.push({ id: doc.id, ...Object(doc.data()) });
          // console.log(doc.id, " => ", doc.data());

          // console.log('/' + Object(doc.data()).game.game + '/' + doc.id);
        });
      });

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

  startNewGame() {
    const formValues = this.newGameForm.value;
    const { game, friend } = formValues;

    const otherPlayer = this.friends.find(f => f.id === friend);
    // console.log("FORM VALUES: ", formValues);

    // console.log("FORM VALUES FRIEND:", otherPlayer);

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

    // console.log('FORM VALUES NEW GAMES: ', newGame);

    switch (this.selectedGame) {
      case 'nought':
        const p = this.db.saveData('games', newGame);
        p.then(data => this.router.navigateByUrl(`nought/${data.id}`));
        break;
      case 'chess':

        break;
      default: break;
    }
  }

}
