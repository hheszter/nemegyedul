import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  haveAccount: boolean = true;
  invalidLogin: boolean = false;

  showModal: boolean = false;
  titleInModal: string = "";
  textInModal: string = "";
  formInModal: boolean = false;

  loginForm: FormGroup;
  regForm: FormGroup;

  dbSubscription: Subscription;

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
      email: new FormControl('', [Validators.required, Validators.pattern(/^[\w\.]+@\w+\.[a-z\.]{2,5}$/)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
      repassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
      name: new FormControl('', [Validators.required, Validators.pattern(/^[A-ZÁÉÍÓÖŐÚÜŰa-záéíóöőúüű\.\- ]{5,35}$/)]),
      age: new FormControl('', [Validators.required, Validators.min(18), Validators.max(110)]),
      gender: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required, Validators.pattern(/^[A-ZÁÉÍÓÖŐÚÜŰa-záéíóöőúüű\- ]{2,35}$/)]),
      photo: new FormControl('', [Validators.pattern(/^https?:\/\/.{5,250}$/)]),
      role: new FormControl('', [Validators.required]),
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

  ngDoCheck() {
    this.checkUserLoggedIn();
  }

  switchForm() {
    this.haveAccount = !this.haveAccount;
  }

  checkUserLoggedIn() {
    //let uid = window.localStorage.getItem("app_user_uid");
    let uid = window.sessionStorage.getItem("app_user_uid");
    if (uid) {
      this.getUserLoggedIn(uid);
      this.router.navigate(["/main"]);
    };
  }

  //get user data and save in db.service:
  getUserLoggedIn(uid: string) {
    this.dbSubscription = this.db.getData("users").subscribe(
      (doc: any) => {
        doc.forEach((user: User) => {
          if (user.userUID) {
            if (user.userUID === uid) {
              this.db.loggedInUser.next(user);
              
            }
          }
        })
      },
      (err: any) => console.error(err),
      () => this.dbSubscription.unsubscribe()
    )
  }


  // ------------------------- registration -------------------------
  registration() {
    const regData = this.regForm.value;

    if (regData.password !== regData.repassword) {
      this.setModal("Valami nem stimmel", "A két jelszó nem egyezik!", false);
      return
    }

    this.auth.register(regData.email, regData.password)
      .then((data) => {
        delete regData.password;
        delete regData.repassword;
        regData.date = new Date().toLocaleDateString();
        regData.userUID = data.user.uid;
        regData.myEvents = [];
        if(!regData.photo){
          regData.photo = "https://icon-library.com/images/default-user-icon/default-user-icon-4.jpg" //default avatar photo
        }
        this.db.saveData("users", regData);
        
        //send email to verify email address!!!
        // data.user.sendEmailVerification()
        //   .then(()=>console.log("email has been sent")) //set the link to continoue
        //   .catch(err=>console.error(err))
      })
      .then(() => {
        this.regForm.reset();
        this.loginForm.reset();
        this.setModal("Sikeres regisztráció", "Erősítse meg az email címét, lépjen be az emailfiókjába! \n Hitelesítés után kérem jelentkezzen be!", false);
        this.switchForm();

      })
      .catch(err => {
        if (err.code === "auth/email-already-in-use") {
          this.setModal("", "Ezzel az email címmel már regisztáltak, kérjük jelentkezzen be!", false);
          this.switchForm();
        } else {
          console.error(err);
        }
      })
  }


  // ------------------------- login -------------------------
  login() {
    const loginData = this.loginForm.value;

    this.auth.login(loginData.logEmail, loginData.logPassword)
      .then((data) => {
      //without email verification:
        this.auth.setLocalStorage();
        this.router.navigate(["/main"]);

      //with email verification:
        // if(data.user.emailVerified){
        //   this.auth.setLocalStorage();
        //   this.router.navigate(["/main"]);
        // } else {
        //   this.setModal("Hiányzó jóváhagyás", "Erősítse meg az email címét, lépjen be az emailfiókjába", false)
        // }
      })
      .catch(err => {
        this.invalidLogin = true;
        console.log(err);
      })
  }

  resetPassword() {
    this.setModal("Új jelszó igénylés", "Adja meg az email címét:", true);
  }


  // ------------------------- modal -------------------------
  setModal(title: string, text: string, isForm: boolean) {
    this.titleInModal = title;
    this.textInModal = text;
    this.formInModal = isForm;
    this.showModal = true;
  }

  closeModal(value: any) {
    if (value) {
      if (value.email) {
        this.auth.getNewPassword(value.email);
        this.setModal("", "Ellenőrízze az emailfiókját!", false);
        this.loginForm.reset();
      }
    }
    this.titleInModal = "";
    this.textInModal = "";
    this.formInModal = false;
    this.showModal = false;
  }
}
