import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {

  newGameForm: FormGroup;

  games = [
    'Sakk',
    'Amőba'
  ]

  friends: Array<any> = [
    {
      name: 'Jucus',
      imageUrl: 'https://images.unsplash.com/photo-1546458904-143d1674858d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=758&q=80'
    }
  ];

  matches: Array<any> = [
    {
      id: 'safasfgsgg',
      game: 'nought',
      name: 'Amőba',
      datetime: new Date(),
      imageUrl: '../../../assets/images/nought.jpeg',
      opponent: 'Jucus'
    },
    {
      id: 'dsfsdghhd',
      game: 'chess',
      name: 'Sakk',
      datetime: new Date(),
      imageUrl: '../../../assets/images/chess.jpg',
      opponent: 'Magdolna'
    }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.newGameForm = new FormGroup({
      game: new FormControl('', Validators.required),
      friends: new FormControl('', Validators.required)
    })
  }

  ngOnInit(): void {
  }

  startNewGame() {

  }
}
