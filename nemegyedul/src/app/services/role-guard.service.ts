import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService implements CanActivate {
  currentUser: any;
  currentUserArray: any[] = [];
  constructor(public router: Router, private databaseService: DatabaseService) { 
    this.databaseService.loggedInUser.subscribe(
      data => this.currentUser = data,
      error => console.error(error)
    )
  }
  
  
  
  canActivate = (route: ActivatedRouteSnapshot): boolean => {
    
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
