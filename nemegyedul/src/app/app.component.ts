import { Component } from '@angular/core';
import { DatabaseService } from './services/database.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'nemegyedul';

  constructor(private db: DatabaseService){
    const uid = window.localStorage.getItem("app_user_uid");
    if (uid) {
      this.db.getUserLoggedIn(uid);
    };
  }
}
