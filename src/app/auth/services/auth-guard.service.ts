import { CanActivate, Router } from "@angular/router";
import { Observable, map } from "rxjs";
import { Injectable } from "@angular/core";

import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): Observable<boolean> {
    return this.authService.isLogged$.pipe(map((isLoggedIn) => {
      // Restrict accessing routes if user not logged in
      if (isLoggedIn) {
        // Let user to go ahead
        return true
      }

      // Navigate to home page if user not logged in
      this.router.navigateByUrl('/');
      return false;
    }))
  }
}