import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { NavComponent } from './components/nav/nav.component';
import { MainComponent } from './components/main/main.component';
import { EventFormComponent } from './components/event-form/event-form.component';
import { MyEventsComponent } from './components/my-events/my-events.component';
import { GamesComponent } from './components/games/games.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { ReactiveFormsModule } from '@angular/forms';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { LoginModalComponent } from './components/login/login-modal/login-modal.component';
import { ProfilComponent } from './components/profil/profil.component';

import { ChessComponent } from './components/games/chess/chess.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavComponent,
    MainComponent,
    EventFormComponent,
    MyEventsComponent,
    GamesComponent,
    WelcomeComponent,
    LoginModalComponent,
    ProfilComponent,
    ChessComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
