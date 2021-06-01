import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  isLoggedIn: any;
  currentUser: User;
  constructor(private databaseService: DatabaseService, private authGuardService: AuthGuardService) { }

  ngOnInit(): void {
    this.authGuardService.isActive.subscribe(
      data => this.isLoggedIn = data,
      error => console.error(error)
    )
  }

}
