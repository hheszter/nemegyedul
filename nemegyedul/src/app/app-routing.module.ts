import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommunityComponent } from './components/community/community.component';
import { EventFormComponent } from './components/event-form/event-form.component';
import { ChessComponent } from './components/games/chess/chess.component';
import { GamesComponent } from './components/games/games.component';
import { NoughtsAndCrossesComponent } from './components/games/noughts-and-crosses/noughts-and-crosses.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { MyEventsComponent } from './components/my-events/my-events.component';
import { ProfilComponent } from './components/profil/profil.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { AuthGuardService } from './services/auth-guard.service';
import { RoleGuardService } from './services/role-guard.service';

const routes: Routes = [
  { path: "", component: WelcomeComponent },
  { path: "welcome", component: WelcomeComponent },
  { path: "login", component: LoginComponent },
  { path: "main", component: MainComponent, canActivate: [AuthGuardService] },
  { path: "my-events", component: MyEventsComponent, canActivate: [AuthGuardService] },
  { path: "event-form", component: EventFormComponent, canActivate: [AuthGuardService, RoleGuardService], data: { expectedRole: 2 } },
  { path: "games", component: GamesComponent, canActivate: [AuthGuardService] },
  { path: "chess/:matchId", component: ChessComponent, canActivate: [AuthGuardService] },
  { path: "nought/:matchId", component: NoughtsAndCrossesComponent, canActivate: [AuthGuardService] },
  { path: "profil", component: ProfilComponent, canActivate: [AuthGuardService] },
  { path: "community", component: CommunityComponent, canActivate: [AuthGuardService] },
  { path: "**", component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
