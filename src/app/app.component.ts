import { Component, OnInit } from '@angular/core';

import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'trello';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    // Call get current user function to get user details at initial time of application;
    this.authService.getCurrentUser().subscribe({
      next: (res) => {
        // Handle success response
        console.log('res', res);
      },
      error: (err) => {
        // Streem null to every components if failed getting api
        // using behavioral subject created in service
        this.authService.setCurrentUser(null);
      }
    })
  }
}
