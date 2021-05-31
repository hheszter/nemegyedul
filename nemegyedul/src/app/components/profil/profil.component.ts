import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {

  user: User;
  // newFriendRequest: any;

  showMyEvents: boolean = false;
  showMyFriends: boolean = false;

  dbSubscription: Subscription;

  constructor(
    private db: DatabaseService, 
    private auth: AuthService) { }

  ngOnInit(): void {
    this.dbSubscription = this.db.loggedInUser.subscribe(
      (user:any)=>{
        this.user=user;
      },
      (err:any)=>console.error(err),
      ()=>this.dbSubscription.unsubscribe()
    );

    // this.dbSubscription = this.db.newFriendReq.subscribe(
    //   (req:any)=>{
    //     this.newFriendRequest=req;
    //   },
    //   (err:any)=>console.error(err),
    //   ()=>this.dbSubscription.unsubscribe()
    // );
  }

  newPassword(email:string){
    this.auth.getNewPassword(email)
      .then(()=>{
        alert("Nézze meg az emailfiókját!")
      })
      .catch(err=>console.log(err))
  }

  showEvents(){
    this.showMyEvents = !this.showMyEvents;
  }

  showFriends(){
    this.showMyFriends = !this.showMyFriends;
  }

  editProfil(){
    //modal form, save to db, db.loggedInUser.next(...)  
    alert("Ez a funkció még fejlesztés alatt áll... Köszönjük a türelmét!")
  }

}