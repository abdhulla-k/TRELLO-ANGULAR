import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";

import { AuthService } from "../../services/auth.service";
import { CurrentUserInterface } from "../../types/current-user.interface";
import { LoginRequestInterface } from "../../types/login-request.interfacat";
import { SocketService } from "src/app/shared/services/socket.service";

@Component({
  selector: 'auth-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  // Set a variable to save error message if any
  errorMessage: String | null = null;

  // Create login form group
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email],],
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
    const { email, password } = this.form.value;
    const request: LoginRequestInterface = {
      email: String(email),
      password: String(password)
    };

    // Send request
    this.authService.login(request).subscribe({
      next: (currentUser: CurrentUserInterface) => {
        // Pass the data to serToken function to save it in local storage
        this.authService.setToken(currentUser);

        // Establish socket connection
        this.socketService.setUpsocketConnection(currentUser);

        // Share the data throughout the application
        this.authService.setCurrentUser(currentUser);

        // Remove error if exist
        this.errorMessage = null;

        // Success. So navigate to home page.
        this.router.navigateByUrl('/');
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this.errorMessage = err.error.emailOrPassword;
      }
    })
  }
}