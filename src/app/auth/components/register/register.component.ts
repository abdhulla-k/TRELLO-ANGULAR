 import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";

import { AuthService } from "../../services/auth.service";
import { RegisterRequestInterface } from "../../types/register-request.interface";
import { CurrentUserInterface } from "../../types/current-user.interface";
import { SocketService } from "src/app/shared/services/socket.service";

@Component({
  selector: 'auth-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  // Set a variable to save error message if any
  errorMessage: String | null = null;

  // Create registration form group
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email],],
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private socketService: SocketService,
  ) { }

  // Function to submit registration form
  onSubmit() {
    // Get all data from form
    const { email, username, password } = this.form.value;
    const request: RegisterRequestInterface = {
      email: String(email),
      username: String(username),
      password: String(password)
    };

    // Send request
    this.authService.register(request).subscribe({
      next: (currentUser: CurrentUserInterface) => {
        // Pass the data to serToken function to save it in local storage
        this.authService.setToken(currentUser);

        // Establish socket io connection
        this.socketService.setUpsocketConnection(currentUser);

        // Share the data throughout the application
        this.authService.setCurrentUser(currentUser);

        // Remove error if exist
        this.errorMessage = null;

        // Success. So navigate to home page.
        this.router.navigateByUrl('/');
      },
      error: (err: HttpErrorResponse) => {
        // Join all error messages and assign to variable
        this.errorMessage = err.error.join(', ')
      }
    })
  }
}