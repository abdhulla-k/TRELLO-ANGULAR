import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/auth/services/auth.service";

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
})
export class TopbarComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  // Function to logout
  logOut(): void {
    // Call logout function
    this.authService.logOut();

    // Navigate to home page
    this.router.navigateByUrl('/')
  }
}