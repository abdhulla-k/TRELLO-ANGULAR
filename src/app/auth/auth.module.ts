import { NgModule } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

import { CurrentUserInterface } from "./types/current-user.interface";
import { AuthService } from "./services/auth.service";

@NgModule({
  providers: [
    AuthService,
  ]
})
export class AuthModule {
  url = 'http://localhost:4000'

  constructor(private http: HttpClient) { }

  // Function to get user details
  getCurrentUser(): Observable<CurrentUserInterface> {
    // Return objservable with derived data to subscribe from any place
    return this.http.get<CurrentUserInterface>(`${this.url}/api/user`);
  }
}