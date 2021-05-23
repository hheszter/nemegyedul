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
  themes: Array<string>;

  constructor(
    private db: DatabaseService, 
    private auth: AuthService) { }

  ngOnInit(): void {
    this.db.loggedInUser.subscribe(
      (user:any)=>{
        this.user=user;
        this.themes=this.setThemes(user.category);
      },
      (err:any)=>console.error(err)
    )
  }

  setThemes(categoryObj: any){
    return Object.keys(categoryObj).filter( index => categoryObj[index])
    
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