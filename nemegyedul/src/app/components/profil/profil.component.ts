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
  themes: Array<string>;
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
        this.themes=Object.keys(user.category).filter( index => user.category[index]);
      },
      (err:any)=>console.error(err),
      ()=>this.dbSubscription.unsubscribe()
    )
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
  }

}