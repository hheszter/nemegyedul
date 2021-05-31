import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user';
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
  currentUser: any = {name: 'user', age: 1};
  user: any = false;
  dbSubscription: Subscription;
  newReqs: number = 0;

  constructor(
    private config: ConfigService, 
    private authService: AuthService, 
    private databaseService: DatabaseService, 
    private authGuard: AuthGuardService,
    private router: Router
    ) { 
      
      this.authService.loginStatusChanged.subscribe(
        data => {this.user = data; },
        error => console.error(error)
      )
    }

  ngOnInit(): void {
   
    this.user = window.localStorage.getItem("app_user_uid") 
    // this.user = window.sessionStorage.getItem("app_user_uid") 
    this.databaseService.loggedInUser.subscribe(
      data => this.currentUser = data,
      error => console.error(error)
    )

    this.getNewRequests();
    
  }
  onLogout() {
    this.authService.logout()
    this.user = false
    this.newReqs = 0;
    this.router.navigate(["/welcome"]);
  }


  //get number of new friendRequestsToMe
  getNewRequests(){
    this.dbSubscription = this.databaseService.newFriendReq.subscribe(
      (req:any)=>{
        this.newReqs=req;
      },
      (err:any)=>console.error(err),
      ()=>this.dbSubscription.unsubscribe()
    );
  }

}
