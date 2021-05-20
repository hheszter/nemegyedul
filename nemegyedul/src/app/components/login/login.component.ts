import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  haveAccount: boolean = true;
  emailIsUsed: boolean = false;
  invalidLogin: boolean = false;

  loginForm: FormGroup;
  regForm: FormGroup;

  constructor(
    private router: Router,
    private auth: AuthService,
    private db: DatabaseService,
  ) { }

  ngOnInit(): void {
    this.checkUserLoggedIn();

    this.loginForm = new FormGroup({
      logEmail: new FormControl('', [Validators.required]),
      logPassword: new FormControl('', [Validators.required])
    });

    this.regForm = new FormGroup({
      email: new FormControl('', [Validators.required],),
      password: new FormControl('', [Validators.required],),
      repassword: new FormControl('', [Validators.required],),
      name: new FormControl('', [Validators.required],),
      age: new FormControl('', [Validators.required],),
      gender: new FormControl('', [Validators.required],),
      photo: new FormControl(''),
      role: new FormControl('', [Validators.required],),
      category: new FormGroup({
        sport: new FormControl(''),
        culture: new FormControl(''),
        gardening: new FormControl(''),
        gastronomy: new FormControl(''),
        handiwork: new FormControl(''),
        astrology: new FormControl(''),
        reading: new FormControl(''),
        stamps: new FormControl(''),
        family: new FormControl(''),
      })
    });
  }

  ngDoCheck(){
    this.checkUserLoggedIn();
  }

  switchForm() {
    this.haveAccount = !this.haveAccount;
  }

  checkUserLoggedIn(){
    if (window.localStorage.getItem("app_user_uid")) {
      this.router.navigate(["/main"]);
    };
  }

  registration() {
    const regData = this.regForm.value;
    
    if(regData.password !== regData.repassword){
      alert("Nem egyezik a két jelszó!");
      return
    }

    this.auth.register(regData.email, regData.password)
      .then((data)=>{
        delete regData.password;
        delete regData.repassword;
        regData.date = new Date().toLocaleDateString();
        regData.userUID = data.user.uid;
        this.db.saveData("users", regData);
     })
      .then(()=>{
        this.regForm.reset();
        alert("A regisztráció sikeres, kérem jelentkezzen be!")
        this.switchForm();
      })
      .catch(err => {
        if(err.code === "auth/email-already-in-use"){
          this.emailIsUsed = true;
        } else {
          console.error(err);
        }
      })
  }

  login() {
    const loginData = this.loginForm.value;

    this.auth.login(loginData.logEmail, loginData.logPassword)
      .then((data) => {
        this.auth.setLocalStorage();
        this.router.navigate(["/main"]);
      })
      .catch(err => {
        this.invalidLogin = true;
        console.log(err);
      })
  }

  resetPassword() {
    let userEmail = prompt("Adja meg az email címét, hogy új jelszót küldhessünk:");
    this.auth.getNewPassword(userEmail);
  }
}
