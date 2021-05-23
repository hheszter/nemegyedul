import { Component, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { DatabaseService } from 'src/app/services/database.service';
import { RoleGuardService } from 'src/app/services/role-guard.service';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit, CanActivate {
  currentUser: any;

  constructor(public router: Router, private databaseService: DatabaseService) { }
  

  ngOnInit(): void {
    this.databaseService.loggedInUser.subscribe(
      data => { console.log(data); 
        this.currentUser = data}
    );
    
    
    
  }
  canActivate = (route: ActivatedRouteSnapshot): boolean => {
        console.log(route)
        
            const expectedRole = route.data.expectedRole;
            console.log(this.currentUser)
            if (!this.currentUser || +this.currentUser.role < expectedRole) {
              console.log('nem elég magas a jogosultsági szint, elvárt szint:', expectedRole )
              this.router.navigate(["/main"]);
              return false
            } 
              console.log('megfelelő jogosultság', +this.currentUser.role)
              return true
      }
}
