import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "src/app/auth/services/auth.service";

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // If logged in. redirect to boards page
    this.authService.isLogged$.subscribe((isLoggedIn) => {
      if(isLoggedIn) {
        this.router.navigateByUrl('/boards');
      }
    })
  }
}