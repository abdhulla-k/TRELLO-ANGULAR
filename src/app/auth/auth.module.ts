import { NgModule } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

import { CurrentUserInterface } from "./types/current-user.interface";
import { AuthService } from "./services/auth.service";
import { RegisterComponent } from "./components/register/register.component";
import { environment } from "src/environments/environment";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "./components/login/login.component";
import { AuthGuardService } from "./services/auth-guard.service";

// Create routes
const routes = [
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    CommonModule,
  ],
  providers: [
    AuthService,
    AuthGuardService
  ],
  declarations: [
    RegisterComponent, 
    LoginComponent,
  ]
})
export class AuthModule {
  url = environment.url;

  constructor(private http: HttpClient) { }

  // Function to get user details
  getCurrentUser(): Observable<CurrentUserInterface> {
    // Return objservable with derived data to subscribe from any place
    return this.http.get<CurrentUserInterface>(`${this.url}/api/user`);
  }
}