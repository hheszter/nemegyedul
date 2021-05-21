import { Component, OnInit } from '@angular/core';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { AuthService } from 'src/app/services/auth.service';
import { ConfigService } from 'src/app/services/config.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  navigation = this.config.navigation;
  currentUser: any = {name: 'Zsolt'};
  user: any = false;
  constructor(
    private config: ConfigService, 
    private authService: AuthService, 
    private databaseService: DatabaseService, 
    private authGuard: AuthGuardService) { }

  ngOnInit(): void {
    // this.databaseService.getUserByUID(window.localStorage.getItem("app_user_uid"), "users").subscribe(
    //   (data:any) => this.currentUser = data,
    //   (error:any) => console.error(error)
    // )
    //this.user = window.localStorage.getItem("app_user_uid") 

    this.user=this.authGuard.canActivate()

    
    
  }

  onLogout() {
    this.authService.logout()
  }

}
