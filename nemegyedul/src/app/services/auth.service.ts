import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loginStatusChanged: any = new Subject<any>();
  

  constructor(private auth: AngularFireAuth) { 

  }

  register(email:string, pw:string){
    return this.auth.createUserWithEmailAndPassword(email, pw)
  }

  login(email:string, pw:string){
    return this.auth.signInWithEmailAndPassword(email, pw)
  }

  logout(){
    window.localStorage.removeItem("app_user_uid");
    this.loginStatusChanged.next(false);
    return this.auth.signOut();
  }

  setLocalStorage(){
    this.auth.currentUser
      .then(user => {
        if(user?.uid){
          window.localStorage.setItem("app_user_uid", user?.uid);
          this.loginStatusChanged.next(true);
        }
      })
      .catch(err=>console.error(err))
  }

  getNewPassword(email:any){
    return this.auth.sendPasswordResetEmail(email)
      .then(()=>console.log("email has been sent"))
      .catch(err=>console.error(err))
  }
}
