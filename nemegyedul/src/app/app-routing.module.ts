import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventFormComponent } from './components/event-form/event-form.component';
import { GamesComponent } from './components/games/games.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { MyEventsComponent } from './components/my-events/my-events.component';
import { ProfilComponent } from './components/profil/profil.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { AuthGuardService } from './services/auth-guard.service';
import { RoleGuardService } from './services/role-guard.service';

const routes: Routes = [
  {path: "", component:WelcomeComponent},
  {path: "welcome", component:WelcomeComponent},
  {path: "login", component:LoginComponent},
  {path: "main", component:MainComponent, canActivate: [AuthGuardService]},
  {path: "my-events", component:MyEventsComponent, canActivate: [AuthGuardService]},
  {path: "event-form", component:EventFormComponent, canActivate: [AuthGuardService, ], data: {expectedRole: 2}},
  {path: "games", component:GamesComponent, canActivate: [AuthGuardService]},
  {path: "profil", component:ProfilComponent},
  {path: "**", component:LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
