import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router) { }
  canActivate(): boolean {
    if (!window.localStorage.getItem("app_user_uid")) {
      this.router.navigate(["/login"]);
      return false
    };
    return true

  }
}
