import { Component, OnInit } from '@angular/core';
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

  constructor(
    private db: DatabaseService, 
    private auth: AuthService) { }

  ngOnInit(): void {
    this.db.loggedInUser.subscribe(
      (user:any)=>{
        this.user=user;
      },
      (err:any)=>console.error(err)
    )
  }

  newPassword(email:string){
    this.auth.getNewPassword(email)
      .then(()=>{
        alert("Nézze meg az emailfiókját!")
      })
      .catch(err=>console.log(err))
  }

  editProfil(){
    //modal form, save to db, db.loggedInUser.next(...)  
  }

}