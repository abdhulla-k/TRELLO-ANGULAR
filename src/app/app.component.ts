import { Component, OnInit } from '@angular/core';

import { AuthService } from './auth/services/auth.service';
import { CurrentUserInterface } from './auth/types/current-user.interface';
import { SocketService } from './shared/services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'trello';

  constructor(
    private authService: AuthService,
    private socketService: SocketService,
  ) { }

  ngOnInit(): void {
    // Call get current user function to get user details at initial time of application;
    this.authService.getCurrentUser().subscribe({
      next: (currentUser: CurrentUserInterface) => {
        // Set up a socket connection with user
        this.socketService.setUpsocketConnection(currentUser);

        // Handle success response
        this.authService.setCurrentUser(currentUser);
      },
      error: (err) => {
        // Streem null to every components if failed getting api
        // using behavioral subject created in service
        this.authService.setCurrentUser(null);
      }
    })
  }
}
