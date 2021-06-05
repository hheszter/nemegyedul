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
  constructor(private databaseService: DatabaseService, private authService: AuthService) { }

  ngOnInit(): void {
    // this.authGuardService.isActive.subscribe(
    //   data => {this.isLoggedIn = data; console.log('welcome data:', data)},
    //   error => console.error(error)
    // )
    !window.localStorage.getItem('app_user_uid') ? this.isLoggedIn = false : this.isLoggedIn = true;
    this.authService.loginStatusChanged.subscribe(
      data => this.isLoggedIn = data
    )
  }

}
